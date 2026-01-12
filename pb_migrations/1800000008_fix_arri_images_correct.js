/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    // Re-run fix for Arri images with CORRECTED file sources
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
                // Force update image
                record.set("image", file);

                // Ensure correct image is in gallery too (replace if needed or just add?)
                // Since this is a fix, let's just update the main image. 
                // Users might have manually edited gallery, so be careful.
                // But likely they haven't. Let's just update 'image'.

                app.save(record);
                console.log(`✅ Corrected image for: ${slug}`);
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
