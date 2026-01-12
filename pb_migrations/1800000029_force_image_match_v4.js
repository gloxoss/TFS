/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    const services = app.findAllRecords("services");

    services.forEach(record => {
        const slug = record.getString("slug");
        let sections = [];
        try {
            sections = JSON.parse(record.getString("sections"));
        } catch (e) {
            // Already handled or invalid
            const raw = record.get("sections");
            if (Array.isArray(raw)) sections = raw;
            else return;
        }

        let hasChanges = false;
        const potentialImages = [];
        const pathToBasenameMap = {};

        console.log(`[V4] Processing ${slug}...`);

        // 1. Scan for paths (Only collect those that STILL need migration)
        sections.forEach((section) => {
            ['image', 'background'].forEach(key => {
                const p = section[key];
                if (typeof p === 'string' && p.startsWith("/")) {
                    const localPath = "web/public" + p;
                    try {
                        const file = $filesystem.fileFromPath(localPath);
                        potentialImages.push(file);

                        const parts = p.split("/");
                        const basename = parts[parts.length - 1];
                        pathToBasenameMap[p] = basename;
                    } catch (e) { /* ignore */ }
                }
            });
        });

        if (potentialImages.length > 0) {
            // Upload images (Append logic roughly)
            // Actually, we just set them again. PB handles the diff or re-upload.
            record.set("images", potentialImages);
            app.save(record);
        }

        // 2. Reload to get generated filenames
        const updatedRecord = app.findRecordById("services", record.id);
        const savedFilenames = updatedRecord.getStringSlice("images");

        // 3. Ultra-Fuzzy Matching
        const matchFilename = (originalBasename) => {
            const dotIdx = originalBasename.lastIndexOf(".");
            const ext = originalBasename.substring(dotIdx);
            const rawName = originalBasename.substring(0, dotIdx);

            // Allow PB to change separators: "tech-support" -> "tech_support" or "techsupport"
            // Strategy: Remove non-alphanumeric from both and compare startsWith
            const cleanOriginal = rawName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

            return savedFilenames.find(saved => {
                if (!saved.endsWith(ext)) return false;
                const savedStem = saved.substring(0, saved.lastIndexOf("."));
                const cleanSaved = savedStem.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

                // Check if cleaned saved name starts with cleaned original name
                return cleanSaved.startsWith(cleanOriginal);
            });
        };

        // 4. Update JSON
        sections.forEach(section => {
            ['image', 'background'].forEach(key => {
                const originalPath = section[key];
                if (originalPath && originalPath.startsWith("/") && pathToBasenameMap[originalPath]) {
                    const originalBasename = pathToBasenameMap[originalPath];
                    const match = matchFilename(originalBasename);

                    if (match) {
                        section[key] = match;
                        hasChanges = true;
                        console.log(`    🔗 Fixed ${key}: ${originalBasename} -> ${match}`);
                    } else {
                        console.log(`    ❌ Still could not match: ${originalBasename}`);
                    }
                }
            });
        });

        if (hasChanges) {
            updatedRecord.set("sections", JSON.stringify(sections));
            app.save(updatedRecord);
            console.log(`    💾 Saved updated JSON for ${slug}`);
        }
    });

}, (app) => {
    // No rollback
});
