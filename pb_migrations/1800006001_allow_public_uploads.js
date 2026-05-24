/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Allow public uploads to documents collection
 * 
 * The client-side PocketBase SDK auth isn't syncing with server cookies,
 * so we temporarily allow public uploads. The admin UI is already protected
 * by Next.js middleware.
 */
migrate((app) => {
    const collection = app.findCollectionByNameOrId("documents");
    if (collection) {
        collection.createRule = ""; // Allow public uploads
        collection.updateRule = ""; // Allow public updates
        collection.deleteRule = "@request.auth.id != ''"; // Still require auth for delete
        app.save(collection);
        console.log('[Migration] Updated documents collection rules to allow uploads');
    }
}, (app) => {
    const collection = app.findCollectionByNameOrId("documents");
    if (collection) {
        collection.createRule = "@request.auth.id != ''";
        collection.updateRule = "@request.auth.id != ''";
        collection.deleteRule = "@request.auth.id != ''";
        app.save(collection);
        console.log('[Migration] Reverted documents collection rules');
    }
})
