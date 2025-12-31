/// <reference path="../pb_data/types.d.ts" />

/**
 * Link all variant siblings (after field was fixed to Multiple)
 */
migrate((app) => {
    console.log("=== Linking Variants (Final) ===");

    const variantGroups = [
        { name: "Nanlite Forza Series", patterns: ["Nanlite Forza 60B", "Nanlite Forza 300B", "Nanlite Forza 500B"] },
        { name: "Aputure Light Storm Pro Series", patterns: ["Aputure LS 600c Pro", "Aputure LS 600d Pro", "Aputure LS 600x Pro", "Aputure LS 1200d Pro"] }
    ];

    let total = 0;

    for (const group of variantGroups) {
        console.log("Group: " + group.name);
        const records = [];

        for (const name of group.patterns) {
            try {
                const r = app.findFirstRecordByFilter("pbc_equipment00001", `name = "${name}"`);
                if (r) records.push(r);
            } catch (e) { }
        }

        if (records.length < 2) continue;

        const allIds = records.map(r => r.id);

        for (const record of records) {
            const siblings = allIds.filter(id => id !== record.id);
            record.set("variants", siblings);
            app.save(record);
            total++;
            console.log("  " + record.get("name") + " -> " + siblings.length + " siblings");
        }
    }

    console.log("Done! Linked " + total + " products.");
}, (app) => { });
