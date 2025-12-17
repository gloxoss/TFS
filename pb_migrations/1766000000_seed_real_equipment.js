/// <reference path="../pb_data/types.d.ts" />

/**
 * Seed Migration: Real Cinema Equipment Data
 * 
 * This migration populates the database with realistic cinema rental equipment
 * for client presentation. Includes:
 * - Categories (cameras, lenses, power, media, monitors, support)
 * - Equipment items (30+ professional cinema products)
 * - Kit templates (camera packages with configurable accessories)
 * - Kit items (linking accessories to camera kits)
 */

migrate((app) => {
    console.log('[Seed] Starting equipment seed migration...');

    // =========================================================================
    // PHASE 1: SEED CATEGORIES
    // =========================================================================

    const categoriesCollection = app.findCollectionByNameOrId('categories');

    const categoryData = [
        { name: 'Cameras', name_en: 'Cameras', name_fr: 'Caméras', slug: 'cameras', description: 'Professional cinema cameras', icon: 'camera' },
        { name: 'Lenses', name_en: 'Lenses', name_fr: 'Objectifs', slug: 'lenses', description: 'Cinema lenses and lens sets', icon: 'aperture' },
        { name: 'Power', name_en: 'Power & Batteries', name_fr: 'Batteries & Alimentation', slug: 'power', description: 'V-Mount, Gold Mount batteries and power solutions', icon: 'battery' },
        { name: 'Media', name_en: 'Media & Storage', name_fr: 'Média & Stockage', slug: 'media', description: 'CFexpress, SSD, and recording media', icon: 'hard-drive' },
        { name: 'Monitors', name_en: 'Monitors', name_fr: 'Moniteurs', slug: 'monitors', description: 'On-camera and production monitors', icon: 'monitor' },
        { name: 'Support', name_en: 'Cages & Rigs', name_fr: 'Cages & Supports', slug: 'support', description: 'Camera cages, handles, and rigging', icon: 'box' },
        { name: 'Audio', name_en: 'Audio', name_fr: 'Audio', slug: 'audio', description: 'Microphones, recorders, and audio gear', icon: 'mic' },
        { name: 'Lighting', name_en: 'Lighting', name_fr: 'Éclairage', slug: 'lighting', description: 'LED panels, fresnels, and lighting fixtures', icon: 'sun' },
        { name: 'Grip', name_en: 'Grip', name_fr: 'Machinerie', slug: 'grip', description: 'Tripods, dollies, and grip equipment', icon: 'move' },
    ];

    const categoryIds = {};

    for (const cat of categoryData) {
        try {
            // Check if category exists
            let existing;
            try {
                existing = app.findRecordsByFilter(categoriesCollection, `slug = "${cat.slug}"`, '', 1);
            } catch {
                existing = [];
            }

            if (existing && existing.length > 0) {
                categoryIds[cat.slug] = existing[0].id;
                console.log(`[Seed] Category "${cat.name}" already exists, skipping...`);
            } else {
                const record = new Record(categoriesCollection);
                record.set('name', cat.name);
                record.set('name_en', cat.name_en);
                record.set('name_fr', cat.name_fr);
                record.set('slug', cat.slug);
                record.set('description', cat.description);
                record.set('icon', cat.icon);
                app.save(record);
                categoryIds[cat.slug] = record.id;
                console.log(`[Seed] Created category: ${cat.name}`);
            }
        } catch (e) {
            console.error(`[Seed] Error with category ${cat.name}:`, e);
        }
    }

    // =========================================================================
    // PHASE 2: SEED EQUIPMENT
    // =========================================================================

    const equipmentCollection = app.findCollectionByNameOrId('equipment');

    const equipmentData = [
        // CAMERAS
        {
            name_en: 'Sony FX6 Full-Frame Cinema Camera',
            name_fr: 'Sony FX6 Caméra Cinéma Plein Format',
            slug: 'sony-fx6',
            category: 'cameras',
            brand: 'Sony',
            description_en: 'Full-frame cinema camera with 4K 120fps, S-Cinetone, and dual base ISO.',
            description_fr: 'Caméra cinéma plein format avec 4K 120fps, S-Cinetone et double ISO natif.',
            daily_rate: 350,
            stock: 3,
            stock_available: 2,
            featured: true,
            visibility: true
        },
        {
            name_en: 'Sony FX3 Cinema Line',
            name_fr: 'Sony FX3 Ligne Cinéma',
            slug: 'sony-fx3',
            category: 'cameras',
            brand: 'Sony',
            description_en: 'Compact full-frame cinema camera, ideal for run-and-gun and gimbal work.',
            description_fr: 'Caméra cinéma compacte plein format, idéale pour le run-and-gun et gimbal.',
            daily_rate: 250,
            stock: 4,
            stock_available: 3,
            featured: true,
            visibility: true
        },
        {
            name_en: 'ARRI Alexa Mini LF',
            name_fr: 'ARRI Alexa Mini LF',
            slug: 'arri-alexa-mini-lf',
            category: 'cameras',
            brand: 'ARRI',
            description_en: 'Large-format cinema camera with ARRI color science and 4.5K sensor.',
            description_fr: 'Caméra cinéma grand format avec science des couleurs ARRI et capteur 4.5K.',
            daily_rate: 1200,
            stock: 1,
            stock_available: 1,
            featured: true,
            visibility: true
        },
        {
            name_en: 'RED V-Raptor 8K VV',
            name_fr: 'RED V-Raptor 8K VV',
            slug: 'red-v-raptor-8k',
            category: 'cameras',
            brand: 'RED',
            description_en: '8K Vista Vision sensor with global shutter and 600fps at 2K.',
            description_fr: 'Capteur Vista Vision 8K avec obturateur global et 600fps en 2K.',
            daily_rate: 950,
            stock: 1,
            stock_available: 1,
            featured: false,
            visibility: true
        },
        {
            name_en: 'Blackmagic URSA Mini Pro 12K',
            name_fr: 'Blackmagic URSA Mini Pro 12K',
            slug: 'bmpcc-ursa-12k',
            category: 'cameras',
            brand: 'Blackmagic Design',
            description_en: '12K Super 35 sensor with Blackmagic RAW recording.',
            description_fr: 'Capteur Super 35 12K avec enregistrement Blackmagic RAW.',
            daily_rate: 550,
            stock: 2,
            stock_available: 2,
            featured: false,
            visibility: true
        },

        // LENSES
        {
            name_en: 'Sony FE 24-70mm f/2.8 GM II',
            name_fr: 'Sony FE 24-70mm f/2.8 GM II',
            slug: 'sony-24-70-gm2',
            category: 'lenses',
            brand: 'Sony',
            description_en: 'Professional zoom lens, perfect for documentary and event work.',
            description_fr: 'Objectif zoom professionnel, parfait pour documentaire et événementiel.',
            daily_rate: 85,
            stock: 4,
            stock_available: 3,
            featured: false,
            visibility: true
        },
        {
            name_en: 'Sony FE 70-200mm f/2.8 GM II',
            name_fr: 'Sony FE 70-200mm f/2.8 GM II',
            slug: 'sony-70-200-gm2',
            category: 'lenses',
            brand: 'Sony',
            description_en: 'Telephoto zoom, ideal for interviews and compressed shots.',
            description_fr: 'Téléobjectif zoom, idéal pour interviews et plans compressés.',
            daily_rate: 95,
            stock: 3,
            stock_available: 2,
            featured: false,
            visibility: true
        },
        {
            name_en: 'Sony FE 50mm f/1.2 GM',
            name_fr: 'Sony FE 50mm f/1.2 GM',
            slug: 'sony-50-12-gm',
            category: 'lenses',
            brand: 'Sony',
            description_en: 'Ultra-fast prime lens with stunning bokeh.',
            description_fr: 'Objectif fixe ultra-rapide avec bokeh magnifique.',
            daily_rate: 75,
            stock: 2,
            stock_available: 2,
            featured: false,
            visibility: true
        },
        {
            name_en: 'Canon CN-E 35mm T1.5 L F',
            name_fr: 'Canon CN-E 35mm T1.5 L F',
            slug: 'canon-cne-35mm',
            category: 'lenses',
            brand: 'Canon',
            description_en: 'Cinema prime lens with EF mount, 11-blade iris for beautiful bokeh.',
            description_fr: 'Objectif cinéma fixe avec monture EF, iris 11 lames pour un beau bokeh.',
            daily_rate: 120,
            stock: 2,
            stock_available: 2,
            featured: false,
            visibility: true
        },
        {
            name_en: 'Zeiss CP.3 Prime Set (5-Lens)',
            name_fr: 'Set Zeiss CP.3 Primes (5 Objectifs)',
            slug: 'zeiss-cp3-set',
            category: 'lenses',
            brand: 'Zeiss',
            description_en: 'Set of 5 CP.3 primes: 25, 35, 50, 85, 135mm T2.1',
            description_fr: 'Set de 5 objectifs CP.3: 25, 35, 50, 85, 135mm T2.1',
            daily_rate: 450,
            stock: 1,
            stock_available: 1,
            featured: true,
            visibility: true
        },

        // POWER
        {
            name_en: 'V-Mount Battery 150Wh',
            name_fr: 'Batterie V-Mount 150Wh',
            slug: 'v-mount-150wh',
            category: 'power',
            brand: 'Core SWX',
            description_en: 'High-capacity V-Mount battery with D-Tap and USB outputs.',
            description_fr: 'Batterie V-Mount haute capacité avec sorties D-Tap et USB.',
            daily_rate: 25,
            stock: 12,
            stock_available: 10,
            featured: false,
            visibility: true
        },
        {
            name_en: 'Sony BP-A60 Battery Pack (×2)',
            name_fr: 'Pack Batterie Sony BP-A60 (×2)',
            slug: 'sony-bp-a60-pack',
            category: 'power',
            brand: 'Sony',
            description_en: 'Two Sony BP-A60 batteries for FX6/FX9.',
            description_fr: 'Deux batteries Sony BP-A60 pour FX6/FX9.',
            daily_rate: 35,
            stock: 6,
            stock_available: 5,
            featured: false,
            visibility: true
        },
        {
            name_en: 'D-Tap Power Cable Kit',
            name_fr: 'Kit Câble D-Tap',
            slug: 'd-tap-cable-kit',
            category: 'power',
            brand: 'Wooden Camera',
            description_en: 'D-Tap to various camera power cables.',
            description_fr: 'Câbles D-Tap vers différentes alimentations caméra.',
            daily_rate: 15,
            stock: 8,
            stock_available: 7,
            featured: false,
            visibility: true
        },
        {
            name_en: 'Dual V-Mount Charger',
            name_fr: 'Chargeur Double V-Mount',
            slug: 'dual-vmount-charger',
            category: 'power',
            brand: 'Core SWX',
            description_en: 'Simultaneous dual V-Mount battery charger.',
            description_fr: 'Chargeur double batterie V-Mount simultané.',
            daily_rate: 20,
            stock: 4,
            stock_available: 4,
            featured: false,
            visibility: true
        },

        // MEDIA
        {
            name_en: 'CFexpress Type B 512GB (×2)',
            name_fr: 'CFexpress Type B 512Go (×2)',
            slug: 'cfexpress-512gb-2pack',
            category: 'media',
            brand: 'SanDisk',
            description_en: 'Two 512GB CFexpress Type B cards for Sony/Canon cameras.',
            description_fr: 'Deux cartes CFexpress Type B 512Go pour Sony/Canon.',
            daily_rate: 40,
            stock: 8,
            stock_available: 6,
            featured: false,
            visibility: true
        },
        {
            name_en: 'CFexpress Card Reader USB-C',
            name_fr: 'Lecteur CFexpress USB-C',
            slug: 'cfexpress-reader',
            category: 'media',
            brand: 'ProGrade',
            description_en: 'High-speed CFexpress Type B card reader.',
            description_fr: 'Lecteur carte CFexpress Type B haute vitesse.',
            daily_rate: 15,
            stock: 6,
            stock_available: 5,
            featured: false,
            visibility: true
        },
        {
            name_en: 'Samsung T7 Shield 2TB SSD',
            name_fr: 'Samsung T7 Shield 2To SSD',
            slug: 'samsung-t7-2tb',
            category: 'media',
            brand: 'Samsung',
            description_en: 'Rugged portable SSD for media backup.',
            description_fr: 'SSD portable robuste pour sauvegarde média.',
            daily_rate: 25,
            stock: 5,
            stock_available: 4,
            featured: false,
            visibility: true
        },

        // MONITORS
        {
            name_en: 'SmallHD Cine 7" Monitor',
            name_fr: 'Moniteur SmallHD Cine 7"',
            slug: 'smallhd-cine-7',
            category: 'monitors',
            brand: 'SmallHD',
            description_en: '7" 1800-nit daylight-viewable touchscreen monitor.',
            description_fr: 'Moniteur tactile 7" 1800 nits visible en plein jour.',
            daily_rate: 85,
            stock: 4,
            stock_available: 3,
            featured: false,
            visibility: true
        },
        {
            name_en: 'Atomos Ninja V+ 5"',
            name_fr: 'Atomos Ninja V+ 5"',
            slug: 'atomos-ninja-v-plus',
            category: 'monitors',
            brand: 'Atomos',
            description_en: '5" HDR monitor/recorder with ProRes RAW support.',
            description_fr: 'Moniteur/enregistreur HDR 5" avec support ProRes RAW.',
            daily_rate: 65,
            stock: 5,
            stock_available: 4,
            featured: false,
            visibility: true
        },
        {
            name_en: 'TVLogic F-7H MK2 7"',
            name_fr: 'TVLogic F-7H MK2 7"',
            slug: 'tvlogic-f7h-mk2',
            category: 'monitors',
            brand: 'TVLogic',
            description_en: 'Broadcast-grade 7" field monitor with false color.',
            description_fr: 'Moniteur terrain 7" qualité broadcast avec fausses couleurs.',
            daily_rate: 75,
            stock: 3,
            stock_available: 2,
            featured: false,
            visibility: true
        },

        // SUPPORT
        {
            name_en: 'Wooden Camera FX6 Base Kit',
            name_fr: 'Kit Base Wooden Camera FX6',
            slug: 'wooden-camera-fx6-cage',
            category: 'support',
            brand: 'Wooden Camera',
            description_en: 'Complete cage system for Sony FX6 with NATO rails.',
            description_fr: 'Système cage complet pour Sony FX6 avec rails NATO.',
            daily_rate: 55,
            stock: 3,
            stock_available: 2,
            featured: false,
            visibility: true
        },
        {
            name_en: 'SmallRig Top Handle with NATO',
            name_fr: 'Poignée Supérieure SmallRig NATO',
            slug: 'smallrig-top-handle',
            category: 'support',
            brand: 'SmallRig',
            description_en: 'Universal top handle with NATO rail mount.',
            description_fr: 'Poignée supérieure universelle avec montage rail NATO.',
            daily_rate: 15,
            stock: 8,
            stock_available: 7,
            featured: false,
            visibility: true
        },
        {
            name_en: 'Tilta Nucleus-M Follow Focus',
            name_fr: 'Follow Focus Tilta Nucleus-M',
            slug: 'tilta-nucleus-m',
            category: 'support',
            brand: 'Tilta',
            description_en: 'Wireless follow focus system with hand unit.',
            description_fr: 'Système follow focus sans fil avec unité main.',
            daily_rate: 95,
            stock: 2,
            stock_available: 2,
            featured: false,
            visibility: true
        },

        // GRIP
        {
            name_en: 'Sachtler FSB 8 Fluid Head & Tripod',
            name_fr: 'Sachtler FSB 8 Tête Fluide & Trépied',
            slug: 'sachtler-fsb8',
            category: 'grip',
            brand: 'Sachtler',
            description_en: 'Professional fluid head with flowtech 75 tripod.',
            description_fr: 'Tête fluide professionnelle avec trépied flowtech 75.',
            daily_rate: 85,
            stock: 4,
            stock_available: 3,
            featured: true,
            visibility: true
        },
        {
            name_en: 'DJI RS 3 Pro Gimbal',
            name_fr: 'Gimbal DJI RS 3 Pro',
            slug: 'dji-rs3-pro',
            category: 'grip',
            brand: 'DJI',
            description_en: '3-axis gimbal stabilizer for cinema cameras up to 4.5kg.',
            description_fr: 'Stabilisateur gimbal 3 axes pour caméras cinéma jusqu\'à 4.5kg.',
            daily_rate: 75,
            stock: 3,
            stock_available: 2,
            featured: false,
            visibility: true
        },
    ];

    const equipmentIds = {};

    for (const equip of equipmentData) {
        try {
            // Check if equipment exists
            let existing;
            try {
                existing = app.findRecordsByFilter(equipmentCollection, `slug = "${equip.slug}"`, '', 1);
            } catch {
                existing = [];
            }

            if (existing && existing.length > 0) {
                equipmentIds[equip.slug] = existing[0].id;
                console.log(`[Seed] Equipment "${equip.name_en}" already exists, skipping...`);
            } else {
                const record = new Record(equipmentCollection);
                record.set('name_en', equip.name_en);
                record.set('name_fr', equip.name_fr);
                record.set('slug', equip.slug);
                record.set('category', categoryIds[equip.category]);
                record.set('brand', equip.brand);
                record.set('description_en', equip.description_en);
                record.set('description_fr', equip.description_fr);
                record.set('daily_rate', equip.daily_rate);
                record.set('stock', equip.stock);
                record.set('stock_available', equip.stock_available);
                record.set('featured', equip.featured);
                record.set('visibility', equip.visibility);
                app.save(record);
                equipmentIds[equip.slug] = record.id;
                console.log(`[Seed] Created equipment: ${equip.name_en}`);
            }
        } catch (e) {
            console.error(`[Seed] Error with equipment ${equip.name_en}:`, e);
        }
    }

    // =========================================================================
    // PHASE 3: SEED KIT TEMPLATES
    // =========================================================================

    const kitTemplatesCollection = app.findCollectionByNameOrId('kit_templates');

    const kitTemplateData = [
        {
            name: 'Sony FX6 Cinema Package',
            main_product: 'sony-fx6',
            base_price_modifier: 0,
            description: 'Complete production-ready package for the Sony FX6'
        },
        {
            name: 'Sony FX3 Run & Gun Kit',
            main_product: 'sony-fx3',
            base_price_modifier: 0,
            description: 'Compact kit for documentary and gimbal work'
        },
        {
            name: 'ARRI Alexa Mini LF Pro Package',
            main_product: 'arri-alexa-mini-lf',
            base_price_modifier: -100,
            description: 'Full cinema package with Zeiss primes included'
        },
    ];

    const kitTemplateIds = {};

    for (const kit of kitTemplateData) {
        try {
            if (!equipmentIds[kit.main_product]) {
                console.log(`[Seed] Skipping kit "${kit.name}" - main product not found`);
                continue;
            }

            // Check if template exists
            let existing;
            try {
                existing = app.findRecordsByFilter(kitTemplatesCollection, `name = "${kit.name}"`, '', 1);
            } catch {
                existing = [];
            }

            if (existing && existing.length > 0) {
                kitTemplateIds[kit.name] = existing[0].id;
                console.log(`[Seed] Kit template "${kit.name}" already exists, skipping...`);
            } else {
                const record = new Record(kitTemplatesCollection);
                record.set('name', kit.name);
                record.set('main_product', equipmentIds[kit.main_product]);
                record.set('base_price_modifier', kit.base_price_modifier);
                record.set('description', kit.description);
                app.save(record);
                kitTemplateIds[kit.name] = record.id;
                console.log(`[Seed] Created kit template: ${kit.name}`);
            }
        } catch (e) {
            console.error(`[Seed] Error with kit template ${kit.name}:`, e);
        }
    }

    // =========================================================================
    // PHASE 4: SEED KIT ITEMS
    // =========================================================================

    const kitItemsCollection = app.findCollectionByNameOrId('kit_items');

    // Define kit items for Sony FX6 kit
    const fx6KitItems = [
        // Lenses slot
        { product: 'sony-24-70-gm2', slot_name: 'Lenses', is_mandatory: false, default_quantity: 1, swappable_category: 'lenses' },
        { product: 'sony-70-200-gm2', slot_name: 'Lenses', is_mandatory: false, default_quantity: 1, swappable_category: 'lenses' },
        { product: 'sony-50-12-gm', slot_name: 'Lenses', is_mandatory: false, default_quantity: 1, swappable_category: 'lenses' },
        // Power slot
        { product: 'v-mount-150wh', slot_name: 'Power Solution', is_mandatory: true, default_quantity: 2, swappable_category: 'power' },
        { product: 'd-tap-cable-kit', slot_name: 'Power Solution', is_mandatory: false, default_quantity: 1, swappable_category: 'power' },
        // Media slot
        { product: 'cfexpress-512gb-2pack', slot_name: 'Media & Storage', is_mandatory: true, default_quantity: 1, swappable_category: 'media' },
        { product: 'cfexpress-reader', slot_name: 'Media & Storage', is_mandatory: false, default_quantity: 1, swappable_category: 'media' },
        // Monitoring slot
        { product: 'smallhd-cine-7', slot_name: 'Monitoring', is_mandatory: false, default_quantity: 1, swappable_category: 'monitors' },
        { product: 'atomos-ninja-v-plus', slot_name: 'Monitoring', is_mandatory: false, default_quantity: 1, swappable_category: 'monitors' },
        // Support slot
        { product: 'wooden-camera-fx6-cage', slot_name: 'Support & Rigging', is_mandatory: false, default_quantity: 1, swappable_category: 'support' },
        { product: 'smallrig-top-handle', slot_name: 'Support & Rigging', is_mandatory: false, default_quantity: 1, swappable_category: 'support' },
        { product: 'tilta-nucleus-m', slot_name: 'Support & Rigging', is_mandatory: false, default_quantity: 1, swappable_category: 'support' },
    ];

    // Define kit items for Sony FX3 kit (simpler)
    const fx3KitItems = [
        { product: 'sony-24-70-gm2', slot_name: 'Lenses', is_mandatory: false, default_quantity: 1, swappable_category: 'lenses' },
        { product: 'sony-50-12-gm', slot_name: 'Lenses', is_mandatory: false, default_quantity: 1, swappable_category: 'lenses' },
        { product: 'v-mount-150wh', slot_name: 'Power Solution', is_mandatory: true, default_quantity: 1, swappable_category: 'power' },
        { product: 'cfexpress-512gb-2pack', slot_name: 'Media & Storage', is_mandatory: true, default_quantity: 1, swappable_category: 'media' },
        { product: 'atomos-ninja-v-plus', slot_name: 'Monitoring', is_mandatory: false, default_quantity: 1, swappable_category: 'monitors' },
        { product: 'smallrig-top-handle', slot_name: 'Support & Rigging', is_mandatory: false, default_quantity: 1, swappable_category: 'support' },
    ];

    // Define kit items for ARRI Alexa Mini LF kit (premium)
    const alexaKitItems = [
        { product: 'zeiss-cp3-set', slot_name: 'Lenses', is_mandatory: true, default_quantity: 1, swappable_category: 'lenses' },
        { product: 'v-mount-150wh', slot_name: 'Power Solution', is_mandatory: true, default_quantity: 4, swappable_category: 'power' },
        { product: 'dual-vmount-charger', slot_name: 'Power Solution', is_mandatory: true, default_quantity: 1, swappable_category: 'power' },
        { product: 'samsung-t7-2tb', slot_name: 'Media & Storage', is_mandatory: true, default_quantity: 2, swappable_category: 'media' },
        { product: 'smallhd-cine-7', slot_name: 'Monitoring', is_mandatory: true, default_quantity: 1, swappable_category: 'monitors' },
        { product: 'tvlogic-f7h-mk2', slot_name: 'Monitoring', is_mandatory: false, default_quantity: 1, swappable_category: 'monitors' },
        { product: 'tilta-nucleus-m', slot_name: 'Support & Rigging', is_mandatory: true, default_quantity: 1, swappable_category: 'support' },
    ];

    const allKitItems = [
        { templateName: 'Sony FX6 Cinema Package', items: fx6KitItems },
        { templateName: 'Sony FX3 Run & Gun Kit', items: fx3KitItems },
        { templateName: 'ARRI Alexa Mini LF Pro Package', items: alexaKitItems },
    ];

    for (const kitConfig of allKitItems) {
        const templateId = kitTemplateIds[kitConfig.templateName];
        if (!templateId) {
            console.log(`[Seed] Skipping kit items for "${kitConfig.templateName}" - template not found`);
            continue;
        }

        for (const item of kitConfig.items) {
            try {
                const productId = equipmentIds[item.product];
                if (!productId) {
                    console.log(`[Seed] Skipping kit item "${item.product}" - product not found`);
                    continue;
                }

                // Check if kit item already exists
                let existing;
                try {
                    existing = app.findRecordsByFilter(
                        kitItemsCollection,
                        `template = "${templateId}" && product = "${productId}" && slot_name = "${item.slot_name}"`,
                        '',
                        1
                    );
                } catch {
                    existing = [];
                }

                if (existing && existing.length > 0) {
                    console.log(`[Seed] Kit item "${item.product}" in "${kitConfig.templateName}" already exists, skipping...`);
                } else {
                    const record = new Record(kitItemsCollection);
                    record.set('template', templateId);
                    record.set('product', productId);
                    record.set('slot_name', item.slot_name);
                    record.set('is_mandatory', item.is_mandatory);
                    record.set('default_quantity', item.default_quantity);
                    if (item.swappable_category && categoryIds[item.swappable_category]) {
                        record.set('swappable_category', categoryIds[item.swappable_category]);
                    }
                    app.save(record);
                    console.log(`[Seed] Created kit item: ${item.product} in ${kitConfig.templateName}`);
                }
            } catch (e) {
                console.error(`[Seed] Error with kit item ${item.product}:`, e);
            }
        }
    }

    console.log('[Seed] Equipment seed migration complete!');

}, (app) => {
    // Rollback: We don't delete data on rollback to be safe
    console.log('[Seed] Rollback - No action taken (seed data preserved)');
});
