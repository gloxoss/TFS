/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    const collection = app.findCollectionByNameOrId("services")

    if (!collection) {
        console.log('[Migration] Services collection not found, skipping...')
        return
    }

    // 1. Update the 'template' field options
    const templateField = collection.fields.find(f => f.name === "template")

    // Add 'hub_alt' if it doesn't exist
    if (templateField && !templateField.values.includes("hub_alt")) {
        templateField.values = [...templateField.values, "hub_alt"]
        app.save(collection)
        console.log('[Migration] Added hub_alt template option')
    }

    // 2. Update the 'sporting-events' service to use the new template
    try {
        const record = app.findFirstRecordByFilter("services", 'slug = "sporting-events"')
        if (record) {
            record.set("template", "hub_alt")
            app.save(record)
            console.log('[Migration] Updated sporting-events to hub_alt template')
        }
    } catch (e) {
        // Record might not exist yet if fresh db, that's fine
        console.log("[Migration] sporting-events record not found, skipping update")
    }

}, (app) => {
    // Rollback
    const collection = app.findCollectionByNameOrId("services")

    if (!collection) {
        return
    }

    // 1. Revert sporting-events template
    try {
        const record = app.findFirstRecordByFilter("services", 'slug = "sporting-events"')
        if (record) {
            record.set("template", "hub") // Revert to standard hub
            app.save(record)
        }
    } catch (e) { }

    // 2. Remove 'hub_alt' option
    const templateField = collection.fields.find(f => f.name === "template")
    if (templateField) {
        templateField.values = templateField.values.filter(v => v !== "hub_alt")
        app.save(collection)
    }
})
