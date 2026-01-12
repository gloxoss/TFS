/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    const slugs = [
        "arri-alexa-35-xtreme",
        "sony-fx6",
        "cooke-s8i-set",
        "sony-fe-50mm-gm",
        "sony-fe-24-70mm-gm-ii",
        "sony-fe-35mm-gm",
        "sony-fe-16-35mm-gm",
        "sony-fe-85mm-gm",
        "sony-fe-70-200mm-gm",
        "sony-fe-pz-28-135mm"
    ];

    slugs.forEach(slug => {
        try {
            const record = app.findFirstRecordByFilter("equipment", `slug="${slug}"`);

            let file = null;
            const exts = ['jpg', 'png', 'jpeg', 'webp', 'gif'];
            for (const ext of exts) {
                try {
                    const path = `pb_data/new_cameras_lenses_images/${slug}.${ext}`;
                    file = $filesystem.fileFromPath(path);
                    if (file) break;
                } catch (e) { }
            }

            if (file) {
                record.set("image", file);

                // Also set gallery if empty
                const currentImages = record.get("images");
                if (!currentImages || currentImages.length === 0) {
                    record.set("images", [file]);
                }

                app.save(record);
                console.log(`✅ Updated image for: ${slug}`);
            } else {
                console.log(`⚠️ No local image found for: ${slug}`);
            }

        } catch (e) {
            console.log(`Skipping update for ${slug}: ${e}`);
        }
    });

}, (app) => {
    // No rollback
})
