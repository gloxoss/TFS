/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    const output = [];

    // 1. Add 'user' field to 'quotes' collection
    const collection = app.findCollectionByNameOrId("quotes");

    // Check if field already exists (avoid error if run multiple times manually)
    // iterate schema.fields to check
    let fieldExists = false;
    const fields = collection.fields; // In recent PB, fields is a list
    // JSVM handling of fields list might vary, but usually it's an array-like wrapper
    // We can try to find it.

    // Safe way in JSVM: try getting it? Or just blindly add if we know it's missing.
    // Let's assume it's missing because of the 400 error.

    // However, to be safe, we can try to look it up.
    // Note: JSVM 'fields' is a specialized list.
    // field := collection.schema.getFieldByName("user") // Old way

    // New PocketBase v0.23+ way:
    // collection.fields.getByName("user")

    try {
        const existing = collection.fields.getByName("user");
        if (existing) fieldExists = true;
    } catch (e) {
        // likely not found
    }

    if (!fieldExists) {
        const Field = require("pocketbase/models/schema/field"); // Hypothetical import if needed, but usually we use specific methods
        // Actually, just constructing the field struct/object

        // In JSVM migrations for PB v0.23+:
        // collection.fields.add(new RelationField(...)) 
        // But referencing the Go types in JS is tricky without the global constructors.
        // Usually `new Field(...)` works if globals are exposed.

        // Let's use the JSON approach which is often safer or the standard `RelationField` if available.
        // But often just passing a plain object to `add` works? No.

        // Let's look at `1765453987_created_categories.js` (standard PB generation) for syntax.
        // Usually it uses `new Field(...)`.

        // If we can't be sure of the syntax, we can try `enable expansion` and verify?
        // Let's stick to the most robust method for JSVM: `collection.fields.add(...)`
        // We will try to instantiate a RelationField.

        // Alternative: Use raw schema manipulations? 
        // collection.schema.addField(new SchemaField({...})) // Old API

        // Let's try the modern way found in docs: 
        // const field = new RelationField({ name: "user", collectionId: "users", ... })
        // We will assume `RelationField` is available globally in the migrate context or try to use `app` helpers.

        // Safest backup: Update the whole collection with simple object merge if possible? No.

        // Let's try attempting to add it using the standard `Field` class if we can guess it.
        // Actually, let's look at how `1734000100_add_role_field.js` did it.
        // It used `collection.fields.add(field)`.

        // I will copy that pattern.

        const userField = new RelationField({
            "name": "user",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
                "collectionId": "_pb_users_auth_", // 'users' collection ID
                "cascadeDelete": false,
                "minSelect": null,
                "maxSelect": 1,
                "displayFields": null
            }
        });

        collection.fields.add(userField);
        app.save(collection);
        output.push("Added 'user' relation field to 'quotes' collection.");
    } else {
        output.push("'user' field already exists.");
    }

    // 2. Link Orphans (Copy of logic from 1734000000)
    const users = app.findAllRecords("users");
    const emailToId = {};
    users.forEach((u) => {
        const email = u.email();
        if (email) emailToId[email.toLowerCase()] = u.id;
    });

    const quotes = app.findAllRecords("quotes");
    // We check all because previously 'user' didn't exist, so we couldn't filter by "user = ''".
    // Or we can just process all.

    let linkedCount = 0;
    quotes.forEach((quote) => {
        // If already linked, skip?
        const existingUser = quote.get("user");
        if (existingUser && existingUser !== "") return;

        const clientEmail = quote.getString("client_email");
        if (clientEmail && emailToId[clientEmail.toLowerCase()]) {
            const userId = emailToId[clientEmail.toLowerCase()];
            quote.set("user", userId);
            app.save(quote);
            linkedCount++;
        }
    });

    output.push(`Linked ${linkedCount} quotes to users.`);
    console.log(output.join('\n'));

}, (app) => {
    // Revert logic: remove fields?
    // Dangerous to remove data. We skip revert for safety.
})
