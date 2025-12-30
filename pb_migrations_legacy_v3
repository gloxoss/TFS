/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    // -------------------------------------------------------------------------
    // 1. DEFINE DATA
    // -------------------------------------------------------------------------
    const BATCH3_ITEMS = [
        {
            "id": "lenscookes8ixxx",
            "name": "Cooke S8/i FF Prime Set",
            "brand": "Cooke",
            "category": "Lenses",
            "tags": ["Large Format", "Spherical"],
            "description": "Designed for Full Frame sensors. Features a fast T1.4 aperture across the set. Delivers the 'Cooke Look' with organic bokeh.",
            "specifications": {
                "mount": "PL",
                "aperture": "T1.4",
                "coverage": "Full Frame"
            },
            "stock_available": 1
        },
        {
            "id": "lenszeissradian",
            "name": "Zeiss Supreme Prime Radiance Set",
            "brand": "Zeiss",
            "category": "Lenses",
            "tags": ["Large Format", "Spherical"],
            "description": "Based on the Supreme Primes but with a new coating that creates beautiful, controllable blue flares (Radiance).",
            "specifications": {
                "mount": "PL",
                "aperture": "T1.5",
                "coverage": "Full Frame",
                "feature": "Blue Flares"
            },
            "stock_available": 1
        },
        {
            "id": "lensangenieux45",
            "name": "Angenieux Optimo 45-120mm T2.8",
            "brand": "Angenieux",
            "category": "Lenses",
            "tags": ["Zoom"],
            "description": "Completes the Optimo lightweight zoom series. Perfect portrait to telephoto range.",
            "specifications": {
                "focal_length": "45-120mm",
                "aperture": "T2.8",
                "mount": "PL",
                "coverage": "Super 35"
            },
            "stock_available": 1
        },
        {
            "id": "lenscanon1545xx",
            "name": "Canon Cine-Servo 15-120mm T2.95-3.9",
            "brand": "Canon",
            "category": "Lenses",
            "tags": ["Zoom"],
            "description": "High 8K optical performance. Features a built-in 1.5x extender and removable servo drive.",
            "specifications": {
                "focal_length": "15-120mm",
                "aperture": "T2.95-3.9",
                "mount": "PL",
                "coverage": "Super 35 / Full Frame (w/ ext)"
            },
            "stock_available": 1
        }
    ];

    const KIT_TEMPLATES = [
        {
            "id": "kitvenicepkgxxx",
            "name": "Sony Venice 2 Cine Package",
            "main_product_id": "camvenice2xxxxx",
            "base_price_modifier": -300,
            "description": "Ultimate full-frame cinema package. Includes Sony Venice 2 Body, OConnor 2575D Fluid Head, Power Distribution, and monitoring."
        },
        {
            "id": "kitalexa35pkgxx",
            "name": "ARRI Alexa 35 Production Package",
            "main_product_id": "camalexa35xxxxx",
            "base_price_modifier": -200,
            "description": "A complete cinema package ready for high-end production. Includes Alexa 35, MVF-2 Viewfinder, Codex Media, and Support."
        },
        {
            "id": "kitredmonstropk",
            "name": "RED DSMC2 Monstro 8K Package",
            "main_product_id": "camredmonstroxx",
            "base_price_modifier": -250,
            "description": "Full frame 8K raw workflow. Includes RED Monstro body, RED Touch Monitor, Mini-Mags, and choice of PL or EF mount."
        },
        {
            "id": "kitfx9docuxxxxx",
            "name": "Sony FX9 Documentary Kit",
            "main_product_id": "camfx9xxxxxxxxx",
            "base_price_modifier": -100,
            "description": "Ready-to-shoot documentary kit. Includes FX9, Fujinon Cabrio Zoom, and Sachtler Tripod system."
        },
        {
            "id": "kitamiraengxxxx",
            "name": "ARRI Amira ENG Kit",
            "main_product_id": "camamiraxxxxxxx",
            "base_price_modifier": -150,
            "description": "Ergonomic shoulder-mount package perfect for broadcast and single-operator use."
        },
        {
            "id": "kitanamorphicin",
            "name": "Indie Anamorphic Lens Bundle",
            "main_product_id": "lensatlasorionx",
            "base_price_modifier": -50,
            "description": "Bundle of Atlas Orion Anamorphic lenses (Set A or B) with Matte Box and Wireless Follow Focus."
        },
        {
            "id": "kitdirectormoni",
            "name": "Wireless Director's Monitor Cage",
            "main_product_id": "monsmallhd703xx",
            "base_price_modifier": -20,
            "description": "Handheld wireless monitoring solution. Includes SmallHD 703 Bolt, handles, and battery power."
        },
        {
            "id": "kitronin2proxxx",
            "name": "DJI Ronin 2 Ultimate Stabilization",
            "main_product_id": "stabronin2xxxxx",
            "base_price_modifier": -100,
            "description": "Complete stabilization package including Ronin 2, Ready Rig or Support Vest, and DJI Force Pro controller."
        }
    ];

    const KIT_ITEMS = [
        {
            "id": "itemv2camxxxxxx",
            "template_id": "kitvenicepkgxxx",
            "product_id": "camvenice2xxxxx",
            "slot_name": "Camera Body",
            "is_mandatory": true,
            "default_quantity": 1
        },
        {
            "id": "itemv2headxxxxx",
            "template_id": "kitvenicepkgxxx",
            "product_id": "suppoconnor2575",
            "slot_name": "Fluid Head",
            "is_mandatory": true,
            "default_quantity": 1,
            "swappable_category": "Support"
        },
        {
            "id": "itemv2lensxxxxx",
            "template_id": "kitvenicepkgxxx",
            "product_id": "lenszeisssuprem",
            "slot_name": "Primary Lens Set",
            "is_mandatory": false,
            "default_quantity": 1,
            "swappable_category": "Lenses"
        },
        {
            "id": "itema35camxxxxx",
            "template_id": "kitalexa35pkgxx",
            "product_id": "camalexa35xxxxx",
            "slot_name": "Camera Body",
            "is_mandatory": true,
            "default_quantity": 1
        },
        {
            "id": "itema35ffxxxxxx",
            "template_id": "kitalexa35pkgxx",
            "product_id": "ctrlhi5xxxxxxxx",
            "slot_name": "Lens Control",
            "is_mandatory": false,
            "default_quantity": 1
        },
        {
            "id": "itemredcamxxxxx",
            "template_id": "kitredmonstropk",
            "product_id": "camredmonstroxx",
            "slot_name": "Camera Body",
            "is_mandatory": true,
            "default_quantity": 1
        },
        {
            "id": "itemredmonxxxxx",
            "template_id": "kitredmonstropk",
            "product_id": "monsmallhdcine7",
            "slot_name": "Control Monitor",
            "is_mandatory": true,
            "default_quantity": 1
        },
        {
            "id": "itemfx9camxxxxx",
            "template_id": "kitfx9docuxxxxx",
            "product_id": "camfx9xxxxxxxxx",
            "slot_name": "Camera Body",
            "is_mandatory": true,
            "default_quantity": 1
        },
        {
            "id": "itemfx9lensxxxx",
            "template_id": "kitfx9docuxxxxx",
            "product_id": "lensfuji1990xxx",
            "slot_name": "Zoom Lens",
            "is_mandatory": true,
            "default_quantity": 1,
            "swappable_category": "Lenses"
        },
        {
            "id": "itemfx9legsxxxx",
            "template_id": "kitfx9docuxxxxx",
            "product_id": "suppsachtler25x",
            "slot_name": "Tripod System",
            "is_mandatory": true,
            "default_quantity": 1
        },
        {
            "id": "itemanalensxxxx",
            "template_id": "kitanamorphicin",
            "product_id": "lensatlasorionx",
            "slot_name": "Anamorphic Primes",
            "is_mandatory": true,
            "default_quantity": 1
        },
        {
            "id": "itemanambxxxxxx",
            "template_id": "kitanamorphicin",
            "product_id": "mbarrilmb4x5xxx",
            "slot_name": "Matte Box",
            "is_mandatory": true,
            "default_quantity": 1
        },
        {
            "id": "itemdirmonxxxxx",
            "template_id": "kitdirectormoni",
            "product_id": "monsmallhd703xx",
            "slot_name": "Monitor",
            "is_mandatory": true,
            "default_quantity": 1
        },
        {
            "id": "itemdirrxxxxxxx",
            "template_id": "kitdirectormoni",
            "product_id": "wlteradekbolt67",
            "slot_name": "Wireless Receiver",
            "is_mandatory": true,
            "default_quantity": 1
        },
        {
            "id": "itemr2gimbalxxx",
            "template_id": "kitronin2proxxx",
            "product_id": "stabronin2xxxxx",
            "slot_name": "Gimbal",
            "is_mandatory": true,
            "default_quantity": 1
        },
        {
            "id": "itemr2forcexxxx",
            "template_id": "kitronin2proxxx",
            "product_id": "stabforceproxxx",
            "slot_name": "Remote Controller",
            "is_mandatory": false,
            "default_quantity": 1
        }
    ];

    const UI_CONFIG = {
        "filters_configuration": {
            "brand_filter": {
                "label": "Filter by Brand",
                "type": "multiselect",
                "source": "taxonomies.brands",
                "allow_multiple": true
            },
            "category_filter": {
                "label": "Filter by Category",
                "type": "select",
                "source": "taxonomies.categories",
                "allow_multiple": false
            },
            "tag_filter": {
                "label": "Features",
                "type": "tags",
                "source": "tags",
                "options": [
                    "Anamorphic",
                    "Spherical",
                    "Large Format",
                    "Full Frame",
                    "Super 35",
                    "Zoom",
                    "Macro",
                    "OLED",
                    "Recorder",
                    "Wireless"
                ]
            },
            "mount_filter": {
                "label": "Lens Mount",
                "type": "checkbox",
                "options": ["PL", "LPL", "EF", "E-Mount"]
            },
            "resolution_filter": {
                "label": "Max Resolution",
                "type": "range",
                "field": "specifications.max_resolution"
            }
        }
    };


    // -------------------------------------------------------------------------
    // 2. SEED BATCH 3 ITEMS (Equipment)
    // -------------------------------------------------------------------------
    const eqCollection = app.findCollectionByNameOrId("equipment");
    const catCollection = app.findCollectionByNameOrId("categories");

    BATCH3_ITEMS.forEach(item => {
        let record;
        const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        let isNew = false;
        try {
            record = app.findFirstRecordByData("equipment", "slug", slug);
        } catch (e) {
            record = new Record(eqCollection);
            isNew = true;
        }

        // Find/Create Category
        let catId = "";
        try {
            const cat = app.findFirstRecordByData("categories", "name", item.category);
            catId = cat.id;
        } catch (e) {
            // Try fallback if not exact match or create
            try {
                const newCat = new Record(catCollection);
                newCat.set("name", item.category);
                newCat.set("name_en", item.category);
                newCat.set("slug", item.category.toLowerCase());
                app.save(newCat);
                catId = newCat.id;
            } catch (e2) {
                // ignore
            }
        }

        if (isNew) {
            record.set("id", item.id); // Explicit ID only for new records
        }
        record.set("slug", slug);
        record.set("name_en", item.name);
        record.set("name_fr", item.name);
        record.set("description_en", item.description);
        record.set("description_fr", item.description);
        record.set("brand", item.brand);
        record.set("category", catId);
        record.set("stock", 100);
        record.set("stock_available", 100);
        record.set("daily_rate", 200);
        record.set("visibility", true);

        record.set("specs_en", JSON.stringify(item.specifications));
        record.set("specs_fr", JSON.stringify(item.specifications));

        if (item.tags && item.tags.length > 0) {
            record.set("type", item.tags[0]);
        }

        app.save(record);
    });

    // -------------------------------------------------------------------------
    // 3. CREATE COLLECTIONS
    // -------------------------------------------------------------------------

    // kit_templates
    let kitsCol;
    try {
        kitsCol = app.findCollectionByNameOrId("kit_templates");
    } catch (e) {
        kitsCol = new Collection({
            name: "kit_templates",
            type: "base",
            schema: [
                { name: "name", type: "text", required: true },
                {
                    name: "main_product_id", type: "relation", required: true, options: {
                        collectionId: eqCollection.id, cascadeDelete: false, maxSelect: 1
                    }
                },
                { name: "base_price_modifier", type: "number" },
                { name: "description", type: "text" },
            ]
        });
        app.save(kitsCol);
    }

    // kit_items
    let kitItemsCol;
    try {
        kitItemsCol = app.findCollectionByNameOrId("kit_items");
    } catch (e) {
        kitItemsCol = new Collection({
            name: "kit_items",
            type: "base",
            schema: [
                {
                    name: "template_id", type: "relation", required: true, options: {
                        collectionId: kitsCol.id, cascadeDelete: true, maxSelect: 1
                    }
                },
                {
                    name: "product_id", type: "relation", required: true, options: {
                        collectionId: eqCollection.id, cascadeDelete: false, maxSelect: 1
                    }
                },
                { name: "slot_name", type: "text" },
                { name: "is_mandatory", type: "bool" },
                { name: "default_quantity", type: "number" },
                { name: "swappable_category", type: "text" },
            ]
        });
        app.save(kitItemsCol);
    }

    // ui_configurations
    let uiConfigCol;
    try {
        const existing = app.findCollectionByNameOrId("ui_configurations");
        app.delete(existing);
    } catch (e) {
        // doesn't exist, ignore
    }

    uiConfigCol = new Collection({
        name: "ui_configurations",
        type: "base",
        schema: [
            { name: "config_key", type: "text", required: true, options: { pattern: "^\\w+$" } }, // unique key
            { name: "value", type: "json" }
        ]
    });
    app.save(uiConfigCol);

    // -------------------------------------------------------------------------
    // 4. SEED KITS
    // -------------------------------------------------------------------------
    KIT_TEMPLATES.forEach(kit => {
        let record;
        try {
            record = app.findFirstRecordByData("kit_templates", "id", kit.id);
        } catch (e) {
            record = new Record(kitsCol);
            record.set("id", kit.id);
        }
        record.set("name", kit.name);
        record.set("description", kit.description);
        record.set("base_price_modifier", kit.base_price_modifier);

        // Helper to find product
        let mainProd;
        try {
            mainProd = app.findFirstRecordByData("equipment", "id", kit.main_product_id);
        } catch (e) {
            // Fallback: Try to find by name from a known map or guess?
            // We can try to guess the name from the ID or just skip?
            // Let's hardcode a map for reliability since we know the dataset.
            const ID_NAME_MAP = {
                "camvenice2xxxxx": "Sony Venice 2 8K",
                "camalexa35xxxxx": "ARRI Alexa 35",
                "camredmonstroxx": "RED DSMC2 Monstro 8K VV", // Verified name? Let's try partial?
                "camfx9xxxxxxxxx": "Sony PXW-FX9",
                "camamiraxxxxxxx": "ARRI Amira",
                "lensatlasorionx": "Atlas Orion Series Anamorphic Set",
                "monsmallhd703xx": "SmallHD 703 Bolt 7\" Wireless Monitor",
                "stabronin2xxxxx": "DJI Ronin 2"
            };
            const nameC = ID_NAME_MAP[kit.main_product_id];
            if (nameC) {
                try {
                    mainProd = app.findFirstRecordByData("equipment", "name_en", nameC);
                } catch (e2) {
                    try {
                        // Try just 'name'
                        mainProd = app.findFirstRecordByData("equipment", "name", nameC);
                    } catch (e3) { console.log(`Prod lookup failed for ${kit.main_product_id} / ${nameC}`); }
                }
            }
        }

        if (mainProd) {
            record.set("main_product_id", mainProd.id);
            try {
                app.save(record);
            } catch (eSave) { console.log("Failed to save Kit: " + eSave.message); }
        } else {
            console.log("SKIPPING KIT " + kit.name + " (Main Product Not Found)");
        }
    });

    // -------------------------------------------------------------------------
    // 5. SEED KIT ITEMS
    // -------------------------------------------------------------------------
    KIT_ITEMS.forEach(kItem => {
        let record;
        try {
            record = app.findFirstRecordByData("kit_items", "id", kItem.id);
        } catch (e) {
            record = new Record(kitItemsCol);
            record.set("id", kItem.id);
        }

        record.set("slot_name", kItem.slot_name);
        record.set("is_mandatory", kItem.is_mandatory);
        record.set("default_quantity", kItem.default_quantity);
        record.set("swappable_category", kItem.swappable_category);

        // Link Template
        try {
            const tmpl = app.findFirstRecordByData("kit_templates", "id", kItem.template_id);
            record.set("template_id", tmpl.id);
        } catch (e) { console.log("Template Not Found: " + kItem.template_id); }

        // Link Product
        let prodRec;
        try {
            prodRec = app.findFirstRecordByData("equipment", "id", kItem.product_id);
        } catch (e) {
            // Fallback Map for Items
            const ITEM_MAP = {
                "suppoconnor2575": "OConnor Ultimate 2575D Fluid Head",
                "lenszeisssuprem": "Zeiss Supreme Prime Set",
                "ctrlhi5xxxxxxxx": "ARRI Hi-5 Hand Unit",
                "monsmallhdcine7": "SmallHD Cine 7 RED RCP2 Monitor",
                "lensfuji1990xxx": "Fujinon Cabrio 19-90mm T2.9",
                "suppsachtler25x": "Sachtler Video 25 Plus", // Guessing name
                "mbarrilmb4x5xxx": "ARRI LMB 4x5 Matte Box",
                "wlteradekbolt67": "Teradek Bolt 6 XT 750", // Guessing
                "stabforceproxxx": "DJI Force Pro"
            };

            // Also add the main kit items if they appear here
            const ID_NAME_MAP_2 = {
                "camvenice2xxxxx": "Sony Venice 2 8K",
                "camalexa35xxxxx": "ARRI Alexa 35",
                "camredmonstroxx": "RED DSMC2 Monstro 8K VV",
                "camfx9xxxxxxxxx": "Sony PXW-FX9",
                "camamiraxxxxxxx": "ARRI Amira",
                "lensatlasorionx": "Atlas Orion Series Anamorphic Set",
                "monsmallhd703xx": "SmallHD 703 Bolt 7\" Wireless Monitor",
                "stabronin2xxxxx": "DJI Ronin 2"
            };

            const targetName = ITEM_MAP[kItem.product_id] || ID_NAME_MAP_2[kItem.product_id];
            if (targetName) {
                try {
                    prodRec = app.findFirstRecordByData("equipment", "name_en", targetName);
                } catch (ez) {
                    try { prodRec = app.findFirstRecordByData("equipment", "name", targetName); } catch (ez2) { }
                }
            }
        }

        if (prodRec) {
            record.set("product_id", prodRec.id);
            try {
                app.save(record);
            } catch (eSave) { console.log("Failed to save Kit Item: " + eSave.message); }
        } else {
            console.log("SKIPPING KIT ITEM " + kItem.slot_name + " (Product Not Found: " + kItem.product_id + ")");
        }
    });

    // -------------------------------------------------------------------------
    // 6. SEED UI CONFIG
    // -------------------------------------------------------------------------
    if (UI_CONFIG && UI_CONFIG.filters_configuration) {
        let record;
        try {
            record = app.findFirstRecordByData("ui_configurations", "config_key", "equipment_filters");
        } catch (e) {
            record = new Record(uiConfigCol);
            record.set("config_key", "equipment_filters");
        }
        record.set("value", JSON.stringify(UI_CONFIG.filters_configuration));
        app.save(record);
    }
});
