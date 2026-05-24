/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Expand documents collection MIME types
 * 
 * Allow more file types: PDF, Word, Excel, PowerPoint, Images
 * 
 * PocketBase v0.23+ uses 'fields' array, older versions use 'schema'
 */
migrate((app) => {
    const collection = app.findCollectionByNameOrId("documents");
    if (!collection) {
        console.log('[Migration] documents collection not found');
        return;
    }

    // Check both 'fields' (v0.23+) and 'schema' (older versions)
    const fieldsArray = collection.fields || collection.schema || [];
    const fileField = fieldsArray.find(f => f.name === "file");
    
    if (fileField) {
        // Update MIME types
        if (!fileField.options) {
            fileField.options = {};
        }
        fileField.options.mimeTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif"
        ];
        fileField.options.maxSelect = 1;
        fileField.options.maxSize = 52428800; // 50MB
        
        // Also make file NOT required so partial saves work
        fileField.required = false;
        
        app.save(collection);
        console.log('[Migration] Expanded documents collection MIME types');
    } else {
        console.log('[Migration] file field not found in documents collection');
    }
}, (app) => {
    const collection = app.findCollectionByNameOrId("documents");
    if (!collection) return;
    
    const fieldsArray = collection.fields || collection.schema || [];
    const fileField = fieldsArray.find(f => f.name === "file");
    
    if (fileField) {
        if (!fileField.options) fileField.options = {};
        fileField.options.mimeTypes = ["application/pdf"];
        fileField.required = true;
        app.save(collection);
        console.log('[Migration] Reverted documents collection MIME types to PDF only');
    }
})
