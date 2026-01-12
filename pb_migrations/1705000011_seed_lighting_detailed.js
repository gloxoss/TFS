/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {

    // Helper to download images safely
    const fetchImage = (url) => {
        try {
            const res = $http.send({ url: url, method: "GET", timeout: 30 });
            if (res.statusCode === 200) {
                // Sanitize filename
                const cleanName = url.split('/').pop().split('?')[0] || `img_${Date.now()}.jpg`;
                return { name: cleanName, type: res.headers['Content-Type'] || "image/jpeg", content: res.raw };
            }
        } catch (e) {
            console.log(`Warning: Could not fetch image for ${url}`);
        }
        return null;
    };

    const equipmentCollection = app.findCollectionByNameOrId("equipment");

    // Get Lighting Category
    let lightingCat;
    try {
        lightingCat = app.findFirstRecordByFilter("categories", 'slug="lighting"').id;
    } catch (e) {
        // Create if missing
        const cat = new Record(app.findCollectionByNameOrId("categories"));
        cat.set("name", "Lighting");
        cat.set("slug", "lighting");
        app.save(cat);
        lightingCat = cat.id;
    }

    const lightingInventory = [
        // ==========================
        // DAYLIGHT / HMI
        // ==========================
        {
            name: "ARRI M18",
            slug: "arri-m18",
            brand: "ARRI",
            type: "HMI",
            description_en: "1800W Daylight fixture. MAX Technology reflector (lens-less). Combines advantages of PAR and Fresnel.",
            description_fr: "Projecteur lumière du jour 1800W. Technologie MAX sans lentille.",
            specs: { "power": "1800W", "lens": "Open Face (MAX)", "mount": "Spigot 28mm" },
            image: "https://static.bhphoto.com/images/multiple_images/images500x500/1562148955_IMG_1211145.jpg"
        },
        {
            name: "ARRI M40",
            slug: "arri-m40",
            brand: "ARRI",
            type: "HMI",
            description_en: "4000W Daylight fixture. Brighter than a 4K PAR. Focusable 18-52°.",
            description_fr: "Projecteur lumière du jour 4000W. Plus lumineux qu'un PAR 4K.",
            specs: { "power": "4000W", "lens": "Open Face (MAX)" },
            image: "https://www.arri.com/resource/blob/32896/8761a77702c9e0ef5e3479f8c2520fce/m40-gallery-right-data.jpg"
        },
        {
            name: "ARRI M90",
            slug: "arri-m90",
            brand: "ARRI",
            type: "HMI",
            description_en: "9000W Daylight fixture. Extreme output for large scale cinema.",
            description_fr: "Projecteur 9000W. Puissance extrême pour le cinéma grand format.",
            specs: { "power": "9000W", "lens": "Open Face (MAX)" },
            image: "https://www.arri.com/resource/blob/32904/caecf68c1c7bac653c1f233ba5b678da/m90-gallery-back-data.jpg"
        },
        // Arrisun Series
        {
            name: "ARRISUN 5 (575W)",
            slug: "arrisun-5",
            brand: "ARRI",
            type: "HMI",
            description_en: "575W PAR HMI. Compact punch light.",
            description_fr: "HMI PAR 575W. Lumière percutante compacte.",
            specs: { "power": "575W", "type": "PAR" },
            image: "https://www.arri.com/resource/image/269004/landscape_ratio1x0_38/1920/737/5342643664c015aaf16dcc539b6babf1/20E50AF76061D37B39A6459861E2C8F6/arri-arrisun-psn-data2.jpg"
        },
        {
            name: "ARRISUN 12 (1.2kW)",
            slug: "arrisun-12",
            brand: "ARRI",
            type: "HMI",
            description_en: "1200W PAR HMI. The industry workhorse for daylight punch.",
            description_fr: "HMI PAR 1200W. Le standard de l'industrie.",
            specs: { "power": "1200W", "type": "PAR" },
            image: "https://www.arri.com/resource/image/269004/landscape_ratio1x0_38/1920/737/5342643664c015aaf16dcc539b6babf1/20E50AF76061D37B39A6459861E2C8F6/arri-arrisun-psn-data2.jpg"
        },
        {
            name: "ARRISUN 40/25 (2.5/4kW)",
            slug: "arrisun-40-25",
            brand: "ARRI",
            type: "HMI",
            description_en: "Dual wattage 2.5kW / 4kW PAR HMI.",
            description_fr: "HMI PAR double puissance 2.5kW / 4kW.",
            specs: { "power": "2500W / 4000W", "type": "PAR" },
            image: "https://www.arri.com/resource/image/269004/landscape_ratio1x0_38/1920/737/5342643664c015aaf16dcc539b6babf1/20E50AF76061D37B39A6459861E2C8F6/arri-arrisun-psn-data2.jpg"
        },
        {
            name: "ARRISUN 60 (6kW)",
            slug: "arrisun-60",
            brand: "ARRI",
            type: "HMI",
            description_en: "6000W PAR HMI. Intense beam for long throws.",
            description_fr: "HMI PAR 6000W. Faisceau intense pour longues distances.",
            specs: { "power": "6000W", "type": "PAR" },
            image: "https://www.arri.com/resource/image/269004/landscape_ratio1x0_38/1920/737/5342643664c015aaf16dcc539b6babf1/20E50AF76061D37B39A6459861E2C8F6/arri-arrisun-psn-data2.jpg"
        },
        {
            name: "ARRISUN 120 (12kW)",
            slug: "arrisun-120",
            brand: "ARRI",
            type: "HMI",
            description_en: "12000W PAR HMI. Sun simulation and large area lighting.",
            description_fr: "HMI PAR 12000W. Simulation solaire et éclairage de grande surface.",
            specs: { "power": "12000W", "type": "PAR" },
            image: "https://www.arri.com/resource/image/269004/landscape_ratio1x0_38/1920/737/5342643664c015aaf16dcc539b6babf1/20E50AF76061D37B39A6459861E2C8F6/arri-arrisun-psn-data2.jpg"
        },
        // Bron Kobold
        {
            name: "Bron Kobold DW200",
            slug: "bron-kobold-dw200",
            brand: "Bron Kobold",
            type: "HMI",
            description_en: "Compact 200W HMI. Convertible Open Face/PAR.",
            description_fr: "HMI compact 200W. Convertible Open Face/PAR.",
            specs: { "power": "200W", "weatherproof": "Yes" },
            image: "https://static.bhphoto.com/images/images500x500/1574789783_561478.jpg"
        },
        {
            name: "Bron Kobold DW400",
            slug: "bron-kobold-dw400",
            brand: "Bron Kobold",
            type: "HMI",
            description_en: "400W Weatherproof HMI (IP54).",
            description_fr: "HMI 400W étanche (IP54).",
            specs: { "power": "400W", "weatherproof": "IP54" },
            image: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/Bron_Kobold_332_0145_DW400_400_Watt_HMI_1241016409_615590.jpg"
        },
        {
            name: "Bron Kobold DW800",
            slug: "bron-kobold-dw800",
            brand: "Bron Kobold",
            type: "HMI",
            description_en: "800W Focusable Daylight fixture. Compact and robust.",
            description_fr: "Projecteur lumière du jour focalisable 800W.",
            specs: { "power": "800W", "weatherproof": "IP54" },
            image: "https://static.bhphoto.com/images/images500x500/1233195638_561593.jpg"
        },

        // ==========================
        // TUNGSTEN
        // ==========================
        {
            name: "ARRI Junior 150",
            slug: "arri-junior-150",
            brand: "ARRI",
            type: "Tungsten",
            description_en: "150W Fresnel. Perfect for hair light or small accents.",
            description_fr: "Fresnel 150W. Parfait pour les contre-jours.",
            specs: { "power": "150W", "lens": "Fresnel" },
            image: "https://www.arri.com/resource/image/32996/landscape_ratio1x0_38/1920/737/888de7382a202c783d9087e4783250bf/30A4873357CDD137981F9E76FB52E72C/arri-fresnel-150-plus.png"
        },
        {
            name: "ARRI Junior 300 Plus",
            slug: "arri-junior-300",
            brand: "ARRI",
            type: "Tungsten",
            description_en: "300W Fresnel. Compact studio and location fixture.",
            description_fr: "Fresnel 300W. Projecteur compact pour studio et extérieur.",
            specs: { "power": "300W", "lens": "Fresnel" },
            image: "https://www.arri.com/resource/image/32998/landscape_ratio1x0_38/1920/737/5cda24f897c64df9dd68afd45fa9d79f/3913610CD9671146DC8BD4EF59EABDCA/arri-fresnel-300-plus-stage.png"
        },
        {
            name: "ARRI Junior 650 Plus",
            slug: "arri-junior-650",
            brand: "ARRI",
            type: "Tungsten",
            description_en: "650W Fresnel. The standard interview key light.",
            description_fr: "Fresnel 650W. La lumière clé standard pour les interviews.",
            specs: { "power": "650W", "lens": "Fresnel" },
            image: "https://www.arri.com/resource/image/33000/landscape_ratio1x0_38/1920/737/c5b2f072998ebf2101a8f16f3eef94ef/B58966F468C65BD30CAB20CA72E38FC8/arri-fresnel-650-plus.png"
        },
        {
            name: "ARRI True Blue T1 (1kW)",
            slug: "arri-true-blue-t1",
            brand: "ARRI",
            type: "Tungsten",
            description_en: "1000W High performance Fresnel with improved cooling.",
            description_fr: "Fresnel haute performance 1000W avec refroidissement amélioré.",
            specs: { "power": "1000W", "series": "True Blue" },
            image: "https://www.arri.com/resource/image/33178/landscape_ratio1x0_38/1920/737/7df9692b9699b47a591803a3528e084c/E869D365945DAF18E9F733DA558FC2E3/true-blue-t-series-t1-stage.png"
        },
        {
            name: "Arrilite 800 (Redhead)",
            slug: "arrilite-800",
            brand: "ARRI",
            type: "Tungsten",
            description_en: "800W Open Face 'Redhead'. Lightweight, variable beam 42-86 deg.",
            description_fr: "Open Face 800W 'Mandarine'. Léger, faisceau variable.",
            specs: { "power": "800W", "style": "Open Face" },
            image: "https://www.goldcoastcamerahire.com.au/wp-content/uploads/2019/01/Arrilite-800-2.jpg"
        },
        {
            name: "ARRI Blonde 2000",
            slug: "arri-blonde-2000",
            brand: "ARRI",
            type: "Tungsten",
            description_en: "2000W Open Face 'Blonde'. Powerful punchy beam.",
            description_fr: "Open Face 2000W 'Blonde'. Faisceau puissant.",
            specs: { "power": "2000W", "style": "Open Face" },
            image: "https://www.puzzlevideo.fr/wp-content/uploads/2021/01/tungsten.png"
        },
        {
            name: "Dino Light 9x1kW (Maxi Brute)",
            slug: "dino-light-9k",
            brand: "Generic",
            type: "Tungsten",
            description_en: "9-Light 1000W PAR 64 Bank. 9000W Total.",
            description_fr: "Banque 9 lampes 1000W PAR 64.",
            specs: { "power": "9000W", "lamps": "PAR64" },
            image: "https://cineplanet.tv/wp-content/uploads/2023/11/1002346.00-1536x1152.jpg"
        },
        {
            name: "Dino Light 12x1kW (Maxi Brute)",
            slug: "dino-light-12k",
            brand: "Generic",
            type: "Tungsten",
            description_en: "12-Light 1000W PAR 64 Bank. 12000W Total.",
            description_fr: "Banque 12 lampes 1000W PAR 64.",
            specs: { "power": "12000W", "lamps": "PAR64" },
            image: "https://cineplanet.tv/wp-content/uploads/2023/11/1002345.00.jpg"
        },
        {
            name: "Dino Light 24x1kW (Maxi Brute)",
            slug: "dino-light-24k",
            brand: "Generic",
            type: "Tungsten",
            description_en: "24-Light 1000W PAR 64 Bank. Massive 24000W Total.",
            description_fr: "Banque 24 lampes 1000W PAR 64. Total 24000W.",
            specs: { "power": "24000W", "lamps": "PAR64" },
            image: "https://cinelightshop.com/7953-superlarge_default_2x/maxi-brute-twenty-four-light-24000-watts.jpg"
        },
        {
            name: "PAR 64 Can",
            slug: "par-64-can",
            brand: "Kupo",
            type: "Tungsten",
            description_en: "Standard PAR 64 Can. Beam depends on bulb (CP60/61/62).",
            description_fr: "Projecteur PAR 64 standard.",
            specs: { "power": "1000W", "mount": "Yoke" },
            image: "https://www.lightinglab.com.au/wp-content/uploads/2020/04/3-10-Par-64-Black.png"
        },
        {
            name: "ETC Source 4 Profile 750W",
            slug: "etc-source-4",
            brand: "ETC",
            type: "Tungsten",
            description_en: "750W Ellipsoidal. Crisp beam, gobo projection.",
            description_fr: "Découpe 750W. Faisceau net, projection de gobo.",
            specs: { "power": "750W", "lamp": "HPL" },
            image: "https://megavision.com.au/wp-content/uploads/2022/06/ETC-Source-4-750W-Profile-Spotlight.jpg"
        },
        {
            name: "Dedolight DLH4 150W Kit",
            slug: "dedolight-dlh4",
            brand: "Dedolight",
            type: "Tungsten",
            description_en: "Precision 150W fixture with aspheric lens. Clean beam, no stray light.",
            description_fr: "Projecteur de précision 150W avec lentille asphérique.",
            specs: { "power": "150W", "lens": "Aspheric" },
            image: "https://bollywoodfilmequipments.in/wp-content/uploads/2020/12/1-6.jpg"
        },
        {
            name: "Dedolight DLH2 150W",
            slug: "dedolight-dlh2",
            brand: "Dedolight",
            type: "Tungsten",
            description_en: "150W fixture integrated power cable. Similar precision to DLH4.",
            description_fr: "Projecteur 150W intégré.",
            specs: { "power": "150W", "lens": "Aspheric" },
            image: "https://rent.loca-images.com/cdn/shop/products/has_627e816bc1c45714.jpg?v=1687425571&width=800"
        },

        // ==========================
        // LED
        // ==========================
        {
            name: "Creamsource Vortex8",
            slug: "creamsource-vortex8",
            brand: "Creamsource",
            type: "LED",
            description_en: "650W RGBW IP65 Panel. 14,000 lux output.",
            description_fr: "Panneau RGBW 650W IP65.",
            specs: { "power": "650W", "cct": "2200K-15000K", "ip": "IP65" },
            image: "https://static.bhphoto.com/images/multiple_images/images500x500/1643912107_IMG_1690330.jpg"
        },
        {
            name: "ARRI SkyPanel S60-C",
            slug: "arri-skypanel-s60c",
            brand: "ARRI",
            type: "LED",
            description_en: "Softlight LED panel. Fully tunable CCT and RGBW.",
            description_fr: "Panneau LED Softlight.",
            specs: { "power": "400W", "cct": "2800K-10000K" },
            image: "https://static.bhphoto.com/images/images500x500/1432655173_1139001.jpg"
        },
        {
            name: "ARRI SkyPanel S30-C",
            slug: "arri-skypanel-s30c",
            brand: "ARRI",
            type: "LED",
            description_en: "Compact version of the S60. Portable softlight.",
            description_fr: "Version compacte du S60.",
            specs: { "power": "200W", "cct": "2800K-10000K" },
            image: "https://static.bhphoto.com/images/images500x500/1568299854_1166185.jpg"
        },
        // DMG
        {
            name: "DMG Lumiere MINI MIX",
            slug: "dmg-mini-mix",
            brand: "DMG",
            type: "LED",
            description_en: "Compact RGBWW panel. High CRI.",
            description_fr: "Panneau RGBWW compact.",
            specs: { "power": "100W", "cct": "1700K-10000K" },
            image: "https://static.bhphoto.com/images/images500x500/1564134460_1492286.jpg"
        },
        {
            name: "DMG Lumiere SL1 MIX",
            slug: "dmg-sl1-mix",
            brand: "DMG",
            type: "LED",
            description_en: "Standard 120cm RGBWW panel.",
            description_fr: "Panneau RGBWW standard 120cm.",
            specs: { "power": "200W", "cct": "1700K-10000K" },
            image: "https://static.bhphoto.com/images/images500x500/1553262310_1463102.jpg"
        },
        {
            name: "DMG Lumiere MAXI MIX",
            slug: "dmg-maxi-mix",
            brand: "DMG",
            type: "LED",
            description_en: "Large format RGBWW panel. Foldable.",
            description_fr: "Panneau RGBWW grand format. Pliable.",
            specs: { "power": "360W", "cct": "1700K-10000K" },
            image: "https://static.bhphoto.com/images/images500x500/1578328552_1524613.jpg"
        },
        // Astera
        {
            name: "Astera Titan Tube FP1",
            slug: "astera-titan-fp1",
            brand: "Astera",
            type: "LED",
            description_en: "The ultimate film lighting tube. High CRI/TLCI.",
            description_fr: "Le tube d'éclairage de film ultime.",
            specs: { "length": "1m", "pixels": "16", "battery": "Yes" },
            image: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/astera_fp1_set_set_of_8_titan_1581676051_1541959.jpg"
        },
        {
            name: "Astera AX1 Pixel Tube",
            slug: "astera-ax1",
            brand: "Astera",
            type: "LED",
            description_en: "Wireless Pixel Tube. RGBW.",
            description_fr: "Tube Pixel sans fil.",
            specs: { "length": "1m", "battery": "Yes" },
            image: "https://media.astera-led.com/wp-content/uploads/astera-ax1-kit-pixeltube-1200x1200.png"
        },
        {
            name: "Astera AX2 PixelBar",
            slug: "astera-ax2",
            brand: "Astera",
            type: "LED",
            description_en: "Wireless LED Bar with high CRI.",
            description_fr: "Barre LED sans fil.",
            specs: { "length": "1m", "battery": "Yes" },
            image: "https://photocinerent.com/storage/3008/conversions/IMG_0212-slide.jpg"
        },
        {
            name: "Astera AX3 LightDrop",
            slug: "astera-ax3",
            brand: "Astera",
            type: "LED",
            description_en: "Compact magnetic spotlight. Battery powered.",
            description_fr: "Spotlight magnétique compact.",
            specs: { "power": "15W", "battery": "Yes" },
            image: "https://media.astera-led.com/wp-content/uploads/astera-ax3-crmx-kit-ax3-lightdrop-1200x1200.png"
        },
        {
            name: "Astera AX5 TriplePAR",
            slug: "astera-ax5",
            brand: "Astera",
            type: "LED",
            description_en: "Wireless LED PAR. RGBAW. 3x 15W LEDs.",
            description_fr: "PAR LED sans fil.",
            specs: { "power": "45W", "battery": "Yes" },
            image: "https://photocinerent.com/storage/2735/conversions/Astera_AX5_01-QWPO-slide.jpg"
        },
        {
            name: "Astera AX10 SpotMax",
            slug: "astera-ax10",
            brand: "Astera",
            type: "LED",
            description_en: "High output wireless PAR. 135W.",
            description_fr: "PAR sans fil haute puissance.",
            specs: { "power": "135W", "battery": "Yes" },
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmcxAL5sIwJ3whMA5T753bYXcIigFRa37UDA&s"
        },
        {
            name: "Astera LunaBulb",
            slug: "astera-lunabulb",
            brand: "Astera",
            type: "LED",
            description_en: "Smart LED Bulb. Looks like a classic practical.",
            description_fr: "Ampoule LED intelligente.",
            specs: { "socket": "E27", "control": "CRMX" },
            image: "https://static.bhphoto.com/images/images500x500/1718010615_1834164.jpg"
        },
        // Nanlite
        {
            name: "Nanlite Forza 60B II",
            slug: "nanlite-forza-60b",
            brand: "Nanlite",
            type: "LED",
            description_en: "Compact Bi-Color COB LED.",
            description_fr: "LED COB Bi-Color compacte.",
            specs: { "power": "60W", "cct": "Bi-Color" },
            image: "https://static.bhphoto.com/images/images500x500/1673336808_1736656.jpg"
        },
        {
            name: "Nanlite Forza 300",
            slug: "nanlite-forza-300",
            brand: "Nanlite",
            type: "LED",
            description_en: "Powerful Daylight COB.",
            description_fr: "COB lumière du jour puissant.",
            specs: { "power": "300W", "cct": "5600K" },
            image: "https://www.avbroadcast.fr/media/catalog/product/cache/1/image/933x/602f0fa2c1f0d1ba5e241f914e856ff9/n/a/nanlite-forza-300/Forza-300-Projecteur-LED-COB-300-W-5600-K-Nanlite-31.jpg"
        },
        {
            name: "Nanlite Forza 300B",
            slug: "nanlite-forza-300b",
            brand: "Nanlite",
            type: "LED",
            description_en: "Bi-Color 300W COB.",
            description_fr: "COB 300W Bi-Color.",
            specs: { "power": "300W", "cct": "Bi-Color" },
            image: "https://s3-ap-southeast-1.amazonaws.com/altech-prod/uploads/public/640/195/26a/64019526a37e7837538936.jpg"
        },
        {
            name: "Nanlite Forza 500",
            slug: "nanlite-forza-500",
            brand: "Nanlite",
            type: "LED",
            description_en: "High output 500W Daylight COB.",
            description_fr: "COB 500W lumière du jour.",
            specs: { "power": "500W", "cct": "5600K" },
            image: "https://www.hightechstore.ma/wp-content/uploads/2021/11/NANLITE-Forza-500-2Kit-3.jpg"
        },
        {
            name: "Nanlite Forza 500B II",
            slug: "nanlite-forza-500b-ii",
            brand: "Nanlite",
            type: "LED",
            description_en: "Bi-Color 500W COB.",
            description_fr: "COB 500W Bi-Color.",
            specs: { "power": "500W", "cct": "Bi-Color" },
            image: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/nanlite_forza500bii_forza_500b_ii_led_1673336808_1736660.jpg"
        },
        // Aputure
        {
            name: "Aputure STORM XT52",
            slug: "aputure-xt52",
            brand: "Aputure",
            type: "LED",
            description_en: "5200W Tunable White LED.",
            description_fr: "LED blanc réglable 5200W.",
            specs: { "power": "5200W", "ip": "IP65" },
            image: "https://static.bhphoto.com/images/images500x500/1743508894_1889192.jpg"
        },
        {
            name: "Aputure Electro Storm CS15",
            slug: "aputure-cs15",
            brand: "Aputure",
            type: "LED",
            description_en: "1500W Full Color LED.",
            description_fr: "LED couleur 1500W.",
            specs: { "power": "1500W", "mount": "Electronic A-Mount" },
            image: "https://cdn.shopify.com/s/files/1/1343/1935/files/CS15_Meuium_Barndoor-5.png?v=1703557992"
        },
        {
            name: "Aputure Electro Storm XT26",
            slug: "aputure-xt26",
            brand: "Aputure",
            type: "LED",
            description_en: "2600W Bi-Color LED.",
            description_fr: "LED Bi-Color 2600W.",
            specs: { "power": "2600W", "mount": "Electronic A-Mount" },
            image: "https://cdn.shopify.com/s/files/1/1343/1935/files/XT26_Meuium_Barndoor-2.png?v=1710323628&width=1000&crop=center"
        },
        {
            name: "Aputure LS 1200d Pro",
            slug: "aputure-1200d-pro",
            brand: "Aputure",
            type: "LED",
            description_en: "1200W Daylight COB.",
            description_fr: "COB lumière du jour 1200W.",
            specs: { "power": "1200W", "mount": "Bowens" },
            image: "https://www.camerahire.com.au/images/hire/aputure-1200d-lightstorm-led-light.jpeg"
        },
        {
            name: "Aputure LS 600c Pro II",
            slug: "aputure-600c-pro-ii",
            brand: "Aputure",
            type: "LED",
            description_en: "600W Full Color COB (Gen 2).",
            description_fr: "COB couleur 600W (Gen 2).",
            specs: { "power": "600W", "cct": "RGBWW" },
            image: "https://static.bhphoto.com/images/images500x500/1717501568_1828005.jpg"
        },
        {
            name: "Aputure LS 600c Pro",
            slug: "aputure-600c-pro",
            brand: "Aputure",
            type: "LED",
            description_en: "600W Full Color COB.",
            description_fr: "COB couleur 600W.",
            specs: { "power": "600W", "cct": "RGBWW" },
            image: "https://www.tsf.fr/wp-content/uploads/2022/12/LS_600c_pro-1024x1024.jpg"
        },
        {
            name: "Aputure LS 600x Pro",
            slug: "aputure-600x-pro",
            brand: "Aputure",
            type: "LED",
            description_en: "600W Bi-Color COB.",
            description_fr: "COB Bi-Color 600W.",
            specs: { "power": "600W", "cct": "Bi-Color" },
            image: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/aputure_als600xprovus_ls_600x_pro_lamp_1628606136_1657955.jpg"
        },
        {
            name: "Aputure LS 600d Pro",
            slug: "aputure-600d-pro",
            brand: "Aputure",
            type: "LED",
            description_en: "600W Daylight COB.",
            description_fr: "COB lumière du jour 600W.",
            specs: { "power": "600W", "cct": "5600K" },
            image: "https://www.bhphotovideo.com/images/fb/nanlite_forza500bii_forza_500b_ii_led_1736660.jpg" // Note: Re-using valid link from source data
        },
        {
            name: "Amaran 300c",
            slug: "amaran-300c",
            brand: "Amaran",
            type: "LED",
            description_en: "300W Full Color COB.",
            description_fr: "COB couleur 300W.",
            specs: { "power": "300W", "cct": "RGBWW" },
            image: "https://kamerty.ma/wp-content/uploads/2024/06/Amaran-300c-Projecteur-LED-prix-maroc-kamerty-1.jpg"
        },
        {
            name: "Aputure LS 300d II",
            slug: "aputure-300d-ii",
            brand: "Aputure",
            type: "LED",
            description_en: "300W Daylight COB.",
            description_fr: "COB lumière du jour 300W.",
            specs: { "power": "300W", "cct": "5600K" },
            image: "https://yahyaouishop.com/wp-content/uploads/2023/10/APUTURE-LS-C300D-II-1.jpg"
        },
        {
            name: "Aputure LS 60x",
            slug: "aputure-60x",
            brand: "Aputure",
            type: "LED",
            description_en: "60W Bi-Color Focusing LED.",
            description_fr: "LED focalisable 60W Bi-Color.",
            specs: { "power": "60W", "lens": "Focusable" },
            image: "https://www.panavision.com/images/default-source/product-images/panalux/heads/hpp6zai_aputure_ls-60x/px_heads_led_aputure_light-storm-60x_01-1500x999-0bfec42.jpg?sfvrsn=23b2fc2e_1"
        },
        {
            name: "Aputure MC Pro",
            slug: "aputure-mc-pro",
            brand: "Aputure",
            type: "LED",
            description_en: "Magnetic Mini RGBWW Panel.",
            description_fr: "Mini panneau RGBWW magnétique.",
            specs: { "power": "5W", "battery": "Yes" },
            image: "https://cdn.shopify.com/s/files/1/1343/1935/files/MCPro-1.png?v=1696906204&width=1000&crop=center"
        },
        {
            name: "Amaran F21c Flex Mat",
            slug: "amaran-f21c",
            brand: "Amaran",
            type: "LED",
            description_en: "2x1 RGBWW Flexible Mat. 100W.",
            description_fr: "Tapis flexible RGBWW 2x1. 100W.",
            specs: { "power": "100W", "type": "Flex" },
            image: "https://static.bhphoto.com/images/multiple_images/images500x500/1648739988_IMG_1725343.jpg"
        },
        {
            name: "Amaran F22c Flex Mat",
            slug: "amaran-f22c",
            brand: "Amaran",
            type: "LED",
            description_en: "2x2 RGBWW Flexible Mat. 200W.",
            description_fr: "Tapis flexible RGBWW 2x2. 200W.",
            specs: { "power": "200W", "type": "Flex" },
            image: "https://static.bhphoto.com/images/images500x500/1750692348_1698323.jpg"
        },
        // LiteGear
        {
            name: "LiteMat 2",
            slug: "litemat-2",
            brand: "LiteGear",
            type: "LED",
            description_en: "21x21 inch Hybrid LED panel.",
            description_fr: "Panneau LED hybride 21x21 pouces.",
            specs: { "size": "21x21", "cct": "Hybrid" },
            image: "https://www.litegear.com/wp-content/uploads/2019/06/S2-2BACK.png"
        },
        {
            name: "LiteMat 2L",
            slug: "litemat-2l",
            brand: "LiteGear",
            type: "LED",
            description_en: "11.5x40 inch Long Hybrid LED panel.",
            description_fr: "Panneau LED hybride long 11.5x40 pouces.",
            specs: { "size": "11.5x40", "cct": "Hybrid" },
            image: "https://www.tsf.fr/wp-content/uploads/2017/10/LiteMat_2L.png"
        },
        {
            name: "LiteMat 4",
            slug: "litemat-4",
            brand: "LiteGear",
            type: "LED",
            description_en: "21x40 inch Large Hybrid LED panel.",
            description_fr: "Grand panneau LED hybride 21x40 pouces.",
            specs: { "size": "21x40", "cct": "Hybrid" },
            image: "https://photocinerent.com/storage/2663/conversions/Litegear-Litemat-Plu-DCP2-slide.jpg"
        },
        // Misc
        {
            name: "Kino Flo 4ft 4Bank",
            slug: "kinoflo-4ft-4bank",
            brand: "Kino Flo",
            type: "Fluorescent",
            description_en: "4ft 4-Tube fixture. Classic soft light.",
            description_fr: "Projecteur 4 tubes de 4 pieds. Lumière douce classique.",
            specs: { "tubes": "4", "length": "4ft" },
            image: "https://www.visualsfrance.com/location/1189-large_default/kino-4120.jpg"
        },
        {
            name: "Kino Flo 2ft 4Bank",
            slug: "kinoflo-2ft-4bank",
            brand: "Kino Flo",
            type: "Fluorescent",
            description_en: "2ft 4-Tube fixture.",
            description_fr: "Projecteur 4 tubes de 2 pieds.",
            specs: { "tubes": "4", "length": "2ft" },
            image: "https://www.visualsfrance.com/location/1190-large_default/bank-460.jpg"
        },
        {
            name: "SWIT S-2620 Flex",
            slug: "swit-s2620",
            brand: "SWIT",
            type: "LED",
            description_en: "Flexible SMD-LED light. 280 LEDs.",
            description_fr: "Lumière SMD-LED flexible. 280 LEDs.",
            specs: { "type": "Flex", "power": "50W" },
            image: "https://www.visualsfrance.com/2187-large_default/s-2620.jpg"
        },
        {
            name: "SWIT S-2610 Flex",
            slug: "swit-s2610",
            brand: "SWIT",
            type: "LED",
            description_en: "Flexible SMD-LED light. 504 LEDs.",
            description_fr: "Lumière SMD-LED flexible. 504 LEDs.",
            specs: { "type": "Flex", "power": "100W" },
            image: "https://www.visualsfrance.com/2188-medium_default/s-2610.jpg"
        },
        {
            name: "Falconeyes AFEFT 100W",
            slug: "falconeyes-c100bl",
            brand: "Falconeyes",
            type: "LED",
            description_en: "100W Flexible Cloth Lamp. Remote control.",
            description_fr: "Lampe tissu flexible 100W.",
            specs: { "type": "Flex", "power": "100W" },
            image: "https://m.media-amazon.com/images/I/61ERWHDKH0L._AC_SX522_.jpg"
        }
    ];

    lightingInventory.forEach(item => {
        // Upsert logic: Delete if exists, then create new to ensure latest data
        try {
            const existing = app.findFirstRecordByFilter("equipment", `slug="${item.slug}"`);
            app.delete(existing);
        } catch (e) { }

        console.log(`Seeding Lighting: ${item.name}`);
        const record = new Record(equipmentCollection);

        record.set("name", item.name);
        record.set("name_en", item.name);
        record.set("name_fr", item.description_fr ? item.name : item.name);
        record.set("slug", item.slug);
        record.set("brand", item.brand);
        record.set("category", lightingCat);

        record.set("description_en", item.description_en);
        record.set("description_fr", item.description_fr);

        // Ensure specs are valid JSON
        record.set("specs", item.specs);
        record.set("specs_en", item.specs);
        record.set("specs_fr", item.specs);

        record.set("daily_rate", 100); // Default placeholder
        record.set("stock", 4);
        record.set("stock_available", 4);
        record.set("visibility", true);

        // Important: Set Type filter
        record.set("type", item.type);

        if (item.image) {
            const mainImg = fetchImage(item.image);
            if (mainImg) {
                // record.set("image", mainImg); // Uncomment in production
            }
        }

        app.save(record);
    });

}, (app) => {
    // Rollback logic
});