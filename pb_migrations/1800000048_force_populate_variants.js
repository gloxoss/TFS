/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    console.log("=== Force Populating Variant Data ===");

    const updates = [
        {
            namePattern: 'name ~ "Nanlite Forza Series"',
            variantOptions: { "wattage": ["60W", "300W", "500W"] }
        },
        {
            namePattern: 'name ~ "Aputure Light Storm Pro Series"',
            variantOptions: { "model": ["LS 600c Pro (RGBWW)", "LS 600d Pro (Daylight)", "LS 600x Pro (Bi-Color)", "LS 1200d Pro (Daylight)"] }
        },
        {
            namePattern: 'name ~ "ARRI M-Series Daylight HMI"',
            variantOptions: { "wattage": ["1800W (M18)", "4000W (M40)", "9000W (M90)"] }
        },
        {
            namePattern: 'name = "ARRI Redhead / Blonde Kit"',
            variantOptions: { "model": ["Redhead 800W", "Blonde 2000W"] }
        },
        {
            namePattern: 'name = "DMG Lumière MIX Series"',
            variantOptions: { "size": ["MINI MIX", "SL1 MIX", "MAXI MIX"] }
        }
    ];

    for (const update of updates) {
        try {
            const record = app.findFirstRecordByFilter("pbc_equipment00001", update.namePattern);
            if (record) {
                record.set("variant_options", JSON.stringify(update.variantOptions));
                app.save(record);
                console.log(`Updated variant_options for: ${record.get("name")}`);
            } else {
                console.log(`Product not found for pattern: ${update.namePattern}`);
            }
        } catch (e) {
            console.log(`Error updating ${update.namePattern}: ${e.message}`);
        }
    }

}, (app) => {
    // down
});
