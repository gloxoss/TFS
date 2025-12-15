/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const collection = app.findCollectionByNameOrId("quotes");

    // Add 'locked' boolean field
    collection.fields.add(new BoolField({
        name: "locked",
        system: false,
    }));

    app.save(collection);
}, (app) => {
    const collection = app.findCollectionByNameOrId("quotes");

    // Remove 'locked' field
    // Note: finding by name in fields list and removing is complex in JSVM without helper
    // For now we might skip revert or iterate
    try {
        const field = collection.getFieldByName("locked");
        if (field) {
            collection.fields.remove(field);
            app.save(collection);
        }
    } catch (e) {
        // ignore
    }
})
