/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    const slugs = [
        "arri-hi-5-wireless-set",
        "arri-wcu-4",
        "arri-sxu-1",
        "teradek-rt-fiz",
        "teradek-ctrl-3",
        "cmotion-compact-one",
        "tilta-nucleus-m",
        "arri-ff-5-cine",
        "arri-ff-4",
        "arri-ff-3",
        "chrosziel-dv-studio",
        "oconnor-2575d",
        "oconnor-2560",
        "cartoni-master-mk2",
        "cartoni-maxima-30",
        "sachtler-video-30-ii",
        "sachtler-system-25",
        "arrihead-2",
        "cooke-s4i-set",
        "arri-zeiss-master-anamorphic",
        "arri-signature-primes",
        "zeiss-supreme-primes",
        "arri-zeiss-master-primes",
        "zeiss-super-speed-mk3",
        "zeiss-cp3-set",
        "zeiss-ultra-primes",
        "atlas-orion-anamorphic",
        "arri-macro-primes"
    ];

    const collection = app.findCollectionByNameOrId("equipment");

    slugs.forEach(slug => {
        try {
            const record = app.findFirstRecordByFilter("equipment", `slug="${slug}"`);

            // Try to find the local file (downloaded by Python script)
            let file = null;
            const exts = ['jpg', 'png', 'jpeg', 'webp'];

            for (const ext of exts) {
                try {
                    // Try to load file from likely paths
                    // Note: PocketBase execution cwd is usually the project root where 'pocketbase' executable is.
                    // We saved images to 'pb_data/accessory_images' relative to root.
                    const path = `pb_data/accessory_images/${slug}.${ext}`;
                    file = $filesystem.fileFromPath(path);
                    if (file) {
                        console.log(`   Found local file: ${path}`);
                        break;
                    }
                } catch (e) {
                    // console.log(e);
                }
            }

            if (file) {
                record.set("image", file);

                // Also set 'images' gallery if needed (though reusing file object might require reload or might work)
                // For safety, let's just set the main image first. 
                // To set 'images', we'd want to check if it's empty or append.
                // Assuming we want to sync the downloaded image to both if empty.
                const currentImages = record.get("images");
                if (!currentImages || currentImages.length === 0) {
                    // Loading file again to be safe as file stream might be consumed
                    // Or simply use the same file object reference if PB supports it (usually yes)
                    record.set("images", [file]);
                }

                app.save(record);
                console.log(`✅ Updated image for: ${slug}`);
            } else {
                console.log(`⚠️ No local image found for: ${slug} (run download_accessories.py first)`);
            }

        } catch (e) {
            // Record might not exist if seed failed
            console.log(`Skipping update for ${slug}: ${e}`);
        }
    });

}, (app) => {
    // No rollback updating images, difficult to restore previous state without backups
})
