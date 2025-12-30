/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    // -------------------------------------------------------------------------
    // 1. CATEGORIES
    // -------------------------------------------------------------------------
    let categories = new Collection({
        name: "categories",
        type: "base",
        listRule: "",
        viewRule: "",
        schema: [
            { name: "name", type: "text", required: true },
            { name: "name_en", type: "text" },
            { name: "name_fr", type: "text" },
            { name: "slug", type: "text", required: true, options: { pattern: "^[a-z0-9-]+$" } },
            { name: "thumbnail", type: "file", options: { mimeTypes: ["image/jpeg", "image/png", "image/webp"] } }
        ]
    });
    app.save(categories);

    // -------------------------------------------------------------------------
    // 2. EQUIPMENT (Products)
    // -------------------------------------------------------------------------
    let equipment = new Collection({
        name: "equipment",
        type: "base",
        listRule: "",
        viewRule: "",
        schema: [
            { name: "name", type: "text" },
            { name: "name_en", type: "text", required: true },
            { name: "name_fr", type: "text" },
            { name: "slug", type: "text", required: true, options: { pattern: "^[a-z0-9-]+$" } },
            { name: "description_en", type: "editor" },
            { name: "description_fr", type: "editor" },
            { name: "brand", type: "text" },
            { name: "category", type: "relation", options: { collectionId: categories.id, cascadeDelete: false } },
            { name: "daily_rate", type: "number" },
            { name: "stock", type: "number" },
            { name: "stock_available", type: "number" },
            { name: "visibility", type: "bool" },
            { name: "is_featured", type: "bool" },
            { name: "is_new", type: "bool" },
            { name: "specs_en", type: "json" },
            { name: "specs_fr", type: "json" },
            { name: "type", type: "text" },
            { name: "images", type: "file", options: { maxSelect: 10, mimeTypes: ["image/jpeg", "image/png", "image/webp"] } }
        ]
    });
    app.save(equipment);

    // -------------------------------------------------------------------------
    // 3. KIT TEMPLATES
    // -------------------------------------------------------------------------
    let kitTemplates = new Collection({
        name: "kit_templates",
        type: "base",
        listRule: "",
        viewRule: "",
        schema: [
            { name: "name", type: "text", required: true },
            { name: "description", type: "text" },
            { name: "base_price_modifier", type: "number" },
            { name: "main_product_id", type: "relation", required: true, options: { collectionId: equipment.id, maxSelect: 1 } }
        ]
    });
    app.save(kitTemplates);

    // -------------------------------------------------------------------------
    // 4. KIT ITEMS
    // -------------------------------------------------------------------------
    let kitItems = new Collection({
        name: "kit_items",
        type: "base",
        listRule: "",
        viewRule: "",
        schema: [
            { name: "template_id", type: "relation", required: true, options: { collectionId: kitTemplates.id, cascadeDelete: true } },
            { name: "product_id", type: "relation", required: true, options: { collectionId: equipment.id } },
            { name: "slot_name", type: "text", required: true },
            { name: "is_mandatory", type: "bool" },
            { name: "default_quantity", type: "number" },
            { name: "swappable_category", type: "text" }
        ]
    });
    app.save(kitItems);

    // -------------------------------------------------------------------------
    // 5. UI CONFIG
    // -------------------------------------------------------------------------
    let uiConfig = new Collection({
        name: "ui_configurations",
        type: "base",
        listRule: "",
        viewRule: "",
        schema: [
            { name: "config_key", type: "text", required: true, options: { pattern: "^\\w+$" } },
            { name: "value", type: "json" }
        ]
    });
    app.save(uiConfig);

    // -------------------------------------------------------------------------
    // 6. CARTS (Fix: Rules AFTER Schema)
    // -------------------------------------------------------------------------
    let users = app.findCollectionByNameOrId("users");

    let carts = new Collection({
        name: "carts",
        type: "base",
        schema: [
            { name: "user_id", type: "relation", options: { collectionId: users.id, cascadeDelete: true } },
            { name: "status", type: "select", options: { values: ["active", "abandoned", "converted"] } },
            { name: "items", type: "json" },
            { name: "dates_start", type: "date" },
            { name: "dates_end", type: "date" }
        ]
    });
    app.save(carts);

    // Rules intentionally left null (Admin only) for initial creation to avoid validation race conditions
    // app.save(carts);

    // -------------------------------------------------------------------------
    // 7. SERVICES
    // -------------------------------------------------------------------------
    let services = new Collection({
        name: "services",
        type: "base",
        listRule: "",
        viewRule: "",
        schema: [
            { name: "title_en", type: "text", required: true },
            { name: "slug", type: "text", required: true, options: { pattern: "^[a-z0-9-]+$" } },
            { name: "content", type: "editor" },
            { name: "icon", type: "text" }
        ]
    });
    app.save(services);

}, (app) => {
    const collections = ["carts", "kit_items", "kit_templates", "equipment", "categories", "ui_configurations", "services"];
    collections.forEach(name => {
        try {
            const col = app.findCollectionByNameOrId(name);
            app.delete(col);
        } catch (e) { }
    });
});
