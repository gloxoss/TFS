/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const collection = app.findCollectionByNameOrId("quotes");

    // Add 'quote_pdf' file field
    collection.fields.add(new FileField({
        name: "quote_pdf",
        maxSelect: 1,
        maxSize: 5242880, // 5MB
        mimeTypes: ["application/pdf"],
        thumbs: [],
        protected: false,
    }));

    app.save(collection);
}, (app) => {
    const collection = app.findCollectionByNameOrId("quotes");

    // Remove 'quote_pdf' field
    try {
        const field = collection.getFieldByName("quote_pdf");
        if (field) {
            collection.fields.remove(field);
            app.save(collection);
        }
    } catch (e) {
        // ignore
    }
})
