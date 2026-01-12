/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    const services = app.findAllRecords("services");

    services.forEach(record => {
        const slug = record.getString("slug");

        // 1. Force parse sections
        // 'getString' usually returns the raw JSON string for json fields
        const rawSections = record.getString("sections");
        let sections = [];
        try {
            // detailed logging for debugging
            // console.log(`[V3] Raw sections for ${slug}: ${rawSections.substring(0, 50)}...`);
            sections = JSON.parse(rawSections);
        } catch (e) {
            // If it's already an object (unlikely with getString but possible in some contexts), try to use it
            // casting to any to avoid TS errors in strict mode
            const rawObj = record.get("sections");
            if (Array.isArray(rawObj)) {
                sections = rawObj;
            } else {
                console.log(`[V3] ❌ JSON Parse Error for ${slug}: ${e}`);
                return;
            }
        }

        let hasChanges = false;
        const potentialImages = [];
        const pathToBasenameMap = {};

        console.log(`[V3] Processing ${slug} (${sections.length} sections)`);

        // 2. Scan for paths
        sections.forEach((section) => {
            const paths = [];
            if (section.image) paths.push(section.image);
            if (section.background) paths.push(section.background);

            paths.forEach(p => {
                if (typeof p === 'string' && p.startsWith("/")) {
                    const localPath = "web/public" + p;
                    try {
                        const file = $filesystem.fileFromPath(localPath);
                        potentialImages.push(file);

                        // Map path -> basename for later replacement
                        const parts = p.split("/");
                        const basename = parts[parts.length - 1];
                        pathToBasenameMap[p] = basename;

                        console.log(`    Found local file: ${localPath}`);
                    } catch (e) {
                        console.log(`    ⚠️ File not found: ${localPath}`);
                    }
                }
            });
        });

        if (potentialImages.length === 0) {
            console.log(`    No local images found to upload.`);
            return;
        }

        // 3. Upload images
        record.set("images", potentialImages);
        app.save(record);

        // 4. Reload to get generated filenames
        const updatedRecord = app.findRecordById("services", record.id);

        // Note: Pocketbase might rename them slightly differently than we expect
        // so we need to be smart about matching.
        const savedFilenames = updatedRecord.getStringSlice("images");
        console.log(`    ✅ Uploaded ${savedFilenames.length} images.`);

        // 5. Update JSON references
        sections.forEach(section => {
            const keys = ['image', 'background'];
            keys.forEach(key => {
                const originalPath = section[key];
                if (originalPath && pathToBasenameMap[originalPath]) {
                    const originalBasename = pathToBasenameMap[originalPath]; // e.g. "hero.jpg"

                    // PB format: filename_hash.ext
                    // We match if savedFilename starts with (filename_no_ext + "_") AND ends with (.ext)

                    const dotIdx = originalBasename.lastIndexOf(".");
                    const stem = originalBasename.substring(0, dotIdx);
                    const ext = originalBasename.substring(dotIdx);

                    const match = savedFilenames.find(saved => {
                        // Strict check: start with stem + "_"
                        // This prevents "hero.jpg" matching "hero-small_hash.jpg" accidentally 
                        // unless the stem is "hero-small"
                        return saved.startsWith(stem + "_") && saved.endsWith(ext);
                    });

                    if (match) {
                        section[key] = match;
                        hasChanges = true;
                        console.log(`    🔗 Replaced ${key}: ${originalBasename} -> ${match}`);
                    } else {
                        console.log(`    ❌ Could not match ${originalBasename} in saved list.`);
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
