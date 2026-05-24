/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Add Template Field to Services
 * 
 * Adds support for different service page templates:
 * - template: "default" | "showcase" (determines which layout to use)
 * - slider_images: file array for hero slider (showcase template)
 * - video_url: text for video embed (showcase template)
 * - downloads: JSON array for downloadable files
 */

migrate((app) => {
    const collection = app.findCollectionByNameOrId("services")

    if (!collection) {
        console.log('[Migration] Services collection not found, skipping...')
        return
    }

    // Add template field (select: default or showcase)
    collection.fields.addAt(collection.fields.length, new Field({
        "hidden": false,
        "id": "select_template_01",
        "maxSelect": 1,
        "name": "template",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": ["default", "showcase"]
    }))

    // Add slider_images field for showcase template hero
    collection.fields.addAt(collection.fields.length, new Field({
        "hidden": false,
        "id": "file_slider_images_01",
        "maxSelect": 5,
        "maxSize": 10485760,
        "mimeTypes": ["image/png", "image/jpeg", "image/webp"],
        "name": "slider_images",
        "presentable": false,
        "required": false,
        "system": false,
        "thumbs": [],
        "type": "file"
    }))

    // Add video_url field for video section
    collection.fields.addAt(collection.fields.length, new Field({
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text_video_url_01",
        "max": 0,
        "min": 0,
        "name": "video_url",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
    }))

    // Add downloads field (JSON array)
    collection.fields.addAt(collection.fields.length, new Field({
        "hidden": false,
        "id": "json_downloads_01",
        "maxSize": 0,
        "name": "downloads",
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

    // Remove added fields
    collection.fields.removeById("select_template_01")
    collection.fields.removeById("file_slider_images_01")
    collection.fields.removeById("text_video_url_01")
    collection.fields.removeById("json_downloads_01")

    return app.save(collection)
})
