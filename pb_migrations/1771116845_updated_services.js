/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_services000001")

  // update field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "svc_hero",
    "maxSelect": 1,
    "maxSize": 20971520,
    "mimeTypes": null,
    "name": "hero_image",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": null,
    "type": "file"
  }))

  // update field
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "svc_images",
    "maxSelect": 10,
    "maxSize": 20971520,
    "mimeTypes": null,
    "name": "images",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": null,
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_services000001")

  // update field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "svc_hero",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": null,
    "name": "hero_image",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": null,
    "type": "file"
  }))

  // update field
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "svc_images",
    "maxSelect": 10,
    "maxSize": 0,
    "mimeTypes": null,
    "name": "images",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": null,
    "type": "file"
  }))

  return app.save(collection)
})
