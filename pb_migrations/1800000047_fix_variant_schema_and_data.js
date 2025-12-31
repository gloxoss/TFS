/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    console.log("=== Fix: Adding variant_options field and repopulating data ===");

    const collection = app.findCollectionByNameOrId("pbc_equipment00001");

    // 1. Add 'variant_options' JSON field if it doesn't exist
    let field = collection.fields.getByName("variant_options");
    if (!field) {
        console.log("Adding 'variant_options' field to schema...");
        filter = new Field({
            name: "variant_options",
            type: "json",
            required: false,
            presentable: false,
            system: false,
            options: {
                maxSize: 2000000
            }
        });
        collection.fields.add(filter); // or collection.fields.push(filter) - check PB API, usually .add() works in internal Go, but in JS migration it might be different. 
        // In recent PB JS, collection.fields is a specific type. 
        // Let's safe-guard: usually we use `col.fields.add(new Field(...))`. 

        app.save(collection);
        console.log("Schema saved.");
    } else {
        console.log("Field 'variant_options' already exists.");
    }

    // 2. Re-populate data (since previous save likely failed for this field)
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
