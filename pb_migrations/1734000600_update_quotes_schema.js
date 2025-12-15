/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const collection = app.findCollectionByNameOrId("quotes");

    // 1. Add 'pdf_file' field
    collection.fields.add(new FileField({
        name: "pdf_file",
        maxSelect: 1,
        maxSize: 10485760, // 10MB
        mimeTypes: ["application/pdf"],
        thumbs: [],
        protected: false,
    }));

    // 2. Update 'status' field options to include 'quoted'
    const statusField = collection.fields.getByName("status");
    if (statusField) {
        // cast to SelectField to access values
        const select = statusField;
        if (!select.values.includes("quoted")) {
            select.values.push("quoted");
        }
    }

    app.save(collection);
}, (app) => {
    const collection = app.findCollectionByNameOrId("quotes");

    // Revert 'pdf_file'
    try {
        const field = collection.getFieldByName("pdf_file");
        if (field) {
            collection.fields.remove(field);
        }
    } catch (e) { /* ignore */ }

    // Revert 'status' options (remove 'quoted')
    // This is risky if data exists, so we might skip or handle carefully.
    // For now, simpler to leave 'quoted' in valid options on revert or strictly remove it.
    const statusField = collection.fields.getByName("status");
    if (statusField) {
        const select = statusField;
        select.values = select.values.filter(v => v !== "quoted");
    }

    app.save(collection);
})
