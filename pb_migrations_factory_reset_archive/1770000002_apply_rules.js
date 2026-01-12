/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    // 1. CARTS
    const carts = app.findCollectionByNameOrId("carts");
    const users = app.findCollectionByNameOrId("users");

    // Add user_id field explicitly now
    if (!users) {
        throw new Error("DEBUG: Users collection not found!");
    }
    if (!users.id) {
        throw new Error("DEBUG: Users ID is blank! Users obj: " + JSON.stringify(users));
    }

    if (users) {
        carts.fields.add(new Field({
            name: "user_id",
            type: "relation",
            collectionId: users.id,
            cascadeDelete: true
        }));
        app.save(carts);
    }

    carts.listRule = "@request.auth.id = user_id";
    carts.viewRule = "@request.auth.id = user_id";
    carts.createRule = "@request.auth.id = user_id";
    carts.updateRule = "@request.auth.id = user_id";
    app.save(carts);


    // 2. POSTS (Public)
    const posts = app.findCollectionByNameOrId("posts");
    // posts.listRule = "published = true";
    // posts.viewRule = "published = true";
    app.save(posts);

    // ...

    // 4. QUOTES
    const quotes = app.findCollectionByNameOrId("quotes");
    if (users) {
        quotes.fields.add(new Field({
            name: "user",
            type: "relation",
            collectionId: users.id,
            cascadeDelete: false
        }));
        app.save(quotes);
    }


    // 3. SERVICES (Public)
    const services = app.findCollectionByNameOrId("services");
    services.listRule = "is_active = true"; // Or empty string? logic used in service is "is_active = true" filter manually, so public rule "" is fine.
    // Actually service.ts mentions: "listRule: '', // public"
    services.listRule = "";
    services.viewRule = "";
    app.save(services);

    // 4. QUOTES

    quotes.listRule = "@request.auth.id = user.id";
    quotes.viewRule = "@request.auth.id = user.id";
    quotes.createRule = ""; // Public create? Yes for inquiry. Or maybe "" for public.
    quotes.updateRule = "@request.auth.id = user.id";
    app.save(quotes);

    // 5. EQUIPMENT & CATEGORIES (Public Read)
    const equipment = app.findCollectionByNameOrId("equipment");
    equipment.listRule = "";
    equipment.viewRule = "";
    app.save(equipment);

    const categories = app.findCollectionByNameOrId("categories");
    categories.listRule = "";
    categories.viewRule = "";
    app.save(categories);

    // 6. KITS (Public Read)
    const kitTemplates = app.findCollectionByNameOrId("kit_templates");
    kitTemplates.listRule = "";
    kitTemplates.viewRule = "";
    app.save(kitTemplates);

    const kitItems = app.findCollectionByNameOrId("kit_items");
    kitItems.listRule = "";
    kitItems.viewRule = "";
    app.save(kitItems);

    // 7. UI CONFIG (Public Read)
    const uiConfig = app.findCollectionByNameOrId("ui_configurations");
    uiConfig.listRule = "";
    uiConfig.viewRule = "";
    app.save(uiConfig);

}, (app) => {
    // Down migration: remove rules (set to null)
    const collections = ["carts", "posts", "services", "quotes", "equipment", "categories", "kit_templates", "kit_items", "ui_configurations"];
    collections.forEach(name => {
        try {
            const col = app.findCollectionByNameOrId(name);
            col.listRule = null;
            col.viewRule = null;
            col.createRule = null;
            col.updateRule = null;
            app.save(col);
        } catch (e) { }
    });
});
