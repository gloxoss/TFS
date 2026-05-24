/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3475746528")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id != '' && @request.auth.role = 'admin'",
    "updateRule": "@request.auth.id != '' && @request.auth.role = 'admin'",
    "viewRule": "@request.auth.id != '' && @request.auth.role = 'admin'"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3475746528")

  // update collection data
  unmarshal({
    "listRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
