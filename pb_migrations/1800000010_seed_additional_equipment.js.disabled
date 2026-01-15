// Migration: Seed Additional Equipment (Cameras, Zoom Lenses, Lens Control)
// Adds 38 more equipment items to the existing catalog

const ID_EQUIPMENT = "pbc_equipment00001"
const ID_CATEGORIES = "pbc_categories0001"

// Helper to generate slug
function slugify(text) {
    return text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
}

migrate((app) => {
    console.log("🚀 Starting additional equipment seed migration...")

    // ===== GET EXISTING CATEGORIES =====
    const categoriesCollection = app.findCollectionByNameOrId(ID_CATEGORIES)
    const categoryRecords = app.findRecordsByFilter(categoriesCollection, "1=1", "", 100, 0)

    const categoryMap = {}
    for (const rec of categoryRecords) {
        categoryMap[rec.get("name")] = rec.id
    }
    console.log("📂 Found categories:", Object.keys(categoryMap))

    // ===== CREATE NEW CATEGORY: Lens Control =====
    if (!categoryMap["Lens Control"]) {
        const newCat = new Record(categoriesCollection)
        newCat.set("name", "Lens Control")
        newCat.set("name_en", "Lens Control")
        newCat.set("name_fr", "Contrôle d'Objectif")
        newCat.set("slug", "lens-control")
        newCat.set("description", "Wireless and mechanical follow focus systems, lens motors, and FIZ controllers")
        app.save(newCat)
        categoryMap["Lens Control"] = newCat.id
        console.log("✅ Created new category: Lens Control")
    }

    // ===== ADDITIONAL EQUIPMENT DATA =====
    const additionalEquipment = [
        // === CAMERAS ===
        {
            id: "cam_amira",
            name: "ARRI Amira",
            brand: "ARRI",
            category: "Cameras",
            description_en: "Arri's Amira offers an ergonomic design that's well-suited to handheld, shoulder-mount operation. Features the same sensor as the Alexa Mini.",
            description_fr: "L'Amira d'Arri offre un design ergonomique bien adapté à l'utilisation à main levée ou à l'épaule. Dispose du même capteur que l'Alexa Mini.",
            specs: {
                sensor_size: "28.3mm x 18.2mm",
                max_resolution: "3200 x 1800",
                dynamic_range: "14+ Stops",
                media_type: "CFast 2.0",
                weight_lbs: "9.2",
                codec: "ProRes, ARRIRAW",
                max_fps: "200fps max",
                image_url: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/panasonic_au_v35lt1g_cinema_varicam_lt_4k_1455802590_1226386.jpg"
            },
            stock_available: 1,
            type: "Cinema Camera",
            sensor_size: "Super 35",
            resolution: "3.2K"
        },
        {
            id: "cam_varicam_lt",
            name: "Panasonic VariCam LT",
            brand: "Panasonic",
            category: "Cameras",
            description_en: "The VariCam LT packages the VariCam 35's 4K Super 35mm sensor in a lightweight, single-body design. Features dual native ISO.",
            description_fr: "Le VariCam LT intègre le capteur 4K Super 35mm du VariCam 35 dans un design compact et léger. Dispose d'un double ISO natif.",
            specs: {
                sensor_size: "24.6mm x 12.9mm",
                max_resolution: "4096 x 2160",
                dynamic_range: "14+ Stops",
                media_type: "P2 Express, Micro P2",
                weight_lbs: "6",
                codec: "AVC-Intra, ProRes",
                max_fps: "60fps full sensor",
                image_url: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_k0_0014798_amira_camera_set_with_1513877808_1346962.jpg"
            },
            stock_available: 1,
            type: "Cinema Camera",
            sensor_size: "Super 35",
            resolution: "4K"
        },
        {
            id: "cam_sony_f55",
            name: "Sony PMW-F55",
            brand: "Sony",
            category: "Cameras",
            description_en: "The Super 35-format Sony F55 captures 16-bit image files at up to 4K raw. Features a global shutter.",
            description_fr: "La Sony F55 Super 35 capture des fichiers image 16 bits jusqu'en 4K raw. Dispose d'un obturateur global.",
            specs: {
                sensor_size: "24mm x 12.7mm",
                max_resolution: "4096 x 2160",
                dynamic_range: "14 Stops",
                media_type: "SxS, AXSM",
                weight_lbs: "4.85",
                codec: "XAVC, X-OCN",
                max_fps: "180fps max",
                image_url: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/Sony_PMW_F55_CineAlta_4K_Digital_1458308124_898428.jpg"
            },
            stock_available: 1,
            type: "Cinema Camera",
            sensor_size: "Super 35",
            resolution: "4K"
        },

        // === SPHERICAL PRIME LENSES ===
        {
            id: "lens_zeiss_master_prime",
            name: "ARRI / Zeiss Master Prime Set",
            brand: "Zeiss",
            category: "Lenses",
            description_en: "Arri/Zeiss Master Primes offer high contrast and resolution with virtually no breathing. T1.3 aperture across the set.",
            description_fr: "Les Master Primes Arri/Zeiss offrent un contraste et une résolution élevés avec pratiquement aucun breathing. Ouverture T1.3 sur tout le set.",
            specs: { mount: "PL", aperture: "T1.3", coverage: "Super 35", image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsKM9wNQwbX7kJIuSdy2K69ysSMwtJmeDWZQ&s" },
            stock_available: 1, type: "Prime Lens Set", mount: "PL", sensor_size: "Super 35"
        },
        {
            id: "lens_zeiss_super_speed",
            name: "ARRI / Zeiss Super Speed MK III Set",
            brand: "Zeiss",
            category: "Lenses",
            description_en: "Renowned for their classic cinematic look, Super Speed MK III primes offer high light-gathering capability (T1.3) with a warm, organic image character.",
            description_fr: "Réputées pour leur look cinématographique classique, les Super Speed MK III offrent une grande capacité de captation de lumière (T1.3) avec un caractère d'image chaud et organique.",
            specs: { mount: "PL", aperture: "T1.3", coverage: "Super 35", image_url: "https://cdn.sanity.io/images/rns5gelz/production/f76305fe454e6a8a91c77fb0d2bc937bd2c91988-2000x2000.jpg?w=1000&fit=max&auto=format" },
            stock_available: 1, type: "Prime Lens Set", mount: "PL", sensor_size: "Super 35"
        },
        {
            id: "lens_zeiss_cp2",
            name: "Zeiss Compact Prime CP.2 Set",
            brand: "Zeiss",
            category: "Lenses",
            description_en: "Designed for versatility, CP.2 lenses deliver sharp, high-contrast images. Interchangeable mounts and full-frame coverage.",
            description_fr: "Conçues pour la polyvalence, les optiques CP.2 offrent des images nettes et contrastées. Montures interchangeables et couverture plein format.",
            specs: { mount: "PL / EF", aperture: "T2.1", coverage: "Full Frame", image_url: "https://www.thevisionhouse.com.au/wp-content/uploads/2022/10/Zeiss-CP2-1-640x0-c-default.jpeg" },
            stock_available: 1, type: "Prime Lens Set", mount: "PL", sensor_size: "Full Frame"
        },
        {
            id: "lens_zeiss_cp3",
            name: "Zeiss Compact Prime CP.3 Set",
            brand: "Zeiss",
            category: "Lenses",
            description_en: "Building on the CP.2, the CP.3 offers improved mechanics, refined optical performance, and a smaller form factor.",
            description_fr: "S'appuyant sur le CP.2, le CP.3 offre une mécanique améliorée, des performances optiques raffinées et un format plus compact.",
            specs: { mount: "PL / EF", aperture: "T2.1", coverage: "Full Frame", image_url: "https://vmi.tv/wp-content/uploads/sites/3/2023/04/Zeiss-CP3-Set.jpg" },
            stock_available: 1, type: "Prime Lens Set", mount: "PL", sensor_size: "Full Frame"
        },
        {
            id: "lens_zeiss_ultra_prime",
            name: "ARRI / Zeiss Ultra Prime Set",
            brand: "Zeiss",
            category: "Lenses",
            description_en: "High-contrast, high-resolution lenses offering even field illumination. Widely considered a workhorse lens for cinema.",
            description_fr: "Optiques à haut contraste et haute résolution offrant une illumination uniforme. Considérées comme les optiques de travail par excellence du cinéma.",
            specs: { mount: "PL", aperture: "T1.9", coverage: "Super 35", image_url: "https://images.squarespace-cdn.com/content/v1/5e72aea433a7b935087f9d5d/83d842be-acd1-48e0-8b2d-be1e11120327/Screen+Shot+2023-02-15+at+9.08.34+AM.jpg" },
            stock_available: 1, type: "Prime Lens Set", mount: "PL", sensor_size: "Super 35"
        },
        {
            id: "lens_zeiss_standard",
            name: "Zeiss Standard Prime Set",
            brand: "Zeiss",
            category: "Lenses",
            description_en: "Known for their classic ZEISS look, Standard Primes deliver sharp, high-contrast images with natural color reproduction in a tiny form factor.",
            description_fr: "Connues pour leur look ZEISS classique, les Standard Primes offrent des images nettes et contrastées avec une reproduction naturelle des couleurs dans un format compact.",
            specs: { mount: "PL", aperture: "T2.1", coverage: "Super 35", image_url: "https://utopiacam.com/wp-content/uploads/2016/05/standardspeeds.jpg" },
            stock_available: 1, type: "Prime Lens Set", mount: "PL", sensor_size: "Super 35"
        },

        // === MACRO LENSES ===
        {
            id: "lens_arri_macro",
            name: "ARRI Macro Prime Set",
            brand: "ARRI",
            category: "Lenses",
            description_en: "Designed for close-focus cinematography, ARRI Macro Primes deliver exceptional sharpness and flat field performance.",
            description_fr: "Conçues pour la cinématographie en gros plan, les ARRI Macro Primes offrent une netteté exceptionnelle et des performances de champ plat.",
            specs: { mount: "PL", aperture: "T2.0", coverage: "Super 35", image_url: "https://static.madedaily.com/managed_images/a4fee251-1a0e-4276-b95d-716d2d3536ad/35617/ARRI-Macro-100mm-T2_C.jpg" },
            stock_available: 1, type: "Macro Lens", mount: "PL", sensor_size: "Super 35"
        },
        {
            id: "lens_zeiss_master_macro",
            name: "Zeiss Master Macro 100mm",
            brand: "Zeiss",
            category: "Lenses",
            description_en: "Designed for high-end macro cinematography, Master Macro Primes deliver exceptional sharpness and contrast from close focus to infinity.",
            description_fr: "Conçue pour la macrocinématographie haut de gamme, la Master Macro offre une netteté et un contraste exceptionnels du gros plan à l'infini.",
            specs: { focal_length: "100mm", mount: "PL", aperture: "T2.0", coverage: "Super 35", image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3o7xDEWDfq1fss3q_AqUFFTJR_yWBlqdYjw&s" },
            stock_available: 1, type: "Macro Lens", mount: "PL", sensor_size: "Super 35"
        },

        // === ANAMORPHIC LENSES ===
        {
            id: "lens_servicevision_scorpio",
            name: "Servicevision Scorpion Anamorphic Set",
            brand: "Servicevision",
            category: "Lenses",
            description_en: "Designed for lightweight anamorphic cinematography, Scorpion lenses deliver a classic character with pleasing oval bokeh.",
            description_fr: "Conçues pour la cinématographie anamorphique légère, les optiques Scorpion offrent un caractère classique avec un bokeh ovale agréable.",
            specs: { mount: "PL", aperture: "T2.2", coverage: "Full Frame / Super 35", image_url: "https://rental.servicevision.es/wp-content/uploads/2019/02/056_ScorpioLens_Anamorphic2x-1-scaled.jpg" },
            stock_available: 1, type: "Anamorphic Lens Set", mount: "PL", sensor_size: "Full Frame"
        },

        // === ZOOM LENSES ===
        {
            id: "lens_arri_uwz",
            name: "ARRI 9.5-18mm T2.9 Ultra Wide Zoom",
            brand: "ARRI",
            category: "Lenses",
            description_en: "This super-wide angle, near-telecentric zoom delivers optimal image quality with virtually no distortion.",
            description_fr: "Ce zoom ultra grand-angle quasi-télécentrique offre une qualité d'image optimale avec pratiquement aucune distorsion.",
            specs: { focal_length: "9.5-18mm", aperture: "T2.9", mount: "PL", coverage: "Large Format (Open Gate)", image_url: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_k2_0001686_uwz_9_5_18mm_t2_9_f_1499174765_1287811.jpg" },
            stock_available: 1, type: "Zoom Lens", mount: "PL", sensor_size: "Large Format"
        },
        {
            id: "lens_arri_alura_18_80",
            name: "ARRI Alura 18-80mm T2.6 Studio Zoom",
            brand: "ARRI",
            category: "Lenses",
            description_en: "Designed to match ARRI prime lenses in color and contrast, it delivers exceptional optical consistency. Optimized for ALEXA 2K.",
            description_fr: "Conçue pour correspondre aux optiques fixes ARRI en couleur et contraste, elle offre une consistance optique exceptionnelle. Optimisée pour ALEXA 2K.",
            specs: { focal_length: "18-80mm", aperture: "T2.6", mount: "PL", coverage: "Super 35", image_url: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_k2_47931_0_alura_18_80mm_t2_6_wide_angle_1487692047_1287816.jpg" },
            stock_available: 1, type: "Zoom Lens", mount: "PL", sensor_size: "Super 35"
        },
        {
            id: "lens_fuji_14_35",
            name: "Fujinon Cabrio 14-35mm T2.9",
            brand: "Fujinon",
            category: "Lenses",
            description_en: "Wide to telephoto zoom for Super 35mm cameras. Features a detachable ENG-style digital drive unit.",
            description_fr: "Zoom grand-angle à téléobjectif pour caméras Super 35mm. Dispose d'une unité de commande numérique détachable style ENG.",
            specs: { focal_length: "14-35mm", aperture: "T2.9", mount: "PL", coverage: "Super 35", image_url: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/fujinon_zk2_5x14_14_35mm_t2_9_cabrio_premier_1384866604_1013528.jpg" },
            stock_available: 1, type: "Zoom Lens", mount: "PL", sensor_size: "Super 35"
        },
        {
            id: "lens_fuji_19_90",
            name: "Fujinon Cabrio 19-90mm T2.9",
            brand: "Fujinon",
            category: "Lenses",
            description_en: "Versatile standard zoom with detachable servo drive. A workhorse for documentary and commercial production.",
            description_fr: "Zoom standard polyvalent avec servo détachable. Un outil de travail pour la production documentaire et commerciale.",
            specs: { focal_length: "19-90mm", aperture: "T2.9", mount: "PL", coverage: "Super 35", image_url: "https://static.bhphoto.com/images/multiple_images/images500x500/1498824105_IMG_823618.jpg" },
            stock_available: 1, type: "Zoom Lens", mount: "PL", sensor_size: "Super 35"
        },
        {
            id: "lens_fuji_20_120",
            name: "Fujinon Cabrio 20-120mm T3.5",
            brand: "Fujinon",
            category: "Lenses",
            description_en: "Lightweight zoom with standard 0.8 pitch gears. Servo unit optional (sold separately/check kit).",
            description_fr: "Zoom léger avec engrenages 0.8 standard. Unité servo optionnelle (vendue séparément/vérifier le kit).",
            specs: { focal_length: "20-120mm", aperture: "T3.5", mount: "PL", coverage: "Super 35", image_url: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/fujinon_xk6x20_nm_xk6x20_20_120_pl_mount_1488383209_1322733.jpg" },
            stock_available: 1, type: "Zoom Lens", mount: "PL", sensor_size: "Super 35"
        },
        {
            id: "lens_fuji_85_300",
            name: "Fujinon Cabrio 85-300mm T2.9-4.0",
            brand: "Fujinon",
            category: "Lenses",
            description_en: "Lightweight telephoto zoom with detachable servo. T2.9 until 200mm, ramping to T4.0 at 300mm.",
            description_fr: "Zoom téléobjectif léger avec servo détachable. T2.9 jusqu'à 200mm, passant à T4.0 à 300mm.",
            specs: { focal_length: "85-300mm", aperture: "T2.9-4.0", mount: "PL", coverage: "Super 35", image_url: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/fujinon_zk3_5x85_saf_85_300mm_cabrio_lens_1684943711_1733118.jpg" },
            stock_available: 1, type: "Zoom Lens", mount: "PL", sensor_size: "Super 35"
        },
        {
            id: "lens_canon_15_47",
            name: "Canon CN-E 15.5-47mm T2.8 Wide Zoom",
            brand: "Canon",
            category: "Lenses",
            description_en: "Wide-angle cinema zoom engineered for 4K resolution. Compact and lightweight.",
            description_fr: "Zoom cinéma grand-angle conçu pour la résolution 4K. Compact et léger.",
            specs: { focal_length: "15.5-47mm", aperture: "T2.8", mount: "PL", coverage: "Super 35", image_url: "https://static.bhphoto.com/images/images500x500/1346318521_889818.jpg" },
            stock_available: 1, type: "Zoom Lens", mount: "PL", sensor_size: "Super 35"
        },
        {
            id: "lens_canon_15_120",
            name: "Canon Cine-Servo 15-120mm T2.95-3.9",
            brand: "Canon",
            category: "Lenses",
            description_en: "Broadcast studio, sports, or live event lens. Pairs cine-style zoom with servo control.",
            description_fr: "Objectif pour studio broadcast, sport ou événement en direct. Associe zoom cinéma et contrôle servo.",
            specs: { focal_length: "15-120mm", aperture: "T2.95-3.9", mount: "PL / EF", coverage: "Full Frame / Super 35", image_url: "https://static.bhphoto.com/images/images500x500/1662540395_1725850.jpg" },
            stock_available: 1, type: "Zoom Lens", mount: "PL", sensor_size: "Full Frame"
        },
        {
            id: "lens_canon_25_250",
            name: "Canon Cine-Servo 25-250mm T2.95",
            brand: "Canon",
            category: "Lenses",
            description_en: "High magnification zoom with servo control. Includes built-in 1.5x extender.",
            description_fr: "Zoom à fort grossissement avec contrôle servo. Inclut un extender 1.5x intégré.",
            specs: { focal_length: "25-250mm", aperture: "T2.95", mount: "PL / EF", coverage: "Super 35", image_url: "https://static.bhphoto.com/images/images500x500/1587386883_1557489.jpg" },
            stock_available: 1, type: "Zoom Lens", mount: "PL", sensor_size: "Super 35"
        },
        {
            id: "lens_angenieux_16_40",
            name: "Angenieux Optimo Style 16-40mm T2.8",
            brand: "Angenieux",
            category: "Lenses",
            description_en: "Compact wide zoom supporting 4K resolution. Internal focus design with no breathing.",
            description_fr: "Zoom compact grand-angle supportant la résolution 4K. Design à mise au point interne sans breathing.",
            specs: { focal_length: "16-40mm", aperture: "T2.8", mount: "PL", coverage: "Super 35", image_url: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/angenieux_16_40_optimo_16_to_40mm_optimo_1419417309_1107020.jpg" },
            stock_available: 1, type: "Zoom Lens", mount: "PL", sensor_size: "Super 35"
        },
        {
            id: "lens_angenieux_28_76",
            name: "Angenieux Optimo 28-76mm T2.6",
            brand: "Angenieux",
            category: "Lenses",
            description_en: "Lightweight wide-angle to portrait zoom. Extremely high optical quality.",
            description_fr: "Zoom léger du grand-angle au portrait. Qualité optique extrêmement élevée.",
            specs: { focal_length: "28-76mm", aperture: "T2.6", mount: "PL", coverage: "Super 35", image_url: "https://static.bhphoto.com/images/images500x500/1493987833_1332901.jpg" },
            stock_available: 1, type: "Zoom Lens", mount: "PL", sensor_size: "Super 35"
        },
        {
            id: "lens_angenieux_48_130",
            name: "Angenieux Optimo Style 48-130mm T3",
            brand: "Angenieux",
            category: "Lenses",
            description_en: "Mid-telephoto zoom. Can be used with the Angenieux Servo Unit (ASU).",
            description_fr: "Zoom mi-téléobjectif. Peut être utilisé avec l'unité servo Angenieux (ASU).",
            specs: { focal_length: "48-130mm", aperture: "T3", mount: "PL", coverage: "Super 35", image_url: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/angenieux_optimo_48_130_style_with_asu_optimo_style_48_130mm_zoom_1513340578_1365594.jpg" },
            stock_available: 1, type: "Zoom Lens", mount: "PL", sensor_size: "Super 35"
        },
        {
            id: "lens_angenieux_19_94",
            name: "Angenieux Optimo Style 19.5-94mm T2.6",
            brand: "Angenieux",
            category: "Lenses",
            description_en: "Replaces the classic 17-80mm. Superb homogeneity of colorimetry, contrast and resolution.",
            description_fr: "Remplace le classique 17-80mm. Superbe homogénéité de colorimétrie, contraste et résolution.",
            specs: { focal_length: "19.5-94mm", aperture: "T2.6", mount: "PL", coverage: "Super 35", image_url: "https://epc.es/wp-content/uploads/2019/04/ANGENIEUX-195-94mm-20-scaled.jpg" },
            stock_available: 1, type: "Zoom Lens", mount: "PL", sensor_size: "Super 35"
        },
        {
            id: "lens_angenieux_30_76",
            name: "Angenieux Optimo Style 30-76mm T2.8",
            brand: "Angenieux",
            category: "Lenses",
            description_en: "Lightweight, compact, mid-range lens. Matches the Optimo line look.",
            description_fr: "Objectif mi-range léger et compact. Correspond au look de la gamme Optimo.",
            specs: { focal_length: "30-76mm", aperture: "T2.8", mount: "PL", coverage: "Super 35", image_url: "https://www.bhphotovideo.com/images/fb/angenieux_optimo_30_76_style_optimo_style_30_76mm_zoom_1365593.jpg" },
            stock_available: 1, type: "Zoom Lens", mount: "PL", sensor_size: "Super 35"
        },
        {
            id: "lens_zeiss_cz2_15_30",
            name: "Zeiss CZ.2 15-30mm Compact Zoom",
            brand: "Zeiss",
            category: "Lenses",
            description_en: "Short wide-angle zoom lens for full-frame sensors. Color matched to Zeiss primes.",
            description_fr: "Zoom grand-angle court pour capteurs plein format. Colorimétrie assortie aux optiques fixes Zeiss.",
            specs: { focal_length: "15-30mm", aperture: "T2.9", mount: "PL / EF / E", coverage: "Full Frame", image_url: "https://static.bhphoto.com/images/images500x500/1390563263_1023801.jpg" },
            stock_available: 1, type: "Zoom Lens", mount: "PL", sensor_size: "Full Frame"
        },
        {
            id: "lens_tokina_11_16",
            name: "Tokina 11-16mm T3.0",
            brand: "Tokina",
            category: "Lenses",
            description_en: "Professional cine wide-angle zoom. Re-housed with PL mount and 0.8 gears.",
            description_fr: "Zoom cinéma grand-angle professionnel. Reconditionnée avec monture PL et engrenages 0.8.",
            specs: { focal_length: "11-16mm", aperture: "T3.0", mount: "PL", coverage: "Super 35", image_url: "https://thehdhouse.com/wp-content/uploads/2023/09/tokina-duclos-11-16mm-T3.0-1.png" },
            stock_available: 1, type: "Zoom Lens", mount: "PL", sensor_size: "Super 35"
        },
        {
            id: "lens_sigma_50_100",
            name: "Sigma 50-100mm T2 High-Speed Zoom",
            brand: "Sigma",
            category: "Lenses",
            description_en: "Fast T2 aperture zoom. Delivers 6K-8K resolution performance.",
            description_fr: "Zoom rapide à ouverture T2. Offre des performances de résolution 6K-8K.",
            specs: { focal_length: "50-100mm", aperture: "T2", mount: "PL", coverage: "Super 35", image_url: "https://www.bhphotovideo.com/images/fb/sigma_693968_sigma_50_100mm_t2_for_1327932.jpg" },
            stock_available: 1, type: "Zoom Lens", mount: "PL", sensor_size: "Super 35"
        },

        // === LENS CONTROL ===
        {
            id: "ctrl_sxu1",
            name: "ARRI SXU-1 Single Axis Unit",
            brand: "ARRI",
            category: "Lens Control",
            description_en: "Wireless hand unit offering single-axis focus, iris, or zoom control.",
            description_fr: "Unité sans fil offrant un contrôle mono-axe pour la mise au point, l'iris ou le zoom.",
            specs: { channels: "1 Axis", compatibility: "ARRI / cforce", image_url: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_k2_0000071_sxu_1_single_axis_unit_1486549411_1287348.jpg" },
            stock_available: 1, type: "Wireless Controller"
        },
        {
            id: "ctrl_teradek_fiz",
            name: "Teradek RT FIZ Wireless Lens Control",
            brand: "Teradek",
            category: "Lens Control",
            description_en: "Features the CTRL.5 wireless lens controller, MDR.X receiver, and MOTR.S Max lens motor.",
            description_fr: "Comprend le contrôleur sans fil CTRL.5, le récepteur MDR.X et le moteur MOTR.S Max.",
            specs: { channels: "3 Axis", components: "CTRL.5, MDR.X, MOTR.S", image_url: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/teradek_15_0056_rt_fiz_wireless_lens_1726150825_1848823.jpg" },
            stock_available: 1, type: "Wireless Controller"
        },
        {
            id: "ctrl_teradek_ctrl3",
            name: "Teradek CTRL.3 Three-Axis Controller",
            brand: "Teradek",
            category: "Lens Control",
            description_en: "Control focus, iris, or zoom with ease. 5000' outdoor wireless range.",
            description_fr: "Contrôlez la mise au point, l'iris ou le zoom facilement. Portée sans fil de 1500m en extérieur.",
            specs: { channels: "3 Axis", range: "5000 ft", display: "OLED", image_url: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/teradek_15_0047_i_rt_ctrl_3_wireless_lens_1557400011_1473056.jpg" },
            stock_available: 1, type: "Wireless Controller"
        },
        {
            id: "ctrl_cmotion_one",
            name: "cmotion compact ONE Set",
            brand: "cmotion",
            category: "Lens Control",
            description_en: "Ready-to-shoot one motor system. Lightweight and compact.",
            description_fr: "Système mono-moteur prêt à tourner. Léger et compact.",
            specs: { channels: "1 Axis", motor: "Integrated", image_url: "https://videoking.eu/wp-content/uploads/2022/10/compact-ONE-set-E.jpg" },
            stock_available: 1, type: "Wireless Controller"
        },
        {
            id: "ctrl_arri_ff5",
            name: "ARRI FF-5 Cine Follow Focus",
            brand: "ARRI",
            category: "Lens Control",
            description_en: "Gear ratio of 2:1, designed for cine-style lenses. Snaps onto 15mm or 19mm rods.",
            description_fr: "Ratio d'engrenage 2:1, conçu pour les optiques cinéma. Se fixe sur des tiges de 15mm ou 19mm.",
            specs: { type: "Mechanical", ratio: "2:1", rod_support: "15mm/19mm", image_url: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_kk_0005758_follow_focus_ff_5_cine_1478778337_1288927.jpg" },
            stock_available: 1, type: "Follow Focus"
        },
        {
            id: "ctrl_arri_ff4",
            name: "ARRI FF-4 Follow Focus",
            brand: "ARRI",
            category: "Lens Control",
            description_en: "1:2 knob-to-gear ratio for smooth, accurate focus pulls. Robust economical unit.",
            description_fr: "Ratio bouton-engrenage 1:2 pour des tirages de point fluides et précis. Unité robuste et économique.",
            specs: { type: "Mechanical", ratio: "1:2", rod_support: "15mm LWS", image_url: "https://static.bhphoto.com/images/images500x500/1478779549_1288924.jpg" },
            stock_available: 1, type: "Follow Focus"
        },
        {
            id: "ctrl_arri_ff3",
            name: "ARRI FF-3 Follow Focus",
            brand: "ARRI",
            category: "Lens Control",
            description_en: "Lightweight single-sided follow focus. Ideal for handheld and studio setups.",
            description_fr: "Follow focus monotace léger. Idéal pour les configurations à main et en studio.",
            specs: { type: "Mechanical", rod_support: "15mm LWS", image_url: "https://tv-team.no/cdn/shop/files/arri-ff3-1x1-1.png?v=1688412622" },
            stock_available: 1, type: "Follow Focus"
        },
        {
            id: "ctrl_chrosziel_dv",
            name: "Chrosziel DV Studio Rig Follow Focus",
            brand: "Chrosziel",
            category: "Lens Control",
            description_en: "15mm lightweight standard follow focus. Includes VariLock dual hard stops.",
            description_fr: "Follow focus standard léger 15mm. Inclut les butées doubles VariLock.",
            specs: { type: "Mechanical", rod_support: "15mm LWS", gears: "6 included", image_url: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/chrosziel_c_206_60skit_dv_studio_rig_follow_1427280621_1131821.jpg" },
            stock_available: 1, type: "Follow Focus"
        }
    ]

    // ===== SEED EQUIPMENT =====
    const equipmentCollection = app.findCollectionByNameOrId(ID_EQUIPMENT)
    let addedCount = 0

    for (const item of additionalEquipment) {
        const slug = slugify(item.name)

        // Check if already exists
        try {
            const existing = app.findFirstRecordByFilter(equipmentCollection, `slug = "${slug}"`)
            if (existing) {
                console.log(`⏭️ Skipping existing: ${item.name}`)
                continue
            }
        } catch (e) {
            // Not found, continue to create
        }

        const catId = categoryMap[item.category]
        if (!catId) {
            console.log(`⚠️ Category not found for ${item.name}: ${item.category}`)
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
        record.set("stock_available", item.stock_available || 1)
        record.set("is_featured", false)
        record.set("visibility", "published")

        // Filter fields
        if (item.type) record.set("type", item.type)
        if (item.mount) record.set("mount", item.mount)
        if (item.sensor_size) record.set("sensor_size", item.sensor_size)
        if (item.resolution) record.set("resolution", item.resolution)

        app.save(record)
        addedCount++
        console.log(`✅ Added: ${item.name}`)
    }

    console.log(`\n🎉 Migration complete! Added ${addedCount} new equipment items.`)

}, (app) => {
    console.log("⬇️ Rolling back additional equipment seed...")

    const equipmentCollection = app.findCollectionByNameOrId(ID_EQUIPMENT)
    const additionalSlugs = [
        "arri-amira", "panasonic-varicam-lt", "sony-pmw-f55",
        "arri--zeiss-master-prime-set", "arri--zeiss-super-speed-mk-iii-set",
        "zeiss-compact-prime-cp2-set", "zeiss-compact-prime-cp3-set",
        "arri--zeiss-ultra-prime-set", "zeiss-standard-prime-set",
        "arri-macro-prime-set", "zeiss-master-macro-100mm",
        "servicevision-scorpion-anamorphic-set",
        "arri-95-18mm-t29-ultra-wide-zoom", "arri-alura-18-80mm-t26-studio-zoom",
        "fujinon-cabrio-14-35mm-t29", "fujinon-cabrio-19-90mm-t29",
        "fujinon-cabrio-20-120mm-t35", "fujinon-cabrio-85-300mm-t29-40",
        "canon-cn-e-155-47mm-t28-wide-zoom", "canon-cine-servo-15-120mm-t295-39",
        "canon-cine-servo-25-250mm-t295",
        "angenieux-optimo-style-16-40mm-t28", "angenieux-optimo-28-76mm-t26",
        "angenieux-optimo-style-48-130mm-t3", "angenieux-optimo-style-195-94mm-t26",
        "angenieux-optimo-style-30-76mm-t28", "zeiss-cz2-15-30mm-compact-zoom",
        "tokina-11-16mm-t30", "sigma-50-100mm-t2-high-speed-zoom",
        "arri-sxu-1-single-axis-unit", "teradek-rt-fiz-wireless-lens-control",
        "teradek-ctrl3-three-axis-controller", "cmotion-compact-one-set",
        "arri-ff-5-cine-follow-focus", "arri-ff-4-follow-focus",
        "arri-ff-3-follow-focus", "chrosziel-dv-studio-rig-follow-focus"
    ]

    for (const slug of additionalSlugs) {
        try {
            const record = app.findFirstRecordByFilter(equipmentCollection, `slug = "${slug}"`)
            if (record) {
                app.delete(record)
                console.log(`🗑️ Deleted: ${slug}`)
            }
        } catch (e) {
            // Not found, skip
        }
    }

    // Delete Lens Control category if empty
    try {
        const categoriesCollection = app.findCollectionByNameOrId(ID_CATEGORIES)
        const lensControlCat = app.findFirstRecordByFilter(categoriesCollection, `slug = "lens-control"`)
        if (lensControlCat) {
            app.delete(lensControlCat)
            console.log("🗑️ Deleted category: Lens Control")
        }
    } catch (e) { }

    console.log("⬇️ Rollback complete.")
})
