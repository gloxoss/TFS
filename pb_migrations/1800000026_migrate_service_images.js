/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    const services = app.findAllRecords("services");

    services.forEach(record => {
        const sections = JSON.parse(JSON.stringify(record.get("sections") || [])); // Clone
        const slugs = record.get("slug");

        let hasChanges = false;
        const potentialImages = [];
        const pathToFileMap = {}; // path -> File object
        const pathToBasenameMap = {}; // path -> basename (for matching)

        // 1. Identify images to migrate
        sections.forEach(section => {
            if (section.image && section.image.startsWith("/")) {
                const localPath = "web/public" + section.image;
                try {
                    const file = $filesystem.fileFromPath(localPath);
                    // Store for upload
                    potentialImages.push(file);
                    pathToFileMap[section.image] = file;

                    // Extract basename for matching later (e.g. "hero.jpg")
                    // Note: PB might sanitize names.
                    const parts = section.image.split("/");
                    pathToBasenameMap[section.image] = parts[parts.length - 1];
                } catch (e) {
                    console.log(`[Migrate] Warning: Image file not found: ${localPath} for service ${slugs}`);
                }
            }
        });

        if (potentialImages.length === 0) return;

        // 2. Upload images (Replace existing 'images' list to be safe, or append?)
        // Since we did a fresh restore, 'images' should be empty-ish.
        // Let's just set them.
        record.set("images", potentialImages);
        app.save(record);

        // 3. Retrieve updated record to get generated filenames
        const updatedRecord = app.findRecordById("services", record.id);
        const savedFilenames = updatedRecord.getStringSlice("images"); // array of strings

        console.log(`[Migrate] Service ${slugs}: Uploaded ${savedFilenames.length} images.`);

        // 4. Update JSON sections with new filenames
        sections.forEach(section => {
            if (section.image && section.image.startsWith("/") && pathToBasenameMap[section.image]) {
                const originalBasename = pathToBasenameMap[section.image];
                // Determine name stem (e.g. "hero" from "hero.jpg")
                const originalStem = originalBasename.substring(0, originalBasename.lastIndexOf("."));
                const originalExt = originalBasename.substring(originalBasename.lastIndexOf("."));

                // Find match in savedFilenames
                // Logic: saved filename starts with stem, ends with ext (ignoring the random suffix part mostly, but PB adds valid chars)
                // Or safer: checks if saved filename contains the original basename?
                // PB format: name_hash.ext

                const match = savedFilenames.find(savedName => {
                    // Robust match: 
                    // 1. Exact match (rare due to hash)
                    if (savedName === originalBasename) return true;
                    // 2. Prefix match: "hero_" matches "hero_abc.jpg"
                    // We must ensure "hero-2" doesn't match "hero" check
                    // So we check if savedName starts with (stem + "_")
                    if (savedName.startsWith(originalStem + "_") && savedName.endsWith(originalExt)) return true;
                    return false;
                });

                if (match) {
                    section.image = match;
                    hasChanges = true;
                } else {
                    console.log(`[Migrate] Could not map ${originalBasename} to a saved filename.`);
                }
            }
        });

        if (hasChanges) {
            updatedRecord.set("sections", sections);
            app.save(updatedRecord);
            console.log(`[Migrate] Updated JSON for ${slugs}`);
        }
    });

}, (app) => {
    // No rollback
});
