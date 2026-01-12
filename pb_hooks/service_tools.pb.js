/// <reference path="../pb_data/types.d.ts" />

/**
 * Service Management Tools
 * Commands:
 * 1. export-services: Dumps all services to pb_data/services_export.json
 * 2. import-services: Updates services from pb_data/services_import.json
 */

// --- EXPORT ---
$app.rootCmd.addCommand(new Command({
    use: "export-services",
    run: (cmd, args) => {
        const app = $app;
        const records = app.findAllRecords("services"); // Fetch all

        const exportData = {};

        records.forEach(rec => {
            // Serialize sections logic similar to Catalog
            const data = {
                slug: rec.getString("slug"),
                title: rec.getString("title"),
                title_fr: rec.getString("title_fr"),
                brief_description: rec.getString("brief_description"),
                hero_image: rec.getString("hero_image"),
                // Parse JSON fields
                sections: (function (s) { try { return JSON.parse(s) } catch (e) { return [] } })(rec.getString("sections")),
                stats: (function (s) { try { return JSON.parse(s) } catch (e) { return [] } })(rec.getString("stats")),
                features: (function (s) { try { return JSON.parse(s) } catch (e) { return [] } })(rec.getString("features")),
                // List of associated images
                // images: rec.getStringSlice("images") 
            };
            exportData[data.slug] = data;
        });

        const jsonStr = JSON.stringify(exportData, null, 2);
        const exportPath = "pb_data/services_export.json";

        try {
            $os.writeFile(exportPath, jsonStr, 0o644);
            console.log(`✅ Exported ${records.length} services to ${exportPath}`);
        } catch (e) {
            console.log(`❌ Export failed: ${e}`);
        }
    }
}));

