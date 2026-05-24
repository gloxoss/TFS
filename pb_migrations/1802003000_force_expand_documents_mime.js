/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Force expand documents MIME types
 * 
 * This migration forcibly updates the documents collection to accept
 * more file types beyond just PDFs.
 */
migrate((app) => {
    const collection = app.findCollectionByNameOrId("documents");
    if (!collection) {
        console.log('[Migration] documents collection not found - skipping');
        return;
    }

    console.log('[Migration] Found documents collection:', collection.id);
    console.log('[Migration] Current schema/fields:', JSON.stringify(collection.schema || collection.fields, null, 2));

    // PocketBase stores fields in 'schema' for base collections
    const fieldsArray = collection.schema || collection.fields || [];
    const fileField = fieldsArray.find(f => f.name === "file");
    
    if (fileField) {
        console.log('[Migration] Found file field, updating options...');
        console.log('[Migration] Current options:', JSON.stringify(fileField.options, null, 2));
        
        // Ensure options object exists
        if (!fileField.options) {
            fileField.options = {};
        }
        
        // Update to accept many file types
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
        
        // Make file optional to allow partial saves
        fileField.required = false;
        
        app.save(collection);
        console.log('[Migration] SUCCESS - Expanded documents MIME types');
    } else {
        console.log('[Migration] ERROR - file field not found in documents collection');
        console.log('[Migration] Available fields:', fieldsArray.map(f => f.name));
    }
}, (app) => {
    // Revert: this is a data migration, revert is optional
    console.log('[Migration] Revert called - no action needed');
})
