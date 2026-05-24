/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    // 1. Fetch the collection by name (or ID)
    // Note: accessing via 'app', not global
    try {
        const collection = app.findCollectionByNameOrId("posts");

        // 2. Define the new field
        // We'll add a 'video_provider' select field as an example
        const field = new Field({
            name: "video_provider",
            type: "select",
            required: false,
            maxSelect: 1,
            values: ["youtube", "vimeo", "other"]
        });

        // 3. Add to collection
        collection.fields.add(field);

        // 4. Save changes
        return app.save(collection);
    } catch (e) {
        // Collection might not exist in some environments, handle gracefully
        console.log("Migration skipped: " + e);
    }
}, (app) => {
    // DOWN migration (Revert)
    try {
        const collection = app.findCollectionByNameOrId("posts");
        collection.fields.removeByName("video_provider");
        return app.save(collection);
    } catch (e) {
        console.log("Revert skipped: " + e);
    }
})
