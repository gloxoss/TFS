/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    const collection = app.findCollectionByNameOrId("equipment");

    // 1. Add item_sort_order field
    collection.fields.push(new Field({
        name: "item_sort_order",
        type: "number",
        required: false,
        min: 0
    }));
    app.save(collection);

    // 2. Initialize ALL records to 999 (Default High value)
    // We do this via DB query for speed, or loop
    // Using Javascript loop for safety hook firing (though slow)
    // Actually, SQL update is faster.
    app.db().newQuery("UPDATE equipment SET item_sort_order = 999").execute();

    // 3. Apply Custom Order for Cameras
    const customOrder = {
        'arri-alexa-35-xtreme': 1,
        'arri-alexa-35': 2,
        'arri-alexa-mini-lf': 3,
        'arri-alexa-mini': 4,
        'arri-amira': 5,
        'panasonic-varicam-lt': 6,
        'dsmc2-monstro-8k': 7,
        'sony-venice-2-8k': 8,
        'sony-f55': 9,
        'sony-pxw-fx9': 10,
        'sony-fx6': 11,
        'sony-fx3': 12
    };

    Object.entries(customOrder).forEach(([slug, order]) => {
        try {
            const record = app.findFirstRecordByFilter("equipment", `slug="${slug}"`);
            if (record) {
                record.set("item_sort_order", order);
                app.save(record);
            }
        } catch (e) {
            console.log(`Warning: Product ${slug} not found for sorting update.`);
        }
    });

}, (app) => {
    const collection = app.findCollectionByNameOrId("equipment");
    const field = collection.fields.find(f => f.name === "item_sort_order");
    if (field) {
        collection.fields.remove(field);
        app.save(collection);
    }
});