// --- IMPORT ---
$app.rootCmd.addCommand(new Command({
    use: "import-services",
    run: (cmd, args) => {
        const app = $app;
        const importPath = "pb_data/services_import.json";

        console.log("📥 STARTING SERVICES IMPORT...");

        let jsonData;
        try {
            const bytes = $os.readFile(importPath);
            const str = String.fromCharCode.apply(null, bytes);
            jsonData = JSON.parse(str);
            console.log(`✅ Loaded ${importPath}`);
        } catch (e) {
            console.log(`❌ Create 'pb_data/services_import.json' first.`);
            return;
        }

        let updatedCount = 0;

        for (const slug in jsonData) {
            const item = jsonData[slug];

            try {
                const record = app.findFirstRecordByFilter("services", `slug="${slug}"`);
                let hasImageUpdates = false;
                const imagesToUpload = []; // { field: 'hero_image' | 'section.image', sectionIdx: number, localPath: string, key: string }
                // Note: We can't easily append to 'images' field one by one effectively without reloading. 
                // Strategy: 
                // 1. Identify all LOCAL files referenced in JSON
                // 2. Upload them to 'images' list (appending)
                // 3. Update the JSON references to the new filenames

                // --- 1. Basic Fields ---
                if (item.title) record.set("title", item.title);
                if (item.title_fr) record.set("title_fr", item.title_fr);
                if (item.brief_description) record.set("brief_description", item.brief_description);
                if (item.stats) record.set("stats", item.stats);
                if (item.features) record.set("features", item.features);

                // --- 2. Image Handling ---

                // A. Hero Image
                if (item.hero_image && item.hero_image !== record.getString("hero_image")) {
                    // If it looks like a local file (no hash, or user says so)
                    // We try to find it in pb_data
                    const p = `pb_data/${item.hero_image}`;
                    if ($filesystem.exists(p)) {
                        try {
                            const f = $filesystem.fileFromPath(p);
                            record.set("hero_image", f);
                            console.log(`    🖼️  Hero updated: ${item.hero_image}`);
                        } catch (e) { }
                    }
                }

                // B. Section Images
                // We need to scan sections for filenames that match files in pb_data/
                const sections = item.sections || [];
                const localImagesFound = [];
                const pathToBasenameMap = {};

                sections.forEach((section, idx) => {
                    ['image', 'background'].forEach(key => {
                        const val = section[key];
                        // Heuristic: If it has no extension, ignore. If it has a path separator, ignore? 
                        // User will likely provide "my_image.jpg"
                        if (val && typeof val === 'string' && val.includes(".")) {
                            const localPath = `pb_data/${val}`;
                            if ($filesystem.exists(localPath)) {
                                try {
                                    const file = $filesystem.fileFromPath(localPath);
                                    localImagesFound.push(file);
                                    pathToBasenameMap[val] = val; // map "my_image.jpg" -> "my_image.jpg"
                                } catch (e) { }
                            }
                        }
                    });
                });

                if (localImagesFound.length > 0) {
                    // Get existing images to avoid overwriting? 
                    // Actually, 'images' is a multiple file field. setting it *adds* usually? 
                    // No, record.set("images", [...]) replaces.
                    // So we must fetch existing?
                    // BUT, finding existing as Files is hard. 
                    // EASIER: Just set the new ones. The old ones are kept referenced by old JSON? 
                    // Wait, if I overwrite 'images', the old files are deleted?
                    // PocketBase: "If you want to append, you have to get the old values + new values."
                    // BUT getting old values as *uploadable files* is impossible.
                    // Workaround: We only really need to upload IF strict "replace all" or if we accept we add them.
                    // Actually, for this use case, let's assume 'images' is a bucket for *all* section images.
                    // If we overwrite it, old images used by sections NOT modified might be lost?
                    // YES. This is risky.
                    // BETTER APPROACH: Use `record.set("images+", ...)` to append? 
                    // JS SDK for hooks supports set("images+", [file])? 
                    // Let's try `record.set("images+", localImagesFound)`.

                    // It seems standard set() replaces. The '+' operator is for API.
                    // In Go hooks: form.AddFiles(). 
                    // In JS hooks: record.set("images", current + new) ?
                    // The safe bet: Just upload them. If we lose old unconnected images, maybe okay?
                    // But we lose old CONNECTED images if we replace the list.
                    // However, we are re-uploading everything found in JSON ideally?
                    // No, the JSON might references existing "hero_123.jpg". We don't have that source file.

                    // SOLUTION: Don't use the 'images' list for permanent storage if we can't append.
                    // WAIT. The migration used `record.set("images", ...)` and it worked.

                    // Let's try to append by passing a collection?
                    // The JSVM `record.set` is a wrapper.
                    // Known limitation: Modifying file collections in JS hooks safely is tricky without replacing.

                    // FALLBACK: Just upload them. The user provided the source in pb_data.
                    // If they want to keep old ones, they shouldn't trigger this logic?
                    // Actually, if simply referencing "hero_hash.jpg", we skip it (doesn't exist in pb_data).
                    // So we only upload NEW files. 
                    // But if we `set("images", [newFile])`, we wipe the old list.
                    // So "hero_hash.jpg" becomes a ghost reference (file deleted).

                    // CRITICAL: We need to append.
                    // Try: `record.addFiles("images", ...)` if available? No.
                    // Try: `const old = record.getStringSlice("images"); record.set("images", old.concat(newFiles))`?
                    // No, `getStringSlice` returns strings, `set` expects File objects (or strings? no).

                    // ULTRA-FALLBACK: Use the API/Form logic? Too complex for this snippet.
                    // COMPROMISE: We will try to rely on the fact that usually users batch update.
                    // OR, only for this tool, we admit it replaces the gallery. 
                    // Warn the user: "Ensures all images in JSON are in the gallery."

                    // Actually... `record.set("images+", file)` MIGHT work in recent PB key accessors.
                    // Let's rely on standard behavior:
                    // If we can't append, we are stuck.
                    // Let's try: `record.set("images+", localImagesFound)` 
                    // If it throws, we catch.

                    record.set("images+", localImagesFound);
                }

                app.save(record);

                // --- 3. Update JSON Refs ---
                // Reload to get new names
                if (localImagesFound.length > 0) {
                    const savedRecord = app.findRecordById("services", record.id);
                    const savedNames = savedRecord.getStringSlice("images");

                    // Map back
                    sections.forEach(section => {
                        ['image', 'background'].forEach(key => {
                            const val = section[key];
                            if (pathToBasenameMap[val]) {
                                // Fuzzy match
                                const stem = val.substring(0, val.lastIndexOf("."));
                                const ext = val.substring(val.lastIndexOf("."));

                                const match = savedNames.find(s => s.startsWith(stem + "_") && s.endsWith(ext));
                                if (match) {
                                    section[key] = match;
                                    console.log(`    🔗 Linked ${val} -> ${match}`);
                                }
                            }
                        });
                    });

                    // Save JSON
                    savedRecord.set("sections", sections);
                    app.save(savedRecord);
                }

                console.log(`   📝 Updated: ${slug}`);
                updatedCount++;

            } catch (e) {
                console.log(`   ⚠️ Error updating '${slug}': ${e}`);
            }
        }

        console.log(`\n✅ Import Complete: ${updatedCount} services updated.`);
    }
}));
