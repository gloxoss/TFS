/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    const collection = app.findCollectionByNameOrId("services");

    collection.fields.add(new Field({
        name: "hero_image",
        type: "text",
        required: false,
    }));

    app.save(collection);
}, (app) => {
    const collection = app.findCollectionByNameOrId("services");

    collection.fields.removeByName("hero_image"); // remove the field

    app.save(collection);
})
