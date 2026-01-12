/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    const slugs = [
        "smallhd-cine-5",
        "swit-s1051h",
        "ruige-tl-701hda",
        "lilliput-fs7",
        "tvlogic-f7hs",
        "smallhd-702-bright",
        "smallhd-dp6-sdi",
        "fujinon-cabrio-25-300mm",
        "tokina-50-135mm",
        "laowa-24mm-periprobe",
        "canon-ej-6mm",
        "canon-ef-100mm-macro",
        "canon-tse-45mm",
        "ibe-plx2-extender"
    ];

    slugs.forEach(slug => {
        try {
            const record = app.findFirstRecordByFilter("equipment", `slug="${slug}"`);

            let file = null;
            const exts = ['jpg', 'png', 'jpeg', 'webp', 'gif'];
            for (const ext of exts) {
                try {
                    const path = `pb_data/extra_monitors_lenses_images/${slug}.${ext}`;
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
