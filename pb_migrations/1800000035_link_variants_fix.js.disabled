/// <reference path="../pb_data/types.d.ts" />

/**
 * FIX: Link existing variant products together
 * 
 * The previous migration created the products but failed to persist the variant links.
 * This script finds products by name pattern and links them as variants.
 */
migrate((app) => {
    const collection = app.findCollectionByNameOrId("pbc_equipment00001");
    if (!collection) {
        console.log("❌ Equipment collection not found");
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
        console.log(`\n🔍 Processing: ${group.name}`);

        // Find all products matching the patterns
        const variantRecords = [];

        for (const pattern of group.patterns) {
            try {
                const record = app.findFirstRecordByFilter(
                    "pbc_equipment00001",
                    `name = "${pattern}" && visibility != "archived"`
                );
                if (record) {
                    variantRecords.push(record);
                    console.log(`  ✓ Found: ${pattern}`);
                } else {
                    console.log(`  ⚠ Not found: ${pattern}`);
                }
            } catch (e) {
                console.log(`  ⚠ Not found: ${pattern}`);
            }
        }

        if (variantRecords.length < 2) {
            console.log(`  ⏭ Skipping - need at least 2 variants to link`);
            continue;
        }

        // Get all variant IDs
        const allVariantIds = variantRecords.map(r => r.id);

        // Link each variant to ALL others (excluding itself)
        for (const record of variantRecords) {
            const siblingIds = allVariantIds.filter(id => id !== record.id);
            record.set("variants", siblingIds);
            app.save(record);
            console.log(`  🔗 Linked ${record.get("name")} → ${siblingIds.length} siblings`);
            totalLinked++;
        }
    }

    console.log(`\n✅ Done! Linked ${totalLinked} products total.`);
}, (app) => {
    // Rollback: Clear all variant links
    console.log("Rolling back variant links...");

    const records = app.findRecordsByFilter(
        "pbc_equipment00001",
        "variants != ''"
    );

    for (const record of records) {
        record.set("variants", []);
        app.save(record);
    }
});
