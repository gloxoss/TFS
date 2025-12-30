// Migration: Seed Lighting, Filters, Grip, and Power Equipment
// Adds 33+ items across Lighting, Filters, Grip & Support, Power categories

const ID_EQUIPMENT = "pbc_equipment00001"
const ID_CATEGORIES = "pbc_categories0001"
const ID_KIT_TEMPLATES = "pbc_kittemplates01"
const ID_KIT_SLOTS = "pbc_kitslots000001"

function slugify(text) {
    return text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
}

migrate((app) => {
    console.log("🚀 Starting lighting, filters & grip migration...")

    const equipmentCollection = app.findCollectionByNameOrId(ID_EQUIPMENT)
    const categoriesCollection = app.findCollectionByNameOrId(ID_CATEGORIES)
    const kitTemplatesCollection = app.findCollectionByNameOrId(ID_KIT_TEMPLATES)
    const kitSlotsCollection = app.findCollectionByNameOrId(ID_KIT_SLOTS)

    // Build category map
    const categoryRecords = app.findRecordsByFilter(categoriesCollection, "1=1", "", 100, 0)
    const categoryMap = {}
    for (const rec of categoryRecords) {
        categoryMap[rec.get("name")] = rec.id
    }

    // Create new categories if needed
    const newCategories = [
        { name: "Filters", name_fr: "Filtres", slug: "filters", desc: "ND, IRND, Diffusion, Polarizers, Diopters, and Effect Filters" },
        { name: "Grip & Support", name_fr: "Grip & Support", slug: "grip-support", desc: "Stands, Frames, Light Modifiers, and Rigging Equipment" }
    ]

    for (const cat of newCategories) {
        if (!categoryMap[cat.name]) {
            const record = new Record(categoriesCollection)
            record.set("name", cat.name)
            record.set("name_en", cat.name)
            record.set("name_fr", cat.name_fr)
            record.set("slug", cat.slug)
            record.set("description", cat.desc)
            app.save(record)
            categoryMap[cat.name] = record.id
            console.log(`✅ Created category: ${cat.name}`)
        }
    }

    // Build equipment slug->ID map
    const equipmentRecords = app.findRecordsByFilter(equipmentCollection, "1=1", "", 500, 0)
    const equipmentMap = {}
    for (const rec of equipmentRecords) {
        equipmentMap[rec.get("slug")] = rec.id
    }

    // ===== LIGHTING EQUIPMENT =====
    const lightingEquipment = [
        // DAYLIGHT HMI
        {
            name: "ARRI M-Series Daylight HMI",
            brand: "ARRI",
            category: "Lighting",
            description_en: "Academy Award-winning daylight products featuring patented MAX Technology reflector (lens-less). Combines advantages of PAR and Fresnel.",
            description_fr: "Produits lumière du jour primés aux Oscars avec réflecteur MAX Technology breveté (sans lentille). Combine les avantages du PAR et du Fresnel.",
            specs: { type: "HMI / Daylight", models_available: "M18, M40, M90", technology: "MAX Reflector", image_url: "https://www.arri.com/resource/image/179162/landscape_ratio1x0_38/1920/737/67ca2a010b4fa77f8129d59c0a4e5ff2/DB594B8F249D9DB4738D3CD846DC1156/m-series-stage.jpg" },
            stock: 3, type: "HMI Daylight"
        },
        {
            name: "ARRI ARRISUN HMI Series",
            brand: "ARRI",
            category: "Lighting",
            description_en: "Classic HMI PAR lampheads used when punch or bounce is required on set. Includes 12KW, 6KW, 4/2.5KW, 1.2KW, and 575W.",
            description_fr: "Têtes PAR HMI classiques utilisées pour le punch ou le rebond sur le plateau. Inclut 12KW, 6KW, 4/2.5KW, 1.2KW et 575W.",
            specs: { type: "HMI PAR", available_wattage: "575W - 12KW", usage: "Punch / Bounce", image_url: "https://www.arri.com/resource/image/269004/landscape_ratio1x0_38/1920/737/5342643664c015aaf16dcc539b6babf1/20E50AF76061D37B39A6459861E2C8F6/arri-arrisun-psn-data2.jpg" },
            stock: 2, type: "HMI PAR"
        },
        // TUNGSTEN
        {
            name: "ARRI Junior Tungsten Fresnel Set",
            brand: "ARRI",
            category: "Lighting",
            description_en: "Ideal for portable applications where compact, robust, lightweight tungsten Fresnel spotlights are required. Includes 150W to 10KW.",
            description_fr: "Idéal pour les applications portables nécessitant des projecteurs Fresnel tungstène compacts, robustes et légers. Inclut 150W à 10KW.",
            specs: { type: "Tungsten Fresnel", mount: "Manual / Pole Op", wattage_range: "150W - 10KW", image_url: "https://www.arri.com/resource/image/178532/landscape_ratio1x0_38/1920/737/9abc0a8c3fb59110e6d24c9e910fab4f/17A0DCC72072D62359DEBB1D7F067F67/arri-junior-stage.jpg" },
            stock: 5, type: "Tungsten Fresnel"
        },
        {
            name: "ARRI True Blue T1",
            brand: "ARRI",
            category: "Lighting",
            description_en: "Evolution of location fixtures with over 30 improvements for studio and location lighting. 1000W Fresnel.",
            description_fr: "Évolution des projecteurs de location avec plus de 30 améliorations pour l'éclairage studio et location. Fresnel 1000W.",
            specs: { type: "Tungsten Fresnel", wattage: "1000W", cooling: "Improved", image_url: "https://www.arri.com/resource/image/33178/landscape_ratio1x0_38/1920/737/7df9692b9699b47a591803a3528e084c/E869D365945DAF18E9F733DA558FC2E3/true-blue-t-series-t1-stage.png" },
            stock: 4, type: "Tungsten Fresnel"
        },
        {
            name: "ARRI Redhead / Blonde Kit",
            brand: "ARRI",
            category: "Lighting",
            description_en: "Lightweight quartz lighting (800W - 2000W). Fiberglass housing provides heat insulation. Variable beam angle 42-86 degrees.",
            description_fr: "Éclairage quartz léger (800W - 2000W). Boîtier en fibre de verre pour isolation thermique. Angle de faisceau variable 42-86 degrés.",
            specs: { type: "Open Face", wattage: "800W / 2000W", beam_angle: "42-86 degrees", image_url: "https://www.goldcoastcamerahire.com.au/wp-content/uploads/2019/01/Arrilite-800-2.jpg" },
            stock: 4, type: "Open Face"
        },
        {
            name: "Dino Light 12x1KW PAR 64",
            brand: "Generic",
            category: "Lighting",
            description_en: "High-output tungsten fixture for large-scale productions. Multiple PAR 64 lamps on a single frame. Ideal for large-area washes.",
            description_fr: "Projecteur tungstène haute puissance pour productions à grande échelle. Multiples lampes PAR 64 sur un seul châssis.",
            specs: { type: "Multi-Bank PAR", configuration: "12 x 1000W", total_output: "12KW", image_url: "https://www.spottlight-dortmund.de/wp-content/uploads/2020/03/Dino-Light-12kw.png" },
            stock: 2, type: "PAR Bank"
        },
        {
            name: "Kupo PAR 64 Can",
            brand: "Kupo",
            category: "Lighting",
            description_en: "Low-cost, highly flexible luminaire. Beam spread depends on installed lamp (VNSP, NSP, MFL, WFL).",
            description_fr: "Luminaire économique et très flexible. L'ouverture du faisceau dépend de la lampe installée.",
            specs: { type: "PAR Can", lamp: "1000W PAR 64", voltage: "110V/240V", image_url: "https://www.lightinglab.com.au/wp-content/uploads/2020/04/3-10-Par-64-Black.png" },
            stock: 10, type: "PAR Can"
        },
        {
            name: "ETC Source 4 Profile 750W",
            brand: "ETC",
            category: "Lighting",
            description_en: "Combines HPL lamp energy saving with dichroic reflector. Crisp pattern projection and shutters for shaping light.",
            description_fr: "Combine l'économie d'énergie de la lampe HPL avec un réflecteur dichroïque. Projection de gobos nette et volets pour façonner la lumière.",
            specs: { type: "Profile / Leko", wattage: "750W", feature: "Gobo Projection", image_url: "https://megavision.com.au/wp-content/uploads/2022/06/ETC-Source-4-750W-Profile-Spotlight.jpg" },
            stock: 6, type: "Profile Spot"
        },
        {
            name: "Dedolight DLH4 150W 3-Light Kit",
            brand: "Dedolight",
            category: "Lighting",
            description_en: "Compact, high-precision lighting solution. Exceptional beam control and optical efficiency. Includes 3 x DLH4 heads.",
            description_fr: "Solution d'éclairage compacte haute précision. Contrôle de faisceau exceptionnel et efficacité optique. Inclut 3 têtes DLH4.",
            specs: { type: "Precision Spot", wattage: "150W per head", kit_size: "3-Light", image_url: "https://bollywoodfilmequipments.in/wp-content/uploads/2020/12/1-6.jpg" },
            stock: 2, type: "Precision Spot"
        },
        // LED
        {
            name: "Creamsource Vortex8 RGB Panel",
            brand: "Creamsource",
            category: "Lighting",
            description_en: "650W RGB LED Light Panel. Massive 14,000 lux output. IP65 Water Resistant. Rivals 1200W HMI.",
            description_fr: "Panneau LED RGB 650W. Puissance massive de 14 000 lux. Résistant à l'eau IP65. Rivalise avec un HMI 1200W.",
            specs: { type: "RGBW Panel", output: "650W", ip_rating: "IP65", cct: "2200K - 15000K", image_url: "https://static.bhphoto.com/images/multiple_images/images500x500/1643912107_IMG_1690330.jpg" },
            stock: 2, type: "LED Panel"
        },
        {
            name: "ARRI SkyPanel S60-C Softlight",
            brand: "ARRI",
            category: "Lighting",
            description_en: "High-output, full-color LED softlight. Exceptional color accuracy and wide CCT range. The industry standard soft source.",
            description_fr: "Softlight LED full-color haute puissance. Précision des couleurs exceptionnelle et large plage CCT. La source douce standard de l'industrie.",
            specs: { type: "RGBW Soft Panel", aperture: "645 x 300 mm", cct: "2800K - 10000K", image_url: "https://static.bhphoto.com/images/images500x500/1432655173_1139001.jpg" },
            stock: 4, type: "LED Soft Panel"
        },
        {
            name: "DMG Lumière MIX Series",
            brand: "Rosco / DMG",
            category: "Lighting",
            description_en: "High-performance RGBWW color mixing. Lightweight and modular. Available as MINI, SL1, and MAXI MIX.",
            description_fr: "Mélange de couleurs RGBWW haute performance. Léger et modulaire. Disponible en MINI, SL1 et MAXI MIX.",
            specs: { type: "RGBWW Panel", color_engine: "6-Chip LED", models: "MINI, SL1, MAXI", image_url: "https://static.bhphoto.com/images/images500x500/1564134460_1492286.jpg" },
            stock: 3, type: "LED Panel"
        },
        {
            name: "Astera Titan Tube Set (8-Tube)",
            brand: "Astera",
            category: "Lighting",
            description_en: "Wireless, battery-powered RGB tubes. Ideal for creative lighting and effects. Includes charging case.",
            description_fr: "Tubes RGB sans fil alimentés par batterie. Idéal pour l'éclairage créatif et les effets. Inclut le boîtier de charge.",
            specs: { type: "Wireless Tube", battery: "20 Hours Max", control: "App / Wireless DMX", ip_rating: "IP65", image_url: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/astera_fp1_set_set_of_8_titan_1581676051_1541959.jpg" },
            stock: 2, type: "LED Tube"
        },
        {
            name: "Nanlite Forza Series (300/500)",
            brand: "Nanlite",
            category: "Lighting",
            description_en: "High-output, compact point-source fixtures. COB technology. Available in Daylight and Bi-Color.",
            description_fr: "Projecteurs point-source compacts haute puissance. Technologie COB. Disponible en Daylight et Bi-Color.",
            specs: { type: "COB Monolight", mount: "Bowens", options: "300B, 500B, 60B", image_url: "https://cdn-aliyun.nanlite.com/release/1694758773902-815500-1410622625-Forza+300%2B500II.png" },
            stock: 3, type: "LED COB"
        },
        {
            name: "Aputure STORM XT52",
            brand: "Aputure",
            category: "Lighting",
            description_en: "Point-Source Tunable-White LED Monolight. Offers 5200W equivalent high-output white CCT from 2500 to 10,000K.",
            description_fr: "Monobloc LED blanc ajustable point-source. Offre un équivalent 5200W avec CCT blanc de 2500 à 10 000K.",
            specs: { type: "COB Monolight", output: "5200W Equivalent", cct: "2500K - 10000K", ip_rating: "IP65", image_url: "https://static.bhphoto.com/images/images500x500/1743508894_1889192.jpg" },
            stock: 1, type: "LED COB"
        },
        {
            name: "Aputure Electro Storm CS15",
            brand: "Aputure",
            category: "Lighting",
            description_en: "Powerful full color point source LED. High SSI (Tungsten 89+). Electronic mount accessories.",
            description_fr: "LED point-source full-color puissante. SSI élevé (Tungsten 89+). Accessoires à monture électronique.",
            specs: { type: "RGB Monolight", output: "1500W", mount: "Aputure Electronic", image_url: "https://cdn.shopify.com/s/files/1/1343/1935/files/CS15_Meuium_Barndoor-5.png?v=1703557992" },
            stock: 1, type: "LED COB"
        },
        {
            name: "Aputure Light Storm Pro Series",
            brand: "Aputure",
            category: "Lighting",
            description_en: "Industry standard point-source LED fixtures. Includes 1200d Pro, 600d/x/c Pro models. Bowens mount.",
            description_fr: "Projecteurs LED point-source standard de l'industrie. Inclut les modèles 1200d Pro, 600d/x/c Pro. Monture Bowens.",
            specs: { type: "COB Monolight", models: "1200d, 600c, 600d, 600x", control: "Sidus Link", image_url: "https://cdn.shopify.com/s/files/1/1343/1935/files/LS1200dPro-2.png?v=1711009429&width=1000&crop=center" },
            stock: 6, type: "LED COB"
        },
        {
            name: "Aputure MC Pro RGB",
            brand: "Aputure",
            category: "Lighting",
            description_en: "Miniature RGBWW light with magnetic mounting. IP65 rated. Perfect for practicals and accents.",
            description_fr: "Mini lumière RGBWW avec montage magnétique. Classification IP65. Parfait pour les pratiques et accents.",
            specs: { type: "Mini Panel", battery: "Internal", mounting: "Magnetic", image_url: "https://cdn.shopify.com/s/files/1/1343/1935/files/MCPro-1.png?v=1696906204&width=1000&crop=center" },
            stock: 8, type: "LED Mini"
        },
        {
            name: "amaran F21c Flexible LED Mat",
            brand: "Aputure / Amaran",
            category: "Lighting",
            description_en: "2x1' RGBWW Flexible Mat. Lightweight and thin. 100W output.",
            description_fr: "Mat flexible RGBWW 2x1'. Léger et fin. Puissance 100W.",
            specs: { type: "Flexible Mat", size: "2x1 ft", output: "100W", image_url: "https://static.bhphoto.com/images/multiple_images/images500x500/1648739988_IMG_1725343.jpg" },
            stock: 2, type: "LED Mat"
        },
        {
            name: "LiteGear LiteMat Series",
            brand: "LiteGear",
            category: "Lighting",
            description_en: "Ultra-thin, lightweight soft lighting. Available in LiteMat 2, 2L, and 4. Bi-Color control.",
            description_fr: "Éclairage doux ultra-fin et léger. Disponible en LiteMat 2, 2L et 4. Contrôle bi-couleur.",
            specs: { type: "Lightweight Panel", thickness: "< 1 inch", models: "2, 2L, 4", image_url: "https://s.turbifycdn.com/aah/filmandvideolighting/litegear-litemat-led-lighting-film-video-photo-17.jpg" },
            stock: 3, type: "LED Panel"
        },
        // GRIP & SUPPORT
        {
            name: "Professional Light Modifier Kit",
            brand: "Generic",
            category: "Grip & Support",
            description_en: "High-quality modifiers for Bowens mount fixtures. Includes Parabolic, Lantern, Octagon, and Rectangle softboxes.",
            description_fr: "Modificateurs de haute qualité pour projecteurs à monture Bowens. Inclut softboxes paraboliques, lanternes, octogones et rectangles.",
            specs: { mount: "Bowens", types: "Softbox, Lantern, Octa", image_url: "https://lightroom-photoshop-tutorials.com/wp-content/uploads/2021/06/Types-of-Light-Modifiers.webp" },
            stock: 10, type: "Light Modifiers"
        },
        {
            name: "Butterfly & Overhead Frames",
            brand: "Generic",
            category: "Grip & Support",
            description_en: "Standard frames for diffusion and bounce. Available in 4x4, 6x6, 8x8, 12x12, and 20x20.",
            description_fr: "Cadres standards pour diffusion et rebond. Disponibles en 4x4, 6x6, 8x8, 12x12 et 20x20.",
            specs: { material: "Aluminum / Steel", sizes: "4x4 to 20x20", image_url: "https://us.rosco.com/sites/default/files/content/product/2023-06/butterlies-muslin_molton_camouflage-group1_web_size_0.jpg" },
            stock: 5, type: "Frames"
        },
        {
            name: "Professional Grip Stand Package",
            brand: "Generic",
            category: "Grip & Support",
            description_en: "Includes C-Stands, Combo Stands, Wind-Up Stands, and High Rollers for overheads.",
            description_fr: "Inclut C-Stands, Combo Stands, pieds à treuil et High Rollers pour les overheads.",
            specs: { types: "C-Stand, Combo, Crank-Up", material: "Chrome Steel / Stainless", image_url: "https://www.essentialphoto.co.uk/cdn/shop/products/K-040047-PIXAPRO-HEAVY-DUTY-COMMERCIAL-STAND-BUNDLE-01.jpg?v=1682072193" },
            stock: 20, type: "Stands"
        },
        // POWER
        {
            name: "Mobile Film Generator (Silent)",
            brand: "Generic",
            category: "Power",
            description_en: "Silent generators for location filming. Range from 3Kva to 150Kva.",
            description_fr: "Générateurs silencieux pour le tournage en extérieur. De 3Kva à 150Kva.",
            specs: { fuel: "Diesel", output: "3Kva - 150Kva", feature: "Super Silent", image_url: "https://www.pro-lift-montagetechnik.com/WebRoot/Store15/Shops/78156040/6336/C105/EA30/C18A/1998/0A0C/6D0B/2F36/02823_Stromaggregat_Diesel_Silent_400V_E-Starter_10000W_DG14000SE3_1.png" },
            stock: 2, type: "Generator"
        },
        {
            name: "Power Distribution Box (3-Phase/1-Phase)",
            brand: "Generic",
            category: "Power",
            description_en: "Safe, reliable power distribution. 125A, 63A, 32A options in Single and Three Phase.",
            description_fr: "Distribution d'alimentation sûre et fiable. Options 125A, 63A, 32A en monophasé et triphasé.",
            specs: { amperage: "32A, 63A, 125A", protection: "RCD / MCB", image_url: "https://thehireman.co.uk/app/uploads/2022/03/125a-distribution-board_1-2.jpg" },
            stock: 5, type: "Distribution"
        },
        {
            name: "Professional Inline Dimmer",
            brand: "Generic",
            category: "Power",
            description_en: "Precise intensity control for Tungsten. 1kW, 2kW, 3kW, and 5kW options.",
            description_fr: "Contrôle précis de l'intensité pour le Tungstène. Options 1kW, 2kW, 3kW et 5kW.",
            specs: { capacity: "1KW - 5KW", type: "Linear Dimming", image_url: "https://www.resolutionhire.tv/wp-content/uploads/2020/01/2K-Dimmer-scaled.jpg" },
            stock: 10, type: "Dimmer"
        },
        // FILTERS
        {
            name: "Tiffen/Schneider Solid ND Filter 4x5.65",
            brand: "Tiffen / Schneider",
            category: "Filters",
            description_en: "Solid neutral density filter providing exposure reduction (1-stop, 2-stop, etc). 4x5.65 size.",
            description_fr: "Filtre ND solide offrant une réduction d'exposition (1-stop, 2-stop, etc). Taille 4x5.65.",
            specs: { size: "4x5.65", type: "Solid ND", stops: "0.3 - 2.1", image_url: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/Tiffen_45650ND3_4_x_5_65_Neutral_1636720564_86014.jpg" },
            stock: 5, type: "Solid ND"
        },
        {
            name: "Tiffen/Schneider IRND Filter 4x5.65",
            brand: "Tiffen / Schneider",
            category: "Filters",
            description_en: "Full Spectrum IRND. Eliminates infrared pollution on digital sensors while reducing exposure.",
            description_fr: "IRND plein spectre. Élimine la pollution infrarouge sur les capteurs numériques tout en réduisant l'exposition.",
            specs: { size: "4x5.65", type: "IRND", feature: "IR Cut", image_url: "https://static.bhphoto.com/images/images500x500/1502792755_572940.jpg" },
            stock: 5, type: "IRND"
        },
        {
            name: "Schneider Soft-Edge Grad ND 4x5.65",
            brand: "Schneider",
            category: "Filters",
            description_en: "Graduated ND to darken skies. Soft-edge transition. Horizontal orientation.",
            description_fr: "ND gradué pour assombrir les ciels. Transition bord doux. Orientation horizontale.",
            specs: { size: "4x5.65", type: "Graduated ND", edge: "Soft", image_url: "https://static.bhphoto.com/images/images500x500/1629724915_373624.jpg" },
            stock: 3, type: "Grad ND"
        },
        {
            name: "Tiffen Black Pro-Mist Filter",
            brand: "Tiffen",
            category: "Filters",
            description_en: "Reduces highlights and contrast. Smoothes facial wrinkles. Pastel-like quality.",
            description_fr: "Réduit les hautes lumières et le contraste. Lisse les rides du visage. Qualité pastel.",
            specs: { size: "4x5.65", type: "Diffusion", density: "1/8, 1/4, 1/2, 1", image_url: "https://static.bhphoto.com/images/images500x500/1727344805_85878.jpg" },
            stock: 4, type: "Diffusion"
        },
        {
            name: "Schneider True-Pol Linear Polarizer",
            brand: "Schneider",
            category: "Filters",
            description_en: "Effective polarizer for motion picture cameras. Extinction ratio of ER 374.",
            description_fr: "Polariseur efficace pour caméras de cinéma. Ratio d'extinction de ER 374.",
            specs: { size: "4x5.65", type: "Linear Polarizer", feature: "High Extinction", image_url: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/Schneider_68013056_True_Polarizing_Filter_4_x_1565868205_398939.jpg" },
            stock: 3, type: "Polarizer"
        },
        {
            name: "Tiffen 138mm Full Field Diopter Set",
            brand: "Tiffen",
            category: "Filters",
            description_en: "Set of +1/2, +1, +2, +3 diopters for close-focus work. Fits 138mm bellows or trays.",
            description_fr: "Jeu de dioptries +1/2, +1, +2, +3 pour le travail en gros plan. Compatible 138mm.",
            specs: { size: "138mm Round", type: "Diopter / Close-up", values: "+1/2 to +3", image_url: "https://images.squarespace-cdn.com/content/v1/61a7f2611cbe417ce838e1b3/09e74e3c-45b5-48cf-9681-5cf3b2cb3187/Tiffen-138mm-Diopter-Set-Wide.png?format=2500w" },
            stock: 1, type: "Diopter"
        },
        {
            name: "Schneider Blue True-Streak Filter",
            brand: "Schneider",
            category: "Filters",
            description_en: "Creates anamorphic-style blue streak flares from point light sources. 4x5.65 size.",
            description_fr: "Crée des flares bleus style anamorphique à partir de sources lumineuses ponctuelles. Taille 4x5.65.",
            specs: { size: "4x5.65", type: "Effect Filter", color: "Blue", image_url: "https://static.bhphoto.com/images/images500x500/1568816621_944109.jpg" },
            stock: 2, type: "Effect"
        }
    ]

    let addedCount = 0
    for (const item of lightingEquipment) {
        const slug = slugify(item.name)
        try {
            const existing = app.findFirstRecordByFilter(equipmentCollection, `slug = "${slug}"`)
            if (existing) {
                console.log(`⏭️ Skipping existing: ${item.name}`)
                continue
            }
        } catch (e) { }

        const catId = categoryMap[item.category]
        if (!catId) {
            console.log(`⚠️ Category not found: ${item.category}`)
            continue
        }

        const record = new Record(equipmentCollection)
        record.set("name", item.name)
        record.set("name_en", item.name)
        record.set("name_fr", item.name)
        record.set("slug", slug)
        record.set("brand", item.brand)
        record.set("category", catId)
        record.set("description", item.description_en)
        record.set("description_en", item.description_en)
        record.set("description_fr", item.description_fr)
        record.set("specs", JSON.stringify(item.specs))
        record.set("specs_en", JSON.stringify(item.specs))
        record.set("specs_fr", JSON.stringify(item.specs))
        record.set("stock_available", item.stock || 1)
        record.set("is_featured", false)
        record.set("visibility", "published")
        if (item.type) record.set("type", item.type)

        app.save(record)
        equipmentMap[slug] = record.id
        addedCount++
        console.log(`✅ Added: ${item.name}`)
    }

    // ===== 1-TON GRIP PACKAGE KIT =====
    const distroId = equipmentMap["power-distribution-box-3-phase1-phase"]
    if (distroId) {
        try {
            const existing = app.findFirstRecordByFilter(kitTemplatesCollection, `name = "1-Ton Grip & Lighting Package"`)
            if (!existing) {
                const kitRecord = new Record(kitTemplatesCollection)
                kitRecord.set("name", "1-Ton Grip & Lighting Package")
                kitRecord.set("description", "Essential grip and lighting package for location shoots. Includes stands, distribution, and basic tungsten/LED kit.")
                kitRecord.set("main_product_id", distroId)
                kitRecord.set("base_price_modifier", 0)
                app.save(kitRecord)
                console.log("✅ Added kit template: 1-Ton Grip & Lighting Package")
            }
        } catch (e) { }
    }

    console.log(`\n🎉 Migration complete! Added ${addedCount} equipment items.`)

}, (app) => {
    console.log("⬇️ Rolling back lighting/filters migration...")
})
