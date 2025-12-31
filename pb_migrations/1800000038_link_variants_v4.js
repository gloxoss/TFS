/// <reference path="../pb_data/types.d.ts" />

/**
 * FIX: Properly link all variant siblings (v4)
 * Uses explicit JSON stringify for array to ensure multi-value storage
 */
migrate((app) => {
    console.log("=== Variant Link Fix v4 (JSON Array) ===");

    // Define variant groups
    const variantGroups = [
        {
            name: "Nanlite Forza Series",
            patterns: ["Nanlite Forza 60B", "Nanlite Forza 300B", "Nanlite Forza 500B"]
        },
        {
            name: "Aputure Light Storm Pro Series",
            patterns: ["Aputure LS 600c Pro", "Aputure LS 600d Pro", "Aputure LS 600x Pro", "Aputure LS 1200d Pro"]
        }
    ];

    for (const group of variantGroups) {
        console.log("Processing: " + group.name);

        const variantRecords = [];

        for (const pattern of group.patterns) {
            try {
                const record = app.findFirstRecordByFilter(
                    "pbc_equipment00001",
                    `name = "${pattern}"`
                );
                if (record) {
                    variantRecords.push({ id: record.id, name: pattern, record: record });
                    console.log("  Found: " + pattern);
                }
            } catch (e) {
                console.log("  Not found: " + pattern);
            }
        }

        if (variantRecords.length < 2) continue;

        // Link each to all others
        for (const item of variantRecords) {
            const siblings = variantRecords
                .filter(v => v.id !== item.id)
                .map(v => v.id);

            console.log("  Linking " + item.name + " to: " + JSON.stringify(siblings));

            // Try setting as array
            item.record.set("variants", siblings);

            // Debug: Log what was set
            const afterSet = item.record.get("variants");
            console.log("  After set: " + JSON.stringify(afterSet));

            app.save(item.record);

            // Verify by re-reading
            const saved = app.findRecordById("pbc_equipment00001", item.id);
            const savedVariants = saved.get("variants");
            console.log("  After save: " + JSON.stringify(savedVariants));
        }
    }

    console.log("=== Complete ===");
}, (app) => {
    // No rollback
});
