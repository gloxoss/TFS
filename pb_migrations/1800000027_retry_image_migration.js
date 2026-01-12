/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    const services = app.findAllRecords("services");

    services.forEach(record => {
        const rawSections = record.getString("sections"); // Explicitly get string
        let sections = [];
        try {
            sections = JSON.parse(rawSections);
        } catch (e) {
            console.log(`[V3] JSON Parse Error for ${record.getString("slug")}: ${e}`);
            return;
        }

        const slug = record.getString("slug");

        let hasChanges = false;
        const potentialImages = [];
        const pathToBasenameMap = {}; // local path -> basename

        console.log(`[V3] Processing ${slug} (Sections: ${sections.length})`);

        // 1. Collect Valid Images
        sections.forEach((section, idx) => {
            // Check both 'image' and 'background'
            const candidatePaths = [];
            if (section.image) candidatePaths.push({ key: 'image', val: section.image });
            if (section.background) candidatePaths.push({ key: 'background', val: section.background });

            candidatePaths.forEach(item => {
                const p = item.val;
                if (p && p.startsWith("/")) {
                    // console.log(`    Found candidate: ${p}`);
                    const localPath = "web/public" + p;
                    try {
                        const file = $filesystem.fileFromPath(localPath);
                        potentialImages.push(file);

                        const parts = p.split("/");
                        const basename = parts[parts.length - 1];
                        pathToBasenameMap[p] = basename;
                    } catch (e) {
                        console.log(`    ⚠️ File not found: ${localPath}`);
                    }
                }
            });
        });

        if (potentialImages.length === 0) {
            console.log(`    No local images found in sections.`);
            return;
        }

        // 2. Upload to 'images' field
        record.set("images", potentialImages);
        app.save(record);

        // 3. Reload to get generated filenames
        const updatedRecord = app.findRecordById("services", record.id);
        const savedFilenames = updatedRecord.getStringSlice("images");

        console.log(`    ✅ Uploaded ${savedFilenames.length} images.`);

        // 4. Update JSON
        sections.forEach(section => {
            // Helper to update field
            const updateField = (field) => {
                const originalPath = section[field];
                if (originalPath && originalPath.startsWith("/") && pathToBasenameMap[originalPath]) {
                    const originalBasename = pathToBasenameMap[originalPath];
                    const nameStem = originalBasename.substring(0, originalBasename.lastIndexOf("."));
                    const extension = originalBasename.substring(originalBasename.lastIndexOf("."));

                    // Find best match in savedFilenames
                    const match = savedFilenames.find(saved => {
                        // Check prefix + extension
                        return saved.startsWith(nameStem + "_") && saved.endsWith(extension);
                    });

                    if (match) {
                        console.log(`    🔗 Mapped ${field}: ${originalBasename} -> ${match}`);
                        section[field] = match;
                        hasChanges = true;
                    } else {
                        console.log(`    ❌ Unmatched ${field}: ${originalBasename}`);
                    }
                }
            };

            updateField('image');
            updateField('background');
        });

        if (hasChanges) {
            updatedRecord.set("sections", JSON.stringify(sections)); // Ensure we save as string if needed, or native
            app.save(updatedRecord);
            console.log(`    💾 Updated JSON for ${slug}`);
        }
    });

}, (app) => {
    // No rollback
});
