/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    const slugs = [
        "teradek-bolt-pro-2000",
        "teradek-bolt-pro-1000",
        "teradek-bolt-lt-500",
        "teradek-bolt-pro-300",
        "video-devices-pix-e7",
        "tvlogic-lvm-091w",
        "arri-blonde-2000",
        "par-64-can",
        "gfm-lite-dolly",
        "egripment-javelin",
        "ball-adapter-150mm"
    ];

    slugs.forEach(slug => {
        try {
            const record = app.findFirstRecordByFilter("equipment", `slug="${slug}"`);

            let file = null;
            const exts = ['jpg', 'png', 'jpeg', 'webp', 'gif'];
            for (const ext of exts) {
                try {
                    const path = `pb_data/final_sweep_images/${slug}.${ext}`;
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
