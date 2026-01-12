/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_863811952")

  // add field
  collection.fields.addAt(14, new Field({
    "hidden": false,
    "id": "file1510083480",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "hero_image",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  // add field
  collection.fields.addAt(15, new Field({
    "hidden": false,
    "id": "json731267992",
    "maxSize": 0,
    "name": "sections",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(16, new Field({
    "hidden": false,
    "id": "json1464297386",
    "maxSize": 0,
    "name": "stats",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(17, new Field({
    "hidden": false,
    "id": "json1874629670",
    "maxSize": 0,
    "name": "tags",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(18, new Field({
    "hidden": false,
    "id": "json3217087507",
    "maxSize": 0,
    "name": "features",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_863811952")

  // remove field
  collection.fields.removeById("file1510083480")

  // remove field
  collection.fields.removeById("json731267992")

  // remove field
  collection.fields.removeById("json1464297386")

  // remove field
  collection.fields.removeById("json1874629670")

  // remove field
  collection.fields.removeById("json3217087507")

  return app.save(collection)
})
