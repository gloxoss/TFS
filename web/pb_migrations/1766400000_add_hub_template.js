/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Add Hub Template Support
 * 
 * Adds support for hub template:
 * - Updates template select to include "hub" option
 * - Adds sub_services JSON field for child service slugs
 */

migrate((app) => {
    const collection = app.findCollectionByNameOrId("services")

    if (!collection) {
        console.log('[Migration] Services collection not found, skipping...')
        return
    }

    // Find and update the template field to include "hub"
    const templateField = collection.fields.find(f => f.name === "template")
    if (templateField) {
        templateField.values = ["default", "showcase", "hub"]
        console.log('[Migration] Updated template field with hub option')
    }

    // Add sub_services field (JSON array of slugs)
    collection.fields.addAt(collection.fields.length, new Field({
        "hidden": false,
        "id": "json_sub_services_01",
        "maxSize": 0,
        "name": "sub_services",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
    }))

    return app.save(collection)

}, (app) => {
    const collection = app.findCollectionByNameOrId("services")

    if (!collection) {
        return
    }

    // Revert template field
    const templateField = collection.fields.find(f => f.name === "template")
    if (templateField) {
        templateField.values = ["default", "showcase"]
    }

    // Remove sub_services field
    collection.fields.removeById("json_sub_services_01")

    return app.save(collection)
})
