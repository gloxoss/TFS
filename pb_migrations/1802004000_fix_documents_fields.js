/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Fix documents collection - add missing file field
 * 
 * The original migration may have created the collection without proper fields.
 * This migration adds the required 'title' and 'file' fields.
 * 
 * Uses PocketBase v0.23+ API: collection.fields.add(new Field(...))
 */
migrate((app) => {
    let collection = app.findCollectionByNameOrId("documents");
    
    if (!collection) {
        console.log('[Migration] documents collection not found - skipping');
        return;
    }
    
    console.log('[Migration] Found documents collection:', collection.id);
    
    // Check if fields already exist
    const hasTitle = collection.fields.getByName("title");
    const hasFile = collection.fields.getByName("file");
    
    console.log('[Migration] Has title field:', !!hasTitle);
    console.log('[Migration] Has file field:', !!hasFile);
    
    // Add title field if missing
    if (!hasTitle) {
        console.log('[Migration] Adding title field...');
        collection.fields.add(new Field({
            name: "title",
            type: "text",
            required: false,
        }));
    }
    
    // Add file field if missing
    if (!hasFile) {
        console.log('[Migration] Adding file field...');
        collection.fields.add(new Field({
            name: "file",
            type: "file",
            required: false,
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
                "image/webp",
                "image/gif"
            ],
        }));
    }
    
    app.save(collection);
    console.log('[Migration] Documents collection updated successfully');
    
}, (app) => {
    const collection = app.findCollectionByNameOrId("documents");
    if (!collection) return;
    
    collection.fields.removeByName("title");
    collection.fields.removeByName("file");
    
    app.save(collection);
    console.log('[Migration] Reverted documents fields');
})
