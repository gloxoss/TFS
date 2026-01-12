/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    const slugs = [
        "easyrig-2-5-600n",
        "easyrig-vario-5-gimbal",
        "tilta-armor-man-3",
        "tilta-armor-man-2",
        "bebob-v200-micro",
        "bebob-v290rm-cine",
        "bebob-b290cine-kit",
        "swit-pb-r290s",
        "swit-pocket-140wh",
        "idx-duo-c198p"
    ];

    slugs.forEach(slug => {
        try {
            const record = app.findFirstRecordByFilter("equipment", `slug="${slug}"`);

            let file = null;
            const exts = ['jpg', 'png', 'jpeg', 'webp', 'gif'];
            for (const ext of exts) {
                try {
                    const path = `pb_data/support_power_images/${slug}.${ext}`;
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
