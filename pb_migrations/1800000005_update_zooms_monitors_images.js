/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    const slugs = [
        "arri-uwz-9.5-18mm",
        "arri-alura-45-250mm",
        "arri-alura-18-80mm",
        "fujinon-cabrio-19-90mm",
        "fujinon-cabrio-85-300mm",
        "fujinon-cabrio-20-120mm",
        "canon-cne-15.5-47mm",
        "canon-cine-servo-17-120mm",
        "angenieux-optimo-style-30-76mm",
        "angenieux-optimo-style-16-40mm",
        "sigma-50-100mm-t2",
        "arri-lmb-4x5",
        "arri-lmb-25",
        "arri-mb-28",
        "arri-mmb-2",
        "chrosziel-450-r11",
        "smallhd-ultra-7-bolt",
        "smallhd-ultra-7",
        "smallhd-703-bolt",
        "smallhd-cine-7-red",
        "tvlogic-vfm-055a",
        "sony-pvma170",
        "sony-bvm-e251",
        "blackmagic-video-assist-7-12g",
        "atomos-shogun-7"
    ];

    slugs.forEach(slug => {
        try {
            const record = app.findFirstRecordByFilter("equipment", `slug="${slug}"`);

            // Try to find local file
            let file = null;
            const exts = ['jpg', 'png', 'jpeg', 'webp'];

            for (const ext of exts) {
                try {
                    const path = `pb_data/zooms_monitors_images/${slug}.${ext}`;
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
                console.log(`⚠️ No local image found for: ${slug} (run download_zooms_monitors.py first)`);
            }

        } catch (e) {
            console.log(`Skipping update for ${slug}: ${e}`);
        }
    });

}, (app) => {
    // No rollback
})
