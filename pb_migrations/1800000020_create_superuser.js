/// <reference path="../pb_data/types.d.ts" />

// PocketBase v0.23+ stores admins in the _superusers auth collection
migrate((app) => {
    const email = "recovery@local.host";
    const password = "1234567890";

    console.log("[Recovery] Creating superuser in _superusers collection...");

    try {
        // Find the _superusers collection
        const collection = app.findCollectionByNameOrId("_superusers");

        // Check if user already exists
        try {
            const existing = app.findAuthRecordByEmail(collection, email);
            console.log("[Recovery] Superuser already exists. Done.");
            return;
        } catch (e) {
            // Not found, proceed to create
        }

        // Create new superuser record
        const record = new Record(collection);
        record.set("email", email);
        record.setPassword(password);

        app.save(record);
        console.log("[Recovery] SUCCESS! Superuser created: " + email + " / " + password);

    } catch (e) {
        console.log("[Recovery] Error: " + e.message);
    }

}, (app) => {
    // Down migration
    try {
        const collection = app.findCollectionByNameOrId("_superusers");
        const record = app.findAuthRecordByEmail(collection, "recovery@local.host");
        app.delete(record);
    } catch (e) { }
})
