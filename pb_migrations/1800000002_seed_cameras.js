/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    const EQUIPMENT_COLLECTION = "equipment";
    const CATEGORY_SLUG = "cameras";

    // 1. Get the Camera Category ID
    let cameraCategory;
    try {
        cameraCategory = app.findFirstRecordByFilter("categories", `slug = "${CATEGORY_SLUG}"`);
    } catch (e) {
        console.log(`⚠️ Category '${CATEGORY_SLUG}' not found. Please seed categories first.`);
        return;
    }

    // 2. The Data (IDs padded to 15 chars to meet PocketBase requirements)
    const cameras = [
        {
            "id": "arr001a35000000",
            "name": "ARRI Alexa 35",
            "name_en": "ARRI Alexa 35",
            "name_fr": "ARRI Alexa 35",
            "slug": "arri-alexa-35",
            "brand": "ARRI",
            "description_en": "Arri's compact Alexa 35 features a 4.6K Super 35-format sensor capable of capturing 17 stops of dynamic range. With an exposure index adjustable from 160 to 6400, the camera incorporates four built-in motorized ND filters (clear, 0.6, 1.2, and 1.8) and offers a maximum frame rate of 120 fps.\n\nIncludes:\n● ARRI MVF-2 Viewfinder\n● ARRI B-Mount Power Distribution Module (PDM-1)\n● ARRI PL-to-LPL Mount Adapter\n● Codex Compact Drive 1TB / 2TB\n● Codex Compact Drive Reader\n● Full Licensing (ARRIRAW, ProRes, Open Gate, 4:3, Anamorphic)",
            "description_fr": "La compacte Alexa 35 d'Arri est dotée d'un capteur 4.6K au format Super 35 capable de capturer 17 stops de plage dynamique. Avec un indice d'exposition réglable de 160 à 6400, la caméra intègre quatre filtres ND motorisés (clair, 0.6, 1.2 et 1.8) et offre une fréquence d'images maximale de 120 ips.\n\nInclus :\n● Viseur ARRI MVF-2\n● Module de distribution d'alimentation ARRI B-Mount (PDM-1)\n● Adaptateur de monture ARRI PL vers LPL\n● Disque Codex Compact 1TB / 2TB\n● Lecteur Codex Compact Drive\n● Licence complète (ARRIRAW, ProRes, Open Gate, 4:3, Anamorphic)",
            "specs": { "sensor_size": "28.0 x 19.2mm", "max_resolution": "4608 x 3164", "dynamic_range": "17 Stops", "media_type": "Codex Compact Drive", "mount": "LPL (PL Adapter incl.)", "codec": "ProRes, ARRIRAW", "max_fps": "120fps" },
            "specs_en": { "sensor_size": "28.0 x 19.2mm", "max_resolution": "4608 x 3164", "dynamic_range": "17 Stops", "media_type": "Codex Compact Drive", "mount": "LPL (PL Adapter incl.)", "codec": "ProRes, ARRIRAW", "max_fps": "120fps" },
            "specs_fr": { "sensor_size": "28.0 x 19.2mm", "max_resolution": "4608 x 3164", "dynamic_range": "17 Diaphs", "media_type": "Codex Compact Drive", "mount": "LPL (Adaptateur PL incl.)", "codec": "ProRes, ARRIRAW", "max_fps": "120ips" },
            "type": null,
            "mount": "LPL",
            "sensor_size": "28.0 x 19.2mm",
            "resolution": "4608 x 3164",
            "daily_rate": 0,
            "stock": 1,
            "stock_available": 1,
            "visibility": true,
            "featured": false,
            "is_featured": false,
            "image_url": "https://static.bhphoto.com/images/multiple_images/images500x500/1754407216_IMG_2544984.jpg",
            "gallery_urls": ["https://static.bhphoto.com/images/multiple_images/images500x500/1754407216_IMG_2544977.jpg"]
        },
        {
            "id": "son002ven200000",
            "name": "Sony Venice 2 8K",
            "name_en": "Sony Venice 2 8K",
            "name_fr": "Sony Venice 2 8K",
            "slug": "sony-venice-2-8k",
            "brand": "Sony",
            "description_en": "Building on the original Venice, Venice 2 features a compact design, internal recording, and an 8.6K full-frame CMOS sensor that can capture 16 stops of dynamic range. The camera also offers a dual-base ISO of 800/3200 and 8 stops of built-in ND filters. The Panavision Modular accessory system adds further functionality.\n\nIncludes:\n● Sony VENICE Accessory Cage / Top Plate Kit\n● Sony OLED Viewfinder\n● Power Distribution Module\n● Lens Mount Adapter options\n● Codex Compact Drives / AXS-R7\n● Full Licensing (Full Frame, 8.6K, Anamorphic, SLog)",
            "description_fr": "S'appuyant sur la Venice originale, la Venice 2 présente un design compact, un enregistrement interne et un capteur CMOS plein format 8,6K capable de capturer 16 stops de plage dynamique. La caméra offre également un double ISO de base de 800/3200 et 8 stops de filtres ND intégrés.\n\nInclus :\n● Kit Cage / Top Plate Sony VENICE\n● Viseur OLED Sony\n● Module de distribution d'alimentation\n● Adaptateurs de monture\n● Codex Compact Drives\n● Licence complète (Plein format, 8.6K, Anamorphic, SLog)",
            "specs": { "sensor_size": "35.9mm x 23.93mm", "max_resolution": "8640 x 5760", "dynamic_range": "16 Stops", "media_type": "AXS Memory / Codex", "mount": "PL / E-mount", "codec": "X-OCN, ProRes", "max_fps": "90fps" },
            "specs_en": { "sensor_size": "35.9mm x 23.93mm", "max_resolution": "8640 x 5760", "dynamic_range": "16 Stops", "media_type": "AXS Memory / Codex", "mount": "PL / E-mount", "codec": "X-OCN, ProRes", "max_fps": "90fps" },
            "specs_fr": { "sensor_size": "35.9mm x 23.93mm", "max_resolution": "8640 x 5760", "dynamic_range": "16 Diaphs", "media_type": "AXS Memory / Codex", "mount": "PL / E-mount", "codec": "X-OCN, ProRes", "max_fps": "90ips" },
            "type": null,
            "mount": "PL",
            "sensor_size": "35.9mm x 23.93mm",
            "resolution": "8640 x 5760",
            "daily_rate": 0,
            "stock": 1,
            "stock_available": 1,
            "visibility": true,
            "featured": true,
            "is_featured": true,
            "image_url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/sony_mpc_3628_venice_2_digital_motion_1636969601_1672825.jpg",
            "gallery_urls": ["https://static.bhphoto.com/images/multiple_images/images500x500/1636969594_IMG_1641924.jpg"]
        },
        {
            "id": "arr003mlf000000",
            "name": "ARRI Alexa Mini LF",
            "name_en": "ARRI Alexa Mini LF",
            "name_fr": "ARRI Alexa Mini LF",
            "slug": "arri-alexa-mini-lf",
            "brand": "ARRI",
            "description_en": "The Alexa Mini LF combines the Alexa Mini's compact form factor with the Alexa LF's large-format sensor. Exclusively from Panavision, the Mini LF can be rented with the Panavision Modular accessory system and a Panavised lens mount.\n\nIncludes:\n● ARRI Advanced Accessory Cage\n● ARRI MVF-2\n● BEBOB Power Splitting Box\n● ARRI PL-LPL Mount Adapter\n● Codex Compact Drives\n● ARRI Codex SXR Capture Drive Dock\n● Full Licensing (4:3, ARRIRAW)",
            "description_fr": "L'Alexa Mini LF combine le format compact de l'Alexa Mini avec le capteur grand format de l'Alexa LF. Disponible avec le système d'accessoires modulaires Panavision.\n\nInclus :\n● Cage d'accessoires avancée ARRI\n● ARRI MVF-2\n● Boîtier de répartition d'alimentation BEBOB\n● Adaptateur ARRI PL-LPL\n● Codex Compact Drives\n● Station d'accueil ARRI Codex SXR\n● Licence complète (4:3, ARRIRAW)",
            "specs": { "sensor_size": "36.7mm x 25.5mm", "max_resolution": "4448 x 3096", "dynamic_range": "14+ Stops", "media_type": "Codex Compact Drive", "mount": "LPL", "codec": "ProRes, ARRIRAW", "max_fps": "90fps" },
            "specs_en": { "sensor_size": "36.7mm x 25.5mm", "max_resolution": "4448 x 3096", "dynamic_range": "14+ Stops", "media_type": "Codex Compact Drive", "mount": "LPL", "codec": "ProRes, ARRIRAW", "max_fps": "90fps" },
            "specs_fr": { "sensor_size": "36.7mm x 25.5mm", "max_resolution": "4448 x 3096", "dynamic_range": "14+ Diaphs", "media_type": "Codex Compact Drive", "mount": "LPL", "codec": "ProRes, ARRIRAW", "max_fps": "90ips" },
            "type": null,
            "mount": "LPL",
            "sensor_size": "36.7mm x 25.5mm",
            "resolution": "4448 x 3096",
            "daily_rate": 0,
            "stock": 1,
            "stock_available": 1,
            "visibility": true,
            "featured": false,
            "is_featured": false,
            "image_url": "https://static.bhphoto.com/images/multiple_images/images500x500/1717001182_IMG_2256540.jpg",
            "gallery_urls": ["https://static.bhphoto.com/images/images500x500/1717001118_1829047.jpg"]
        },
        {
            "id": "arr004mini00000",
            "name": "ARRI Alexa Mini",
            "name_en": "ARRI Alexa Mini",
            "name_fr": "ARRI Alexa Mini",
            "slug": "arri-alexa-mini",
            "brand": "ARRI",
            "description_en": "The compact and lightweight Alexa Mini can be fitted with a Panavision lens mount for compatibility with Panavision optics, and its versatility can be further enhanced with the custom Panavision Modular accessory system.\n\nIncludes:\n● ARRI MVF-1\n● CFast 2.0 Cards\n● CFast 2.0 Reader (USB-A, USB-C)\n● Full Licensing (4:3, ARRIRAW)",
            "description_fr": "La compacte et légère Alexa Mini peut être équipée d'une monture d'objectif Panavision pour une compatibilité avec les optiques Panavision, et sa polyvalence peut être encore améliorée grâce au système d'accessoires modulaires.\n\nInclus :\n● ARRI MVF-1\n● Cartes CFast 2.0\n● Lecteur CFast 2.0\n● Licence complète (4:3, ARRIRAW)",
            "specs": { "sensor_size": "28.3mm x 18.2mm", "max_resolution": "3168 x 2202", "dynamic_range": "14+ Stops", "media_type": "CFast 2.0", "mount": "PL", "codec": "ProRes, ARRIRAW", "max_fps": "200fps" },
            "specs_en": { "sensor_size": "28.3mm x 18.2mm", "max_resolution": "3168 x 2202", "dynamic_range": "14+ Stops", "media_type": "CFast 2.0", "mount": "PL", "codec": "ProRes, ARRIRAW", "max_fps": "200fps" },
            "specs_fr": { "sensor_size": "28.3mm x 18.2mm", "max_resolution": "3168 x 2202", "dynamic_range": "14+ Diaphs", "media_type": "CFast 2.0", "mount": "PL", "codec": "ProRes, ARRIRAW", "max_fps": "200ips" },
            "type": null,
            "mount": "PL",
            "sensor_size": "28.3mm x 18.2mm",
            "resolution": "3168 x 2202",
            "daily_rate": 0,
            "stock": 1,
            "stock_available": 1,
            "visibility": true,
            "featured": false,
            "is_featured": false,
            "image_url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_k0_0024310_alexa_mini_lf_and_1553752231_1470347.jpg",
            "gallery_urls": ["https://static.bhphoto.com/images/multiple_images/images500x500/1553767658_IMG_1161265.jpg"]
        },
        {
            "id": "arr005amira0000",
            "name": "ARRI Amira",
            "name_en": "ARRI Amira",
            "name_fr": "ARRI Amira",
            "slug": "arri-amira",
            "brand": "ARRI",
            "description_en": "Arri's Amira offers an ergonomic design that's well-suited to handheld, shoulder-mount operation. As with the Alexa cameras, the Amira can be Panavised with a Panavision lens mount and Panavision Modular accessories.\n\nIncludes:\n● ARRI MVF-1\n● CFast 2.0 Cards\n● CFast 2.0 Reader\n● Servo Lens Interface\n● Full Licensing (4:3, ARRIRAW)",
            "description_fr": "L'Amira d'Arri offre un design ergonomique parfaitement adapté à une utilisation à l'épaule ou à main levée. Comme pour les caméras Alexa, l'Amira peut être équipée d'une monture Panavision et d'accessoires modulaires.\n\nInclus :\n● ARRI MVF-1\n● Cartes CFast 2.0\n● Lecteur CFast 2.0\n● Interface pour objectif Servo\n● Licence complète (4:3, ARRIRAW)",
            "specs": { "sensor_size": "28.3mm x 18.2mm", "max_resolution": "3200 x 1800", "dynamic_range": "14+ Stops", "media_type": "CFast 2.0", "mount": "PL", "codec": "ProRes, ARRIRAW", "max_fps": "200fps" },
            "specs_en": { "sensor_size": "28.3mm x 18.2mm", "max_resolution": "3200 x 1800", "dynamic_range": "14+ Stops", "media_type": "CFast 2.0", "mount": "PL", "codec": "ProRes, ARRIRAW", "max_fps": "200fps" },
            "specs_fr": { "sensor_size": "28.3mm x 18.2mm", "max_resolution": "3200 x 1800", "dynamic_range": "14+ Diaphs", "media_type": "CFast 2.0", "mount": "PL", "codec": "ProRes, ARRIRAW", "max_fps": "200ips" },
            "type": null,
            "mount": "PL",
            "sensor_size": "28.3mm x 18.2mm",
            "resolution": "3200 x 1800",
            "daily_rate": 0,
            "stock": 1,
            "stock_available": 1,
            "visibility": true,
            "featured": false,
            "is_featured": false,
            "image_url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/panasonic_au_v35lt1g_cinema_varicam_lt_4k_1455802590_1226386.jpg",
            "gallery_urls": ["https://static.bhphoto.com/images/multiple_images/images500x500/1513878399_IMG_920926.jpg"]
        },
        {
            "id": "pan006vlt000000",
            "name": "Panasonic VariCam LT",
            "name_en": "Panasonic VariCam LT",
            "name_fr": "Panasonic VariCam LT",
            "slug": "panasonic-varicam-lt",
            "brand": "Panasonic",
            "description_en": "The VariCam LT packages the VariCam 35's 4K Super 35mm sensor in a lightweight, single-body design. Both the VariCam 35 and the VariCam LT can be fully outfitted with Panavision Modular accessories, including custom-engineered baseplates, top plates, handles, side rods, and more.\n\nIncludes:\n● ARRI MVF-1\n● CFast 2.0 Cards\n● CFast 2.0 Reader\n● Servo Lens Interface\n● Full Licensing",
            "description_fr": "La VariCam LT intègre le capteur 4K Super 35mm de la VariCam 35 dans un boîtier monobloc léger. Elle peut être entièrement équipée avec les accessoires modulaires Panavision.\n\nInclus :\n● ARRI MVF-1\n● Cartes CFast 2.0\n● Lecteur CFast 2.0\n● Interface pour objectif Servo\n● Licence complète",
            "specs": { "sensor_size": "24.6mm x 12.9mm", "max_resolution": "4096 x 2160", "dynamic_range": "14+ Stops", "media_type": "expressP2 card", "mount": "EF / PL", "codec": "AVC-Intra, ProRes", "max_fps": "240fps" },
            "specs_en": { "sensor_size": "24.6mm x 12.9mm", "max_resolution": "4096 x 2160", "dynamic_range": "14+ Stops", "media_type": "expressP2 card", "mount": "EF / PL", "codec": "AVC-Intra, ProRes", "max_fps": "240fps" },
            "specs_fr": { "sensor_size": "24.6mm x 12.9mm", "max_resolution": "4096 x 2160", "dynamic_range": "14+ Diaphs", "media_type": "Carte expressP2", "mount": "EF / PL", "codec": "AVC-Intra, ProRes", "max_fps": "240ips" },
            "type": null,
            "mount": "PL",
            "sensor_size": "24.6mm x 12.9mm",
            "resolution": "4096 x 2160",
            "daily_rate": 0,
            "stock": 1,
            "stock_available": 1,
            "visibility": true,
            "featured": false,
            "is_featured": false,
            "image_url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_k0_0014798_amira_camera_set_with_1513877808_1346962.jpg",
            "gallery_urls": ["https://static.bhphoto.com/images/multiple_images/images500x500/1455802213_IMG_588330.jpg"]
        },
        {
            "id": "son007fx9000000",
            "name": "Sony PXW-FX9",
            "name_en": "Sony PXW-FX9",
            "name_fr": "Sony PXW-FX9",
            "slug": "sony-pxw-fx9",
            "brand": "Sony",
            "description_en": "The Sony FX9 packages Sony's 6K full-frame Exmor R sensor into a compact, lightweight, single-body cinema camera designed for both documentary and narrative production.\n\nIncludes:\n● SONY XDCA-FX9 Extension Unit\n● Sony XQD G Series Cards\n● Sony XQD Card Reader\n● PL-E Mount Adapter\n● EF-E Metabones Adapter",
            "description_fr": "La Sony FX9 intègre le capteur plein format 6K Exmor R de Sony dans une caméra de cinéma compacte, légère et monobloc, conçue pour la production documentaire et narrative.\n\nInclus :\n● Unité d'extension SONY XDCA-FX9\n● Cartes Sony XQD série G\n● Lecteur de carte Sony XQD\n● Adaptateur PL-E\n● Adaptateur EF-E Metabones",
            "specs": { "sensor_size": "35.7mm x 18.8mm", "max_resolution": "6048 x 4032", "dynamic_range": "15 Stops", "media_type": "XQD Card", "mount": "E-Mount / PL Adapter", "codec": "XAVC, ProRes (via Ext)", "max_fps": "60fps (FF 6K)" },
            "specs_en": { "sensor_size": "35.7mm x 18.8mm", "max_resolution": "6048 x 4032", "dynamic_range": "15 Stops", "media_type": "XQD Card", "mount": "E-Mount / PL Adapter", "codec": "XAVC, ProRes (via Ext)", "max_fps": "60fps (FF 6K)" },
            "specs_fr": { "sensor_size": "35.7mm x 18.8mm", "max_resolution": "6048 x 4032", "dynamic_range": "15 Diaphs", "media_type": "Carte XQD", "mount": "Monture E / Adaptateur PL", "codec": "XAVC, ProRes (via Ext)", "max_fps": "60ips (FF 6K)" },
            "type": null,
            "mount": "E-Mount",
            "sensor_size": "35.7mm x 18.8mm",
            "resolution": "6048 x 4032",
            "daily_rate": 0,
            "stock": 1,
            "stock_available": 1,
            "visibility": true,
            "featured": false,
            "is_featured": false,
            "image_url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/sony_pxw_fx9v_pxw_fx9_xdcam_6k_full_frame_1568344897_1506002.jpg",
            "gallery_urls": ["https://static.bhphoto.com/images/multiple_images/images500x500/1568344558_IMG_1251228.jpg"]
        },
        {
            "id": "son008fx3000000",
            "name": "Sony FX3",
            "name_en": "Sony FX3",
            "name_fr": "Sony FX3",
            "slug": "sony-fx3",
            "brand": "Sony",
            "description_en": "Inspired by Sony's high-end cinema cameras, the FX3 is a compact full-frame camera that delivers stunning 4K footage with 15 stops of dynamic range. It features dual base ISO (800/12,800) for excellent low-light performance and a built-in cooling system for extended shoots.\n\nIncludes:\n● SONY NP-FZ100 Batteries\n● SONY CFexpress Type-A Cards\n● SONY Card Reader\n● XLR-K3M Audio Handle\n● EF-E Metabones Adapter",
            "description_fr": "Inspirée des caméras de cinéma haut de gamme de Sony, la FX3 est une caméra plein format compacte qui offre des images 4K époustouflantes avec 15 stops de plage dynamique. Elle dispose d'un double ISO de base (800/12 800) et d'un système de refroidissement intégré.\n\nInclus :\n● Batteries SONY NP-FZ100\n● Cartes SONY CFexpress Type-A\n● Lecteur de carte SONY\n● Poignée Audio XLR-K3M\n● Adaptateur EF-E Metabones",
            "specs": { "sensor_size": "35.6 x 23.8 mm", "max_resolution": "4096 x 2160", "dynamic_range": "15+ Stops", "media_type": "CFexpress Type A / SD", "mount": "E-Mount", "codec": "XAVC S-I, ProRes RAW (Ext)", "max_fps": "120fps" },
            "specs_en": { "sensor_size": "35.6 x 23.8 mm", "max_resolution": "4096 x 2160", "dynamic_range": "15+ Stops", "media_type": "CFexpress Type A / SD", "mount": "E-Mount", "codec": "XAVC S-I, ProRes RAW (Ext)", "max_fps": "120fps" },
            "specs_fr": { "sensor_size": "35.6 x 23.8 mm", "max_resolution": "4096 x 2160", "dynamic_range": "15+ Diaphs", "media_type": "CFexpress Type A / SD", "mount": "Monture E", "codec": "XAVC S-I, ProRes RAW (Ext)", "max_fps": "120ips" },
            "type": null,
            "mount": "E-Mount",
            "sensor_size": "35.6 x 23.8 mm",
            "resolution": "4096 x 2160",
            "daily_rate": 0,
            "stock": 1,
            "stock_available": 1,
            "visibility": true,
            "featured": false,
            "is_featured": false,
            "image_url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/sony_ilme_fx3a_fx3_full_frame_cinema_camera_1746547141_1894322.jpg",
            "gallery_urls": ["https://static.bhphoto.com/images/multiple_images/images500x500/1746725588_IMG_2489166.jpg"]
        },
        {
            "id": "son009f55000000",
            "name": "Sony F55",
            "name_en": "Sony F55",
            "name_fr": "Sony F55",
            "slug": "sony-f55",
            "brand": "Sony",
            "description_en": "The Super 35-format Sony F55 captures 16-bit image files at up to 4K raw. Enhancing the user experience, Panavision has developed and manufactured the custom-designed Panavision Modular accessory package.\n\nIncludes:\n● ARRI Cage for Sony F5/F55 VCT-U14\n● Sony AXS-R5 Recorder\n● Sony Pro+ SxS Cards\n● Sony AXS S24 / SxS Cards\n● Sony AXS Card Reader\n● Servo Lens Interface",
            "description_fr": "La Sony F55 au format Super 35 capture des fichiers image 16 bits jusqu'au format RAW 4K. Panavision a développé un ensemble d'accessoires modulaires personnalisés pour améliorer l'expérience utilisateur.\n\nInclus :\n● Cage ARRI pour Sony F5/F55 VCT-U14\n● Enregistreur Sony AXS-R5\n● Cartes Sony Pro+ SxS\n● Cartes Sony AXS S24 / SxS\n● Lecteur de carte Sony AXS\n● Interface pour objectif Servo",
            "specs": { "sensor_size": "24mm x 12.7mm", "max_resolution": "4096 x 2160", "dynamic_range": "14 Stops", "media_type": "SxS / AXS", "mount": "FZ (PL Adapter)", "codec": "XAVC, X-OCN", "max_fps": "240fps (2K)" },
            "specs_en": { "sensor_size": "24mm x 12.7mm", "max_resolution": "4096 x 2160", "dynamic_range": "14 Stops", "media_type": "SxS / AXS", "mount": "FZ (PL Adapter)", "codec": "XAVC, X-OCN", "max_fps": "240fps (2K)" },
            "specs_fr": { "sensor_size": "24mm x 12.7mm", "max_resolution": "4096 x 2160", "dynamic_range": "14 Diaphs", "media_type": "SxS / AXS", "mount": "FZ (Adaptateur PL)", "codec": "XAVC, X-OCN", "max_fps": "240ips (2K)" },
            "type": null,
            "mount": "PL",
            "sensor_size": "24mm x 12.7mm",
            "resolution": "4096 x 2160",
            "daily_rate": 0,
            "stock": 1,
            "stock_available": 1,
            "visibility": true,
            "featured": false,
            "is_featured": false,
            "image_url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/Sony_PMW_F55_CineAlta_4K_Digital_1458308124_898428.jpg",
            "gallery_urls": ["https://static.bhphoto.com/images/multiple_images/images500x500/1458487193_IMG_604767.jpg"]
        },
        {
            "id": "red010mon000000",
            "name": "DSMC2 Monstro 8K",
            "name_en": "DSMC2 Monstro 8K",
            "name_fr": "DSMC2 Monstro 8K",
            "slug": "dsmc2-monstro-8k",
            "brand": "RED",
            "description_en": "The RED Monstro 8K VV sensor can capture up to 60 fps when recording full format. The sensor is housed in a DSMC2 camera body, which can be further enhanced with Panavision Modular accessories and a Panavised lens mount.\n\nIncludes:\n● RED PRO TOUCH 7.0\n● RED Mini Mags\n● RED Mini Mags Card Reader\n● RED EVF",
            "description_fr": "Le capteur RED Monstro 8K VV peut capturer jusqu'à 60 ips en enregistrement plein format. Le capteur est logé dans un boîtier DSMC2, qui peut être amélioré avec les accessoires modulaires Panavision.\n\nInclus :\n● Écran RED PRO TOUCH 7.0\n● RED Mini Mags\n● Lecteur de carte RED Mini Mags\n● Viseur RED EVF",
            "specs": { "sensor_size": "40.96mm x 21.6mm", "max_resolution": "8192 x 4320", "dynamic_range": "17+ Stops", "media_type": "RED Mini Mag", "mount": "PL / EF", "codec": "R3D, ProRes, DNxHD", "max_fps": "60fps (8K FF)" },
            "specs_en": { "sensor_size": "40.96mm x 21.6mm", "max_resolution": "8192 x 4320", "dynamic_range": "17+ Stops", "media_type": "RED Mini Mag", "mount": "PL / EF", "codec": "R3D, ProRes, DNxHD", "max_fps": "60fps (8K FF)" },
            "specs_fr": { "sensor_size": "40.96mm x 21.6mm", "max_resolution": "8192 x 4320", "dynamic_range": "17+ Diaphs", "media_type": "RED Mini Mag", "mount": "PL / EF", "codec": "R3D, ProRes, DNxHD", "max_fps": "60ips (8K FF)" },
            "type": null,
            "mount": "PL",
            "sensor_size": "40.96mm x 21.6mm",
            "resolution": "8192 x 4320",
            "daily_rate": 0,
            "stock": 1,
            "stock_available": 1,
            "visibility": true,
            "featured": false,
            "is_featured": false,
            "image_url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/Sony_PMW_F55_CineAlta_4K_Digital_1458308124_898428.jpg",
            "gallery_urls": ["https://static.bhphoto.com/images/multiple_images/images500x500/1458487193_IMG_604767.jpg"]
        }
    ];

    // 3. Helper to fetch file from URL
    function fetchFile(url) {
        try {
            const res = $http.send({ url: url, method: "GET" });
            if (res.statusCode !== 200) {
                console.log(`Failed to fetch image: ${url}`);
                return null;
            }
            const filename = url.split('/').pop().split('?')[0] || "image.jpg";
            return $filesystem.fileFromBytes(res.raw, filename);
        } catch (e) {
            console.log(`Error fetching image ${url}:`, e);
            return null;
        }
    }

    // 4. Processing Loop
    cameras.forEach(data => {
        // A. Remove existing record by slug if it exists (Upsert Logic)
        try {
            const existing = app.findFirstRecordByFilter(EQUIPMENT_COLLECTION, `slug = "${data.slug}"`);
            if (existing) {
                app.delete(existing);
                console.log(`♻️ Removed existing: ${data.name}`);
            }
        } catch (e) {
            // Record doesn't exist, safe to proceed
        }

        // B. Create New Record
        const collection = app.findCollectionByNameOrId(EQUIPMENT_COLLECTION);
        const record = new Record(collection);

        // Correct way to set ID in JS
        record.set("id", data.id);

        // Basic Strings
        record.set("name", data.name);
        record.set("name_en", data.name_en);
        record.set("name_fr", data.name_fr);
        record.set("slug", data.slug);
        record.set("brand", data.brand);
        record.set("category", cameraCategory.id);

        // HTML/Editor Fields
        record.set("description_en", data.description_en);
        record.set("description_fr", data.description_fr);

        // JSON Fields (Specs)
        record.set("specs", data.specs);
        record.set("specs_en", data.specs_en);
        record.set("specs_fr", data.specs_fr);

        // Filter Fields
        record.set("type", data.type);
        record.set("mount", data.mount);
        record.set("sensor_size", data.sensor_size);
        record.set("resolution", data.resolution);

        // Business Logic
        record.set("daily_rate", data.daily_rate);
        record.set("stock", data.stock);
        record.set("stock_available", data.stock_available);
        record.set("visibility", data.visibility);
        record.set("featured", data.featured);
        record.set("is_featured", data.is_featured);

        // C. Handle Main Image
        if (data.image_url) {
            const file = fetchFile(data.image_url);
            if (file) record.set("image", file);
        }

        // D. Handle Gallery Images
        if (data.gallery_urls && data.gallery_urls.length > 0) {
            const files = [];
            data.gallery_urls.forEach(url => {
                const f = fetchFile(url);
                if (f) files.push(f);
            });
            if (files.length > 0) record.set("images", files);
        }

        // E. Save to DB
        app.save(record);
        console.log(`✅ Created: ${data.name}`);
    });

}, (app) => {
    // Optional: Down migration logic
    const ids = ["arr001a35000000", "son002ven200000", "arr003mlf000000", "arr004mini00000", "arr005amira0000", "pan006vlt000000", "son007fx9000000", "son008fx3000000", "son009f55000000", "red010mon000000"];
    ids.forEach(id => {
        try {
            const record = app.findRecordById("equipment", id);
            app.delete(record);
        } catch (e) { /* ignore */ }
    });
});
