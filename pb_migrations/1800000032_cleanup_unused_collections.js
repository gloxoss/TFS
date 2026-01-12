/// <reference path="../pb_data/types.d.ts" />

/**
 * Cleanup Unused Collections
 * Deletes collections identified as unused during the audit:
 * - content_blocks
 * - ui_configurations
 * - booking_items
 */

migrate((app) => {
    const collections = ["content_blocks", "ui_configurations", "booking_items"];

    collections.forEach((name) => {
        try {
            const collection = app.findCollectionByNameOrId(name);
            app.delete(collection);
            console.log(`✅ Deleted unused collection: ${name}`);
        } catch (e) {
            console.log(`⚠️ Collection not found (already deleted?): ${name}`);
        }
    });

}, (app) => {
    // Rollback is difficult as data is lost, but we can recreate the empty schemas if needed.
    // For now, leaving rollback empty as this is a destructive cleanup.
    console.log("Cleanup cannot be automatically reverted (data loss).");
});
