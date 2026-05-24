/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    let collection;
    try {
        collection = app.findCollectionByNameOrId("messages");
    } catch (e) {
        console.log("Collection 'messages' not found, creating new one...");
        collection = new Collection({
            name: "messages",
            type: "base"
        });
    }

    // Helper to add field if missing
    const ensureField = (name, type, options = {}) => {
        let existing = null;
        try {
            existing = collection.fields.getByName(name);
        } catch (e) {
            // Field doesn't exist
        }

        if (!existing) {
            const field = new Field({
                name: name,
                type: type,
                required: options.required || false,
                presentable: options.presentable || false,
                system: false,
                ...options.options
            });
            collection.fields.add(field);
        }
    };

    // 1. Name
    ensureField("name", "text", { required: true, presentable: true });

    // 2. Email
    ensureField("email", "email", { required: true, presentable: true });

    // 3. Subject
    ensureField("subject", "text", { required: false });

    // 4. Message
    ensureField("message", "text", { required: true });

    // Ensure Rules allow public create
    collection.createRule = ""; // Public can create
    collection.listRule = null; // Admin only
    collection.viewRule = null; // Admin only

    app.save(collection);

}, (app) => {
    // Revert logic
    try {
        const collection = app.findCollectionByNameOrId("messages");
        app.delete(collection);
    } catch (e) { }
})
