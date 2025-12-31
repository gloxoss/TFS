/// <reference path="../pb_data/types.d.ts" />

/**
 * Revert to JSON Variant Options approach:
 * 1. Delete individual variant records (Forza 60B/300B/500B, Aputure variants)
 * 2. Restore original series products (unhide, rename)
 * 3. Add variant_options JSON data
 */
migrate((app) => {
    console.log("=== Reverting to JSON Variant Options ===");

    // 1. DELETE individual variant records
    const variantsToDelete = [
        "Nanlite Forza 60B", "Nanlite Forza 300B", "Nanlite Forza 500B",
        "Aputure LS 600c Pro", "Aputure LS 600d Pro", "Aputure LS 600x Pro", "Aputure LS 1200d Pro",
        "ARRI M18 HMI", "ARRI M40 HMI", "ARRI M90 HMI",
        "DMG MINI MIX", "DMG SL1 MIX", "DMG MAXI MIX"
    ];

    let deleted = 0;
    for (const name of variantsToDelete) {
        try {
            const record = app.findFirstRecordByFilter("pbc_equipment00001", `name = "${name}"`);
            if (record) {
                app.delete(record);
                console.log("Deleted: " + name);
                deleted++;
            }
        } catch (e) {
            // Not found, skip
        }
    }
    console.log("Deleted " + deleted + " variant records");

    // 2. RESTORE archived series products
    const seriesToRestore = [
        {
            archivedName: "[ARCHIVED] Nanlite Forza Series (300/500)",
            newName: "Nanlite Forza Series",
            variantOptions: { "wattage": ["60W", "300W", "500W"] }
        },
        {
            archivedName: "[ARCHIVED] Aputure Light Storm Pro Series",
            newName: "Aputure Light Storm Pro Series",
            variantOptions: { "model": ["LS 600c Pro (RGBWW)", "LS 600d Pro (Daylight)", "LS 600x Pro (Bi-Color)", "LS 1200d Pro (Daylight)"] }
        },
        {
            archivedName: "[ARCHIVED] ARRI M-Series Daylight HMI",
            newName: "ARRI M-Series Daylight HMI",
            variantOptions: { "wattage": ["1800W (M18)", "4000W (M40)", "9000W (M90)"] }
        }
    ];

    let restored = 0;
    for (const series of seriesToRestore) {
        try {
            const record = app.findFirstRecordByFilter("pbc_equipment00001", `name = "${series.archivedName}"`);
            if (record) {
                record.set("name", series.newName);
                record.set("name_en", series.newName);
                record.set("name_fr", series.newName);
                record.set("visibility", true);
                record.set("variant_options", JSON.stringify(series.variantOptions));
                app.save(record);
                console.log("Restored: " + series.newName);
                restored++;
            }
        } catch (e) {
            console.log("Could not restore: " + series.archivedName);
        }
    }
    console.log("Restored " + restored + " series products");

    // 3. Add variant_options to other products that have variants in their specs
    const lightingWithVariants = [
        {
            name: "ARRI Redhead / Blonde Kit",
            variantOptions: { "model": ["Redhead 800W", "Blonde 2000W"] }
        },
        {
            name: "DMG Lumière MIX Series",
            variantOptions: { "size": ["MINI MIX", "SL1 MIX", "MAXI MIX"] }
        }
    ];

    for (const item of lightingWithVariants) {
        try {
            const record = app.findFirstRecordByFilter("pbc_equipment00001", `name = "${item.name}"`);
            if (record) {
                record.set("variant_options", JSON.stringify(item.variantOptions));
                app.save(record);
                console.log("Added variant options to: " + item.name);
            }
        } catch (e) {
            console.log("Not found: " + item.name);
        }
    }

    console.log("=== Complete ===");
}, (app) => {
    console.log("Rollback not implemented");
});
