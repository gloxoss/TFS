// Migration: Revert equipment update rules to admin-only

migrate((app) => {
    const collection = app.findCollectionByNameOrId("equipment")
    if (collection) {
        collection.updateRule = null // Admin only
        app.save(collection)
        console.log("🔒 Equipment update rule reverted to admin-only")
    }
}, (app) => {
    const collection = app.findCollectionByNameOrId("equipment")
    if (collection) {
        collection.updateRule = "" // Public
        app.save(collection)
    }
})
