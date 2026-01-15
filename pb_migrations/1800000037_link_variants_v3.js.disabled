/// <reference path="../pb_data/types.d.ts" />

/**
 * FIX: Properly link all variant siblings
 * Each variant should link to ALL other variants in its family, not just one.
 * Removed visibility filter since new products have visibility=false (not "archived" string).
 */
migrate((app) => {
    console.log("=== Starting Variant Link Fix ===");

    // Define variant groups - find by exact name match
    const variantGroups = [
        {
            name: "Nanlite Forza Series",
            patterns: ["Nanlite Forza 60B", "Nanlite Forza 300B", "Nanlite Forza 500B"]
        },
        {
            name: "Aputure Light Storm Pro Series",
            patterns: ["Aputure LS 600c Pro", "Aputure LS 600d Pro", "Aputure LS 600x Pro", "Aputure LS 1200d Pro"]
        },
        {
            name: "ARRI M-Series",
            patterns: ["ARRI M18", "ARRI M40", "ARRI M90"]
        },
        {
            name: "DMG Lumière MIX Series",
            patterns: ["DMG Lumière MINI MIX", "DMG Lumière SL1 MIX", "DMG Lumière MAXI MIX"]
        }
    ];

    let totalLinked = 0;

    for (const group of variantGroups) {
        console.log("Processing: " + group.name);

        const variantRecords = [];

        // Find all products in this group (no visibility filter - they have visibility=false not string)
        for (const pattern of group.patterns) {
            try {
                // Simple name match without visibility filter
                const record = app.findFirstRecordByFilter(
                    "pbc_equipment00001",
                    `name = "${pattern}"`
                );
                if (record) {
                    variantRecords.push(record);
                    console.log("  Found: " + pattern + " (id: " + record.id + ")");
                }
            } catch (e) {
                console.log("  Not found: " + pattern);
            }
        }

        console.log("  Found " + variantRecords.length + " variants in group");

        if (variantRecords.length < 2) {
            console.log("  Skipping - need at least 2 variants to link");
            continue;
        }

        // Get all variant IDs
        const allVariantIds = variantRecords.map(r => r.id);
        console.log("  All IDs: " + allVariantIds.join(", "));

        // Link each variant to ALL others (excluding itself)
        for (const record of variantRecords) {
            const siblingIds = allVariantIds.filter(id => id !== record.id);
            console.log("  " + record.get("name") + " -> siblings: " + siblingIds.join(", "));
            record.set("variants", siblingIds);
            app.save(record);
            totalLinked++;
        }
        console.log("  Linked " + variantRecords.length + " products with " + (variantRecords.length - 1) + " siblings each");
    }

    console.log("=== Complete: Linked " + totalLinked + " products ===");
}, (app) => {
    console.log("Rollback not implemented");
});
