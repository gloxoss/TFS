/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    const slugs = [
        "arri-m18",
        "arri-m40"
    ];

    slugs.forEach(slug => {
        try {
            const record = app.findFirstRecordByFilter("equipment", `slug="${slug}"`);

            // Try to find local file
            let file = null;
            const path = `pb_data/video_lights_images/${slug}.jpg`;
            try {
                file = $filesystem.fileFromPath(path);
            } catch (e) { }

            if (file) {
                record.set("image", file);

                // Add to 'images' gallery if empty
                const currentImages = record.get("images");
                if (!currentImages || currentImages.length === 0) {
                    record.set("images", [file]);
                }

                app.save(record);
                console.log(`✅ Fixed image for: ${slug}`);
            } else {
                console.log(`⚠️ Still no local image found for: ${slug}`);
            }

        } catch (e) {
            console.log(`Skipping update for ${slug}: ${e}`);
        }
    });

}, (app) => {
    // No rollback
})
