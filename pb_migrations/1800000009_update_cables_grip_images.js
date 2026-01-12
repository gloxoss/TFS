/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    const slugs = [
        "power-cable-16a",
        "power-cable-32a-3phase",
        "power-cable-63a-3phase",
        "power-cable-125a-3phase",
        "distro-vipere-32a",
        "schneider-nd-3",
        "schneider-irnd-3",
        "schneider-grad-nd-9",
        "tiffen-bpm-1-4",
        "schneider-glimmerglass-1",
        "schneider-hbm",
        "arri-rota-pola",
        "schneider-true-pol",
        "tiffen-138mm-diopter-set",
        "schneider-streak-blue",
        "movietech-magnum-dolly",
        "movietech-scooter-dolly",
        "panther-super-panther",
        "panther-husky-dolly",
        "chapman-peewee",
        "moviebird-45",
        "stanton-jimmy-jib",
        "egripment-javelin",
        "panther-u-bangi",
        "gfm-mini-jib",
        "panther-straight-track",
        "panther-curved-track",
        "manfrotto-autopoles"
    ];

    slugs.forEach(slug => {
        try {
            const record = app.findFirstRecordByFilter("equipment", `slug="${slug}"`);

            let file = null;
            const exts = ['jpg', 'png', 'jpeg', 'webp'];
            for (const ext of exts) {
                try {
                    const path = `pb_data/cables_grip_images/${slug}.${ext}`;
                    file = $filesystem.fileFromPath(path);
                    if (file) break;
                } catch (e) { }
            }

            if (file) {
                record.set("image", file);
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
