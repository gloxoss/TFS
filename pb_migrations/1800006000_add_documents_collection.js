/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const collection = new Collection({
        name: "documents",
        type: "base",
        schema: [
            {
                name: "title",
                type: "text",
                required: false,
                options: {},
            },
            {
                name: "file",
                type: "file",
                required: true,
                options: {
                    maxSelect: 1,
                    maxSize: 52428800, // 50MB
                    mimeTypes: ["application/pdf"],
                    thumbs: [],
                },
            },
        ],
        listRule: "",
        viewRule: "",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
    });

    return app.save(collection);
}, (app) => {
    const collection = app.findCollectionByNameOrId("documents");
    if (collection) {
        return app.delete(collection);
    }
})
