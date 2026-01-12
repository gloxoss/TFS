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

    // Helper to find category ID
    const getCategoryId = (slug) => {
        try {
            return app.findFirstRecordByFilter("categories", `slug="${slug}"`).id;
        } catch (e) {
            // Fallback
            return app.findFirstRecordByFilter("categories", 'slug="cameras"').id;
        }
    };

    const catMonitors = getCategoryId("monitors");
    const catLenses = getCategoryId("lenses");

    const newItems = [
        // --- MONITORS ---
        {
            name: "SmallHD CINE 5 Touchscreen",
            slug: "smallhd-cine-5",
            brand: "SmallHD",
            category: catMonitors,
            description_en: "Sharp 5-inch touchscreen monitor suitable for indoor/outdoor. 2000 nits brightness. Cross conversion supported.",
            description_fr: "Moniteur tactile net de 5 pouces adapté à l'intérieur/extérieur. Luminosité de 2000 nits. Conversion croisée prise en charge.",
            specs: { "size": "5 inch", "brightness": "2000 nits", "inputs": "3G-SDI / HDMI" },
            daily_rate: 150,
            image_urls: ["https://static.bhphoto.com/images/multiple_images/images500x500/1662682690_IMG_1834568.jpg"]
        },
        {
            name: "SWIT S-1051H 5\" HD-SDI/HDMI",
            slug: "swit-s1051h",
            brand: "SWIT",
            category: catMonitors,
            description_en: "Compact 5-inch monitor with RGB backlight LED panel. Supports 2K/3G/HD/SD-SDI and HDMI.",
            description_fr: "Moniteur compact de 5 pouces avec panneau LED rétroéclairé RGB. Prend en charge 2K/3G/HD/SD-SDI et HDMI.",
            specs: { "size": "5 inch", "resolution": "800x480", "inputs": "SDI / HDMI" },
            daily_rate: 80,
            image_urls: ["https://static.bhphoto.com/images/multiple_images/images500x500/1452426413_IMG_573410.jpg"]
        },
        {
            name: "RUIGE TL-701HDA",
            slug: "ruige-tl-701hda",
            brand: "RUIGE",
            category: catMonitors,
            description_en: "High-resolution, wide-viewing angle 7-inch LCD monitor. Widely used in film and field productions.",
            description_fr: "Moniteur LCD 7 pouces haute résolution à grand angle de vue. Largement utilisé dans les productions cinématographiques.",
            specs: { "size": "7 inch", "resolution": "1024x600", "inputs": "HDMI / SDI" },
            daily_rate: 70,
            image_urls: ["https://en.ruige.com/wp-content/uploads/2022/02/index01-2.jpg"]
        },
        {
            name: "Lilliput FS7 7\" 4K Monitor",
            slug: "lilliput-fs7",
            brand: "Lilliput",
            category: catMonitors,
            description_en: "High-contrast 7-inch monitor with native 1920x1200 resolution. Supports 4K input via HDMI.",
            description_fr: "Moniteur 7 pouces à contraste élevé avec résolution native 1920x1200. Prend en charge l'entrée 4K via HDMI.",
            specs: { "size": "7 inch", "resolution": "1920x1200", "brightness": "500 nits" },
            daily_rate: 90,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1576780570_1412531.jpg"]
        },
        {
            name: "TVLogic F-7HS High Luminance",
            slug: "tvlogic-f7hs",
            brand: "TVLogic",
            category: catMonitors,
            description_en: "7-inch Full HD Field Monitor with Max Brightness of 1800 nits. Enhanced sharpness and peaking.",
            description_fr: "Moniteur de terrain Full HD de 7 pouces avec une luminosité maximale de 1800 nits. Netteté et peaking améliorés.",
            specs: { "size": "7 inch", "brightness": "1800 nits", "resolution": "1920x1080" },
            daily_rate: 180,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1670343919_1737073.jpg"]
        },
        {
            name: "SmallHD 702 Bright Black Edition",
            slug: "smallhd-702-bright",
            brand: "SmallHD",
            category: catMonitors,
            description_en: "Daylight viewable 7-inch monitor with 1000 nits brightness and Full HD 1080p display.",
            description_fr: "Moniteur 7 pouces visible en plein jour avec une luminosité de 1000 nits et un affichage Full HD 1080p.",
            specs: { "size": "7 inch", "brightness": "1000 nits", "resolution": "1920x1080" },
            daily_rate: 160,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1517313952_1387386.jpg"]
        },
        {
            name: "SmallHD DP6-SDI 5.6\"",
            slug: "smallhd-dp6-sdi",
            brand: "SmallHD",
            category: catMonitors,
            description_en: "Lightweight, hi-res monitor with highly accurate Focus Assist. Accepts HDMI, Component, and HD-SDI.",
            description_fr: "Moniteur léger haute résolution avec assistance à la mise au point très précise. Accepte HDMI, Composante et HD-SDI.",
            specs: { "size": "5.6 inch", "resolution": "1280x800", "inputs": "SDI / HDMI" },
            daily_rate: 60,
            image_urls: ["https://www.talamas.com/sites/default/files/styles/large/public/smallhd-dp6-sdi-56-inch-monitor.jpg?itok=e8rBnTkR"]
        },

        // --- LENSES ---
        {
            name: "Fujinon ZK25-300mm T3.5 Cabrio",
            slug: "fujinon-cabrio-25-300mm",
            brand: "Fujinon",
            category: catLenses,
            description_en: "12x zoom for Super35. PL Mount. Constant T3.5 aperture from 25-273mm.",
            description_fr: "Zoom 12x pour Super35. Monture PL. Ouverture constante T3.5 de 25 à 273mm.",
            specs: { "mount": "PL", "range": "25-300mm", "aperture": "T3.5 - T3.85" },
            daily_rate: 700,
            type: "Zoom",
            image_urls: ["https://static.bhphoto.com/images/images500x500/1623843470_1055313.jpg"]
        },
        {
            name: "Tokina Cinema AT-X 50-135mm T3.0",
            slug: "tokina-50-135mm",
            brand: "Tokina",
            category: catLenses,
            description_en: "Highly versatile zoom range in a compact design. Parfocal, reduced breathing.",
            description_fr: "Plage de zoom très polyvalente dans un design compact. Parfocal, respiration réduite.",
            specs: { "mount": "EF / PL", "range": "50-135mm", "aperture": "T3.0" },
            daily_rate: 200,
            type: "Zoom",
            image_urls: ["https://www.cathayphoto.com.sg/_next/image?url=https%3A%2F%2Fassets.cathayphoto.com.sg%2Fproduct%2Ftok-50-135-t3-cinema-_ef_.jpg&w=1920&q=75"]
        },
        {
            name: "Laowa 24mm T14 2x PeriProbe",
            slug: "laowa-24mm-periprobe",
            brand: "Venus Optics",
            category: catLenses,
            description_en: "Periscope-style probe lens with interchangeable ends (90° and Straight). 2x Macro magnification.",
            description_fr: "Objectif sonde de style périscope avec embouts interchangeables. Grossissement Macro 2x.",
            specs: { "mount": "PL", "focal_length": "24mm", "aperture": "T14", "feature": "Probe / Macro" },
            daily_rate: 180,
            type: "Specialty",
            image_urls: ["https://static.bhphoto.com/images/images500x500/1654688136_1710457.jpg"]
        },
        {
            name: "Canon EJ 6mm T1.5 (B4)",
            slug: "canon-ej-6mm",
            brand: "Canon",
            category: catLenses,
            description_en: "Ultra-wide professional broadcast lens. Fast T1.5 aperture. B4 Mount.",
            description_fr: "Objectif de diffusion professionnel ultra-large. Ouverture rapide T1.5. Monture B4.",
            specs: { "mount": "B4", "focal_length": "6mm", "aperture": "T1.5" },
            daily_rate: 150,
            type: "Prime",
            image_urls: ["https://media.exapro.com/product/2024/04/P240402264/595c32aab03f5ff7ce3717a00a678cc0/462x340/canon-ej-t15-p240402264_2.jpg"]
        },
        {
            name: "Canon EF 100mm f/2.8L Macro IS USM",
            slug: "canon-ef-100mm-macro",
            brand: "Canon",
            category: catLenses,
            description_en: "Mid-telephoto macro lens with Hybrid Image Stabilization. Life-size 1:1 magnification.",
            description_fr: "Téléobjectif macro moyen avec stabilisation d'image hybride. Grossissement 1:1.",
            specs: { "mount": "Canon EF", "focal_length": "100mm", "aperture": "f/2.8", "feature": "Macro / IS" },
            daily_rate: 60,
            type: "Prime",
            image_urls: ["https://mpex.com/_ipx/f_webp,b_%23fff,fit_contain,s_500x500/https://mpex.com/pub/media/catalog/product/cache/2264c9e38777ed202d5c3170a063a3cf/i/m/image_6230_4.jpg"]
        },
        {
            name: "Canon TS-E 45mm f/2.8 Tilt-Shift",
            slug: "canon-tse-45mm",
            brand: "Canon",
            category: catLenses,
            description_en: "Tilt-shift lens offering complete control over depth of field and perspective.",
            description_fr: "Objectif à bascule et décentrement offrant un contrôle total sur la profondeur de champ et la perspective.",
            specs: { "mount": "Canon EF", "focal_length": "45mm", "aperture": "f/2.8", "feature": "Tilt-Shift" },
            daily_rate: 70,
            type: "Prime",
            image_urls: ["https://i1.adis.ws/i/canon/2536A019_TS-E_45mm_f2.8_1?w=940&bg=rgb(245,246,246)&fmt=webp&qlt=100&sm=aspect&aspect=1:1"]
        },
        {
            name: "IB/E Optics PLx2 Extender",
            slug: "ibe-plx2-extender",
            brand: "IB/E Optics",
            category: catLenses,
            description_en: "2x Optical Extender for PL mount lenses. Covers large format sensors including Alexa LF/65.",
            description_fr: "Doubleur optique 2x pour objectifs monture PL. Couvre les capteurs grand format.",
            specs: { "mount": "PL", "magnification": "2x", "max_input_aperture": "T1.9" },
            daily_rate: 150,
            type: "Adapter",
            image_urls: ["https://vmi.tv/wp-content/uploads/sites/3/2020/03/IBE-PLx2-Doubler.1.jpg"]
        }
    ];

    newItems.forEach(item => {
        try {
            const existing = app.findFirstRecordByFilter("equipment", `slug="${item.slug}"`);
            app.delete(existing);
        } catch (e) { }

        console.log(`Creating: ${item.name}`);
        const record = new Record(equipmentCollection);

        record.set("name", item.name);
        record.set("name_en", item.name);
        record.set("name_fr", item.description_fr ? item.name : item.name);
        record.set("slug", item.slug);
        record.set("brand", item.brand);
        record.set("category", item.category);

        record.set("description_en", item.description_en);
        record.set("description_fr", item.description_fr);

        record.set("specs", item.specs);
        record.set("specs_en", item.specs);
        record.set("specs_fr", item.specs);

        record.set("daily_rate", item.daily_rate);
        record.set("stock", 2);
        record.set("stock_available", 2);
        record.set("visibility", true);

        if (item.type) {
            record.set("type", item.type);
        }

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