/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    // -------------------------------------------------------------------------
    // 1. CATEGORIES
    // -------------------------------------------------------------------------
    let categories = new Collection({
        name: "categories",
        type: "base",
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
        schema: [
            { name: "config_key", type: "text", required: true, options: { pattern: "^\\w+$" } },
            { name: "value", type: "json" }
        ]
    });
    app.save(uiConfig);

    // -------------------------------------------------------------------------
    // 6. CARTS
    // -------------------------------------------------------------------------
    let users = app.findCollectionByNameOrId("users");

    let carts = new Collection({
        name: "carts",
        type: "base",
        schema: [
            // { name: "user_id", type: "relation", options: { collectionId: users.id, cascadeDelete: true } },
            { name: "status", type: "select", options: { values: ["active", "abandoned", "converted"] } },
            { name: "items", type: "json" },
            { name: "dates_start", type: "date" },
            { name: "dates_end", type: "date" }
        ]
    });
    app.save(carts);

    // -------------------------------------------------------------------------
    // 7. SERVICES
    // -------------------------------------------------------------------------
    let services = new Collection({
        name: "services",
        type: "base",
        schema: [
            { name: "title", type: "text", required: true },
            { name: "title_fr", type: "text" },
            { name: "slug", type: "text", required: true, options: { pattern: "^[a-z0-9-]+$" } },
            { name: "icon", type: "text" },
            { name: "brief_description", type: "text" },
            { name: "brief_description_fr", type: "text" },
            { name: "full_description", type: "editor" },
            { name: "full_description_fr", type: "editor" },
            { name: "type", type: "select", options: { values: ["internal_link", "content_page"] } },
            { name: "target_url", type: "text" },
            { name: "hero_image", type: "file", options: { mimeTypes: ["image/jpeg", "image/png", "image/webp"] } },
            { name: "images", type: "file", options: { mimeTypes: ["image/jpeg", "image/png", "image/webp"], maxSelect: 10 } },
            { name: "sections", type: "json" },
            { name: "stats", type: "json" },
            { name: "tags", type: "json" },
            { name: "features", type: "json" },
            { name: "display_order", type: "number" },
            { name: "is_active", type: "bool" }
        ]
    });
    app.save(services);

    // -------------------------------------------------------------------------
    // 8. POSTS (Blog)
    // -------------------------------------------------------------------------
    let posts = new Collection({
        name: "posts",
        type: "base",
        schema: [
            { name: "title_en", type: "text" },
            { name: "title_fr", type: "text" },
            { name: "slug", type: "text", required: true, options: { pattern: "^[a-z0-9-]+$" } },
            { name: "excerpt_en", type: "text" },
            { name: "excerpt_fr", type: "text" },
            { name: "content_en", type: "editor" },
            { name: "content_fr", type: "editor" },
            { name: "cover_image", type: "file", options: { mimeTypes: ["image/jpeg", "image/png", "image/webp"] } },
            { name: "category", type: "text" },
            { name: "published", type: "bool" },
            { name: "published_at", type: "date" }
        ]
    });
    app.save(posts);

    // -------------------------------------------------------------------------
    // 9. QUOTES
    // -------------------------------------------------------------------------
    let quotes = new Collection({
        name: "quotes",
        type: "base",
        schema: [
            { name: "client_name", type: "text" },
            { name: "client_email", type: "email" },
            { name: "client_phone", type: "text" },
            { name: "client_company", type: "text" },
            { name: "items_json", type: "json" },
            { name: "rental_start_date", type: "date" },
            { name: "rental_end_date", type: "date" },
            { name: "project_description", type: "text" },
            { name: "special_requests", type: "text" },
            { name: "status", type: "select", options: { values: ["pending", "quoted", "accepted", "rejected"] } },
            { name: "internal_notes", type: "text" },
            { name: "estimated_price", type: "number" },
            { name: "quote_pdf", type: "file", options: { mimeTypes: ["application/pdf"] } },
            // { name: "user", type: "relation", options: { collectionId: users.id, cascadeDelete: false } },
            { name: "access_token", type: "text" },
            { name: "confirmation_number", type: "text" },
            { name: "language", type: "text" },
            { name: "follow_up_date", type: "date" },
            { name: "quoted_at", type: "date" }
        ]
    });
    app.save(quotes);

    // -------------------------------------------------------------------------
    // 10. EMAIL QUEUE
    // -------------------------------------------------------------------------
    let emailQueue = new Collection({
        name: "email_queue",
        type: "base",
        schema: [
            { name: "to", type: "email", required: true },
            { name: "subject", type: "text" },
            { name: "html", type: "editor" },
            { name: "reply_to", type: "email" },
            { name: "status", type: "select", options: { values: ["pending", "sent", "failed"] } },
            { name: "attempts", type: "number" },
            { name: "max_attempts", type: "number" },
            { name: "next_attempt_at", type: "date" },
            { name: "payload_type", type: "text" },
            { name: "payload_data", type: "json" },
            { name: "sent_at", type: "date" },
            { name: "error_message", type: "text" }
        ]
    });
    app.save(emailQueue);

}, (app) => {
    // Cleanup
    const collections = [
        "email_queue", "quotes", "posts", "services",
        "carts", "kit_items", "kit_templates", "equipment",
        "categories", "ui_configurations"
    ];
    collections.forEach(name => {
        try { app.delete(app.findCollectionByNameOrId(name)); } catch (e) { }
    });
});
