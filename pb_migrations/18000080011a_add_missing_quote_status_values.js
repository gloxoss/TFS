/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Add 'confirmed' and 'rejected' values to quotes.status select field
 * 
 * The status field was created with only: pending, reviewing, quoted
 * But the application logic requires: confirmed, rejected
 * 
 * This migration updates the select field's allowed values.
 */
migrate((app) => {
    const collection = app.findCollectionByNameOrId("quotes")

    // Find the existing status field and update its values
    const statusField = collection.fields.getByName("status")
    if (statusField) {
        statusField.values = ["pending", "reviewing", "quoted", "confirmed", "rejected"]
    }

    app.save(collection)
}, (app) => {
    const collection = app.findCollectionByNameOrId("quotes")

    const statusField = collection.fields.getByName("status")
    if (statusField) {
        statusField.values = ["pending", "reviewing", "quoted"]
    }

    app.save(collection)
})
