/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    const slugs = [
        "fujinon-cabrio-14-35mm",
        "canon-cine-servo-15-120mm",
        "canon-cine-servo-25-250mm",
        "angenieux-optimo-28-76mm",
        "angenieux-optimo-style-48-130mm",
        "angenieux-optimo-19.5-94mm",
        "zeiss-cz2-15-30mm",
        "tokina-11-16mm",
        "zeiss-cp2-set",
        "zeiss-standard-primes",
        "zeiss-master-macro",
        "scorpion-anamorphic",
        "tvlogic-lqm-071w",
        "marshall-v-md241",
        "transvideo-starlite",
        "atomos-ninja-inferno",
        "swit-cw-s300",
        "zhiyun-crane-3s",
        "dedolight-150w-kit",
        "dmg-lumiere-mix",
        "aputure-cs15",
        "aputure-xt26",
        "aputure-xt52",
        "amaran-flex-mat",
        "aputure-mc-pro",
        "phoenix-crane",
        "panther-pegasus",
        "abc-120-crane",
        "gizmo-jib",
        "panther-lightweight-jib",
        "panther-boogie-wheels",
        "multitower-scaffolding",
        "low-rig-riser",
        "barracuda-bar"
    ];

    slugs.forEach(slug => {
        try {
            const record = app.findFirstRecordByFilter("equipment", `slug="${slug}"`);

            let file = null;
            const exts = ['jpg', 'png', 'jpeg', 'webp', 'gif'];
            for (const ext of exts) {
                try {
                    const path = `pb_data/remaining_images/${slug}.${ext}`;
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
