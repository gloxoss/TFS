// Migration: Temporarily allow public updates for equipment
// This allows the image sync script to upload images without admin auth

migrate((app) => {
    const collection = app.findCollectionByNameOrId("equipment")
    if (collection) {
        collection.updateRule = "" // Allow public update
        app.save(collection)
        console.log("🔓 Equipment update rule set to public")
    }
}, (app) => {
    const collection = app.findCollectionByNameOrId("equipment")
    if (collection) {
        collection.updateRule = null // Admin only
        app.save(collection)
    }
})
