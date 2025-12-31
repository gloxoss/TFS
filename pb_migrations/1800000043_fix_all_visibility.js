/// <reference path="../pb_data/types.d.ts" />

/**
 * Fix: Set visibility to TRUE for ALL products with stock > 0
 * This ensures all available products can be added to quote
 */
migrate((app) => {
    console.log("=== Fixing visibility for all products with stock ===");

    // Get all equipment records
    const records = app.findRecordsByFilter("pbc_equipment00001", "visibility = false && stock_available > 0");

    let fixed = 0;
    for (const record of records) {
        record.set("visibility", true);
        app.save(record);
        console.log("Fixed: " + record.get("name"));
        fixed++;
    }

    console.log("=== Done! Fixed " + fixed + " products ===");
}, (app) => { });
