/// <reference path="../pb_data/types.d.ts" />

/**
 * Link variants - final run after field fixed to Multiple
 */
migrate((app) => {
    console.log("=== Linking Variants (After Multiple Fix) ===");

    const variantGroups = [
        { name: "Nanlite Forza Series", patterns: ["Nanlite Forza 60B", "Nanlite Forza 300B", "Nanlite Forza 500B"] },
        { name: "Aputure Light Storm Pro Series", patterns: ["Aputure LS 600c Pro", "Aputure LS 600d Pro", "Aputure LS 600x Pro", "Aputure LS 1200d Pro"] }
    ];

    for (const group of variantGroups) {
        console.log("Group: " + group.name);
        const records = [];

        for (const name of group.patterns) {
            try {
                const r = app.findFirstRecordByFilter("pbc_equipment00001", `name = "${name}"`);
                if (r) {
                    records.push(r);
                    console.log("  Found: " + name);
                }
            } catch (e) { }
        }

        if (records.length < 2) continue;

        const allIds = records.map(r => r.id);

        for (const record of records) {
            const siblings = allIds.filter(id => id !== record.id);
            record.set("variants", siblings);
            app.save(record);
            console.log("  Linked " + record.get("name") + " to " + siblings.length + " siblings: " + siblings.join(", "));
        }
    }

    console.log("=== Complete ===");
}, (app) => { });
