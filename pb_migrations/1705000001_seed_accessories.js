/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    // 1. Data Definitions
    const equipmentData = [
        // --- LENS CONTROL (Wireless & Mechanical) ---
        {
            name: "Arri Hi-5 Wireless Set",
            slug: "arri-hi-5-wireless-set",
            brand: "ARRI",
            category_slug: "lens-control",
            description_en: "The versatile Hi-5 RX-TX 2400 Set from ARRI combines one Hi-5 wireless handheld FIZ unit with one white-coded RF-EMIP radio module, one Radio Interface Adapter RIA-1, two red-coded RF-2400 radio modules, and accessories.",
            description_fr: "L'ensemble polyvalent Hi-5 RX-TX 2400 d'ARRI combine une unité manuelle sans fil FIZ Hi-5 avec un module radio RF-EMIP à code blanc, un adaptateur d'interface radio RIA-1 et des modules radio RF-2400.",
            specs: {
                "frequency": "2400 MHz DSSS / FHSS",
                "channels": "14",
                "range": "Long range capable",
                "compatibility": "Alexa 35, Mini LF, LF, Mini",
                "battery": "LBP-3500"
            },
            daily_rate: 650,
            image_urls: ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_kk_0041793_hi_5_rx_tx_2400_set_1655120170_1710021.jpg"]
        },
        {
            name: "ARRI WCU-4 Wireless Compact Unit",
            slug: "arri-wcu-4",
            brand: "ARRI",
            category_slug: "lens-control",
            description_en: "The ARRI WCU-4 Wireless Compact Unit is a 3-axis handheld controller featuring an integrated lens display. Control camera functions, focus, iris, and/or zoom from a distance.",
            description_fr: "L'unité compacte sans fil ARRI WCU-4 est un contrôleur portable à 3 axes doté d'un affichage d'objectif intégré. Contrôlez les fonctions de la caméra, la mise au point, l'iris et/ou le zoom à distance.",
            specs: {
                "axes": "3 (Focus, Iris, Zoom)",
                "display": "Integrated Lens Data",
                "compatibility": "Alexa Mini, Plus, Studio, Amira",
                "features": "Vibrating Markers, Backlit Knob"
            },
            daily_rate: 450,
            image_urls: ["https://static.bhphoto.com/images/multiple_images/images500x500/1486487704_IMG_749127.jpg"]
        },
        {
            name: "ARRI SXU-1 Single Axis Unit",
            slug: "arri-sxu-1",
            brand: "ARRI",
            category_slug: "lens-control",
            description_en: "ARRI's SXU-1 Single Axis Unit is a wireless hand unit offering single-axis focus, iris, or zoom control. The compact SXU-1 features remote camera start/stop and tally.",
            description_fr: "L'unité à axe unique ARRI SXU-1 offre un contrôle sans fil de la mise au point, de l'iris ou du zoom. Compacte, elle permet le démarrage/arrêt à distance de la caméra.",
            specs: {
                "axes": "1 (Assignable)",
                "compatibility": "WCU-4 systems, SMC-1",
                "handgrip": "Ergonomic Wooden"
            },
            daily_rate: 250,
            image_urls: ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_k2_0000071_sxu_1_single_axis_unit_1486549411_1287348.jpg"]
        },
        {
            name: "Teradek RT FIZ Wireless Kit",
            slug: "teradek-rt-fiz",
            brand: "Teradek",
            category_slug: "lens-control",
            description_en: "Wirelessly control your lens focus, iris, and zoom with this RT FIZ Wireless Lens Control Kit from Teradek, featuring the CTRL.5 wireless lens controller and MDR.X 3-channel receiver.",
            description_fr: "Contrôlez sans fil la mise au point, l'iris et le zoom avec ce kit Teradek RT FIZ, comprenant le contrôleur CTRL.5 et le récepteur MDR.X à 3 canaux.",
            specs: {
                "controller": "CTRL.5",
                "motor": "MOTR.S Max",
                "receiver": "MDR.X 3-Channel",
                "technology": "FHSS"
            },
            daily_rate: 350,
            image_urls: ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/teradek_15_0056_rt_fiz_wireless_lens_1726150825_1848823.jpg"]
        },
        {
            name: "Teradek CTRL.3 Controller",
            slug: "teradek-ctrl-3",
            brand: "Teradek",
            category_slug: "lens-control",
            description_en: "For precise lens control with your Teradek RT motors and receivers, the Teradek CTRL.3 Three-Axis Wireless Lens Controller can control focus, iris, or zoom with ease.",
            description_fr: "Pour un contrôle précis de l'objectif avec vos moteurs Teradek RT, le contrôleur sans fil à trois axes CTRL.3 gère la mise au point, l'iris ou le zoom.",
            specs: {
                "range_outdoor": "5000 ft",
                "range_indoor": "500 ft",
                "display": "OLED",
                "axes": "3"
            },
            daily_rate: 200,
            image_urls: ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/teradek_15_0047_i_rt_ctrl_3_wireless_lens_1557400011_1473056.jpg"]
        },
        {
            name: "cmotion compact ONE",
            slug: "cmotion-compact-one",
            brand: "cmotion",
            category_slug: "lens-control",
            description_en: "Ready-to-shoot one motor system. Lightweight and compact design for easy operation. Compatible with ARRI CLM-4 motor.",
            description_fr: "Système à un moteur prêt à tourner. Conception légère et compacte pour une utilisation facile. Compatible avec le moteur ARRI CLM-4.",
            specs: {
                "type": "1-Axis Wireless",
                "compatibility": "ARRI CLM-4",
                "design": "Lightweight"
            },
            daily_rate: 200,
            image_urls: ["https://videoking.eu/wp-content/uploads/2022/10/compact-ONE-set-E.jpg"]
        },
        {
            name: "Tilta Nucleus-M",
            slug: "tilta-nucleus-m",
            brand: "Tilta",
            category_slug: "lens-control",
            description_en: "The Tilta Nucleus-M Wireless Lens Control System features a 1000' transmission range and comes with two lens drive motors with built-in wireless receivers.",
            description_fr: "Le système Tilta Nucleus-M offre une portée de transmission de 300m et comprend deux moteurs d'objectif avec récepteurs sans fil intégrés.",
            specs: {
                "range": "1000 ft",
                "motors": "2x Brushless with Receiver",
                "gears": "0.8 MOD",
                "connectors": "7-pin"
            },
            daily_rate: 150,
            image_urls: ["https://static.bhphoto.com/images/multiple_images/images500x500/1526318171_IMG_988009.jpg"]
        },
        {
            name: "ARRI FF-5 Cine Follow Focus",
            slug: "arri-ff-5-cine",
            brand: "ARRI",
            category_slug: "lens-control",
            description_en: "The ARRI FF-5 Cine Set Pro is a complete follow focus kit. Having a gear ratio of 2:1, the FF-5 Cine is designed for cine-style lenses.",
            description_fr: "L'ARRI FF-5 Cine Set Pro est un kit complet de follow focus. Avec un rapport d'engrenage de 2:1, le FF-5 Cine est conçu pour les objectifs de cinéma.",
            specs: {
                "gear_ratio": "2:1",
                "rod_support": "15mm LWS (19mm via adapter)",
                "style": "Cine-Style",
                "mechanism": "Snap-on bridge"
            },
            daily_rate: 150,
            image_urls: ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_kk_0005758_follow_focus_ff_5_cine_1478778337_1288927.jpg"]
        },
        {
            name: "ARRI FF-4 Follow Focus",
            slug: "arri-ff-4",
            brand: "ARRI",
            category_slug: "lens-control",
            description_en: "The sleek ARRI FF-4 Basic Follow Focus Unit consists of a single-sided follow focus with one standard knob. The FF-4 is designed with a 1:2 knob-to-gear ratio.",
            description_fr: "L'unité de follow focus ARRI FF-4 Basic consiste en un follow focus unilatéral avec un bouton standard. Le FF-4 est conçu avec un rapport 1:2.",
            specs: {
                "gear_ratio": "1:2",
                "rod_support": "15mm LWS",
                "operation": "Single-sided"
            },
            daily_rate: 100,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1478779549_1288924.jpg"]
        },
        {
            name: "ARRI FF-3 Follow Focus",
            slug: "arri-ff-3",
            brand: "ARRI",
            category_slug: "lens-control",
            description_en: "Lightweight single-sided follow focus designed for cine and broadcast productions. Mounts on 15mm LWS rods with snap-on clamp.",
            description_fr: "Follow focus léger à un seul côté conçu pour les productions cinématographiques et audiovisuelles. Se monte sur des tiges LWS de 15 mm.",
            specs: {
                "rod_support": "15mm LWS / 19mm Studio",
                "type": "Mechanical",
                "build": "Robust ARRI Standard"
            },
            daily_rate: 80,
            image_urls: ["https://tv-team.no/cdn/shop/files/arri-ff3-1x1-1.png?v=1688412622"]
        },
        {
            name: "Chrosziel DV Studio Rig",
            slug: "chrosziel-dv-studio",
            brand: "Chrosziel",
            category_slug: "lens-control",
            description_en: "Chrosziel's DV Studio Rig Follow Focus 6-Gear Kit is based around the Chrosziel DV Studio Rig, a 15mm lightweight standard follow focus.",
            description_fr: "Le kit Follow Focus 6-Gear DV Studio Rig de Chrosziel est basé sur le DV Studio Rig, un follow focus standard léger de 15 mm.",
            specs: {
                "rod_support": "15mm LWS",
                "stops": "VariLock Dual Hard Stops",
                "gears": "6 Interchangeable included"
            },
            daily_rate: 75,
            image_urls: ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/chrosziel_c_206_60skit_dv_studio_rig_follow_1427280621_1131821.jpg"]
        },

        // --- SUPPORT (Heads & Tripods) ---
        {
            name: "OConnor Ultimate 2575D",
            slug: "oconnor-2575d",
            brand: "OConnor",
            category_slug: "support",
            description_en: "The OConnor Ultimate 2575D Fluid Head includes the sinusoidal counterbalance system for true, accurate balance and holds cameras up to 90 lb.",
            description_fr: "La tête fluide OConnor Ultimate 2575D comprend le système de contrepoids sinusoïdal pour un équilibre précis et supporte des caméras jusqu'à 40,8 kg.",
            specs: {
                "max_load": "90 lb (40.8 kg)",
                "base": "Mitchell / 150mm",
                "counterbalance": "Sinusoidal",
                "tilt_drag": "Stepless"
            },
            daily_rate: 250,
            image_urls: ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/oconnor_c1234_0005_ultimate_2575d_fluid_head_1466607922_1232548.jpg"]
        },
        {
            name: "OConnor Ultimate 2560",
            slug: "oconnor-2560",
            brand: "OConnor",
            category_slug: "support",
            description_en: "The Ultimate 2560 Fluid Head Package is designed for digital cinema cameras. It is capable of supporting camera payloads up to 66 pounds.",
            description_fr: "La tête fluide Ultimate 2560 est conçue pour les caméras de cinéma numérique. Elle est capable de supporter des charges utiles allant jusqu'à 30 kg.",
            specs: {
                "max_load": "66 lb (30 kg)",
                "weight": "18 lb",
                "base": "Mitchell / 150mm"
            },
            daily_rate: 200,
            image_urls: ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/oconnor_c1260_0001_ultimate_2560_fluid_head_1434101716_1157454.jpg"]
        },
        {
            name: "Cartoni Master MK2",
            slug: "cartoni-master-mk2",
            brand: "Cartoni",
            category_slug: "support",
            description_en: "The Master MK2 offers perfect counterbalance at any tilt angle and a consistent seamless fluid drag using Cartoni’s patented technology.",
            description_fr: "Le Master MK2 offre un contrepoids parfait à n'importe quel angle d'inclinaison et une fluidité constante grâce à la technologie brevetée de Cartoni.",
            specs: {
                "type": "Fluid Head",
                "drag": "Continuous",
                "counterbalance": "Perfect Balance"
            },
            daily_rate: 180,
            image_urls: ["https://www.cartoni.com/wp-content/uploads/ProductImages/FluidHeads/Cartoni_FluidHeads_H541_MasterMK2.jpg"]
        },
        {
            name: "Cartoni Maxima 30",
            slug: "cartoni-maxima-30",
            brand: "Cartoni",
            category_slug: "support",
            description_en: "The Maxima 30 Video Fluid Head covers the needs of video shooters using camera rigs weighing from 6.6 to 88 lb. Includes telescopic pan bar.",
            description_fr: "La tête fluide vidéo Maxima 30 couvre les besoins des vidéastes utilisant des configurations de caméra pesant de 3 à 40 kg.",
            specs: {
                "load_range": "6.6 to 88 lb",
                "mount": "Mitchell",
                "pan_bar": "Telescopic"
            },
            daily_rate: 180,
            image_urls: ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/cartoni_hm3100_maxima_30_head_1499187934_1324640.jpg"]
        },
        {
            name: "Sachtler Video 30 II",
            slug: "sachtler-video-30-ii",
            brand: "Sachtler",
            category_slug: "support",
            description_en: "The Sachtler Cine 30 fluid head features a 150mm bowl and supports heavy cameras ranging from 3 to 32 kg. Integrated Sideload platform.",
            description_fr: "La tête fluide Sachtler Cine 30 dispose d'un bol de 150 mm et supporte des caméras lourdes allant de 3 à 32 kg. Plateforme Sideload intégrée.",
            specs: {
                "bowl": "150mm",
                "load_range": "3-32 kg",
                "balance": "SpeedBalance (18 steps)",
                "drag": "7-level"
            },
            daily_rate: 150,
            image_urls: ["https://www.trm.fr/wp-content/uploads/2024/02/SAC_3007_Cine-30-fluid-head_02-600x600-c.jpg"]
        },
        {
            name: "Sachtler System 25 EFP 2",
            slug: "sachtler-system-25",
            brand: "Sachtler",
            category_slug: "support",
            description_en: "Consisting of the Video 25 Plus fluid head, it features a seven-step damping system and an 18-step counterbalance.",
            description_fr: "Composé de la tête fluide Video 25 Plus, il dispose d'un système d'amortissement à sept niveaux et d'un contrepoids à 18 niveaux.",
            specs: {
                "head": "Video 25 Plus",
                "legs": "CF-150 EFP 2CF",
                "spreader": "Ground-Level"
            },
            daily_rate: 180,
            image_urls: ["https://static.bhphoto.com/images/multiple_images/images500x500/1668707156_IMG_1876954.jpg"]
        },
        {
            name: "ARRIHEAD 2 Geared Head",
            slug: "arrihead-2",
            brand: "ARRI",
            category_slug: "support",
            description_en: "The ARRIHEAD 2 is a compact geared head designed to work with both film and digital cameras. It features a tilt-axis centered on the optical center.",
            description_fr: "L'ARRIHEAD 2 est une tête à manivelles compacte conçue pour les caméras argentiques et numériques. Elle dispose d'un axe d'inclinaison centré sur le centre optique.",
            specs: {
                "type": "Geared Head",
                "compatibility": "Arri Bottom Plates",
                "mechanism": "Precision Gears"
            },
            daily_rate: 350,
            image_urls: ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_k2_43670_0_arrihead_2_production_tripod_1478794858_1288722.jpg"]
        },

        // --- LENSES ---
        {
            name: "Cooke S4/i Prime Set",
            slug: "cooke-s4i-set",
            brand: "Cooke",
            category_slug: "lenses",
            description_en: "Cooke S4/i focal lengths range from 12mm to 180mm, all with a wide-open aperture of T2. Offers excellent optical and mechanical performance.",
            description_fr: "Les focales Cooke S4/i vont de 12mm à 180mm, toutes avec une ouverture de T2. Offre d'excellentes performances optiques et mécaniques.",
            specs: {
                "mount": "PL",
                "aperture": "T2.0",
                "range": "12mm - 180mm",
                "features": "/i Technology"
            },
            daily_rate: 1200,
            image_urls: ["https://res.cloudinary.com/offshoot/q_50,w_1920,c_limit,f_auto/REIS/products/5fb741a435394a631fe5a51f/cooke_mini_s4_i_lens_set_alt_2"]
        },
        {
            name: "ARRI / ZEISS Master Anamorphic Set",
            slug: "arri-zeiss-master-anamorphic",
            brand: "ZEISS",
            category_slug: "lenses",
            description_en: "Focal lengths range from 28mm to 135mm, all with a wide-open aperture of T1.9. Designed for premium anamorphic cinematography with exceptional sharpness.",
            description_fr: "Les focales vont de 28mm à 135mm, toutes avec une ouverture de T1.9. Conçu pour le cinéma anamorphique haut de gamme avec une netteté exceptionnelle.",
            specs: {
                "mount": "PL",
                "aperture": "T1.9",
                "type": "Anamorphic",
                "range": "28mm - 135mm"
            },
            daily_rate: 1800,
            image_urls: ["https://cinevo.com/wp-content/uploads/2022/08/ARRI-Zeiss-Master-Anamorphic-Set-a.jpg"]
        },
        {
            name: "ARRI Signature Prime Set",
            slug: "arri-signature-primes",
            brand: "ARRI",
            category_slug: "lenses",
            description_en: "Focal lengths range from 12mm to 280mm, T1.8. Designed for large-format cinematography, delivering a clean, natural image with smooth focus fall-off.",
            description_fr: "Les focales vont de 12mm à 280mm, T1.8. Conçu pour le cinéma grand format, offrant une image propre et naturelle.",
            specs: {
                "mount": "LPL",
                "aperture": "T1.8",
                "coverage": "Large Format",
                "range": "12mm - 280mm"
            },
            daily_rate: 1600,
            image_urls: ["https://images.squarespace-cdn.com/content/v1/5e72aea433a7b935087f9d5d/5b69e981-9bea-4ff0-bf2d-ddfaa2152c5a/Screenshot+2024-06-02+at+1.17.06%E2%80%AFPM.jpg?format=1000w"]
        },
        {
            name: "ZEISS Supreme Prime Set",
            slug: "zeiss-supreme-primes",
            brand: "ZEISS",
            category_slug: "lenses",
            description_en: "Covering an image circle of 46.3mm, Zeiss Supreme Prime lenses offer a T1.5 maximum aperture across most of the range. Compact design.",
            description_fr: "Couvrant un cercle d'image de 46,3 mm, les objectifs Zeiss Supreme Prime offrent une ouverture maximale T1.5 sur la majeure partie de la plage.",
            specs: {
                "mount": "PL/LPL/EF",
                "aperture": "T1.5",
                "coverage": "Full Frame / VV",
                "front_diameter": "95mm"
            },
            daily_rate: 1500,
            image_urls: ["https://cinevo.com/wp-content/uploads/2023/01/cnv-arri-supreme-primes-a-980x652.jpg"]
        },
        {
            name: "ARRI / ZEISS Master Prime Set",
            slug: "arri-zeiss-master-primes",
            brand: "ZEISS",
            category_slug: "lenses",
            description_en: "Master Primes offer focal lengths from 12mm to 150mm, with a common aperture of T1.3. High contrast, resolution, and virtually no breathing.",
            description_fr: "Les Master Primes offrent des focales de 12mm à 150mm, avec une ouverture commune de T1.3. Haut contraste, résolution et pratiquement pas de pompage.",
            specs: {
                "mount": "PL",
                "aperture": "T1.3",
                "range": "12mm - 150mm",
                "features": "No Breathing"
            },
            daily_rate: 1400,
            image_urls: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsKM9wNQwbX7kJIuSdy2K69ysSMwtJmeDWZQ&s"]
        },
        {
            name: "ZEISS Super Speed MK III Set",
            slug: "zeiss-super-speed-mk3",
            brand: "ZEISS",
            category_slug: "lenses",
            description_en: "Focal lengths from 18mm to 85mm, T1.3. Renowned for their classic cinematic look, Super Speed MK III primes offer high light-gathering capability.",
            description_fr: "Focales de 18mm à 85mm, T1.3. Renommés pour leur look cinématographique classique, les Super Speed MK III offrent une grande capacité de captation de lumière.",
            specs: {
                "mount": "PL",
                "aperture": "T1.3",
                "range": "18mm - 85mm",
                "style": "Vintage/Classic"
            },
            daily_rate: 800,
            image_urls: ["https://www.fomorentals.co.uk/img/containers/assets/Zeiss-Super-Speeds.png/2a7a8c282cb7b4f4161f9653311013fe.webp"]
        },
        {
            name: "ZEISS Compact Prime CP.3 Set",
            slug: "zeiss-cp3-set",
            brand: "ZEISS",
            category_slug: "lenses",
            description_en: "Focal lengths range from 15mm to 135mm, T2.1. Building on the CP.2 design, CP.3 lenses deliver improved mechanics and refined optical performance.",
            description_fr: "Les focales vont de 15mm à 135mm, T2.1. S'appuyant sur la conception CP.2, les objectifs CP.3 offrent une mécanique améliorée.",
            specs: {
                "mount": "Interchangeable (PL/EF/E/MFT)",
                "aperture": "T2.1",
                "range": "15mm - 135mm",
                "coverage": "Full Frame"
            },
            daily_rate: 600,
            image_urls: ["https://vmi.tv/wp-content/uploads/sites/3/2023/04/Zeiss-CP3-Set.jpg"]
        },
        {
            name: "ZEISS Ultra Prime Set",
            slug: "zeiss-ultra-primes",
            brand: "ZEISS",
            category_slug: "lenses",
            description_en: "Focal lengths from 8mm to 180mm, with apertures ranging from T1.9 to T2.8. High-contrast, high-resolution lenses with even field illumination.",
            description_fr: "Focales de 8mm à 180mm, ouvertures de T1.9 à T2.8. Objectifs à contraste élevé et haute résolution avec un éclairage de champ uniforme.",
            specs: {
                "mount": "PL",
                "aperture": "T1.9 - T2.8",
                "range": "8mm - 180mm",
                "match": "Matches Master Primes"
            },
            daily_rate: 900,
            image_urls: ["https://images.squarespace-cdn.com/content/v1/5e72aea433a7b935087f9d5d/83d842be-acd1-48e0-8b2d-be1e11120327/Screen+Shot+2023-02-15+at+9.08.34+AM.jpg"]
        },
        {
            name: "Atlas Orion Anamorphic Set",
            slug: "atlas-orion-anamorphic",
            brand: "Atlas Lens Co.",
            category_slug: "lenses",
            description_en: "Atlas Orion Anamorphic primes (32mm to 100mm, T2) deliver a classic anamorphic look with controlled flares, smooth oval bokeh, and minimal distortion.",
            description_fr: "Les Atlas Orion Anamorphic (32mm à 100mm, T2) offrent un look anamorphique classique avec des reflets contrôlés et un bokeh ovale lisse.",
            specs: {
                "mount": "PL / EF",
                "aperture": "T2.0",
                "squeeze": "2x",
                "range": "32mm - 100mm"
            },
            daily_rate: 1000,
            image_urls: ["https://res.cloudinary.com/offshoot/q_70,w_3840,c_limit,f_auto/REIS/products/5fba0435a9eb364eeb7b54c1/atlas_orion_2x_anamorphic_a_set_hr_3"]
        },
        {
            name: "ARRI Macro Prime Set",
            slug: "arri-macro-primes",
            brand: "ARRI",
            category_slug: "lenses",
            description_en: "Focal lengths range from 50mm to 150mm, T2.0. Designed for close-focus cinematography, delivering exceptional sharpness and flat field performance.",
            description_fr: "Focales de 50mm à 150mm, T2.0. Conçu pour la cinématographie en gros plan, offrant une netteté exceptionnelle.",
            specs: {
                "mount": "PL",
                "aperture": "T2.0",
                "type": "Macro",
                "range": "50mm - 150mm"
            },
            daily_rate: 600,
            image_urls: ["https://static.madedaily.com/managed_images/a4fee251-1a0e-4276-b95d-716d2d3536ad/35617/ARRI-Macro-100mm-T2_C.jpg"]
        }
    ];

    // Helper to download images from URL
    const fetchFile = (url) => {
        try {
            console.log(`Downloading: ${url}`);
            const res = $http.send({
                url: url,
                method: "GET",
                timeout: 30
            });

            if (res.statusCode !== 200) {
                console.log(`Failed to fetch image ${url}: code ${res.statusCode}`);
                return null;
            }

            const filename = url.split('/').pop().split('?')[0] || `image_${Date.now()}.jpg`;

            // PB 0.26+ - Create file from bytes
            return $filesystem.fileFromBytes(res.raw, filename);

        } catch (e) {
            console.log(`Error fetching image ${url}: ${e}`);
        }
        return null;
    };

    // 2. Ensure Categories Exist
    const ensureCategory = (slug, name, nameFr) => {
        try {
            return app.findFirstRecordByFilter("categories", `slug="${slug}"`);
        } catch (e) {
            console.log(`Creating Category: ${name}`);
            const collection = app.findCollectionByNameOrId("categories");
            const cat = new Record(collection);
            cat.set("slug", slug);
            cat.set("name", name);
            // cat.set("name_en", name); // Removed if schema doesn't have it, but usually standard is name/name_fr or name_en/name_fr. 
            // Assuming categories collection uses 'name' and 'slug' primarily. 
            // If it supports bilingual, normally name + name_fr or name_en + name_fr. 
            // Previous code used name_en, keeping it safe.
            cat.set("name_en", name);
            cat.set("name_fr", nameFr);
            app.save(cat);
            return cat;
        }
    };

    const categories = {
        "lenses": ensureCategory("lenses", "Lenses", "Objectifs"),
        "lens-control": ensureCategory("lens-control", "Lens Control", "Contrôle d'objectif"),
        "support": ensureCategory("support", "Support & Grip", "Support & Machinerie")
    };

    const equipmentCollection = app.findCollectionByNameOrId("equipment");

    // 3. Process Items
    equipmentData.forEach(item => {
        // A. Clean existing
        try {
            const existing = app.findFirstRecordByFilter("equipment", `slug="${item.slug}"`);
            if (existing) {
                console.log(`Refreshing existing item: ${item.slug}`);
                app.delete(existing);
            }
        } catch (e) { }

        console.log(`Creating equipment: ${item.name}`);
        const record = new Record(equipmentCollection);

        // Core
        record.set("name", item.name);
        record.set("name_en", item.name);
        record.set("name_fr", item.description_fr ? item.name : item.name); // Using Name as fallback for FR title
        record.set("slug", item.slug);
        record.set("brand", item.brand);
        record.set("category", categories[item.category_slug].id);

        // Description
        record.set("description_en", item.description_en);
        record.set("description_fr", item.description_fr);

        // Specs & Details
        record.set("specs", item.specs);
        record.set("specs_en", item.specs);
        record.set("specs_fr", item.specs); // Manual trans required for keys later

        record.set("daily_rate", item.daily_rate);
        record.set("stock", 2); // Default stock
        record.set("stock_available", 2);
        record.set("visibility", true);
        record.set("is_featured", false); // Accessories usually not featured on home

        // Images - Using image_urls[0] as main image
        if (item.image_urls && item.image_urls.length > 0) {
            const mainImg = fetchFile(item.image_urls[0]);
            if (mainImg) {
                record.set("image", mainImg);

                // If you want the same image in the gallery as well (optional, but requested sometimes)
                // record.set("images", [mainImg]); // Note: File objects can typically be used once per save? 
                // PocketBase usually handles file uploads by reading the file object. 
                // Using the same file object for two fields might require creating it twice.
            }

            // If there were multiple images in the array, we would fetch them here.
            // Currently data has 1 url per item mostly.
            if (item.image_urls.length > 1) {
                const galleryFiles = [];
                // Start from index 1 if index 0 is used for 'image'
                for (let i = 1; i < item.image_urls.length; i++) {
                    const f = fetchFile(item.image_urls[i]);
                    if (f) galleryFiles.push(f);
                }
                if (galleryFiles.length > 0) {
                    record.set("images", galleryFiles);
                }
            }
        }

        app.save(record);
    });

}, (app) => {
    // Rollback
    const equipmentData = [
        "arri-hi-5-wireless-set", "arri-wcu-4", "arri-sxu-1", "teradek-rt-fiz",
        "teradek-ctrl-3", "cmotion-compact-one", "tilta-nucleus-m", "arri-ff-5-cine",
        "arri-ff-4", "arri-ff-3", "chrosziel-dv-studio", "oconnor-2575d",
        "oconnor-2560", "cartoni-master-mk2", "cartoni-maxima-30",
        "sachtler-video-30-ii", "sachtler-system-25", "arrihead-2",
        "cooke-s4i-set", "arri-zeiss-master-anamorphic", "arri-signature-primes",
        "zeiss-supreme-primes", "arri-zeiss-master-primes", "zeiss-super-speed-mk3",
        "zeiss-cp3-set", "zeiss-ultra-primes", "atlas-orion-anamorphic",
        "arri-macro-primes"
    ];

    equipmentData.forEach(slug => {
        try {
            const record = app.findFirstRecordByFilter("equipment", `slug="${slug}"`);
            app.delete(record);
        } catch (e) { }
    });
});