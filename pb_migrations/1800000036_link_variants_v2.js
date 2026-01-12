/// <reference path="../pb_data/types.d.ts" />

/**
 * FIX: Link existing variant products together (v2)
 * Fresh migration to ensure execution - previous was marked applied without running.
 */
migrate((app) => {
    const collection = app.findCollectionByNameOrId("pbc_equipment00001");
    if (!collection) {
        console.log("Equipment collection not found");
        return;
    }

    // Define variant groups by name patterns
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

        for (const pattern of group.patterns) {
            try {
                const record = app.findFirstRecordByFilter(
                    "pbc_equipment00001",
                    `name = "${pattern}" && visibility != "archived"`
                );
                if (record) {
                    variantRecords.push(record);
                    console.log("  Found: " + pattern);
                }
            } catch (e) {
                console.log("  Not found: " + pattern);
            }
        }

        if (variantRecords.length < 2) {
            console.log("  Skipping - need at least 2 variants");
            continue;
        }

        const allVariantIds = variantRecords.map(r => r.id);

        for (const record of variantRecords) {
            const siblingIds = allVariantIds.filter(id => id !== record.id);
            record.set("variants", siblingIds);
            app.save(record);
            console.log("  Linked " + record.get("name") + " to " + siblingIds.length + " siblings");
            totalLinked++;
        }
    }

    console.log("Done! Linked " + totalLinked + " products total.");
}, (app) => {
    console.log("Rolling back variant links...");
});
