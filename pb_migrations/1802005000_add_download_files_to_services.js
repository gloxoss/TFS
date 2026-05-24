/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Add download_files field to services collection
 * 
 * Adds a multi-file field that accepts PDFs, Office documents, and images.
 * This replaces the broken documents collection approach — files are now
 * stored directly on the service record, and the `downloads` JSON field
 * references these files via constructed URLs.
 */
migrate((app) => {
    const collection = app.findCollectionByNameOrId("services");

    // Guard: don't add if already exists
    const existing = collection.fields.getByName("download_files");
    if (!existing) {
        collection.fields.addAt(collection.fields.length, new Field({
            "id": "file_download_files_01",
            "name": "download_files",
            "type": "file",
            "hidden": false,
            "required": false,
            "maxSelect": 50,
            "maxSize": 52428800, // 50MB per file
            "mimeTypes": [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "application/vnd.ms-powerpoint",
                "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                "image/png",
                "image/jpeg",
                "image/webp"
            ]
        }));
    }

    app.save(collection);
}, (app) => {
    const collection = app.findCollectionByNameOrId("services");
    collection.fields.removeById("file_download_files_01");
    app.save(collection);
});
