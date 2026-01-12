/// <reference path="../pb_data/types.d.ts" />
/**
 * Stage 2: Seed Essential Data
 * Seeds categories, sample products, kits, UI config, and default settings.
 */
migrate((app) => {
    // =========================================================================
    // 1. SEED CATEGORIES
    // =========================================================================
    const CATEGORIES = [
        { name: "Cameras", slug: "cameras" },
        { name: "Lenses", slug: "lenses" },
        { name: "Lens Control", slug: "lens-control" },
        { name: "Support", slug: "support" },
        { name: "Matte Boxes", slug: "matte-boxes" },
        { name: "Monitors", slug: "monitors" },
        { name: "Wireless Video", slug: "wireless-video" },
        { name: "Stabilization", slug: "stabilization" },
        { name: "Power", slug: "power" },
        { name: "Lighting", slug: "lighting" }
    ];

    const catCol = app.findCollectionByNameOrId("categories");
    const catMap = {}; // name -> id

    CATEGORIES.forEach(cat => {
        try {
            const existing = app.findFirstRecordByData("categories", "slug", cat.slug);
            catMap[cat.name] = existing.id;
        } catch {
            const rec = new Record(catCol);
            rec.set("name", cat.name);
            rec.set("name_en", cat.name);
            rec.set("name_fr", cat.name);
            rec.set("slug", cat.slug);
            app.save(rec);
            catMap[cat.name] = rec.id;
        }
    });
    console.log("[Seed] Categories seeded:", Object.keys(catMap).length);

    // =========================================================================
    // 2. SEED PRODUCTS (Equipment)
    // =========================================================================
    const PRODUCTS = [
        { id: "camvenice2xxxxx", name: "Sony Venice 2", brand: "Sony", category: "Cameras", slug: "sony-venice-2", rate: 1200, stock: 5 },
        { id: "camalexa35xxxxx", name: "ARRI Alexa 35", brand: "ARRI", category: "Cameras", slug: "arri-alexa-35", rate: 1500, stock: 3 },
        { id: "camredmonstroxx", name: "RED Monstro 8K VV", brand: "RED", category: "Cameras", slug: "red-monstro-8k", rate: 1000, stock: 4 },
        { id: "camfx9xxxxxxxxx", name: "Sony FX9", brand: "Sony", category: "Cameras", slug: "sony-fx9", rate: 600, stock: 6 },
        { id: "camamiraxxxxxxx", name: "ARRI AMIRA", brand: "ARRI", category: "Cameras", slug: "arri-amira", rate: 800, stock: 2 },
        { id: "lenscookes8ixxx", name: "Cooke S8/i FF Prime Set", brand: "Cooke", category: "Lenses", slug: "cooke-s8i-set", rate: 800, stock: 2 },
        { id: "lenszeissradian", name: "Zeiss Supreme Radiance", brand: "Zeiss", category: "Lenses", slug: "zeiss-radiance", rate: 750, stock: 2 },
        { id: "lensatlasorionx", name: "Atlas Orion Anamorphic", brand: "Atlas", category: "Lenses", slug: "atlas-orion", rate: 900, stock: 1 },
        { id: "lenszeisssuprem", name: "Zeiss Supreme Prime Set", brand: "Zeiss", category: "Lenses", slug: "zeiss-supreme", rate: 700, stock: 3 },
        { id: "lensfuji1990xxx", name: "Fujinon Premista 19-90mm", brand: "Fujinon", category: "Lenses", slug: "fujinon-premista", rate: 500, stock: 2 },
        { id: "monsmallhd703xx", name: "SmallHD 703 UltraBright", brand: "SmallHD", category: "Monitors", slug: "smallhd-703", rate: 150, stock: 8 },
        { id: "monsmallhdcine7", name: "SmallHD Cine 7", brand: "SmallHD", category: "Monitors", slug: "smallhd-cine7", rate: 200, stock: 5 },
        { id: "stabronin2xxxxx", name: "DJI Ronin 2", brand: "DJI", category: "Stabilization", slug: "dji-ronin-2", rate: 350, stock: 3 },
        { id: "stabforceproxxx", name: "Tilta Gravity G2X", brand: "Tilta", category: "Stabilization", slug: "tilta-gravity", rate: 200, stock: 4 },
        { id: "suppoconnor2575", name: "OConnor 2575D", brand: "OConnor", category: "Support", slug: "oconnor-2575", rate: 250, stock: 3 },
        { id: "suppsachtler25x", name: "Sachtler Video 25", brand: "Sachtler", category: "Support", slug: "sachtler-25", rate: 180, stock: 5 },
        { id: "ctrlhi5xxxxxxxx", name: "Hi-5 FIZ Kit", brand: "Preston", category: "Lens Control", slug: "hi5-fiz", rate: 400, stock: 2 },
        { id: "wlteradekbolt67", name: "Teradek Bolt 4K 750", brand: "Teradek", category: "Wireless Video", slug: "teradek-bolt", rate: 300, stock: 4 }
    ];

    const eqCol = app.findCollectionByNameOrId("equipment");

    PRODUCTS.forEach(p => {
        try {
            app.findFirstRecordByData("equipment", "id", p.id);
            // Already exists, skip
        } catch {
            const rec = new Record(eqCol);
            rec.set("id", p.id);
            rec.set("name", p.name);
            rec.set("name_en", p.name);
            rec.set("name_fr", p.name);
            rec.set("slug", p.slug);
            rec.set("brand", p.brand);
            rec.set("category", catMap[p.category]);
            rec.set("daily_rate", p.rate);
            rec.set("stock", p.stock);
            rec.set("stock_available", p.stock);
            rec.set("visibility", true);
            rec.set("featured", p.category === "Cameras");
            app.save(rec);
        }
    });
    console.log("[Seed] Products seeded:", PRODUCTS.length);

    // =========================================================================
    // 3. SEED KIT TEMPLATES & SLOTS
    // =========================================================================
    const KITS = [
        {
            id: "kitvenicepkgxxx",
            name: "Sony Venice 2 Cine Package",
            main_product_id: "camvenice2xxxxx",
            base_price_modifier: -300,
            slots: [
                { name: "Camera Body", cat: "Cameras" },
                { name: "Primary Lens Set", cat: "Lenses", reco: ["lenscookes8ixxx"] },
                { name: "Monitor", cat: "Monitors", reco: ["monsmallhdcine7"] }
            ]
        },
        {
            id: "kitalexa35pkgxx",
            name: "ARRI Alexa 35 Production Package",
            main_product_id: "camalexa35xxxxx",
            base_price_modifier: -250,
            slots: [
                { name: "Camera Body", cat: "Cameras" },
                { name: "Lens Option", cat: "Lenses", reco: ["lenszeissradian"] },
                { name: "Support", cat: "Support", reco: ["suppoconnor2575"] }
            ]
        }
    ];

    const kitCol = app.findCollectionByNameOrId("kit_templates");
    const slotCol = app.findCollectionByNameOrId("kit_slots");

    KITS.forEach(kit => {
        let kRec;
        try {
            kRec = app.findFirstRecordByData("kit_templates", "id", kit.id);
        } catch {
            kRec = new Record(kitCol);
            kRec.set("id", kit.id);
        }
        kRec.set("name", kit.name);
        kRec.set("main_product_id", kit.main_product_id);
        kRec.set("base_price_modifier", kit.base_price_modifier);
        app.save(kRec);

        // Seed slots
        kit.slots.forEach((slot, idx) => {
            const sRec = new Record(slotCol);
            sRec.set("template_id", kRec.id);
            sRec.set("slot_name", slot.name);
            sRec.set("category_id", catMap[slot.cat]);
            sRec.set("display_order", idx);
            if (slot.reco) sRec.set("recommended_ids", slot.reco);
            app.save(sRec);
        });
    });
    console.log("[Seed] Kits seeded:", KITS.length);

    // =========================================================================
    // 4. SEED UI CONFIGURATION
    // =========================================================================
    const UI_CONFIG = {
        brand_filter: { label: "Filter by Brand", type: "multiselect" },
        category_filter: { label: "Filter by Category", type: "select" },
        tag_filter: { label: "Features", type: "tags", options: ["Anamorphic", "Spherical", "Large Format", "Full Frame", "Super 35"] },
        mount_filter: { label: "Lens Mount", type: "checkbox", options: ["PL", "LPL", "EF", "E-Mount"] }
    };

    try {
        const uiCol = app.findCollectionByNameOrId("ui_configurations");
        const uiRec = new Record(uiCol);
        uiRec.set("config_key", "equipment_filters");
        uiRec.set("value", UI_CONFIG);
        app.save(uiRec);
        console.log("[Seed] UI Config seeded");
    } catch (e) {
        console.log("[Seed] UI Config error:", e);
    }

    // =========================================================================
    // 5. SEED DEFAULT SETTINGS
    // =========================================================================
    try {
        const setCol = app.findCollectionByNameOrId("settings");
        const setRec = new Record(setCol);
        setRec.set("company_name", "TFS - TV Film Solutions");
        setRec.set("contact_email", "contact@tfs.ma");
        setRec.set("company_phone", "+212 522 246 372");
        setRec.set("company_fax", "+212 522 241 396");
        setRec.set("company_address", "N°55-57, Rue Souleimane El Farissi, Ain Borja - Casablanca 20330, Morocco");
        setRec.set("email_notifications", true);
        setRec.set("new_quote_alert", true);
        setRec.set("quote_status_alert", true);
        setRec.set("show_prices", false);
        setRec.set("maintenance_mode", false);
        setRec.set("default_language", "en");
        setRec.set("currency", "MAD");
        app.save(setRec);
        console.log("[Seed] Settings seeded");
    } catch (e) {
        console.log("[Seed] Settings error:", e);
    }

    console.log("[Migration] Stage 2 Complete: Data seeded");

}, (app) => {
    // Rollback: Clear seeded data would require deleting records
    console.log("[Migration] Stage 2 rollback - manual cleanup required");
});
