/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {

    // List of slugs corresponding to the downloaded images
    const slugs = [
        "schneider-nd-03", "schneider-irnd-03", "schneider-grad-nd-09", "tiffen-bpm-1-4",
        "schneider-glimmerglass-1", "tiffen-soft-fx", "diopter-tray", "schneider-hbm",
        "arri-rota-pola", "schneider-true-pol", "tiffen-diopter-set", "tiffen-enhancing",
        "schneider-true-streak-blue", "tiffen-sky-1a", "movietech-magnum", "movietech-scooter",
        "panther-super-panther", "slider-mount-kit", "panther-husky", "chapman-peewee",
        "gfm-lite", "moviebird-45", "phoenix-crane", "multitower", "panther-pegasus",
        "abc-120", "jimmy-jib", "egripment-javelin", "gizmo-jib", "panther-u-bangi",
        "gfm-mini-jib", "panther-lightweight-jib", "panther-boogie-wheels", "system-low-rig",
        "panther-low-rig", "panther-straight-track", "panther-curved-track", "gfm-curved-track",
        "gfm-straight-track", "manfrotto-autopoles", "barracuda-bar", "euro-riser-set",
        "gas-riser", "ball-adapter-150mm"
    ];

    // Absolute path to the temp directory
    // Note: Forward slashes work in Windows JSVM usually, or escaped backslashes.
    const baseDir = "c:/Users/zakio/Documents/Project/PB-Next/pb_data/temp_grip_downloads";

    const extensions = [".jpg", ".png", ".webp", ".jpeg", ".gif"];

    slugs.forEach(slug => {
        try {
            const record = app.findFirstRecordByFilter("equipment", `slug="${slug}"`);

            // Check current image? (Optional, force update preferred here)

            let file = null;
            let foundPath = "";

            for (const ext of extensions) {
                const p = `${baseDir}/${slug}${ext}`;
                try {
                    // Try to load file
                    file = $filesystem.fileFromPath(p);
                    if (file) {
                        foundPath = p;
                        break;
                    }
                } catch (e) { }
            }

            if (file) {
                console.log(`Attaching image to ${slug} from ${foundPath}`);
                record.set("image", file);
                app.save(record);
            } else {
                console.log(`Warning: Image file not found for ${slug}`);
            }

        } catch (e) {
            console.log(`Skipping ${slug} (Record not found or error): ${e.message}`);
        }
    });

}, (app) => {
    // Down migration
});
