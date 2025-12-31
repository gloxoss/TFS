/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    const record = app.findFirstRecordByFilter("pbc_equipment00001", 'name ~ "Nanlite Forza Series"');
    if (record) {
        console.log("Found Product: " + record.get("name"));
        console.log("Variant Options Raw: " + record.get("variant_options"));

        // Check schema?
        try {
            const collection = app.findCollectionByNameOrId("pbc_equipment00001");
            const field = collection.fields.getByName("variant_options");
            if (field) {
                console.log("Field 'variant_options' EXISTS in schema. Type: " + field.type);
            } else {
                console.log("Field 'variant_options' DOES NOT EXIST in schema.");
            }
        } catch (e) {
            console.log("Error checking schema: " + e.message);
        }
    } else {
        console.log("Product not found");
    }
}, (app) => {
    // down
});
