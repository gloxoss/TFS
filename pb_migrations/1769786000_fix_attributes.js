/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    // Cleanup potentially broken collection from previous failed attempt
    try {
        const existing = app.findCollectionByNameOrId("attributes");
        if (existing) {
            app.delete(existing);
            console.log("Deleted existing broken attributes collection");
        }
    } catch (e) {
        // Ignore if not found
    }

    const categories = app.findCollectionByNameOrId("categories");

    const collection = new Collection({
        name: "attributes",
        type: "base",

        fields: [
            new Field({
                type: "text",
                name: "name",
                required: true,
            }),
            new Field({
                type: "text",
                name: "slug",
                required: true,
            }),
            new Field({
                type: "select",
                name: "type",
                required: true,
                values: ["text", "select", "number", "boolean"],
                maxSelect: 1,
            }),
            new Field({
                type: "json",
                name: "options",
            }),
            new Field({
                type: "relation",
                name: "categories",
                collectionId: categories.id,
                cascadeDelete: false,
                maxSelect: null,
            }),
        ]
    });

    return app.save(collection);
}, (app) => {
    const collection = app.findCollectionByNameOrId("attributes");
    return app.delete(collection);
})
