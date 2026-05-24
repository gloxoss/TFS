/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Expand documents collection MIME types
 * 
 * Allow more file types: PDF, Word, Excel, PowerPoint
 */
migrate((app) => {
    const collection = app.findCollectionByNameOrId("documents");
    if (collection) {
        // Find the file field
        const fileField = collection.fields.find(f => f.name === "file");
        if (fileField) {
            fileField.options = {
                ...fileField.options,
                maxSelect: 1,
                maxSize: 52428800, // 50MB
                mimeTypes: [
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "application/vnd.ms-excel",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "application/vnd.ms-powerpoint",
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                    "image/jpeg",
                    "image/png",
                    "image/webp"
                ],
            };
            app.save(collection);
            console.log('[Migration] Expanded documents collection MIME types');
        }
    }
}, (app) => {
    const collection = app.findCollectionByNameOrId("documents");
    if (collection) {
        const fileField = collection.fields.find(f => f.name === "file");
        if (fileField) {
            fileField.options = {
                ...fileField.options,
                maxSelect: 1,
                maxSize: 52428800,
                mimeTypes: ["application/pdf"],
            };
            app.save(collection);
            console.log('[Migration] Reverted documents collection MIME types to PDF only');
        }
    }
})
