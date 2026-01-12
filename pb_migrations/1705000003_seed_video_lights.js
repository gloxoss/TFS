/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {

    // 1. Data Definitions
    const equipmentData = [
        // --- WIRELESS VIDEO ---
        {
            name: "Teradek Ranger MK II 750",
            slug: "teradek-ranger-mk-ii-750",
            brand: "Teradek",
            category_slug: "wireless-video",
            description_en: "Zero-delay 4K wireless transmission up to 750 ft. Inputs 12G-SDI or HDMI. Redesigned for broadcast and handheld.",
            description_fr: "Transmission sans fil 4K sans délai jusqu'à 750 pieds. Entrées 12G-SDI ou HDMI. Redessiné pour la diffusion et le portable.",
            specs: {
                "range": "750 ft",
                "video": "4K60 HDR",
                "io": "12G-SDI / HDMI",
                "latency": "< 1ms"
            },
            daily_rate: 450,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1705406436_1761089.jpg"]
        },
        {
            name: "Teradek Bolt 6 LT 1500",
            slug: "teradek-bolt-6-lt-1500",
            brand: "Teradek",
            category_slug: "wireless-video",
            description_en: "Transmit and receive lossless HD video up to 1500 ft. Supports new 6 GHz frequency. 4K30 HDR capable.",
            description_fr: "Transmettez et recevez de la vidéo HD sans perte jusqu'à 1500 pieds. Prend en charge la nouvelle fréquence 6 GHz.",
            specs: {
                "range": "1500 ft",
                "frequency": "6 GHz",
                "video": "4K30 HDR",
                "io": "3G-SDI / HDMI"
            },
            daily_rate: 400,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1662681512_1723714.jpg"]
        },
        {
            name: "Teradek Bolt 6 LT 750",
            slug: "teradek-bolt-6-lt-750",
            brand: "Teradek",
            category_slug: "wireless-video",
            description_en: "Transmit and receive lossless HD video up to 750 ft. Supports new 6 GHz frequency. 4K30 HDR capable.",
            description_fr: "Transmettez et recevez de la vidéo HD sans perte jusqu'à 750 pieds. Prend en charge la nouvelle fréquence 6 GHz.",
            specs: {
                "range": "750 ft",
                "frequency": "6 GHz",
                "video": "4K30 HDR",
                "io": "3G-SDI / HDMI"
            },
            daily_rate: 300,
            image_urls: ["https://static.bhphoto.com/images/images750x750/1722001523_1841011.jpg"]
        },
        {
            name: "Teradek Bolt Pro 3000",
            slug: "teradek-bolt-pro-3000",
            brand: "Teradek",
            category_slug: "wireless-video",
            description_en: "Transmit uncompressed 1080p video wirelessly over 3000 feet. < 1ms latency. Multicast capable.",
            description_fr: "Transmettez de la vidéo 1080p non compressée sans fil sur 3000 pieds. Latence < 1ms.",
            specs: {
                "range": "3000 ft",
                "video": "1080p60",
                "io": "3G-SDI / HDMI"
            },
            daily_rate: 500,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1471872050_1273194.jpg"]
        },
        {
            name: "Teradek Bolt Sidekick II",
            slug: "teradek-bolt-sidekick-ii",
            brand: "Teradek",
            category_slug: "wireless-video",
            description_en: "Universal receiver compatible with Bolt 500, 1000, and 3000 transmitters. Lightweight, designed for director's monitors.",
            description_fr: "Récepteur universel compatible avec les émetteurs Bolt 500, 1000 et 3000. Léger, conçu pour les moniteurs de réalisateur.",
            specs: {
                "range": "300 ft",
                "compatibility": "Bolt 500/1000/3000",
                "io": "3G-SDI"
            },
            daily_rate: 150,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1491412879_1328070.jpg"]
        },
        {
            name: "Teradek Bolt 1000 XT",
            slug: "teradek-bolt-1000-xt",
            brand: "Teradek",
            category_slug: "wireless-video",
            description_en: "Zero-latency 1000 ft transmission. Features SDI/HDMI cross conversion and manual frequency selection.",
            description_fr: "Transmission sans latence de 1000 pieds. Dispose d'une conversion croisée SDI/HDMI.",
            specs: {
                "range": "1000 ft",
                "video": "1080p60",
                "io": "3G-SDI / HDMI"
            },
            daily_rate: 350,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1525370855_1403862.jpg"]
        },
        {
            name: "Teradek Bolt 500 XT",
            slug: "teradek-bolt-500-xt",
            brand: "Teradek",
            category_slug: "wireless-video",
            description_en: "Zero-latency 500 ft transmission. Compact and lightweight. SDI/HDMI cross conversion.",
            description_fr: "Transmission sans latence de 500 pieds. Compact et léger.",
            specs: {
                "range": "500 ft",
                "video": "1080p60",
                "io": "3G-SDI / HDMI"
            },
            daily_rate: 250,
            image_urls: ["https://static.bhphoto.com/images/images750x750/1524585083_1403845.jpg"]
        },
        {
            name: "Hollyland Mars 400S PRO II",
            slug: "hollyland-mars-400s-pro-ii",
            brand: "Hollyland",
            category_slug: "wireless-video",
            description_en: "Cost-effective 500ft transmission with extremely low 70ms latency. SDI and HDMI monitoring.",
            description_fr: "Transmission économique de 500 pieds avec une latence extrêmement faible de 70 ms.",
            specs: {
                "range": "500 ft",
                "latency": "70ms",
                "video": "1080p60",
                "io": "SDI / HDMI"
            },
            daily_rate: 100,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1701775224_1797151.jpg"]
        },

        // --- STABILIZERS ---
        {
            name: "DJI Ronin 2 Professional Combo",
            slug: "dji-ronin-2",
            brand: "DJI",
            category_slug: "stabilizers",
            description_en: "High-end 3-axis gimbal for professional cinema cameras. High payload capacity and advanced motor control.",
            description_fr: "Gimbal haut de gamme à 3 axes pour caméras de cinéma professionnelles. Grande capacité de charge.",
            specs: {
                "payload": "30 lbs (13.6kg)",
                "battery": "Dual Battery System",
                "speed": "Up to 75mph"
            },
            daily_rate: 450,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1558517704_1479666.jpg"]
        },
        {
            name: "DJI RS 3 Pro Combo",
            slug: "dji-rs-3-pro",
            brand: "DJI",
            category_slug: "stabilizers",
            description_en: "Professional 3-axis gimbal for mirrorless and compact cinema cameras. Carbon fiber construction.",
            description_fr: "Gimbal professionnel à 3 axes pour appareils sans miroir et caméras compactes.",
            specs: {
                "payload": "10 lbs (4.5kg)",
                "weight": "3.3 lbs",
                "features": "Automated Axis Locks"
            },
            daily_rate: 150,
            image_urls: ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/dji_rs_3_pro_gimbal_1720204160_1797421.jpg"]
        },
        {
            name: "DJI RS 4 Pro Combo",
            slug: "dji-rs-4-pro",
            brand: "DJI",
            category_slug: "stabilizers",
            description_en: "Enhanced efficiency with native vertical shooting. Supports up to 9.9lb payload. Includes Focus Pro Motor.",
            description_fr: "Efficacité améliorée avec prise de vue verticale native. Supporte jusqu'à 4,5 kg de charge.",
            specs: {
                "payload": "9.9 lbs (4.5kg)",
                "features": "Native Vertical, Teflon Coated Arms"
            },
            daily_rate: 180,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1730825421_1816789.jpg"]
        },
        {
            name: "DJI Force Pro",
            slug: "dji-force-pro",
            brand: "DJI",
            category_slug: "stabilizers",
            description_en: "Motion control system for Ronin 2 and Ronin-S. Precisely translates operator movement to gimbal.",
            description_fr: "Système de contrôle de mouvement pour Ronin 2 et Ronin-S. Traduit précisément les mouvements de l'opérateur.",
            specs: {
                "latency": "10ms",
                "range": "1.8 miles",
                "compatibility": "Ronin 2 / S"
            },
            daily_rate: 150,
            image_urls: ["https://store.droneway.ma/wp-content/uploads/2020/11/DJI-Force-Pro.jpg"]
        },

        // --- LIGHTING (Daylight / Tungsten / LED) ---

        // DAYLIGHT (HMI)
        {
            name: "ARRI M18 HMI",
            slug: "arri-m18",
            brand: "ARRI",
            category_slug: "lighting",
            description_en: "1800W Daylight fixture. Lens-less MAX technology combines PAR and Fresnel characteristics. Runs on standard household circuit.",
            description_fr: "Projecteur lumière du jour 1800W. Technologie MAX sans lentille combinant PAR et Fresnel.",
            specs: {
                "type": "HMI / Daylight",
                "power": "1800W / 1200W",
                "mount": "Spigot 28mm"
            },
            daily_rate: 350,
            image_urls: ["https://www.arri.com/resource/image/179162/landscape_ratio1x0_38/1920/737/67ca2a010b4fa77f8129d59c0a4e5ff2/DB594B8F249D9DB4738D3CD846DC1156/m-series-stage.jpg"]
        },
        {
            name: "ARRI M40 HMI",
            slug: "arri-m40",
            brand: "ARRI",
            category_slug: "lighting",
            description_en: "4000W Daylight fixture. Brighter than a 4K PAR, focusable from 18 to 52 degrees.",
            description_fr: "Projecteur lumière du jour 4000W. Plus lumineux qu'un PAR 4K, focalisable de 18 à 52 degrés.",
            specs: {
                "type": "HMI / Daylight",
                "power": "4000W / 2500W",
                "lens": "Open Face / MAX"
            },
            daily_rate: 550,
            image_urls: ["https://www.arri.com/resource/image/179162/landscape_ratio1x0_38/1920/737/67ca2a010b4fa77f8129d59c0a4e5ff2/DB594B8F249D9DB4738D3CD846DC1156/m-series-stage.jpg"]
        },

        // TUNGSTEN
        {
            name: "ARRI Junior 650 Plus",
            slug: "arri-junior-650",
            brand: "ARRI",
            category_slug: "lighting",
            description_en: "Classic tungsten Fresnel spotlight. 650W. Robust and lightweight for location use.",
            description_fr: "Projecteur Fresnel tungstène classique. 650W. Robuste et léger.",
            specs: {
                "type": "Tungsten",
                "power": "650W",
                "lens": "Fresnel"
            },
            daily_rate: 40,
            image_urls: ["https://www.arri.com/resource/image/178532/landscape_ratio1x0_38/1920/737/9abc0a8c3fb59110e6d24c9e910fab4f/17A0DCC72072D62359DEBB1D7F067F67/arri-junior-stage.jpg"]
        },
        {
            name: "ARRI T1 True Blue 1K",
            slug: "arri-t1-true-blue",
            brand: "ARRI",
            category_slug: "lighting",
            description_en: "1000W Tungsten Fresnel. Improved cooling and light output compared to classic series.",
            description_fr: "Fresnel tungstène 1000W. Refroidissement et rendement lumineux améliorés.",
            specs: {
                "type": "Tungsten",
                "power": "1000W",
                "lens": "Fresnel"
            },
            daily_rate: 60,
            image_urls: ["https://www.arri.com/resource/image/33178/landscape_ratio1x0_38/1920/737/7df9692b9699b47a591803a3528e084c/E869D365945DAF18E9F733DA558FC2E3/true-blue-t-series-t1-stage.png"]
        },
        {
            name: "Dino Light 12x1000W (Maxi Brute)",
            slug: "dino-light-12k",
            brand: "Generic",
            category_slug: "lighting",
            description_en: "High-output tungsten fixture with 12x 1000W PAR 64 bulbs. Ideal for large area washes.",
            description_fr: "Projecteur tungstène haute puissance avec 12 ampoules PAR 64 de 1000W.",
            specs: {
                "type": "Tungsten",
                "power": "12,000W (12x1K)",
                "lamps": "PAR 64"
            },
            daily_rate: 250,
            image_urls: ["https://www.spottlight-dortmund.de/wp-content/uploads/2020/03/Dino-Light-12kw.png"]
        },
        {
            name: "ETC Source 4 Profile 750W",
            slug: "etc-source-4-750",
            brand: "ETC",
            category_slug: "lighting",
            description_en: "Ellipsoidal spotlight with crisp beam and pattern projection capabilities. 750W HPL lamp.",
            description_fr: "Projecteur ellipsoïdal avec faisceau net et capacités de projection de motifs.",
            specs: {
                "type": "Tungsten",
                "power": "750W HPL",
                "feature": "Gobo projection"
            },
            daily_rate: 50,
            image_urls: ["https://megavision.com.au/wp-content/uploads/2022/06/ETC-Source-4-750W-Profile-Spotlight.jpg"]
        },

        // LED
        {
            name: "ARRI SkyPanel S60-C",
            slug: "arri-skypanel-s60-c",
            brand: "ARRI",
            category_slug: "lighting",
            description_en: "The standard for LED Softlights. Full RGB+W color gamut with tremendous output. Tunable CCT.",
            description_fr: "La référence des lumières douces LED. Gamme de couleurs complète RGB+W.",
            specs: {
                "type": "LED",
                "power": "400W",
                "cct": "2800K - 10,000K",
                "control": "DMX / On-board"
            },
            daily_rate: 450,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1432655173_1139001.jpg"]
        },
        {
            name: "Creamsource Vortex8",
            slug: "creamsource-vortex8",
            brand: "Creamsource",
            category_slug: "lighting",
            description_en: "650W RGBW LED Panel. IP65 Water Resistant. 14,000 lux output. Built-in effects.",
            description_fr: "Panneau LED RGBW 650W. Résistant à l'eau IP65. 14 000 lux de sortie.",
            specs: {
                "type": "LED",
                "power": "650W",
                "cct": "2200K - 15,000K",
                "ip_rating": "IP65"
            },
            daily_rate: 500,
            image_urls: ["https://static.bhphoto.com/images/multiple_images/images500x500/1643912107_IMG_1690330.jpg"]
        },
        {
            name: "Astera Titan Tube Set (8)",
            slug: "astera-titan-tube-set",
            brand: "Astera",
            category_slug: "lighting",
            description_en: "Set of 8 wireless, battery-powered LED tubes. High CRI/TLCI. Perfect for effects and practicals.",
            description_fr: "Ensemble de 8 tubes LED sans fil sur batterie. CRI/TLCI élevé.",
            specs: {
                "type": "LED",
                "battery": "Built-in (20h max)",
                "pixels": "16 Segments",
                "cct": "1750K - 20,000K"
            },
            daily_rate: 400,
            image_urls: ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/astera_fp1_set_set_of_8_titan_1581676051_1541959.jpg"]
        },
        {
            name: "Aputure LS 1200d Pro",
            slug: "aputure-ls-1200d-pro",
            brand: "Aputure",
            category_slug: "lighting",
            description_en: "1200W Daylight COB LED. Rivals 1.8K HMI output. Bowens mount compatible.",
            description_fr: "LED COB lumière du jour 1200W. Rivalise avec la sortie d'un HMI 1.8K.",
            specs: {
                "type": "LED",
                "power": "1200W",
                "cct": "5600K",
                "mount": "Bowens"
            },
            daily_rate: 350,
            image_urls: ["https://cdn.shopify.com/s/files/1/1343/1935/files/LS1200dPro-2.png?v=1711009429&width=1000&crop=center"]
        },
        {
            name: "Aputure LS 600c Pro II",
            slug: "aputure-ls-600c-pro-ii",
            brand: "Aputure",
            category_slug: "lighting",
            description_en: "600W Full-Color Point Source LED. High output RGBWW. Weather resistant.",
            description_fr: "Source ponctuelle LED pleine couleur 600W. Sortie RGBWW élevée.",
            specs: {
                "type": "LED",
                "power": "600W",
                "cct": "2300K - 10,000K",
                "mount": "Bowens"
            },
            daily_rate: 250,
            image_urls: ["https://cdn.shopify.com/s/files/1/1343/1935/files/LS1200dPro-6.png?v=1711009429&width=1000&crop=center"] // Placeholder re-used from your provided links if specific image missing
        },
        {
            name: "Nanlite Forza 500B",
            slug: "nanlite-forza-500b",
            brand: "Nanlite",
            category_slug: "lighting",
            description_en: "Bi-Color LED Monolight. High output in a compact form factor. Bowens mount.",
            description_fr: "Monolight LED Bi-Color. Sortie élevée dans un facteur de forme compact.",
            specs: {
                "type": "LED",
                "power": "500W",
                "cct": "2700K - 6500K",
                "mount": "Bowens"
            },
            daily_rate: 180,
            image_urls: ["https://cdn-aliyun.nanlite.com/release/1694758773902-815500-1410622625-Forza+300%2B500II.png"]
        },
        {
            name: "LiteGear LiteMat 4 Spectrum",
            slug: "litemat-4-spectrum",
            brand: "LiteGear",
            category_slug: "lighting",
            description_en: "Large format, ultra-thin soft light. Full color spectrum control. Lightweight.",
            description_fr: "Lumière douce grand format ultra-mince. Contrôle complet du spectre de couleurs.",
            specs: {
                "type": "LED",
                "size": "21\" x 40\"",
                "pixels": "Individually addressable"
            },
            daily_rate: 300,
            image_urls: ["https://s.turbifycdn.com/aah/filmandvideolighting/litegear-litemat-led-lighting-film-video-photo-17.jpg"]
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
        "wireless-video": ensureCategory("wireless-video", "Wireless Video", "Vidéo Sans Fil"),
        "stabilizers": ensureCategory("stabilizers", "Stabilizers", "Stabilisateurs"),
        "lighting": ensureCategory("lighting", "Lighting", "Éclairage")
    };

    const equipmentCollection = app.findCollectionByNameOrId("equipment");

    // 3. Process Items
    equipmentData.forEach(item => {
        try {
            const existing = app.findFirstRecordByFilter("equipment", `slug="${item.slug}"`);
            if (existing) app.delete(existing);
        } catch (e) { }

        console.log(`Creating equipment: ${item.name}`);
        const record = new Record(equipmentCollection);

        record.set("name", item.name);
        record.set("name_en", item.name);
        record.set("name_fr", item.description_fr ? item.name : item.name);
        record.set("slug", item.slug);
        record.set("brand", item.brand);
        record.set("category", categories[item.category_slug].id);

        record.set("description_en", item.description_en);
        record.set("description_fr", item.description_fr);

        record.set("specs", item.specs);
        record.set("specs_en", item.specs);
        record.set("specs_fr", item.specs);

        record.set("daily_rate", item.daily_rate);
        record.set("stock", 2);
        record.set("stock_available", 2);
        record.set("visibility", true);

        // Specific Type Setting for Lighting
        if (item.category_slug === 'lighting' && item.specs.type) {
            record.set("type", item.specs.type); // e.g., "LED", "Tungsten"
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