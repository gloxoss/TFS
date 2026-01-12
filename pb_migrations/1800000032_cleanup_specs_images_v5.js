/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    console.log("[Migration V5] Removing image_url from equipment specs (Byte Parse Mode)...");

    const collection = app.findCollectionByNameOrId("equipment");
    const records = app.findRecordsByFilter(collection.id, "1=1", "", 1000, 0);

    let updatedCount = 0;

    records.forEach(record => {
        let changed = false;

        ["specs", "specs_en", "specs_fr"].forEach(field => {
            try {
                let val = record.get(field);

                // Helper to ensure we have an object
                let obj = null;

                if (val === null || val === undefined) {
                    return;
                }

                // Case 1: Already an object
                if (typeof val === 'object' && !Array.isArray(val)) {
                    obj = val;
                }
                // Case 2: Byte Array (Array of numbers)
                else if (Array.isArray(val)) {
                    // Convert bytes to string
                    try {
                        const str = val.map(b => String.fromCharCode(b)).join('');
                        obj = JSON.parse(str);
                    } catch (e) {
                        console.log(`[Warning] Failed to parse byte array for ${field} on ${record.id}: ${e}`);
                        return;
                    }
                }
                // Case 3: JSON String
                else if (typeof val === 'string') {
                    if (val.trim().startsWith('{')) {
                        try {
                            obj = JSON.parse(val);
                        } catch (e) { return; }
                    }
                }

                if (obj && typeof obj === 'object') {
                    // Do the cleanup
                    let modified = false;

                    if (obj["image_url"] !== undefined) {
                        delete obj["image_url"];
                        modified = true;
                    }

                    // Also check for nested or other quirks just in case? No, user screenshot was top level.

                    if (modified) {
                        // We must set it back. 
                        // PocketBase usually accepts map[string]any or struct. 
                        // Setting a plain JS object usually works and gets serialized.
                        record.set(field, obj);
                        changed = true;
                    }
                }

            } catch (e) {
                console.log(`[Warning] Error processing field ${field} for record ${record.id}: ${e}`);
            }
        });

        if (changed) {
            app.save(record);
            updatedCount++;
        }
    });

    console.log(`[Migration V5] Completed. Updated ${updatedCount} records.`);

}, (app) => {
    console.log("[Migration V5] Rollback skipped.");
});
