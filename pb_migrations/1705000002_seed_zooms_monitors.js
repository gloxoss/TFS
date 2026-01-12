/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {

    // 1. Data Definitions
    const equipmentData = [
        // --- ZOOM LENSES ---
        {
            name: "ARRI 9.5-18mm T2.9 Ultra Wide Zoom",
            slug: "arri-uwz-9.5-18mm",
            brand: "ARRI",
            category_slug: "lenses",
            description_en: "The 9.5-18mm T2.9 Ultra Wide Zoom Lens from ARRI delivers optimal image quality, suiting it for plate shots and VFX applications. Covers Open Gate.",
            description_fr: "L'objectif zoom ultra grand angle ARRI 9.5-18mm T2.9 offre une qualité d'image optimale, idéale pour les plans larges et les effets visuels.",
            specs: {
                "mount": "PL",
                "aperture": "T2.9",
                "range": "9.5mm - 18mm",
                "coverage": "Open Gate (34.5mm)"
            },
            daily_rate: 800,
            image_urls: ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_k2_0001686_uwz_9_5_18mm_t2_9_f_1499174765_1287811.jpg"]
        },
        {
            name: "ARRI Alura 45-250mm T2.6 Studio Zoom",
            slug: "arri-alura-45-250mm",
            brand: "ARRI",
            category_slug: "lenses",
            description_en: "The ARRI/Fujinon 45-250mm Alura Studio Zoom features a fast T2.6 aperture throughout its zoom range and cine-style lens ergonomics.",
            description_fr: "Le zoom studio ARRI/Fujinon 45-250mm Alura dispose d'une ouverture rapide T2.6 sur toute sa plage de zoom et d'une ergonomie cinéma.",
            specs: {
                "mount": "PL",
                "aperture": "T2.6",
                "range": "45mm - 250mm",
                "coverage": "Super 35"
            },
            daily_rate: 650,
            image_urls: ["https://static.bhphoto.com/images/images750x750/1487692047_1287817.jpg"]
        },
        {
            name: "ARRI Alura 18-80mm T2.6 Studio Zoom",
            slug: "arri-alura-18-80mm",
            brand: "ARRI",
            category_slug: "lenses",
            description_en: "ARRI Alura 18–80mm T2.6 F Wide-Angle Studio Zoom offers a versatile focal range with a constant T2.6 aperture. Designed to match ARRI prime lenses.",
            description_fr: "Le zoom studio grand angle ARRI Alura 18–80mm T2.6 offre une plage focale polyvalente avec une ouverture constante T2.6.",
            specs: {
                "mount": "PL",
                "aperture": "T2.6",
                "range": "18mm - 80mm",
                "coverage": "Super 35"
            },
            daily_rate: 650,
            image_urls: ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_k2_47931_0_alura_18_80mm_t2_6_wide_angle_1487692047_1287816.jpg"]
        },
        {
            name: "Fujinon ZK19-90mm T2.9 Cabrio",
            slug: "fujinon-cabrio-19-90mm",
            brand: "Fujinon",
            category_slug: "lenses",
            description_en: "The Fujinon ZK19-90mm T2.9 Cabrio Lens features a detachable servo drive unit, making it suitable for both cine and ENG-style shooting.",
            description_fr: "L'objectif Fujinon ZK19-90mm T2.9 Cabrio dispose d'une unité de commande servo détachable, ce qui le rend adapté aux tournages cinéma et ENG.",
            specs: {
                "mount": "PL",
                "aperture": "T2.9",
                "range": "19mm - 90mm",
                "features": "Detachable Servo"
            },
            daily_rate: 550,
            image_urls: ["https://static.bhphoto.com/images/multiple_images/images500x500/1498824105_IMG_823618.jpg"]
        },
        {
            name: "Fujinon ZK85-300mm T2.9-4.0 Cabrio",
            slug: "fujinon-cabrio-85-300mm",
            brand: "Fujinon",
            category_slug: "lenses",
            description_en: "Lightweight telephoto zoom for Super35. Features detachable servo unit. Aperture ramps from T2.9 to T4.0 at the long end.",
            description_fr: "Zoom téléobjectif léger pour Super35. Dispose d'une unité servo détachable. L'ouverture passe de T2.9 à T4.0 à fond de zoom.",
            specs: {
                "mount": "PL",
                "aperture": "T2.9 - T4.0",
                "range": "85mm - 300mm",
                "features": "Detachable Servo"
            },
            daily_rate: 600,
            image_urls: ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/fujinon_zk3_5x85_saf_85_300mm_cabrio_lens_1684943711_1733118.jpg"]
        },
        {
            name: "Fujinon XK20-120mm T3.5 Cabrio",
            slug: "fujinon-cabrio-20-120mm",
            brand: "Fujinon",
            category_slug: "lenses",
            description_en: "Wide-to-telephoto zoom lens for Super35 cameras. Features standard 0.8 Mod gears. Servo unit sold separately (Lens Only version).",
            description_fr: "Zoom grand angle à téléobjectif pour caméras Super35. Engrenages standard 0.8 Mod. Unité servo vendue séparément.",
            specs: {
                "mount": "PL",
                "aperture": "T3.5",
                "range": "20mm - 120mm",
                "coverage": "Super 35"
            },
            daily_rate: 450,
            image_urls: ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/fujinon_xk6x20_nm_xk6x20_20_120_pl_mount_1488383209_1322733.jpg"]
        },
        {
            name: "Canon CN-E 15.5-47mm T2.8 L SP",
            slug: "canon-cne-15.5-47mm",
            brand: "Canon",
            category_slug: "lenses",
            description_en: "Wide-angle cinema zoom designed for 4K production. Compact and lightweight, covering Super 35mm sensors.",
            description_fr: "Zoom cinéma grand angle conçu pour la production 4K. Compact et léger, couvrant les capteurs Super 35mm.",
            specs: {
                "mount": "PL",
                "aperture": "T2.8",
                "range": "15.5mm - 47mm",
                "coverage": "Super 35"
            },
            daily_rate: 350,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1346318521_889818.jpg"]
        },
        {
            name: "Canon Cine-Servo 17-120mm T2.95",
            slug: "canon-cine-servo-17-120mm",
            brand: "Canon",
            category_slug: "lenses",
            description_en: "Combines broadcast servo functionality with cinema optics. Ideal for documentary and broadcast use.",
            description_fr: "Combine la fonctionnalité servo broadcast avec l'optique cinéma. Idéal pour le documentaire et la diffusion.",
            specs: {
                "mount": "PL / EF",
                "aperture": "T2.95-3.9",
                "range": "17mm - 120mm",
                "features": "Servo Grip"
            },
            daily_rate: 500,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1717598768_1833736.jpg"]
        },
        {
            name: "Angenieux Optimo Style 30-76mm",
            slug: "angenieux-optimo-style-30-76mm",
            brand: "Angenieux",
            category_slug: "lenses",
            description_en: "Lightweight compact zoom offering 4K+ resolution. Matches Optimo DP series. 2.5x zoom range.",
            description_fr: "Zoom compact léger offrant une résolution 4K+. Correspond à la série Optimo DP. Plage de zoom 2.5x.",
            specs: {
                "mount": "PL",
                "aperture": "T2.8",
                "range": "30mm - 76mm",
                "weight": "Lightweight"
            },
            daily_rate: 450,
            image_urls: ["https://www.bhphotovideo.com/images/fb/angenieux_optimo_30_76_style_optimo_style_30_76mm_zoom_1365593.jpg"]
        },
        {
            name: "Angenieux Optimo Style 16-40mm",
            slug: "angenieux-optimo-style-16-40mm",
            brand: "Angenieux",
            category_slug: "lenses",
            description_en: "Wide angle lightweight zoom. Perfect companion to the 30-76mm. Internal focus and no breathing.",
            description_fr: "Zoom grand angle léger. Compagnon idéal du 30-76mm. Mise au point interne et pas de pompage.",
            specs: {
                "mount": "PL",
                "aperture": "T2.8",
                "range": "16mm - 40mm",
                "weight": "Lightweight"
            },
            daily_rate: 450,
            image_urls: ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/angenieux_16_40_optimo_16_to_40mm_optimo_1419417309_1107020.jpg"]
        },
        {
            name: "Sigma 50-100mm T2 High-Speed Zoom",
            slug: "sigma-50-100mm-t2",
            brand: "Sigma",
            category_slug: "lenses",
            description_en: "High speed T2 zoom lens covering Super 35 sensors. Outstanding sharpness and compact form factor.",
            description_fr: "Objectif zoom haute vitesse T2 couvrant les capteurs Super 35. Netteté exceptionnelle et format compact.",
            specs: {
                "mount": "PL",
                "aperture": "T2.0",
                "range": "50mm - 100mm",
                "coverage": "Super 35"
            },
            daily_rate: 200,
            image_urls: ["https://www.bhphotovideo.com/images/fb/sigma_693968_sigma_50_100mm_t2_for_1327932.jpg"]
        },

        // --- MATTE BOXES ---
        {
            name: "ARRI LMB 4x5 Pro Set",
            slug: "arri-lmb-4x5",
            brand: "ARRI",
            category_slug: "matte-boxes",
            description_en: "Modular lightweight matte box. Includes 15mm LWS console, rotating filter stages, and various trays. Can be clip-on or rod mounted.",
            description_fr: "Matte box modulaire légère. Comprend une console LWS 15mm, des étages de filtres rotatifs et divers plateaux. Montage sur tiges ou clip-on.",
            specs: {
                "stages": "3 (Rotatable)",
                "rod_support": "15mm LWS",
                "type": "Clip-on / Rod",
                "filters": "4x5.65 / 4x4"
            },
            daily_rate: 150,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1496676931_1341045.jpg"]
        },
        {
            name: "ARRI LMB-25 Set",
            slug: "arri-lmb-25",
            brand: "ARRI",
            category_slug: "matte-boxes",
            description_en: "Lightweight, modular matte box designed for professional cine applications. Supports up to three 4x5.65 filter stages.",
            description_fr: "Matte box modulaire légère conçue pour les applications cinéma professionnelles. Supporte jusqu'à trois étages de filtres 4x5.65.",
            specs: {
                "stages": "3",
                "filters": "4x5.65",
                "type": "Clip-on / Rod"
            },
            daily_rate: 120,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1488196247_1288790.jpg"]
        },
        {
            name: "ARRI MB-28 6x6 Production Matte Box",
            slug: "arri-mb-28",
            brand: "ARRI",
            category_slug: "matte-boxes",
            description_en: "Swing-away matte box for 6.6x6.6 filters. Mounted with 19mm bracket. Ideal for large wide-angle zooms.",
            description_fr: "Matte box swing-away pour filtres 6.6x6.6. Montée avec support 19mm. Idéale pour les grands zooms grand angle.",
            specs: {
                "stages": "3",
                "filters": "6.6x6.6",
                "rod_support": "19mm Studio",
                "feature": "Swing-away"
            },
            daily_rate: 180,
            image_urls: ["https://vmi.tv/wp-content/uploads/sites/3/2019/03/ARRI-MB28-Matte-Box-3-2.jpg"]
        },
        {
            name: "ARRI MMB-2 LWS Set",
            slug: "arri-mmb-2",
            brand: "ARRI",
            category_slug: "matte-boxes",
            description_en: "Compact matte box with 15mm LWS rod bracket. Fits most lenses with 114mm front diameter.",
            description_fr: "Matte box compacte avec support de tiges LWS 15mm. S'adapte à la plupart des objectifs de 114mm de diamètre frontal.",
            specs: {
                "stages": "2",
                "filters": "4x5.65 / 4x4",
                "rod_support": "15mm LWS"
            },
            daily_rate: 80,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1533910662_1220658.jpg"]
        },
        {
            name: "Chrosziel 450-R11",
            slug: "chrosziel-450-r11",
            brand: "Chrosziel",
            category_slug: "matte-boxes",
            description_en: "Fits 15mm rods. Includes rotating filter stage for 4x4 or 4x5.65 filters. Ideal for compact camcorders and DSLR rigs.",
            description_fr: "S'adapte aux tiges de 15mm. Comprend un étage de filtre rotatif pour filtres 4x4 ou 4x5.65.",
            specs: {
                "stages": "2",
                "filters": "4x5.65 / 4x4",
                "rod_support": "15mm LWS"
            },
            daily_rate: 60,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1346675010_889174.jpg"]
        },

        // --- MONITORS ---
        {
            name: "SmallHD ULTRA 7 Bolt 6 RX 750",
            slug: "smallhd-ultra-7-bolt",
            brand: "SmallHD",
            category_slug: "monitors",
            description_en: "Ultra-bright 7-inch monitor with integrated Bolt 6 Receiver. 2300 nits brightness. V-Mount battery plate.",
            description_fr: "Moniteur ultra-lumineux de 7 pouces avec récepteur Bolt 6 intégré. Luminosité de 2300 nits. Plaque de batterie V-Mount.",
            specs: {
                "screen_size": "7 inch",
                "resolution": "1920 x 1080",
                "brightness": "2300 nits",
                "wireless": "Bolt 6 RX Built-in"
            },
            daily_rate: 350,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1715266825_1806333.jpg"]
        },
        {
            name: "SmallHD ULTRA 7",
            slug: "smallhd-ultra-7",
            brand: "SmallHD",
            category_slug: "monitors",
            description_en: "Ultrabright 2300 nit 7-inch touchscreen monitor. Camera control capable for ARRI, Sony, RED.",
            description_fr: "Moniteur tactile ultra-lumineux de 2300 nits et 7 pouces. Capable de contrôler les caméras ARRI, Sony, RED.",
            specs: {
                "screen_size": "7 inch",
                "resolution": "1920 x 1200",
                "brightness": "2300 nits",
                "touch": "Yes"
            },
            daily_rate: 250,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1731335130_1795838.jpg"]
        },
        {
            name: "SmallHD 703 Bolt Wireless",
            slug: "smallhd-703-bolt",
            brand: "SmallHD",
            category_slug: "monitors",
            description_en: "All-in-one director's monitor with built-in Teradek receiver (Sidekick equivalent). 3000 nit daylight viewable display.",
            description_fr: "Moniteur réalisateur tout-en-un avec récepteur Teradek intégré. Écran visible en plein jour de 3000 nits.",
            specs: {
                "screen_size": "7 inch",
                "brightness": "3000 nits",
                "wireless": "Built-in Receiver",
                "compatibility": "Bolt 500/1000/3000"
            },
            daily_rate: 300,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1515023115_1380051.jpg"]
        },
        {
            name: "SmallHD Cine 7 RED RCP2",
            slug: "smallhd-cine-7-red",
            brand: "SmallHD",
            category_slug: "monitors",
            description_en: "Professional monitoring for KOMODO or RED DSMC3. Includes camera control software.",
            description_fr: "Monitoring professionnel pour KOMODO ou RED DSMC3. Inclut le logiciel de contrôle de caméra.",
            specs: {
                "screen_size": "7 inch",
                "resolution": "1920 x 1200",
                "brightness": "1800 nits",
                "control": "RED RCP2"
            },
            daily_rate: 220,
            image_urls: ["https://static.bhphoto.com/images/multiple_images/images500x500/1640703758_IMG_1667808.jpg"]
        },
        {
            name: "TVLogic VFM-055A OLED",
            slug: "tvlogic-vfm-055a",
            brand: "TVLogic",
            category_slug: "monitors",
            description_en: "5.5-inch OLED display delivering deep blacks and accurate color reproduction. Waveform, vectorscope, focus assist.",
            description_fr: "Écran OLED de 5,5 pouces offrant des noirs profonds et une reproduction précise des couleurs. Waveform, vectorscope, aide à la mise au point.",
            specs: {
                "screen_size": "5.5 inch",
                "panel": "OLED",
                "resolution": "1920 x 1080",
                "inputs": "3G-SDI / HDMI"
            },
            daily_rate: 150,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1505816473_1362534.jpg"]
        },
        {
            name: "Sony PVMA170 17\" OLED",
            slug: "sony-pvma170",
            brand: "Sony",
            category_slug: "monitors",
            description_en: "17-inch Professional TRIMASTER EL OLED monitor. Ideal for critical evaluation in field or studio.",
            description_fr: "Moniteur professionnel TRIMASTER EL OLED de 17 pouces. Idéal pour l'évaluation critique sur le terrain ou en studio.",
            specs: {
                "screen_size": "17 inch",
                "panel": "OLED",
                "resolution": "1920 x 1080",
                "grade": "Reference"
            },
            daily_rate: 300,
            image_urls: ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/sony_pvm_a170b_pvm_a170_17_pro_oled_1490022375_1320839.jpg"]
        },
        {
            name: "Sony BVM-E251 24\" OLED",
            slug: "sony-bvm-e251",
            brand: "Sony",
            category_slug: "monitors",
            description_en: "Master Monitor 24-inch TRIMASTER EL OLED. The industry standard for color grading and critical viewing.",
            description_fr: "Moniteur Master TRIMASTER EL OLED de 24 pouces. Le standard de l'industrie pour l'étalonnage et le visionnage critique.",
            specs: {
                "screen_size": "24 inch",
                "panel": "OLED",
                "resolution": "1920 x 1080",
                "grade": "Master Reference"
            },
            daily_rate: 500,
            image_urls: ["https://www.sony.com/image/3f6290bc8a31d7cf13236376d5e855dc?fmt=jpeg&wid=558&hei=336"]
        },
        {
            name: "Blackmagic Video Assist 7\" 12G HDR",
            slug: "blackmagic-video-assist-7-12g",
            brand: "Blackmagic Design",
            category_slug: "monitors",
            description_en: "7-inch HDR Recording Monitor. Records Blackmagic RAW from supported cameras. 2500 nits brightness.",
            description_fr: "Moniteur enregistreur HDR de 7 pouces. Enregistre en Blackmagic RAW à partir de caméras prises en charge. Luminosité de 2500 nits.",
            specs: {
                "screen_size": "7 inch",
                "brightness": "2500 nits",
                "recording": "ProRes / DNx / BRAW",
                "inputs": "12G-SDI / HDMI"
            },
            daily_rate: 150,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1568713006_1507213.jpg"]
        },
        {
            name: "Atomos Shogun 7 HDR",
            slug: "atomos-shogun-7",
            brand: "Atomos",
            category_slug: "monitors",
            description_en: "7-inch HDR Monitor-Recorder-Switcher. 3000 nits brightness. Records ProRes RAW.",
            description_fr: "Moniteur-enregistreur-mélangeur HDR de 7 pouces. Luminosité de 3000 nits. Enregistre en ProRes RAW.",
            specs: {
                "screen_size": "7 inch",
                "brightness": "3000 nits",
                "recording": "ProRes RAW",
                "inputs": "SDI / HDMI"
            },
            daily_rate: 180,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1727171715_1854463.jpg"]
        }
    ];

    // Helper to download images from URL
    const fetchImage = (url) => {
        try {
            const res = $http.send({
                url: url,
                method: "GET",
                timeout: 30
            });
            if (res.statusCode === 200) {
                const filename = url.split('/').pop().split('?')[0] || `image_${Date.now()}.jpg`;
                return {
                    name: filename,
                    type: res.headers['Content-Type'] || "image/jpeg",
                    content: res.raw
                };
            }
        } catch (e) {
            console.log(`Failed to fetch image ${url}: ${e}`);
        }
        return null;
    };

    // 2. Ensure Categories Exist
    const ensureCategory = (slug, name, nameFr) => {
        try {
            return app.findFirstRecordByFilter("categories", `slug="${slug}"`);
        } catch (e) {
            console.log(`Creating Category: ${name}`);
            const cat = new Record(app.findCollectionByNameOrId("categories"));
            cat.set("slug", slug);
            cat.set("name", name);
            cat.set("name_en", name);
            cat.set("name_fr", nameFr);
            app.save(cat);
            return cat;
        }
    };

    const categories = {
        "lenses": ensureCategory("lenses", "Lenses", "Objectifs"),
        "matte-boxes": ensureCategory("matte-boxes", "Matte Boxes", "Matte Boxes"),
        "monitors": ensureCategory("monitors", "Monitors", "Moniteurs")
    };

    const equipmentCollection = app.findCollectionByNameOrId("equipment");

    // 3. Process Items
    equipmentData.forEach(item => {
        // A. Clean existing
        try {
            const existing = app.findFirstRecordByFilter("equipment", `slug="${item.slug}"`);
            if (existing) {
                app.delete(existing);
            }
        } catch (e) { }

        console.log(`Creating equipment: ${item.name}`);
        const record = new Record(equipmentCollection);

        // Core
        record.set("name", item.name);
        record.set("name_en", item.name);
        record.set("name_fr", item.description_fr ? item.name : item.name);
        record.set("slug", item.slug);
        record.set("brand", item.brand);
        record.set("category", categories[item.category_slug].id);

        // Description
        record.set("description_en", item.description_en);
        record.set("description_fr", item.description_fr);

        // Specs & Details
        record.set("specs", item.specs);
        record.set("specs_en", item.specs);
        record.set("specs_fr", item.specs);

        record.set("daily_rate", item.daily_rate);
        record.set("stock", 2);
        record.set("stock_available", 2);
        record.set("visibility", true);

        // Set type for filters if needed
        if (item.category_slug === 'lenses') {
            record.set("type", "Zoom");
        }

        // Images
        if (item.image_urls && item.image_urls.length > 0) {
            const mainImg = fetchImage(item.image_urls[0]);
            if (mainImg) {
                // record.set("image", mainImg); 
            }
        }

        app.save(record);
    });

}, (app) => {
    // Rollback logic would go here (delete by slug)
});