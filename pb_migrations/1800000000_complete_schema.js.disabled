/// <reference path="../pb_data/types.d.ts" />
/**
 * Stage 1: Complete Schema Definition (v0.26 Format)
 * 
 * Uses the verbose field format required by PocketBase 0.26.x
 * Each field requires: id, name, type, system, hidden, presentable, required
 */
migrate((app) => {
    // =========================================================================
    // EXPLICIT COLLECTION IDs
    // =========================================================================
    const ID_CATEGORIES = "pbc_categories0001";
    const ID_EQUIPMENT = "pbc_equipment00001";
    const ID_KIT_TEMPLATES = "pbc_kittemplates01";
    const ID_KIT_SLOTS = "pbc_kitslots000001";
    const ID_CARTS = "pbc_carts000000001";
    const ID_CART_ITEMS = "pbc_cartitems00001";
    const ID_UI_CONFIG = "pbc_uiconfig000001";
    const ID_SERVICES = "pbc_services000001";
    const ID_POSTS = "pbc_posts0000000001";
    const ID_QUOTES = "pbc_quotes00000001";
    const ID_EMAIL_QUEUE = "pbc_emailqueue0001";
    const ID_SETTINGS = "pbc_settings000001";
    const ID_CONTENT_BLOCKS = "pbc_contentblocks1";
    const ID_BOOKING_ITEMS = "pbc_bookingitems01";

    // Helper to create text field
    const textField = (id, name, required = false) => ({
        id, name, type: "text", system: false, hidden: false, presentable: false, required,
        autogeneratePattern: "", max: 0, min: 0, pattern: "", primaryKey: false
    });

    // Helper to create number field
    const numberField = (id, name, required = false) => ({
        id, name, type: "number", system: false, hidden: false, presentable: false, required,
        max: null, min: null, onlyInt: false
    });

    // Helper to create bool field
    const boolField = (id, name) => ({
        id, name, type: "bool", system: false, hidden: false, presentable: false, required: false
    });

    // Helper to create json field
    const jsonField = (id, name) => ({
        id, name, type: "json", system: false, hidden: false, presentable: false, required: false, maxSize: 0
    });

    // Helper to create editor field
    const editorField = (id, name) => ({
        id, name, type: "editor", system: false, hidden: false, presentable: false, required: false,
        convertURLs: false, maxSize: 0
    });

    // Helper to create file field
    const fileField = (id, name, maxSelect = 1) => ({
        id, name, type: "file", system: false, hidden: false, presentable: false, required: false,
        maxSelect, maxSize: 0, mimeTypes: null, protected: false, thumbs: null
    });

    // Helper to create relation field
    const relationField = (id, name, collectionId, required = false, cascadeDelete = false) => ({
        id, name, type: "relation", system: false, hidden: false, presentable: false, required,
        collectionId, cascadeDelete, maxSelect: 1, minSelect: 0
    });

    // Helper to create select field
    const selectField = (id, name, values, required = false) => ({
        id, name, type: "select", system: false, hidden: false, presentable: false, required,
        maxSelect: 1, values
    });

    // Helper to create date field
    const dateField = (id, name) => ({
        id, name, type: "date", system: false, hidden: false, presentable: false, required: false,
        max: "", min: ""
    });

    // Helper to create email field
    const emailField = (id, name, required = false) => ({
        id, name, type: "email", system: false, hidden: false, presentable: false, required,
        exceptDomains: null, onlyDomains: null
    });

    // =========================================================================
    // 1. CATEGORIES
    // =========================================================================
    app.save(new Collection({
        id: ID_CATEGORIES,
        name: "categories",
        type: "base",
        system: false,
        listRule: "",
        viewRule: "",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        indexes: [],
        fields: [
            textField("cat_name", "name", true),
            textField("cat_name_en", "name_en"),
            textField("cat_name_fr", "name_fr"),
            textField("cat_slug", "slug", true),
            textField("cat_desc", "description"),
            fileField("cat_thumb", "thumbnail", 1)
        ]
    }));

    // =========================================================================
    // 2. EQUIPMENT
    // =========================================================================
    app.save(new Collection({
        id: ID_EQUIPMENT,
        name: "equipment",
        type: "base",
        system: false,
        listRule: "",
        viewRule: "",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        indexes: [],
        fields: [
            textField("eq_name", "name"),
            textField("eq_name_en", "name_en", true),
            textField("eq_name_fr", "name_fr"),
            textField("eq_slug", "slug", true),
            textField("eq_brand", "brand"),
            relationField("eq_category", "category", ID_CATEGORIES),
            numberField("eq_daily_rate", "daily_rate"),
            numberField("eq_stock", "stock"),
            numberField("eq_stock_avail", "stock_available"),
            boolField("eq_visibility", "visibility"),
            boolField("eq_featured", "featured"),
            boolField("eq_is_featured", "is_featured"),
            fileField("eq_image", "image", 1),
            fileField("eq_images", "images", 10),
            jsonField("eq_specs", "specs"),
            jsonField("eq_specs_en", "specs_en"),
            jsonField("eq_specs_fr", "specs_fr"),
            editorField("eq_desc", "description"),
            editorField("eq_desc_en", "description_en"),
            editorField("eq_desc_fr", "description_fr"),
            textField("eq_type", "type"),
            textField("eq_mount", "mount"),
            textField("eq_sensor", "sensor_size"),
            textField("eq_resolution", "resolution"),
            textField("eq_avail_status", "availability_status")
        ]
    }));

    // =========================================================================
    // 3. KIT TEMPLATES
    // =========================================================================
    app.save(new Collection({
        id: ID_KIT_TEMPLATES,
        name: "kit_templates",
        type: "base",
        system: false,
        listRule: "",
        viewRule: "",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        indexes: [],
        fields: [
            textField("kt_name", "name", true),
            textField("kt_desc", "description"),
            relationField("kt_main_prod", "main_product_id", ID_EQUIPMENT, true),
            numberField("kt_price_mod", "base_price_modifier")
        ]
    }));

    // =========================================================================
    // 4. KIT SLOTS
    // =========================================================================
    app.save(new Collection({
        id: ID_KIT_SLOTS,
        name: "kit_slots",
        type: "base",
        system: false,
        listRule: "",
        viewRule: "",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        indexes: [],
        fields: [
            relationField("ks_template", "template_id", ID_KIT_TEMPLATES, true, true),
            relationField("ks_category", "category_id", ID_CATEGORIES, true),
            textField("ks_slot_name", "slot_name", true),
            jsonField("ks_reco_ids", "recommended_ids"),
            numberField("ks_order", "display_order")
        ]
    }));

    // =========================================================================
    // 5. CARTS
    // =========================================================================
    app.save(new Collection({
        id: ID_CARTS,
        name: "carts",
        type: "base",
        system: false,
        listRule: null,
        viewRule: null,
        createRule: null,
        updateRule: null,
        deleteRule: null,
        indexes: [],
        fields: [
            selectField("cart_status", "status", ["active", "abandoned", "converted"])
        ]
    }));

    // =========================================================================
    // 6. CART ITEMS
    // =========================================================================
    app.save(new Collection({
        id: ID_CART_ITEMS,
        name: "cart_items",
        type: "base",
        system: false,
        listRule: null,
        viewRule: null,
        createRule: null,
        updateRule: null,
        deleteRule: null,
        indexes: [],
        fields: [
            relationField("ci_cart", "cart", ID_CARTS, true, true),
            relationField("ci_product", "product", ID_EQUIPMENT, true),
            numberField("ci_qty", "quantity"),
            textField("ci_group", "group_id"),
            jsonField("ci_dates", "dates")
        ]
    }));

    // =========================================================================
    // 7. UI CONFIGURATIONS
    // =========================================================================
    app.save(new Collection({
        id: ID_UI_CONFIG,
        name: "ui_configurations",
        type: "base",
        system: false,
        listRule: "",
        viewRule: "",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        indexes: [],
        fields: [
            textField("ui_key", "config_key", true),
            jsonField("ui_value", "value")
        ]
    }));

    // =========================================================================
    // 8. SERVICES
    // =========================================================================
    app.save(new Collection({
        id: ID_SERVICES,
        name: "services",
        type: "base",
        system: false,
        listRule: "is_active = true",
        viewRule: "is_active = true",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        indexes: [],
        fields: [
            textField("svc_title", "title", true),
            textField("svc_title_fr", "title_fr"),
            textField("svc_slug", "slug", true),
            textField("svc_icon", "icon"),
            textField("svc_brief", "brief_description"),
            textField("svc_brief_fr", "brief_description_fr"),
            editorField("svc_full", "full_description"),
            editorField("svc_full_fr", "full_description_fr"),
            selectField("svc_type", "type", ["internal_link", "content_page"]),
            textField("svc_target", "target_url"),
            fileField("svc_hero", "hero_image", 1),
            fileField("svc_images", "images", 10),
            jsonField("svc_sections", "sections"),
            jsonField("svc_stats", "stats"),
            jsonField("svc_tags", "tags"),
            jsonField("svc_features", "features"),
            numberField("svc_order", "display_order"),
            boolField("svc_active", "is_active")
        ]
    }));

    // =========================================================================
    // 9. POSTS
    // =========================================================================
    app.save(new Collection({
        id: ID_POSTS,
        name: "posts",
        type: "base",
        system: false,
        listRule: "published = true",
        viewRule: "published = true",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        indexes: [],
        fields: [
            textField("post_title_en", "title_en"),
            textField("post_title_fr", "title_fr"),
            textField("post_slug", "slug", true),
            textField("post_excerpt_en", "excerpt_en"),
            textField("post_excerpt_fr", "excerpt_fr"),
            editorField("post_content_en", "content_en"),
            editorField("post_content_fr", "content_fr"),
            fileField("post_cover", "cover_image", 1),
            textField("post_category", "category"),
            boolField("post_published", "published"),
            dateField("post_published_at", "published_at")
        ]
    }));

    // =========================================================================
    // 10. QUOTES
    // =========================================================================
    app.save(new Collection({
        id: ID_QUOTES,
        name: "quotes",
        type: "base",
        system: false,
        listRule: null,
        viewRule: null,
        createRule: "",
        updateRule: null,
        deleteRule: null,
        indexes: [],
        fields: [
            textField("q_client_name", "client_name"),
            emailField("q_client_email", "client_email"),
            textField("q_client_phone", "client_phone"),
            textField("q_client_company", "client_company"),
            jsonField("q_items", "items_json"),
            dateField("q_start", "rental_start_date"),
            dateField("q_end", "rental_end_date"),
            textField("q_project", "project_description"),
            textField("q_special", "special_requests"),
            selectField("q_status", "status", ["pending", "quoted", "accepted", "rejected"]),
            textField("q_notes", "internal_notes"),
            numberField("q_price", "estimated_price"),
            boolField("q_pdf_gen", "pdf_generated"),
            fileField("q_pdf", "quote_pdf", 1),
            textField("q_token", "access_token"),
            textField("q_confirm", "confirmation_number"),
            textField("q_lang", "language"),
            dateField("q_followup", "follow_up_date"),
            dateField("q_quoted_at", "quoted_at"),
            boolField("q_locked", "locked")
        ]
    }));

    // =========================================================================
    // 11. EMAIL QUEUE
    // =========================================================================
    app.save(new Collection({
        id: ID_EMAIL_QUEUE,
        name: "email_queue",
        type: "base",
        system: false,
        listRule: null,
        viewRule: null,
        createRule: null,
        updateRule: null,
        deleteRule: null,
        indexes: [],
        fields: [
            emailField("eq_to", "to", true),
            textField("eq_subject", "subject"),
            editorField("eq_html", "html"),
            emailField("eq_reply", "reply_to"),
            selectField("eq_status", "status", ["pending", "sent", "failed"]),
            numberField("eq_attempts", "attempts"),
            numberField("eq_max", "max_attempts"),
            dateField("eq_next", "next_attempt_at"),
            textField("eq_payload_type", "payload_type"),
            jsonField("eq_payload", "payload_data"),
            dateField("eq_sent", "sent_at"),
            textField("eq_error", "error_message")
        ]
    }));

    // =========================================================================
    // 12. SETTINGS
    // =========================================================================
    app.save(new Collection({
        id: ID_SETTINGS,
        name: "settings",
        type: "base",
        system: false,
        listRule: "",
        viewRule: "",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        indexes: [],
        fields: [
            textField("set_company", "company_name"),
            emailField("set_email", "contact_email"),
            textField("set_phone", "company_phone"),
            textField("set_fax", "company_fax"),
            textField("set_address", "company_address"),
            boolField("set_email_notif", "email_notifications"),
            boolField("set_quote_alert", "new_quote_alert"),
            boolField("set_status_alert", "quote_status_alert"),
            boolField("set_show_prices", "show_prices"),
            boolField("set_maintenance", "maintenance_mode"),
            textField("set_lang", "default_language"),
            textField("set_currency", "currency")
        ]
    }));

    // =========================================================================
    // 13. CONTENT BLOCKS
    // =========================================================================
    app.save(new Collection({
        id: ID_CONTENT_BLOCKS,
        name: "content_blocks",
        type: "base",
        system: false,
        listRule: "",
        viewRule: "",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        indexes: [],
        fields: [
            textField("cb_key", "key", true),
            textField("cb_content", "content"),
            fileField("cb_image", "image", 1)
        ]
    }));

    // =========================================================================
    // 14. BOOKING ITEMS
    // =========================================================================
    app.save(new Collection({
        id: ID_BOOKING_ITEMS,
        name: "booking_items",
        type: "base",
        system: false,
        listRule: null,
        viewRule: null,
        createRule: null,
        updateRule: null,
        deleteRule: null,
        indexes: [],
        fields: [
            numberField("bi_qty", "quantity", true),
            numberField("bi_price", "price_at_booking", true)
        ]
    }));

    console.log("[Migration] Stage 1 Complete: Created 14 collections");

}, (app) => {
    const collections = [
        "booking_items", "content_blocks", "settings", "email_queue",
        "quotes", "posts", "services", "ui_configurations",
        "cart_items", "carts", "kit_slots", "kit_templates",
        "equipment", "categories"
    ];
    collections.forEach(name => {
        try {
            const col = app.findCollectionByNameOrId(name);
            if (col) app.delete(col);
        } catch { }
    });
});
