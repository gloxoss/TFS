/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    // 1. Data Definitions for MISSING items
    const missingEquipment = [
        // --- MISSING ZOOM LENSES ---
        {
            name: "Fujinon ZK14-35mm T2.9 Cabrio",
            slug: "fujinon-cabrio-14-35mm",
            brand: "Fujinon",
            category_slug: "lenses",
            description_en: "Wide angle zoom for Super 35mm. Detachable servo unit.",
            description_fr: "Zoom grand angle pour Super 35mm. Unité servo détachable.",
            specs: { "mount": "PL", "range": "14-35mm", "aperture": "T2.9" },
            daily_rate: 550,
            image_urls: ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/fujinon_zk2_5x14_14_35mm_t2_9_cabrio_premier_1384866604_1013528.jpg"]
        },
        {
            name: "Canon CINE-SERVO 15-120mm T2.95",
            slug: "canon-cine-servo-15-120mm",
            brand: "Canon",
            category_slug: "lenses",
            description_en: "Full-frame/Super35 zoom with SS-41-IASD full servo kit.",
            description_fr: "Zoom plein format/Super35 avec kit servo SS-41-IASD.",
            specs: { "mount": "PL", "range": "15-120mm", "aperture": "T2.95-3.9" },
            daily_rate: 550,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1662540395_1725850.jpg"]
        },
        {
            name: "Canon CINE-SERVO 25-250mm T2.95",
            slug: "canon-cine-servo-25-250mm",
            brand: "Canon",
            category_slug: "lenses",
            description_en: "Broadcast lens servo setup with cinema optics. Compact and lightweight.",
            description_fr: "Configuration servo d'objectif broadcast avec optique cinéma.",
            specs: { "mount": "PL", "range": "25-250mm", "aperture": "T2.95" },
            daily_rate: 600,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1587386883_1557489.jpg"]
        },
        {
            name: "Angenieux Optimo 28-76mm",
            slug: "angenieux-optimo-28-76mm",
            brand: "Angenieux",
            category_slug: "lenses",
            description_en: "Lightweight Wide-Angle Zoom. Swappable mounts (PL/EF).",
            description_fr: "Zoom grand angle léger. Montures interchangeables.",
            specs: { "mount": "PL", "range": "28-76mm", "aperture": "T2.6" },
            daily_rate: 450,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1493987833_1332901.jpg"]
        },
        {
            name: "Angenieux Optimo Style 48-130mm",
            slug: "angenieux-optimo-style-48-130mm",
            brand: "Angenieux",
            category_slug: "lenses",
            description_en: "Mid-range lightweight zoom. 2.7x zoom ratio, minimal breathing.",
            description_fr: "Zoom léger de milieu de gamme. Rapport de zoom 2,7x, respiration minimale.",
            specs: { "mount": "PL", "range": "48-130mm", "aperture": "T3" },
            daily_rate: 450,
            image_urls: ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/angenieux_optimo_48_130_style_with_asu_optimo_style_48_130mm_zoom_1513340578_1365594.jpg"]
        },
        {
            name: "Angenieux Optimo 19.5-94mm",
            slug: "angenieux-optimo-19.5-94mm",
            brand: "Angenieux",
            category_slug: "lenses",
            description_en: "Maximized for high-res digital production. Superb homogeneity.",
            description_fr: "Optimisé pour la production numérique haute résolution. Superbe homogénéité.",
            specs: { "mount": "PL", "range": "19.5-94mm", "aperture": "T2.6" },
            daily_rate: 600,
            image_urls: ["https://epc.es/wp-content/uploads/2019/04/ANGENIEUX-195-94mm-20-scaled.jpg"]
        },
        {
            name: "ZEISS CZ.2 15-30mm Compact Zoom",
            slug: "zeiss-cz2-15-30mm",
            brand: "ZEISS",
            category_slug: "lenses",
            description_en: "Full-frame wide angle zoom. Color matched to Zeiss primes.",
            description_fr: "Zoom grand angle plein format. Couleurs assorties aux primes Zeiss.",
            specs: { "mount": "PL/E/EF", "range": "15-30mm", "aperture": "T2.9" },
            daily_rate: 350,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1390563263_1023801.jpg"]
        },
        {
            name: "Tokina 11-16mm T3.0",
            slug: "tokina-11-16mm",
            brand: "Tokina",
            category_slug: "lenses",
            description_en: "Ideal for wide-angle cinematography, landscapes, and architecture.",
            description_fr: "Idéal pour la cinématographie grand angle, les paysages et l'architecture.",
            specs: { "mount": "PL", "range": "11-16mm", "aperture": "T3.0" },
            daily_rate: 150,
            image_urls: ["https://thehdhouse.com/wp-content/uploads/2023/09/tokina-duclos-11-16mm-T3.0-1.png"]
        },

        // --- MISSING PRIME LENSES ---
        {
            name: "ZEISS Compact Prime CP.2 Set",
            slug: "zeiss-cp2-set",
            brand: "ZEISS",
            category_slug: "lenses",
            description_en: "Versatile compact primes with interchangeable mounts. Full frame coverage.",
            description_fr: "Primes compacts polyvalents avec montures interchangeables.",
            specs: { "mount": "PL/EF", "aperture": "T2.1", "range": "15mm-135mm" },
            daily_rate: 450,
            image_urls: ["https://www.thevisionhouse.com.au/wp-content/uploads/2022/10/Zeiss-CP2-1-640x0-c-default.jpeg"]
        },
        {
            name: "ZEISS Standard Prime Set",
            slug: "zeiss-standard-primes",
            brand: "ZEISS",
            category_slug: "lenses",
            description_en: "Classic Zeiss look. Small, lightweight, sharp T2.1 lenses.",
            description_fr: "Look Zeiss classique. Objectifs T2.1 petits, légers et nets.",
            specs: { "mount": "PL", "aperture": "T2.1", "range": "16mm-85mm" },
            daily_rate: 300,
            image_urls: ["https://utopiacam.com/wp-content/uploads/2016/05/standardspeeds.jpg"]
        },
        {
            name: "ZEISS Master Macro Prime Set",
            slug: "zeiss-master-macro",
            brand: "ZEISS",
            category_slug: "lenses",
            description_en: "High-end macro cinematography. Exceptional sharpness from close focus to infinity.",
            description_fr: "Cinématographie macro haut de gamme. Netteté exceptionnelle.",
            specs: { "mount": "PL", "aperture": "T2.0", "range": "50mm, 100mm" },
            daily_rate: 700,
            image_urls: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3o7xDEWDfq1fss3q_AqUFFTJR_yWBlqdYjw&s"]
        },
        {
            name: "Servicevision Scorpion Anamorphic Set",
            slug: "scorpion-anamorphic",
            brand: "Servicevision",
            category_slug: "lenses",
            description_en: "Lightweight anamorphic lenses. Classic character with oval bokeh.",
            description_fr: "Objectifs anamorphiques légers. Caractère classique avec bokeh ovale.",
            specs: { "mount": "PL", "aperture": "T2.2", "squeeze": "2x" },
            daily_rate: 1200,
            image_urls: ["https://rental.servicevision.es/wp-content/uploads/2019/02/056_ScorpioLens_Anamorphic2x-1-scaled.jpg"]
        },

        // --- MISSING MONITORS ---
        {
            name: "TVLogic LQM-071W",
            slug: "tvlogic-lqm-071w",
            brand: "TVLogic",
            category_slug: "monitors",
            description_en: "7-inch monitor with 4 auto-sensing inputs. Waveform/Vectorscope.",
            description_fr: "Moniteur 7 pouces avec 4 entrées à détection automatique.",
            specs: { "size": "7 inch", "inputs": "4x SDI" },
            daily_rate: 100,
            image_urls: ["https://tvlogic.tv/Monitors/UpImg/LQM-071W-FRONT.gif"]
        },
        {
            name: "Marshall V-MD241 24\" LED",
            slug: "marshall-v-md241",
            brand: "Marshall",
            category_slug: "monitors",
            description_en: "24-inch Full HD LED backlit LCD. Ideal for village monitoring.",
            description_fr: "LCD rétroéclairé LED Full HD de 24 pouces. Idéal pour le monitoring de village.",
            specs: { "size": "24 inch", "resolution": "1920x1080" },
            daily_rate: 150,
            image_urls: ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/marshall_electronics_v_md241_24_led_lcd_1386257619_982146.jpg"]
        },
        {
            name: "Transvideo Starlite ARRI-WVS",
            slug: "transvideo-starlite",
            brand: "Transvideo",
            category_slug: "monitors",
            description_en: "5-inch touchscreen monitor/recorder with built-in ARRI wireless receiver.",
            description_fr: "Moniteur/enregistreur tactile 5 pouces avec récepteur sans fil ARRI intégré.",
            specs: { "size": "5 inch", "wireless": "ARRI WVS Built-in" },
            daily_rate: 200,
            image_urls: ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_k2_0015243_transvideo_starlite_arri_wvs_1525176383_1367785.jpg"]
        },
        {
            name: "Atomos Ninja Inferno",
            slug: "atomos-ninja-inferno",
            brand: "Atomos",
            category_slug: "monitors",
            description_en: "7-inch 4K HDMI Recording Monitor. High brightness for HDR work.",
            description_fr: "Moniteur enregistreur 4K HDMI de 7 pouces.",
            specs: { "size": "7 inch", "recording": "ProRes / DNxHR" },
            daily_rate: 120,
            image_urls: ["https://static.bhphoto.com/images/multiple_images/images500x500/1490258703_IMG_773212.jpg"]
        },

        // --- MISSING WIRELESS & STABILIZATION ---
        {
            name: "SWIT CW-S300 Wireless System",
            slug: "swit-cw-s300",
            brand: "SWIT",
            category_slug: "wireless-video",
            description_en: "Stable, low-latency video transmission. SDI/HDMI connectivity.",
            description_fr: "Transmission vidéo stable et à faible latence. Connectivité SDI/HDMI.",
            specs: { "range": "300m", "latency": "<1ms" },
            daily_rate: 100,
            image_urls: ["https://media.tarad.com/9/99aplus/img-lib/spd_2018051492235_b.jpg"]
        },
        {
            name: "Zhiyun CRANE 3S",
            slug: "zhiyun-crane-3s",
            brand: "Zhiyun",
            category_slug: "stabilizers",
            description_en: "Heavy duty handheld stabilizer. 14.3 lb payload capacity.",
            description_fr: "Stabilisateur portable robuste. Capacité de charge de 6,5 kg.",
            specs: { "payload": "14.3 lbs", "design": "Modular Handle" },
            daily_rate: 100,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1584603943_1554049.jpg"]
        },

        // --- MISSING LIGHTING ---
        {
            name: "Dedolight Dedo 150W Kit (4-Light)",
            slug: "dedolight-150w-kit",
            brand: "Dedolight",
            category_slug: "lighting",
            description_en: "Compact, high-precision lighting solution. Exceptional beam control.",
            description_fr: "Solution d'éclairage compacte de haute précision. Contrôle exceptionnel du faisceau.",
            specs: { "type": "Tungsten", "power": "150W x 4", "lens": "Aspheric" },
            daily_rate: 150,
            image_urls: ["https://bollywoodfilmequipments.in/wp-content/uploads/2020/12/1-6.jpg"]
        },
        {
            name: "DMG Lumiere MIX Series",
            slug: "dmg-lumiere-mix",
            brand: "DMG Lumiere",
            category_slug: "lighting",
            description_en: "High-performance full-color LED panels (Mini, SL1, Maxi). Advanced RGBWW.",
            description_fr: "Panneaux LED couleur haute performance (Mini, SL1, Maxi).",
            specs: { "type": "LED", "cct": "Full Color", "cri": "95+" },
            daily_rate: 250,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1564134460_1492286.jpg"]
        },
        {
            name: "Aputure Electro Storm CS15",
            slug: "aputure-cs15",
            brand: "Aputure",
            category_slug: "lighting",
            description_en: "1500W High Output Full Color LED. SSI Tungsten 89+.",
            description_fr: "LED couleur haute puissance 1500W.",
            specs: { "type": "LED", "power": "1500W", "mount": "Electronic A-Mount" },
            daily_rate: 450,
            image_urls: ["https://cdn.shopify.com/s/files/1/1343/1935/files/CS15_Meuium_Barndoor-5.png?v=1703557992"]
        },
        {
            name: "Aputure Electro Storm XT26",
            slug: "aputure-xt26",
            brand: "Aputure",
            category_slug: "lighting",
            description_en: "2600W Bi-Color LED. Replaces 4K HMI / 12K Tungsten.",
            description_fr: "LED Bi-Color 2600W. Remplace HMI 4K / Tungstène 12K.",
            specs: { "type": "LED", "power": "2600W", "cct": "2700K-6500K" },
            daily_rate: 600,
            image_urls: ["https://cdn.shopify.com/s/files/1/1343/1935/files/XT26_Meuium_Barndoor-2.png?v=1710323628&width=1000&crop=center"]
        },
        {
            name: "Aputure STORM XT52",
            slug: "aputure-xt52",
            brand: "Aputure",
            category_slug: "lighting",
            description_en: "5200W Tunable White LED. Massive output for large scale productions.",
            description_fr: "LED blanc réglable 5200W. Sortie massive pour les grandes productions.",
            specs: { "type": "LED", "power": "5200W", "ip_rating": "IP65" },
            daily_rate: 1000,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1743508894_1889192.jpg"]
        },
        {
            name: "Amaran F21c / F22c Flex Mat",
            slug: "amaran-flex-mat",
            brand: "Amaran",
            category_slug: "lighting",
            description_en: "RGBWW Flexible LED Mats. Lightweight and versatile.",
            description_fr: "Tapis LED flexibles RGBWW. Léger et polyvalent.",
            specs: { "type": "LED Flex", "power": "100W / 200W" },
            daily_rate: 100,
            image_urls: ["https://static.bhphoto.com/images/multiple_images/images500x500/1648739988_IMG_1725343.jpg"]
        },
        {
            name: "Aputure MC Pro",
            slug: "aputure-mc-pro",
            brand: "Aputure",
            category_slug: "lighting",
            description_en: "Mini RGBWW light. Magnetic, fits in pocket. IP65.",
            description_fr: "Mini lumière RGBWW. Magnétique, tient dans la poche.",
            specs: { "type": "LED", "power": "5W", "feature": "Magnetic" },
            daily_rate: 20,
            image_urls: ["https://cdn.shopify.com/s/files/1/1343/1935/files/MCPro-1.png?v=1696906204&width=1000&crop=center"]
        },

        // --- MISSING GRIP (Cranes & Rigs) ---
        {
            name: "Phoenix Crane",
            slug: "phoenix-crane",
            brand: "Generic",
            category_slug: "grip",
            description_en: "Large hybrid platform/remote crane. Very stable.",
            description_fr: "Grande grue hybride plateforme/télécommande. Très stable.",
            specs: { "type": "Crane", "operator_required": "2-3" },
            daily_rate: 1000,
            image_urls: ["https://www.tsf.fr/wp-content/uploads/2017/12/G-PH-1-0.png"]
        },
        {
            name: "Panther Pegasus Crane",
            slug: "panther-pegasus",
            brand: "Panther",
            category_slug: "grip",
            description_en: "Modular crane made of steel and aluminum. Weather resistant.",
            description_fr: "Grue modulaire en acier et aluminium. Résistant aux intempéries.",
            specs: { "type": "Crane", "build": "Modular" },
            daily_rate: 800,
            image_urls: ["https://mundocrane.com/wp-content/uploads/2020/03/pegasus-2-mundo-crane.jpg"]
        },
        {
            name: "ABC 120 Lightweight Crane",
            slug: "abc-120-crane",
            brand: "MovieTech",
            category_slug: "grip",
            description_en: "Lightweight true allrounder. Setup lengths: 9m, 10.5m, 12m.",
            description_fr: "Grue légère polyvalente. Longueurs: 9m, 10.5m, 12m.",
            specs: { "type": "Crane", "length": "12m Max" },
            daily_rate: 600,
            image_urls: ["https://www.movietech.de/wp-content/uploads/2024/04/MovieTech-ABC-Crane-120-9m-Lightweight-Broadcast-Crane-650x650-1.jpg"]
        },
        {
            name: "Gizmo Jib",
            slug: "gizmo-jib",
            brand: "MovieTech",
            category_slug: "grip",
            description_en: "Modular camera jib system. Extendable front segment.",
            description_fr: "Système de jib de caméra modulaire. Segment avant extensible.",
            specs: { "type": "Jib", "range": "S to XXL" },
            daily_rate: 300,
            image_urls: ["https://www.movietech.de/wp-content/uploads/2023/11/1301-03_Gizmo-Jib-Version-L-Ohne-Hintergrund_650x650px.jpg"]
        },
        {
            name: "Panther Lightweight Jib",
            slug: "panther-lightweight-jib",
            brand: "Panther",
            category_slug: "grip",
            description_en: "Universal jib arm. Mounts on all Panther dollies.",
            description_fr: "Bras de jib universel. Se monte sur toutes les dollies Panther.",
            specs: { "type": "Jib", "mount": "Dolly" },
            daily_rate: 250,
            image_urls: ["https://utopiacam.com/wp-content/uploads/2016/10/lighweightjib_title.jpg"]
        },
        {
            name: "Panther Boogie Wheels",
            slug: "panther-boogie-wheels",
            brand: "Panther",
            category_slug: "grip",
            description_en: "Keeps dolly steady on straight or curved tracks.",
            description_fr: "Maintient la dolly stable sur des rails droits ou courbes.",
            specs: { "type": "Dolly Accessory" },
            daily_rate: 80,
            image_urls: ["https://fookuspookus.ee/wp-content/uploads/2023/08/boogie-wheels-1.jpg"]
        },
        {
            name: "MultiTower Scaffolding",
            slug: "multitower-scaffolding",
            brand: "Generic",
            category_slug: "grip",
            description_en: "Mobile scaffolding solution for safe and quick assembly.",
            description_fr: "Solution d'échafaudage mobile pour un montage sûr et rapide.",
            specs: { "type": "Rigging", "height": "Max 13.2m" },
            daily_rate: 100,
            image_urls: ["https://cdn.djust-app.com/img/0000000034_ve/product/1493423/98195275_1d803712e87d414b81a5a34653667cd5?width=329&height=329&format=webp&fit=contain"]
        },
        {
            name: "System Low Rig / Gas Riser",
            slug: "low-rig-riser",
            brand: "Panther",
            category_slug: "grip",
            description_en: "Includes Low Rig Snake Bracket and Gas Riser for low angles and height adjustment.",
            description_fr: "Comprend le support Low Rig et le Gas Riser pour les angles bas.",
            specs: { "type": "Rigging Accessory" },
            daily_rate: 100,
            image_urls: ["https://www.movietech.de/wp-content/uploads/2023/12/2005-3500Set-Syszem-Low-rig-new-turntsile-650x650-1.jpg"]
        },
        {
            name: "Barracuda Bar",
            slug: "barracuda-bar",
            brand: "Generic",
            category_slug: "grip",
            description_en: "Aluminum crossbars to hold spotlights without tripods.",
            description_fr: "Traverses en aluminium pour maintenir les projecteurs sans trépieds.",
            specs: { "type": "Rigging" },
            daily_rate: 40,
            image_urls: ["https://turtlemaxlocation.com/wp-content/uploads/2019/02/jeu-de-barres-scaled.jpg"]
        }
    ];

    // Helper
    const fetchImage = (url) => {
        try {
            const res = $http.send({ url: url, method: "GET", timeout: 30 });
            if (res.statusCode === 200) {
                const filename = url.split('/').pop().split('?')[0] || `image_${Date.now()}.jpg`;
                return { name: filename, type: res.headers['Content-Type'] || "image/jpeg", content: res.raw };
            }
        } catch (e) { }
        return null;
    };

    // 2. Ensure Categories Exist
    const ensureCategory = (slug) => {
        try {
            return app.findFirstRecordByFilter("categories", `slug="${slug}"`);
        } catch (e) {
            // Should exist from previous scripts, fallback just in case
            return app.findFirstRecordByFilter("categories", 'slug="cameras"');
        }
    };

    const categories = {
        "lenses": ensureCategory("lenses"),
        "monitors": ensureCategory("monitors"),
        "wireless-video": ensureCategory("wireless-video"),
        "stabilizers": ensureCategory("stabilizers"),
        "lighting": ensureCategory("lighting"),
        "grip": ensureCategory("grip")
    };

    const equipmentCollection = app.findCollectionByNameOrId("equipment");

    // 3. Process Items
    missingEquipment.forEach(item => {
        try {
            const existing = app.findFirstRecordByFilter("equipment", `slug="${item.slug}"`);
            if (existing) app.delete(existing);
        } catch (e) { }

        console.log(`Creating missing equipment: ${item.name}`);
        const record = new Record(equipmentCollection);

        record.set("name", item.name);
        record.set("name_en", item.name);
        record.set("name_fr", item.description_fr ? item.name : item.name);
        record.set("slug", item.slug);
        record.set("brand", item.brand);
        record.set("category", categories[item.category_slug]?.id);

        record.set("description_en", item.description_en);
        record.set("description_fr", item.description_fr);
        record.set("specs", item.specs);
        record.set("specs_en", item.specs);
        record.set("specs_fr", item.specs);

        record.set("daily_rate", item.daily_rate);
        record.set("stock", 2);
        record.set("stock_available", 2);
        record.set("visibility", true);

        // Specific types
        if (item.category_slug === 'lenses') record.set("type", item.name.includes("Zoom") ? "Zoom" : "Prime");
        if (item.category_slug === 'lighting') record.set("type", "LED"); // Most here are LED/Tungsten

        if (item.image_urls && item.image_urls.length > 0) {
            const mainImg = fetchImage(item.image_urls[0]);
            if (mainImg) {
                // record.set("image", mainImg); 
            }
        }

        app.save(record);
    });

}, (app) => {
    // Rollback logic
});