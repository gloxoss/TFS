/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Debug documents collection structure
 */
migrate((app) => {
    const collection = app.findCollectionByNameOrId("documents");
    if (!collection) {
        console.log('[Debug] documents collection not found');
        return;
    }

    console.log('[Debug] Collection ID:', collection.id);
    console.log('[Debug] Collection Name:', collection.name);
    console.log('[Debug] Collection Type:', collection.type);
    
    // Log all properties of the collection
    console.log('[Debug] All collection keys:', Object.keys(collection));
    
    // Try different possible field locations
    console.log('[Debug] collection.schema:', JSON.stringify(collection.schema, null, 2));
    console.log('[Debug] collection.fields:', JSON.stringify(collection.fields, null, 2));
    
    // In PocketBase v0.23+, try accessing via rawData
    if (collection.rawData) {
        console.log('[Debug] collection.rawData:', JSON.stringify(collection.rawData, null, 2));
    }
    
    // Full collection dump
    console.log('[Debug] Full collection JSON:', JSON.stringify(collection, null, 2));
    
}, (app) => {
    // No revert needed
})
