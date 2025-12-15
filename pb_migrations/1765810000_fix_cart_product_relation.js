/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const collection = app.findCollectionByNameOrId("cart_items");

    // Find the 'product' field
    const field = collection.fields.getByName("product");
    if (field && field.options) {
        // Update the collectionId to the correct Equipment collection ID
        field.options.collectionId = "pbc_3071488795"; // Correct ID found via debug script

        app.save(collection);
    }
}, (app) => {
    // Revert logic (optional, points back to old ID)
    const collection = app.findCollectionByNameOrId("cart_items");
    const field = collection.fields.getByName("product");
    if (field && field.options) {
        field.options.collectionId = "pbc_4092854851";
        app.save(collection);
    }
})
