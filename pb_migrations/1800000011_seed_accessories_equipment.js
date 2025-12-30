// Migration: Seed Support, Monitors, Wireless, Stabilization, Power Equipment
// Adds 47 more equipment items

const ID_EQUIPMENT = "pbc_equipment00001"
const ID_CATEGORIES = "pbc_categories0001"

function slugify(text) {
    return text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
}

migrate((app) => {
    console.log("🚀 Starting support/monitors/accessories seed migration...")

    // Get existing categories
    const categoriesCollection = app.findCollectionByNameOrId(ID_CATEGORIES)
    const categoryRecords = app.findRecordsByFilter(categoriesCollection, "1=1", "", 100, 0)

    const categoryMap = {}
    for (const rec of categoryRecords) {
        categoryMap[rec.get("name")] = rec.id
    }
    console.log("📂 Found categories:", Object.keys(categoryMap))

    const additionalEquipment = [
        // === SUPPORT (FLUID HEADS & TRIPODS) ===
        {
            id: "supp_oconnor_2560",
            name: "OConnor Ultimate 2560 Fluid Head",
            brand: "OConnor",
            category: "Support",
            description_en: "Designed for digital cinema cameras. Capable of supporting payloads up to 66 lbs. Well suited for portable Alexa configurations.",
            description_fr: "Conçue pour les caméras de cinéma numérique. Capable de supporter des charges jusqu'à 30 kg. Idéale pour les configurations Alexa portables.",
            specs: { payload: "Up to 66 lbs", base: "Mitchell / 150mm", weight: "18 lbs", image_url: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/oconnor_c1260_0001_ultimate_2560_fluid_head_1434101716_1157454.jpg" },
            stock_available: 1, type: "Fluid Head"
        },
        {
            id: "supp_cartoni_master_mk2",
            name: "Cartoni Master MK2 Head",
            brand: "Cartoni",
            category: "Support",
            description_en: "Offers perfect counterbalance at any tilt angle and a consistent seamless fluid drag.",
            description_fr: "Offre un contrepoids parfait à tout angle d'inclinaison et un drag fluide constant et homogène.",
            specs: { payload: "Standard Cinema", base: "Mitchell / 150mm", counterbalance: "Patented", image_url: "https://www.cartoni.com/wp-content/uploads/ProductImages/FluidHeads/Cartoni_FluidHeads_H541_MasterMK2.jpg" },
            stock_available: 1, type: "Fluid Head"
        },
        {
            id: "supp_cartoni_maxima_30",
            name: "Cartoni Maxima 30 Video Fluid Head",
            brand: "Cartoni",
            category: "Support",
            description_en: "Covers needs of rigs from 6.6 to 88 lb. Continuous drag system enables almost freewheeling moves.",
            description_fr: "Couvre les besoins des configurations de 3 à 40 kg. Le système de drag continu permet des mouvements quasi libres.",
            specs: { payload: "6.6 to 88 lbs", base: "Mitchell", drag: "Continuous", image_url: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/cartoni_hm3100_maxima_30_head_1499187934_1324640.jpg" },
            stock_available: 1, type: "Fluid Head"
        },
        {
            id: "supp_sachtler_30",
            name: "Sachtler VIDEO 30 II Tripod",
            brand: "Sachtler",
            category: "Support",
            description_en: "Features a 150mm bowl and supports heavy cameras up to 32 kg. Integrated Sideload platform.",
            description_fr: "Dispose d'une cuvette 150mm et supporte des caméras lourdes jusqu'à 32 kg. Plateforme Sideload intégrée.",
            specs: { payload: "3 to 32 kg", bowl: "150mm", counterbalance: "18 steps", image_url: "https://www.trm.fr/wp-content/uploads/2024/02/SAC_3007_Cine-30-fluid-head_02-600x600-c.jpg" },
            stock_available: 1, type: "Tripod System"
        },
        {
            id: "supp_arrihead_2",
            name: "ARRIHEAD 2 Geared Head",
            brand: "ARRI",
            category: "Support",
            description_en: "Compact geared head designed for film and digital. Tilt-axis centered on the camera's optical center.",
            description_fr: "Tête à engrenages compacte conçue pour le film et le numérique. Axe d'inclinaison centré sur le centre optique de la caméra.",
            specs: { type: "Geared Head", compatibility: "ARRI Bottom Plates", tilt_axis: "Centered", image_url: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_k2_43670_0_arrihead_2_production_tripod_1478794858_1288722.jpg" },
            stock_available: 1, type: "Geared Head"
        },

        // === MATTE BOXES ===
        {
            id: "mb_arri_lmb25",
            name: "ARRI LMB-25 Matte Box Set",
            brand: "ARRI",
            category: "Matte Boxes",
            description_en: "Lightweight, modular matte box. Supports up to three filter stages. Clip-on or rod mount.",
            description_fr: "Matte box légère et modulaire. Supporte jusqu'à trois étages de filtres. Montage clip-on ou sur tiges.",
            specs: { filters: "4x5.65", mounting: "Clamp-on / 15mm LWS", stages: "2 or 3", image_url: "https://static.bhphoto.com/images/images500x500/1488196247_1288790.jpg" },
            stock_available: 1, type: "Matte Box"
        },
        {
            id: "mb_arri_mmb2",
            name: "ARRI MMB-2 Double LWS Set",
            brand: "ARRI",
            category: "Matte Boxes",
            description_en: "Compact matte box with 15mm LWS rod bracket and two filter trays.",
            description_fr: "Matte box compacte avec support de tiges 15mm LWS et deux plateaux de filtres.",
            specs: { filters: "4x5.65 / 4x4", mounting: "15mm LWS", diameter: "114mm", image_url: "https://static.bhphoto.com/images/images500x500/1533910662_1220658.jpg" },
            stock_available: 1, type: "Matte Box"
        },
        {
            id: "mb_arri_mb28",
            name: "ARRI MB-28 6x6 Production Matte Box",
            brand: "ARRI",
            category: "Matte Boxes",
            description_en: "Swing-away matte box with two sliding trays and one geared tray. 6.6 x 6.6 format.",
            description_fr: "Matte box pivotante avec deux plateaux coulissants et un plateau à engrenages. Format 6.6 x 6.6.",
            specs: { filters: "6.6 x 6.6", mounting: "19mm Studio", feature: "Swing-away", image_url: "https://vmi.tv/wp-content/uploads/sites/3/2019/03/ARRI-MB28-Matte-Box-3-2.jpg" },
            stock_available: 1, type: "Matte Box"
        },
        {
            id: "mb_arri_mb14",
            name: "ARRI MB-14 Matte Box",
            brand: "ARRI",
            category: "Matte Boxes",
            description_en: "Production matte box for large zooms and primes. 6.6 x 6.6 filter size.",
            description_fr: "Matte box de production pour grands zooms et optiques fixes. Taille de filtre 6.6 x 6.6.",
            specs: { filters: "6.6 x 6.6", mounting: "19mm / 15mm Studio", usage: "Large Zooms", image_url: "https://patriot.ua/wp-content/uploads/2019/06/MB14-e1581070184302-1300x1299.jpg" },
            stock_available: 1, type: "Matte Box"
        },
        {
            id: "mb_chrosziel_450",
            name: "Chrosziel 450-R11 Matte Box",
            brand: "Chrosziel",
            category: "Matte Boxes",
            description_en: "Fits 15mm support rods. Single stage filter holder for 4x4 or 4x5.65.",
            description_fr: "Compatible avec les tiges de support 15mm. Porte-filtre mono-étage pour 4x4 ou 4x5.65.",
            specs: { filters: "4x5.65 / 4x4", mounting: "15mm LWS", diameter: "114mm", image_url: "https://static.bhphoto.com/images/images500x500/1346675010_889174.jpg" },
            stock_available: 1, type: "Matte Box"
        },

        // === MONITORS (On-Camera & Production) ===
        {
            id: "mon_smallhd_ultra7_touch",
            name: "SmallHD ULTRA 7 UHD 4K Monitor",
            brand: "SmallHD",
            category: "Monitors",
            description_en: "Bright 2300 cd/m2 display. Camera control options for ARRI, Sony, RED.",
            description_fr: "Écran lumineux 2300 cd/m2. Options de contrôle caméra pour ARRI, Sony, RED.",
            specs: { size: "7 inch", brightness: "2300 nits", resolution: "1920 x 1200", inputs: "HDMI / 6G-SDI", image_url: "https://static.bhphoto.com/images/images500x500/1731335130_1795838.jpg" },
            stock_available: 1, type: "On-Camera Monitor"
        },
        {
            id: "mon_smallhd_703",
            name: "SmallHD 703 Bolt 7\" Wireless Monitor",
            brand: "SmallHD",
            category: "Monitors",
            description_en: "Director's monitor with built-in Teradek receiver (Bolt 500/1000/3000 compatible).",
            description_fr: "Moniteur réalisateur avec récepteur Teradek intégré (compatible Bolt 500/1000/3000).",
            specs: { size: "7 inch", brightness: "3000 nits", wireless: "Integrated Receiver", latency: "Zero Delay", image_url: "https://static.bhphoto.com/images/images500x500/1515023115_1380051.jpg" },
            stock_available: 1, type: "Wireless Monitor"
        },
        {
            id: "mon_smallhd_702_oled",
            name: "SmallHD 702 OLED On-Camera Monitor",
            brand: "SmallHD",
            category: "Monitors",
            description_en: "Wide-gamut OLED display solution. Pure blacks and high contrast.",
            description_fr: "Solution d'affichage OLED à large gamut. Noirs purs et contraste élevé.",
            specs: { size: "7 inch", panel: "OLED", gamut: "Wide Color Gamut", image_url: "https://static.bhphoto.com/images/images500x500/1487601332_1320437.jpg" },
            stock_available: 1, type: "On-Camera Monitor"
        },
        {
            id: "mon_smallhd_cine7_red",
            name: "SmallHD Cine 7 RED RCP2 Monitor",
            brand: "SmallHD",
            category: "Monitors",
            description_en: "Includes RED KOMODO/DSMC3 RCP2 camera control software upgrade.",
            description_fr: "Inclut la mise à jour logicielle de contrôle caméra RED KOMODO/DSMC3 RCP2.",
            specs: { size: "7 inch", control: "RED RCP2", brightness: "1800 nits", image_url: "https://static.bhphoto.com/images/multiple_images/images500x500/1640703758_IMG_1667808.jpg" },
            stock_available: 1, type: "On-Camera Monitor"
        },
        {
            id: "mon_tvlogic_055a",
            name: "TVLogic VFM-055A 5.5\" OLED",
            brand: "TVLogic",
            category: "Monitors",
            description_en: "OLED display delivering deep blacks and accurate color. Compact design.",
            description_fr: "Écran OLED offrant des noirs profonds et des couleurs précises. Design compact.",
            specs: { size: "5.5 inch", panel: "OLED", resolution: "1920 x 1080", image_url: "https://static.bhphoto.com/images/images500x500/1505816473_1362534.jpg" },
            stock_available: 1, type: "On-Camera Monitor"
        },
        {
            id: "mon_tvlogic_056w",
            name: "TVLogic VFM-056W/WP",
            brand: "TVLogic",
            category: "Monitors",
            description_en: "Lightweight magnesium-alloy case. Ideal for HD-SLR production.",
            description_fr: "Boîtier léger en alliage de magnésium. Idéal pour la production HD-SLR.",
            specs: { size: "5.6 inch", resolution: "1280 x 800", features: "Waveform/Vectorscope", image_url: "https://www.tvlogic.tv/Monitors/UpImg/VFM-056WP-FRONT(0)(1).png" },
            stock_available: 1, type: "On-Camera Monitor"
        },
        {
            id: "mon_tvlogic_071w",
            name: "TVLogic LQM-071W",
            brand: "TVLogic",
            category: "Monitors",
            description_en: "Features 4 Autosensing Inputs. Rack mountable.",
            description_fr: "Dispose de 4 entrées à détection automatique. Montage en rack possible.",
            specs: { size: "7 inch", inputs: "4 x BNC", display: "Split Screen capable", image_url: "https://tvlogic.tv/Monitors/UpImg/LQM-071W-FRONT.gif" },
            stock_available: 1, type: "Production Monitor"
        },
        {
            id: "mon_tvlogic_091w",
            name: "TVLogic LVM-091W-M",
            brand: "TVLogic",
            category: "Monitors",
            description_en: "9 inch broadcast production monitor. High contrast anti-glare panel.",
            description_fr: "Moniteur de production broadcast 9 pouces. Panneau anti-reflet à haut contraste.",
            specs: { size: "9 inch", resolution: "960x540 (Native)", contrast: "1000:1", image_url: "https://www.tvlogic.tv/Monitors/UpImg/1042_782_LVM-091W(1).png" },
            stock_available: 1, type: "Production Monitor"
        },
        {
            id: "mon_tvlogic_24",
            name: "TVLogic 24\" Full HD 3G-SDI Monitor",
            brand: "TVLogic",
            category: "Monitors",
            description_en: "Full HD 24\" display designed for field monitoring. Max brightness 600 cd/m2.",
            description_fr: "Écran Full HD 24\" conçu pour le monitoring de terrain. Luminosité max 600 cd/m2.",
            specs: { size: "24 inch", resolution: "1920 x 1200", brightness: "600 nits", image_url: "https://static.bhphoto.com/images/images500x500/1671531924_1737071.jpg" },
            stock_available: 1, type: "Production Monitor"
        },
        {
            id: "mon_sony_bvm_e251",
            name: "Sony BVM-E251 24\" OLED Reference",
            brand: "Sony",
            category: "Monitors",
            description_en: "Reference Monitor for critical image evaluation. Exceptional contrast and deep blacks.",
            description_fr: "Moniteur de référence pour l'évaluation critique d'image. Contraste exceptionnel et noirs profonds.",
            specs: { size: "24 inch", panel: "OLED", usage: "Color Grading / Reference", image_url: "https://www.sony.com/image/3f6290bc8a31d7cf13236376d5e855dc?fmt=jpeg&wid=558&hei=336" },
            stock_available: 1, type: "Reference Monitor"
        },
        {
            id: "mon_marshall_24",
            name: "Marshall V-MD241 24\" LED LCD",
            brand: "Marshall",
            category: "Monitors",
            description_en: "Fit for professional SD and HD productions. LED backlit.",
            description_fr: "Adapté aux productions SD et HD professionnelles. Rétroéclairage LED.",
            specs: { size: "24 inch", panel: "LCD", inputs: "Component / Composite", image_url: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/marshall_electronics_v_md241_24_led_lcd_1386257619_982146.jpg" },
            stock_available: 1, type: "Production Monitor"
        },
        {
            id: "mon_transvideo_starlite",
            name: "ARRI Transvideo Starlite ARRI-WVS",
            brand: "ARRI",
            category: "Monitors",
            description_en: "Combination monitor/recorder with built-in wireless video receiver.",
            description_fr: "Combinaison moniteur/enregistreur avec récepteur vidéo sans fil intégré.",
            specs: { size: "5 inch", panel: "OLED Touch", wireless: "ARRI-WVS Receiver", image_url: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_k2_0015243_transvideo_starlite_arri_wvs_1525176383_1367785.jpg" },
            stock_available: 1, type: "Monitor Recorder"
        },
        {
            id: "mon_bm_assist_5",
            name: "Blackmagic Video Assist 5\" 3G-SDI",
            brand: "Blackmagic Design",
            category: "Monitors",
            description_en: "Monitoring and high-quality recording. 3G-SDI and HDMI inputs.",
            description_fr: "Monitoring et enregistrement haute qualité. Entrées 3G-SDI et HDMI.",
            specs: { size: "5 inch", recording: "ProRes / DNxHD", brightness: "300 nits", image_url: "https://static.bhphoto.com/images/images500x500/1594908697_1578060.jpg" },
            stock_available: 1, type: "Monitor Recorder"
        },
        {
            id: "mon_bm_assist_7",
            name: "Blackmagic Video Assist 7\" 12G-SDI",
            brand: "Blackmagic Design",
            category: "Monitors",
            description_en: "Bright 2500 cd/m2 display. 12G-SDI and HDMI inputs. Supports Blackmagic Raw.",
            description_fr: "Écran lumineux 2500 cd/m2. Entrées 12G-SDI et HDMI. Supporte Blackmagic Raw.",
            specs: { size: "7 inch", brightness: "2500 nits", inputs: "12G-SDI / HDMI", image_url: "https://static.bhphoto.com/images/images500x500/1568713006_1507213.jpg" },
            stock_available: 1, type: "Monitor Recorder"
        },
        {
            id: "mon_atomos_shogun",
            name: "Atomos Shogun 7\" HDR Monitor",
            brand: "Atomos",
            category: "Monitors",
            description_en: "Ultra-bright 3000 nit display. Monitor, record, and switch in a single tool.",
            description_fr: "Écran ultra-lumineux 3000 nits. Moniteur, enregistreur et mélangeur en un seul outil.",
            specs: { size: "7 inch", brightness: "3000 nits", recording: "ProRes RAW", image_url: "https://static.bhphoto.com/images/images500x500/1727171715_1854463.jpg" },
            stock_available: 1, type: "Monitor Recorder"
        },
        {
            id: "mon_atomos_ninja",
            name: "Atomos Ninja Inferno 7\"",
            brand: "Atomos",
            category: "Monitors",
            description_en: "Record DCI and UHD 4K signals at up to 60 fps. AtomHDR display technology.",
            description_fr: "Enregistre les signaux DCI et UHD 4K jusqu'à 60 fps. Technologie d'affichage AtomHDR.",
            specs: { size: "7 inch", recording: "4K 60fps", inputs: "HDMI", image_url: "https://static.bhphoto.com/images/multiple_images/images500x500/1490258703_IMG_773212.jpg" },
            stock_available: 1, type: "Monitor Recorder"
        },
        {
            id: "mon_pix_e7",
            name: "Video Devices PIX-E7 7\" 4K Recorder",
            brand: "Video Devices",
            category: "Monitors",
            description_en: "Record 4K video over HDMI and 6G-SDI to SpeedDrive SSDs. Die-cast metal chassis.",
            description_fr: "Enregistre la vidéo 4K via HDMI et 6G-SDI sur SSD SpeedDrive. Châssis en métal moulé.",
            specs: { size: "7 inch", recording: "ProRes", media: "SpeedDrive SSD", image_url: "https://static.bhphoto.com/images/images500x500/1428938280_1137280.jpg" },
            stock_available: 1, type: "Monitor Recorder"
        },

        // === WIRELESS VIDEO ===
        {
            id: "wl_teradek_ranger",
            name: "Teradek Ranger MK II 750",
            brand: "Teradek",
            category: "Wireless Video",
            description_en: "Transmit lossless 4K video up to 750'. Zero delay.",
            description_fr: "Transmet la vidéo 4K sans perte jusqu'à 230m. Latence zéro.",
            specs: { range: "750 ft", resolution: "4K HDR", latency: "Zero Delay", image_url: "https://static.bhphoto.com/images/images500x500/1705406436_1761089.jpg" },
            stock_available: 1, type: "Wireless Transmitter"
        },
        {
            id: "wl_teradek_bolt6_750",
            name: "Teradek Bolt 6 LT 750 Kit",
            brand: "Teradek",
            category: "Wireless Video",
            description_en: "Supports 6 GHz wireless frequency. 4K30 video with 10-bit HDR.",
            description_fr: "Supporte la fréquence sans fil 6 GHz. Vidéo 4K30 avec HDR 10 bits.",
            specs: { range: "750 ft", resolution: "4K30", frequency: "6 GHz", image_url: "https://static.bhphoto.com/images/images750x750/1722001523_1841011.jpg" },
            stock_available: 1, type: "Wireless Transmitter"
        },
        {
            id: "wl_teradek_3000",
            name: "Teradek Bolt Pro 3000 Set",
            brand: "Teradek",
            category: "Wireless Video",
            description_en: "Transmit uncompressed 1080p video over 3000 feet line-of-sight.",
            description_fr: "Transmet la vidéo 1080p non compressée sur 900m en ligne de vue.",
            specs: { range: "3000 ft", resolution: "1080p60", multicast: "Up to 4 receivers", image_url: "https://static.bhphoto.com/images/images500x500/1471872050_1273194.jpg" },
            stock_available: 1, type: "Wireless Transmitter"
        },
        {
            id: "wl_teradek_sidekick",
            name: "Teradek Bolt Sidekick II",
            brand: "Teradek",
            category: "Wireless Video",
            description_en: "Universal receiver compatible with Bolt 500, 1000, and 3000 transmitters.",
            description_fr: "Récepteur universel compatible avec les émetteurs Bolt 500, 1000 et 3000.",
            specs: { range: "300 ft", compatibility: "Bolt 500/1000/3000", output: "SDI", image_url: "https://static.bhphoto.com/images/images500x500/1491412879_1328070.jpg" },
            stock_available: 1, type: "Wireless Receiver"
        },
        {
            id: "wl_teradek_2000",
            name: "Teradek Bolt Pro 2000 Set",
            brand: "Teradek",
            category: "Wireless Video",
            description_en: "Latency free wireless transmission up to 2000 ft over the 5GHz band.",
            description_fr: "Transmission sans fil sans latence jusqu'à 600m sur la bande 5GHz.",
            specs: { range: "2000 ft", latency: "Zero Delay", inputs: "SDI / HDMI", image_url: "https://static.bhphoto.com/images/images500x500/1425923204_1076568.jpg" },
            stock_available: 1, type: "Wireless Transmitter"
        },
        {
            id: "wl_teradek_1000xt",
            name: "Teradek Bolt 1000 XT Set",
            brand: "Teradek",
            category: "Wireless Video",
            description_en: "Visually lossless 3G video signals with zero latency up to 1000 ft.",
            description_fr: "Signaux vidéo 3G visuellement sans perte avec latence zéro jusqu'à 300m.",
            specs: { range: "1000 ft", feature: "Cross Conversion", latency: "Zero Delay", image_url: "https://static.bhphoto.com/images/images500x500/1525370855_1403862.jpg" },
            stock_available: 1, type: "Wireless Transmitter"
        },
        {
            id: "wl_teradek_1000",
            name: "Teradek Bolt Pro 1000 Set",
            brand: "Teradek",
            category: "Wireless Video",
            description_en: "Transmit uncompressed 1080p video wirelessly over 1000 feet.",
            description_fr: "Transmet la vidéo 1080p non compressée sans fil sur 300m.",
            specs: { range: "1000 ft", latency: "Zero Delay", resolution: "1080p60", image_url: "https://static.bhphoto.com/images/images500x500/1471867680_1273184.jpg" },
            stock_available: 1, type: "Wireless Transmitter"
        },
        {
            id: "wl_teradek_lt500",
            name: "Teradek Bolt LT 500 Set",
            brand: "Teradek",
            category: "Wireless Video",
            description_en: "Lighter and smaller high-performance wireless video system.",
            description_fr: "Système vidéo sans fil haute performance plus léger et compact.",
            specs: { range: "500 ft", latency: "Zero Delay", inputs: "SDI or HDMI", image_url: "https://tdmstore.tdm.ma/wp-content/uploads/2020/05/TERADEK-HF-BOLT-LT-500.jpg" },
            stock_available: 1, type: "Wireless Transmitter"
        },
        {
            id: "wl_teradek_500xt",
            name: "Teradek Bolt 500 XT Set",
            brand: "Teradek",
            category: "Wireless Video",
            description_en: "Send and receive visually lossless 3G-video signals up to 500'.",
            description_fr: "Envoie et reçoit des signaux vidéo 3G visuellement sans perte jusqu'à 150m.",
            specs: { range: "500 ft", latency: "Zero Delay", compatibility: "Bolt 500 Series", image_url: "https://static.bhphoto.com/images/images750x750/1524585083_1403845.jpg" },
            stock_available: 1, type: "Wireless Transmitter"
        },
        {
            id: "wl_teradek_300",
            name: "Teradek Bolt Pro 300 Set",
            brand: "Teradek",
            category: "Wireless Video",
            description_en: "Dual Format Video Transmitter/Receiver. Internal antennas.",
            description_fr: "Émetteur/Récepteur vidéo double format. Antennes internes.",
            specs: { range: "300 ft", latency: "Zero Delay", inputs: "SDI / HDMI", image_url: "" },
            stock_available: 1, type: "Wireless Transmitter"
        },
        {
            id: "wl_swit_cws300",
            name: "SWIT CW-S300 Wireless System",
            brand: "SWIT",
            category: "Wireless Video",
            description_en: "Stable, low-latency video transmission for professional on-set monitoring.",
            description_fr: "Transmission vidéo stable à faible latence pour le monitoring professionnel sur plateau.",
            specs: { inputs: "SDI / HDMI", latency: "Low", range: "Long Range", image_url: "https://media.tarad.com/9/99aplus/img-lib/spd_2018051492235_b.jpg" },
            stock_available: 1, type: "Wireless System"
        },
        {
            id: "wl_hollyland_400s",
            name: "Hollyland Mars 400S PRO II",
            brand: "Hollyland",
            category: "Wireless Video",
            description_en: "Receive up to 1080p60 wireless video. Low 70ms latency.",
            description_fr: "Reçoit la vidéo sans fil jusqu'à 1080p60. Faible latence de 70ms.",
            specs: { range: "500 ft", latency: "70 ms", inputs: "SDI / HDMI", image_url: "https://static.bhphoto.com/images/images500x500/1701775224_1797151.jpg" },
            stock_available: 1, type: "Wireless System"
        },

        // === STABILIZATION (GIMBALS) ===
        {
            id: "stab_ronin_s",
            name: "DJI Ronin-S",
            brand: "DJI",
            category: "Stabilization",
            description_en: "Single-handed form factor for DSLR and mirrorless cameras.",
            description_fr: "Format mono-main pour appareils reflex et hybrides.",
            specs: { payload: "8 lbs", type: "Single Handed", compatibility: "DSLR / Mirrorless", image_url: "https://static.bhphoto.com/images/images500x500/1527601874_1383648.jpg" },
            stock_available: 1, type: "Gimbal"
        },
        {
            id: "stab_force_pro",
            name: "DJI Force Pro",
            brand: "DJI",
            category: "Stabilization",
            description_en: "Remote controller featuring Motion Control for Ronin 2 and Ronin-S.",
            description_fr: "Télécommande avec contrôle de mouvement pour Ronin 2 et Ronin-S.",
            specs: { control: "Motion Control", compatibility: "Ronin 2 / Ronin-S", display: "OLED", image_url: "https://store.droneway.ma/wp-content/uploads/2020/11/DJI-Force-Pro.jpg" },
            stock_available: 1, type: "Motion Controller"
        },
        {
            id: "stab_rs3_pro",
            name: "DJI RS 3 Pro Combo",
            brand: "DJI",
            category: "Stabilization",
            description_en: "Professional 3-axis motorized stabilization system with extended payload capacity.",
            description_fr: "Système de stabilisation motorisé 3 axes professionnel avec capacité de charge étendue.",
            specs: { material: "Carbon Fiber", payload: "10 lbs", features: "Automated Axis Locks", image_url: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/dji_rs_3_pro_gimbal_1720204160_1797421.jpg" },
            stock_available: 1, type: "Gimbal"
        },
        {
            id: "stab_rs4_pro",
            name: "DJI RS 4 Pro Combo",
            brand: "DJI",
            category: "Stabilization",
            description_en: "Enhanced operation efficiency, native vertical shooting. 9.9 lb load capacity.",
            description_fr: "Efficacité opérationnelle améliorée, prise de vue verticale native. Capacité de charge 4.5 kg.",
            specs: { payload: "9.9 lb", battery: "13 Hours", vertical: "Native Shooting", image_url: "https://static.bhphoto.com/images/images500x500/1730825421_1816789.jpg" },
            stock_available: 1, type: "Gimbal"
        },
        {
            id: "stab_crane_3s",
            name: "Zhiyun CRANE 3S",
            brand: "Zhiyun",
            category: "Stabilization",
            description_en: "Powerful redesign with detachable handle options and 14.3 lb payload.",
            description_fr: "Redéign puissant avec poignées détachables et charge utile de 6.5 kg.",
            specs: { payload: "14.3 lb", design: "Modular", axis: "55 degree roll", image_url: "https://static.bhphoto.com/images/images500x500/1584603943_1554049.jpg" },
            stock_available: 1, type: "Gimbal"
        },

        // === POWER ===
        {
            id: "power_ecoflow_delta",
            name: "EcoFlow DELTA Pro Power Station",
            brand: "EcoFlow",
            category: "Power",
            description_en: "Portable power station delivering 3600Wh of power. AC outlets and USB ports.",
            description_fr: "Station d'alimentation portable fournissant 3600Wh de puissance. Prises AC et ports USB.",
            specs: { capacity: "3600Wh", output: "3600W AC", charging: "AC, Solar, EV", image_url: "https://static.bhphoto.com/images/images500x500/1642768650_1685678.jpg" },
            stock_available: 1, type: "Power Station"
        }
    ]

    // Seed equipment
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
        } catch (e) { }

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
        if (item.type) record.set("type", item.type)

        app.save(record)
        addedCount++
        console.log(`✅ Added: ${item.name}`)
    }

    console.log(`\n🎉 Migration complete! Added ${addedCount} new equipment items.`)

}, (app) => {
    console.log("⬇️ Rolling back support/monitors/accessories seed...")
    // Rollback logic would go here if needed
})
