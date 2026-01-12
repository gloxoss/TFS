/// <reference path="../pb_data/types.d.ts" />

/**
 * Fix: Set visibility to 'published' for all variant products
 * The products were created with visibility=false, which makes them "unavailable"
 */
migrate((app) => {
    console.log("=== Fixing Variant Visibility ===");

    const productNames = [
        "Nanlite Forza 60B", "Nanlite Forza 300B", "Nanlite Forza 500B",
        "Aputure LS 600c Pro", "Aputure LS 600d Pro", "Aputure LS 600x Pro", "Aputure LS 1200d Pro"
    ];

    for (const name of productNames) {
        try {
            const record = app.findFirstRecordByFilter("pbc_equipment00001", `name = "${name}"`);
            if (record) {
                record.set("visibility", "published");
                app.save(record);
                console.log("Fixed: " + name);
            }
        } catch (e) {
            console.log("Not found: " + name);
        }
    }

    console.log("=== Done ===");
}, (app) => { });
