/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    const slugs = [
        "arri-m18",
        "arri-m40",
        "arri-m90",
        "arrisun-5",
        "arrisun-12",
        "arrisun-40-25",
        "arrisun-60",
        "arrisun-120",
        "bron-kobold-dw200",
        "bron-kobold-dw400",
        "bron-kobold-dw800",
        "arri-junior-150",
        "arri-junior-300",
        "arri-junior-650",
        "arri-true-blue-t1",
        "arrilite-800",
        "arri-blonde-2000",
        "dino-light-9k",
        "dino-light-12k",
        "dino-light-24k",
        "par-64-can",
        "etc-source-4",
        "dedolight-dlh4",
        "dedolight-dlh2",
        "creamsource-vortex8",
        "arri-skypanel-s60c",
        "arri-skypanel-s30c",
        "dmg-mini-mix",
        "dmg-sl1-mix",
        "dmg-maxi-mix",
        "astera-titan-fp1",
        "astera-ax1",
        "astera-ax2",
        "astera-ax3",
        "astera-ax5",
        "astera-ax10",
        "astera-lunabulb",
        "nanlite-forza-60b",
        "nanlite-forza-300",
        "nanlite-forza-300b",
        "nanlite-forza-500",
        "nanlite-forza-500b-ii",
        "aputure-xt52",
        "aputure-cs15",
        "aputure-xt26",
        "aputure-1200d-pro",
        "aputure-600c-pro-ii",
        "aputure-600c-pro",
        "aputure-600x-pro",
        "aputure-600d-pro",
        "amaran-300c",
        "aputure-300d-ii",
        "aputure-60x",
        "aputure-mc-pro",
        "amaran-f21c",
        "amaran-f22c",
        "litemat-2",
        "litemat-2l",
        "litemat-4",
        "kinoflo-4ft-4bank",
        "kinoflo-2ft-4bank",
        "swit-s2620",
        "swit-s2610",
        "falconeyes-c100bl"
    ];

    slugs.forEach(slug => {
        try {
            const record = app.findFirstRecordByFilter("equipment", `slug="${slug}"`);

            let file = null;
            const exts = ['jpg', 'png', 'jpeg', 'webp', 'gif'];
            for (const ext of exts) {
                try {
                    const path = `pb_data/lighting_detailed_images/${slug}.${ext}`;
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
