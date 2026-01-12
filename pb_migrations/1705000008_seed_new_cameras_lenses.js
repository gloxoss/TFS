/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {

    // Helper to download images
    const fetchImage = (url) => {
        try {
            const res = $http.send({ url: url, method: "GET", timeout: 30 });
            if (res.statusCode === 200) {
                const filename = url.split('/').pop().split('?')[0] || `image_${Date.now()}.jpg`;
                return { name: filename, type: res.headers['Content-Type'] || "image/jpeg", content: res.raw };
            }
        } catch (e) {
            console.log(`Failed to fetch image: ${url}`);
        }
        return null;
    };

    const equipmentCollection = app.findCollectionByNameOrId("equipment");
    const kitTemplateCollection = app.findCollectionByNameOrId("kit_templates");
    const kitSlotCollection = app.findCollectionByNameOrId("kit_slots");

    // Get Category IDs
    const getCatId = (slug) => {
        try {
            return app.findFirstRecordByFilter("categories", `slug="${slug}"`).id;
        } catch (e) {
            return null; // Should handle error or fallback
        }
    };

    const catCameras = getCatId("cameras");
    const catLenses = getCatId("lenses");

    // --- 1. NEW CAMERAS ---
    const newCameras = [
        {
            name: "Arri Alexa 35 Xtreme",
            slug: "arri-alexa-35-xtreme",
            brand: "ARRI",
            category: catCameras,
            description_en: "A major revision of the industry’s trusted workhorse. Introduces powerful new hardware and higher speeds for breathtaking slow-motion images.",
            description_fr: "Une révision majeure de la référence de l'industrie. Introduit un nouveau matériel puissant et des vitesses plus élevées pour des ralentis époustouflants.",
            specs: {
                "sensor_size": "28.0 x 19.2 mm (Super 35)",
                "max_resolution": "4608 x 3164",
                "dynamic_range": "14+ Stops",
                "media_type": "CFast 2.0", // Per your data, though Xtreme might use Codex in reality, keeping your data
                "mount": "LPL / PL",
                "codec": "ProRes 4444 XQ, ARRIRAW",
                "max_fps": "120 fps (2K/HD)"
            },
            daily_rate: 1800,
            image_urls: ["https://cdn.theasc.com/20250731-2-arri-alexa-35-xtreme-enso-32-front-right82.jpg"]
        },
        {
            name: "Sony FX6 Full-Frame",
            slug: "sony-fx6",
            brand: "Sony",
            category: catCameras,
            description_en: "Versatile, cine-style imaging in a truly compact form. Captures up to 15+ stops of dynamic range with S-Cinetone gamma.",
            description_fr: "Imagerie de style cinéma polyvalente dans un format vraiment compact. Capture jusqu'à 15+ stops de plage dynamique.",
            specs: {
                "sensor_size": "35.6 x 23.8 mm (Full Frame)",
                "max_resolution": "4096 x 2160",
                "dynamic_range": "15+ Stops",
                "media_type": "CFexpress Type A / SDXC",
                "mount": "Sony E-mount",
                "codec": "XAVC-I, XAVC-L",
                "max_fps": "120 fps (4K)"
            },
            daily_rate: 350,
            image_urls: ["https://static.bhphoto.com/images/multiple_images/images500x500/1671614142_IMG_1901057.jpg"]
        }
    ];

    // Process Cameras & Create Kits
    newCameras.forEach(cam => {
        // Cleanup existing
        try {
            const existing = app.findFirstRecordByFilter("equipment", `slug="${cam.slug}"`);
            app.delete(existing);
        } catch (e) { }

        console.log(`Creating Camera: ${cam.name}`);
        const record = new Record(equipmentCollection);

        record.set("name", cam.name);
        record.set("name_en", cam.name);
        record.set("name_fr", cam.name);
        record.set("slug", cam.slug);
        record.set("brand", cam.brand);
        record.set("category", cam.category);
        record.set("description_en", cam.description_en);
        record.set("description_fr", cam.description_fr);
        record.set("specs", cam.specs);
        record.set("specs_en", cam.specs);
        record.set("specs_fr", cam.specs);
        record.set("daily_rate", cam.daily_rate);
        record.set("stock", 2);
        record.set("stock_available", 2);
        record.set("visibility", true);
        record.set("is_featured", true);

        if (cam.image_urls && cam.image_urls.length > 0) {
            const mainImg = fetchImage(cam.image_urls[0]);
            if (mainImg) {
                // record.set("image", mainImg); 
            }
        }

        app.save(record);

        // Create Kit Template
        try {
            const kitTemplate = new Record(kitTemplateCollection);
            kitTemplate.set("name", `${cam.name} Production Package`);
            kitTemplate.set("description", `Essential kit for ${cam.name}`);
            kitTemplate.set("main_product_id", record.id);
            kitTemplate.set("base_price_modifier", 0);
            app.save(kitTemplate);

            // Create Kit Slots
            const slots = [
                { name: "Lenses", slug: "lenses", order: 1 },
                { name: "Monitor", slug: "monitors", order: 2 },
                { name: "Media", slug: "storage", order: 3 }, // Assuming 'storage' or similar category exists, else use 'accessories'
                { name: "Support", slug: "support", order: 4 }
            ];

            slots.forEach(slot => {
                try {
                    const catRec = app.findFirstRecordByFilter("categories", `slug="${slot.slug}"`);
                    const slotRec = new Record(kitSlotCollection);
                    slotRec.set("template_id", kitTemplate.id);
                    slotRec.set("category_id", catRec.id);
                    slotRec.set("slot_name", slot.name);
                    slotRec.set("display_order", slot.order);
                    app.save(slotRec);
                } catch (err) {
                    // Category might not exist, skip slot
                }
            });
        } catch (e) {
            console.log(`Error creating kit for ${cam.name}: ${e}`);
        }
    });

    // --- 2. NEW LENSES ---
    const newLenses = [
        {
            name: "Cooke S8/i Full-Frame T1.4 Set",
            slug: "cooke-s8i-set",
            brand: "Cooke",
            type: "Prime",
            description_en: "The renowned 'Cooke Look' for full-frame. T1.4 aperture. Organic feel and spherical bokeh.",
            description_fr: "Le célèbre 'Look Cooke' pour le plein format. Ouverture T1.4. Rendu organique.",
            specs: { "mount": "PL", "aperture": "T1.4", "coverage": "Full Frame Plus" },
            daily_rate: 1600,
            image_urls: ["https://twinsproduction.com/wp-content/uploads/2023/11/Cooke-S8i-set.jpg.webp"]
        },
        {
            name: "Sony FE 50mm f/1.2 GM",
            slug: "sony-fe-50mm-gm",
            brand: "Sony",
            type: "Prime",
            description_en: "Normal-length prime flexes a bright f/1.2 design and advanced optics.",
            description_fr: "Focale normale lumineuse f/1.2 avec optique avancée.",
            specs: { "mount": "Sony E", "aperture": "f/1.2", "focal_length": "50mm" },
            daily_rate: 100,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1615895153_1630079.jpg"]
        },
        {
            name: "Sony FE 24-70mm f/2.8 GM II",
            slug: "sony-fe-24-70mm-gm-ii",
            brand: "Sony",
            type: "Zoom",
            description_en: "Refined fast standard zoom. Smaller and lighter than previous generation.",
            description_fr: "Zoom standard rapide raffiné. Plus petit et plus léger.",
            specs: { "mount": "Sony E", "aperture": "f/2.8", "range": "24-70mm" },
            daily_rate: 120,
            image_urls: ["https://static.bhphoto.com/images/multiple_images/images500x500/1651055463_IMG_1739517.jpg"]
        },
        {
            name: "Sony FE 35mm f/1.4 GM",
            slug: "sony-fe-35mm-gm",
            brand: "Sony",
            type: "Prime",
            description_en: "Versatile wide-normal prime built for both stills and cinematic video.",
            description_fr: "Focale large polyvalente conçue pour la photo et la vidéo.",
            specs: { "mount": "Sony E", "aperture": "f/1.4", "focal_length": "35mm" },
            daily_rate: 90,
            image_urls: ["https://static.bhphoto.com/images/multiple_images/images500x500/1610533948_IMG_1472020.jpg"]
        },
        {
            name: "Sony FE 16-35mm f/2.8 GM",
            slug: "sony-fe-16-35mm-gm",
            brand: "Sony",
            type: "Zoom",
            description_en: "Wide-angle zoom covering ultra-wide to standard wide-angle fields of view.",
            description_fr: "Zoom grand angle couvrant des champs ultra-larges à standards.",
            specs: { "mount": "Sony E", "aperture": "f/2.8", "range": "16-35mm" },
            daily_rate: 110,
            image_urls: ["https://static.bhphoto.com/images/multiple_images/images500x500/1504614646_IMG_863921.jpg"]
        },
        {
            name: "Sony FE 85mm f/1.4 GM",
            slug: "sony-fe-85mm-gm",
            brand: "Sony",
            type: "Prime",
            description_en: "Fast short-telephoto prime perfect for portraiture and isolating subjects.",
            description_fr: "Téléobjectif court rapide parfait pour le portrait.",
            specs: { "mount": "Sony E", "aperture": "f/1.4", "focal_length": "85mm" },
            daily_rate: 95,
            image_urls: ["https://static.bhphoto.com/images/multiple_images/images500x500/1624972658_IMG_582639.jpg"]
        },
        {
            name: "Sony FE 70-200mm f/2.8 GM OSS",
            slug: "sony-fe-70-200mm-gm",
            brand: "Sony",
            type: "Zoom",
            description_en: "Reliable telephoto zoom. High sharpness and smooth bokeh.",
            description_fr: "Zoom téléobjectif fiable. Haute netteté et bokeh fluide.",
            specs: { "mount": "Sony E", "aperture": "f/2.8", "range": "70-200mm" },
            daily_rate: 130,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1454496359_1222776.jpg"]
        },
        {
            name: "Sony FE PZ 28-135mm f/4 G OSS",
            slug: "sony-fe-pz-28-135mm",
            brand: "Sony",
            type: "Zoom",
            description_en: "Power Zoom lens designed for 4K video. Minimal breathing.",
            description_fr: "Objectif Power Zoom conçu pour la vidéo 4K. Respiration minimale.",
            specs: { "mount": "Sony E", "aperture": "f/4", "range": "28-135mm", "feature": "Power Zoom" },
            daily_rate: 110,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1410490265_1082051.jpg"]
        }
    ];

    // Process Lenses
    newLenses.forEach(lens => {
        try {
            const existing = app.findFirstRecordByFilter("equipment", `slug="${lens.slug}"`);
            app.delete(existing);
        } catch (e) { }

        console.log(`Creating Lens: ${lens.name}`);
        const record = new Record(equipmentCollection);

        record.set("name", lens.name);
        record.set("name_en", lens.name);
        record.set("name_fr", lens.name);
        record.set("slug", lens.slug);
        record.set("brand", lens.brand);
        record.set("category", catLenses);
        record.set("description_en", lens.description_en);
        record.set("description_fr", lens.description_fr);
        record.set("specs", lens.specs);
        record.set("specs_en", lens.specs);
        record.set("specs_fr", lens.specs);
        record.set("daily_rate", lens.daily_rate);
        record.set("stock", 4);
        record.set("stock_available", 4);
        record.set("visibility", true);

        // Explicitly set type for filter bar (Prime vs Zoom)
        record.set("type", lens.type);

        if (lens.image_urls && lens.image_urls.length > 0) {
            const mainImg = fetchImage(lens.image_urls[0]);
            if (mainImg) {
                // record.set("image", mainImg); 
            }
        }

        app.save(record);
    });

}, (app) => {
    // Rollback logic
});