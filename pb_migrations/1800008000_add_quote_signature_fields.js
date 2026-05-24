/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Add signature and signed_at fields to quotes collection
 * 
 * Required for quote acceptance flow (digital signature feature).
 * - signature: file field for storing the client's signature image
 * - signed_at: date field for timestamp when quote was signed
 */
migrate((app) => {
    const collection = app.findCollectionByNameOrId("quotes")

    // Add signature file field
    collection.fields.add(new Field({
        name: "signature",
        type: "file",
        required: false,
        maxSelect: 1,
        maxSize: 1048576, // 1MB - signatures are small PNGs
        mimeTypes: ["image/png", "image/jpeg"],
    }))

    // Add signed_at date field
    collection.fields.add(new Field({
        name: "signed_at",
        type: "date",
        required: false,
    }))

    app.save(collection)
}, (app) => {
    const collection = app.findCollectionByNameOrId("quotes")

    collection.fields.removeByName("signature")
    collection.fields.removeByName("signed_at")

    app.save(collection)
})
