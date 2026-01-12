/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    const slugs = [
        "teradek-ranger-mk-ii-750",
        "teradek-bolt-6-lt-1500",
        "teradek-bolt-6-lt-750",
        "teradek-bolt-pro-3000",
        "teradek-bolt-sidekick-ii",
        "teradek-bolt-1000-xt",
        "teradek-bolt-500-xt",
        "hollyland-mars-400s-pro-ii",
        "dji-ronin-2",
        "dji-rs-3-pro",
        "dji-rs-4-pro",
        "dji-force-pro",
        "arri-m18",
        "arri-m40",
        "arri-junior-650",
        "arri-t1-true-blue",
        "dino-light-12k",
        "etc-source-4-750",
        "arri-skypanel-s60-c",
        "creamsource-vortex8",
        "astera-titan-tube-set",
        "aputure-ls-1200d-pro",
        "aputure-ls-600c-pro-ii",
        "nanlite-forza-500b",
        "litemat-4-spectrum"
    ];

    slugs.forEach(slug => {
        try {
            const record = app.findFirstRecordByFilter("equipment", `slug="${slug}"`);

            // Try to find local file
            let file = null;
            const exts = ['jpg', 'png', 'jpeg', 'webp'];

            for (const ext of exts) {
                try {
                    const path = `pb_data/video_lights_images/${slug}.${ext}`;
                    file = $filesystem.fileFromPath(path);
                    if (file) {
                        console.log(`   Found local file: ${path}`);
                        break;
                    }
                } catch (e) { }
            }

            if (file) {
                record.set("image", file);

                // Add to 'images' gallery if empty
                const currentImages = record.get("images");
                if (!currentImages || currentImages.length === 0) {
                    record.set("images", [file]);
                }

                app.save(record);
                console.log(`✅ Updated image for: ${slug}`);
            } else {
                console.log(`⚠️ No local image found for: ${slug} (run download_video_lights.py first)`);
            }

        } catch (e) {
            console.log(`Skipping update for ${slug}: ${e}`);
        }
    });

}, (app) => {
    // No rollback
})
