/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_equipment00001")

  // remove field
  collection.fields.removeById("relation3013104609")

  // add field
  collection.fields.addAt(26, new Field({
    "hidden": false,
    "id": "json3213940673",
    "maxSize": 0,
    "name": "variant_options",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_equipment00001")

  // add field
  collection.fields.addAt(26, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_equipment00001",
    "hidden": false,
    "id": "relation3013104609",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "variants",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // remove field
  collection.fields.removeById("json3213940673")

  return app.save(collection)
})
