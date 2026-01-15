// Migration: Seed Kit Templates, Kit Items, and Additional Lenses
// Adds 8 kit templates, 16 kit items, and 4 lenses

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
    console.log("🚀 Starting kit templates & additional lenses migration...")

    // Get collections
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

    // Build equipment slug->ID map
    const equipmentRecords = app.findRecordsByFilter(equipmentCollection, "1=1", "", 500, 0)
    const equipmentMap = {}
    for (const rec of equipmentRecords) {
        equipmentMap[rec.get("slug")] = rec.id
    }
    console.log(`📦 Loaded ${Object.keys(equipmentMap).length} equipment items`)

    // ===== ADDITIONAL LENSES =====
    const additionalLenses = [
        {
            name: "Cooke S8/i FF Prime Set",
            brand: "Cooke",
            category: "Lenses",
            description_en: "Designed for Full Frame sensors. Features a fast T1.4 aperture across the set. Delivers the 'Cooke Look' with organic bokeh.",
            description_fr: "Conçu pour les capteurs plein format. Ouverture rapide T1.4 sur tout le set. Offre le 'Cooke Look' avec un bokeh organique.",
            specs: { mount: "PL", aperture: "T1.4", coverage: "Full Frame", image_url: "" },
            type: "Prime Lens Set", mount: "PL", sensor_size: "Full Frame"
        },
        {
            name: "Zeiss Supreme Prime Radiance Set",
            brand: "Zeiss",
            category: "Lenses",
            description_en: "Based on the Supreme Primes but with a new coating that creates beautiful, controllable blue flares (Radiance).",
            description_fr: "Basé sur les Supreme Primes mais avec un nouveau revêtement créant de magnifiques flares bleus contrôlables (Radiance).",
            specs: { mount: "PL", aperture: "T1.5", coverage: "Full Frame", feature: "Blue Flares", image_url: "" },
            type: "Prime Lens Set", mount: "PL", sensor_size: "Full Frame"
        },
        {
            name: "Angenieux Optimo 45-120mm T2.8",
            brand: "Angenieux",
            category: "Lenses",
            description_en: "Completes the Optimo lightweight zoom series. Perfect portrait to telephoto range.",
            description_fr: "Complète la série de zooms légers Optimo. Portée parfaite du portrait au téléobjectif.",
            specs: { focal_length: "45-120mm", aperture: "T2.8", mount: "PL", coverage: "Super 35", image_url: "" },
            type: "Zoom Lens", mount: "PL", sensor_size: "Super 35"
        },
        {
            name: "Canon Cine-Servo 17-120mm T2.95-3.9",
            brand: "Canon",
            category: "Lenses",
            description_en: "High 8K optical performance. Features a built-in 1.5x extender and removable servo drive.",
            description_fr: "Performance optique 8K élevée. Comprend un extender 1.5x intégré et un servo amovible.",
            specs: { focal_length: "17-120mm", aperture: "T2.95-3.9", mount: "PL", coverage: "Super 35 / Full Frame", image_url: "" },
            type: "Zoom Lens", mount: "PL", sensor_size: "Full Frame"
        }
    ]

    for (const item of additionalLenses) {
        const slug = slugify(item.name)
        try {
            const existing = app.findFirstRecordByFilter(equipmentCollection, `slug = "${slug}"`)
            if (existing) {
                console.log(`⏭️ Skipping existing lens: ${item.name}`)
                continue
            }
        } catch (e) { }

        const catId = categoryMap[item.category]
        if (!catId) continue

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
        record.set("stock_available", 1)
        record.set("is_featured", false)
        record.set("visibility", "published")
        if (item.type) record.set("type", item.type)
        if (item.mount) record.set("mount", item.mount)
        if (item.sensor_size) record.set("sensor_size", item.sensor_size)

        app.save(record)
        equipmentMap[slug] = record.id
        console.log(`✅ Added lens: ${item.name}`)
    }

    // ===== KIT TEMPLATES =====
    const kitTemplates = [
        {
            name: "Sony Venice 2 Cine Package",
            main_product_slug: "sony-venice-2-8k",
            base_price_modifier: -300,
            description_en: "Ultimate full-frame cinema package. Includes Sony Venice 2 Body, OConnor 2575D Fluid Head, Power Distribution, and monitoring.",
            description_fr: "Package cinéma plein format ultime. Inclut le boîtier Sony Venice 2, tête fluide OConnor 2575D, distribution d'alimentation et monitoring."
        },
        {
            name: "ARRI Alexa 35 Production Package",
            main_product_slug: "arri-alexa-35",
            base_price_modifier: -200,
            description_en: "A complete cinema package ready for high-end production. Includes Alexa 35, MVF-2 Viewfinder, Codex Media, and Support.",
            description_fr: "Un package cinéma complet prêt pour la production haut de gamme. Inclut l'Alexa 35, viseur MVF-2, médias Codex et support."
        },
        {
            name: "RED DSMC2 Monstro 8K Package",
            main_product_slug: "red-dsmc2-monstro-8k-vv",
            base_price_modifier: -250,
            description_en: "Full frame 8K raw workflow. Includes RED Monstro body, RED Touch Monitor, Mini-Mags, and choice of PL or EF mount.",
            description_fr: "Workflow raw 8K plein format. Inclut le boîtier RED Monstro, moniteur RED Touch, Mini-Mags et choix de monture PL ou EF."
        },
        {
            name: "Sony FX9 Documentary Kit",
            main_product_slug: "sony-pxw-fx9",
            base_price_modifier: -100,
            description_en: "Ready-to-shoot documentary kit. Includes FX9, Fujinon Cabrio Zoom, and Sachtler Tripod system.",
            description_fr: "Kit documentaire prêt à tourner. Inclut FX9, zoom Fujinon Cabrio et système trépied Sachtler."
        },
        {
            name: "ARRI Amira ENG Kit",
            main_product_slug: "arri-amira",
            base_price_modifier: -150,
            description_en: "Ergonomic shoulder-mount package perfect for broadcast and single-operator use.",
            description_fr: "Package épaule ergonomique parfait pour le broadcast et l'utilisation mono-opérateur."
        },
        {
            name: "Indie Anamorphic Lens Bundle",
            main_product_slug: "atlas-orion-anamorphic-set",
            base_price_modifier: -50,
            description_en: "Bundle of Atlas Orion Anamorphic lenses (Set A or B) with Matte Box and Wireless Follow Focus.",
            description_fr: "Bundle d'objectifs Atlas Orion Anamorphic (Set A ou B) avec Matte Box et Follow Focus sans fil."
        },
        {
            name: "Wireless Director's Monitor Cage",
            main_product_slug: "smallhd-703-bolt-7-wireless-monitor",
            base_price_modifier: -20,
            description_en: "Handheld wireless monitoring solution. Includes SmallHD 703 Bolt, handles, and battery power.",
            description_fr: "Solution de monitoring sans fil portable. Inclut SmallHD 703 Bolt, poignées et alimentation batterie."
        },
        {
            name: "DJI RS 4 Pro Stabilization Package",
            main_product_slug: "dji-rs-4-pro-combo",
            base_price_modifier: -100,
            description_en: "Complete stabilization package including DJI RS 4 Pro, Ready Rig or Support Vest, and DJI Force Pro controller.",
            description_fr: "Package stabilisation complet incluant DJI RS 4 Pro, Ready Rig ou gilet de support et contrôleur DJI Force Pro."
        }
    ]

    const templateMap = {}

    for (const kit of kitTemplates) {
        const mainProductId = equipmentMap[kit.main_product_slug]
        if (!mainProductId) {
            console.log(`⚠️ Main product not found for kit: ${kit.name} (${kit.main_product_slug})`)
            continue
        }

        // Check if exists
        try {
            const existing = app.findFirstRecordByFilter(kitTemplatesCollection, `name = "${kit.name}"`)
            if (existing) {
                templateMap[kit.name] = existing.id
                console.log(`⏭️ Skipping existing kit template: ${kit.name}`)
                continue
            }
        } catch (e) { }

        const record = new Record(kitTemplatesCollection)
        record.set("name", kit.name)
        record.set("description", kit.description_en)
        record.set("main_product_id", mainProductId)
        record.set("base_price_modifier", kit.base_price_modifier)

        app.save(record)
        templateMap[kit.name] = record.id
        console.log(`✅ Added kit template: ${kit.name}`)
    }

    // ===== KIT SLOTS (Items) =====
    const kitSlots = [
        // Venice 2 Package
        { template: "Sony Venice 2 Cine Package", slot_name: "Camera Body", category: "Cameras", recommended: ["sony-venice-2-8k"], order: 1 },
        { template: "Sony Venice 2 Cine Package", slot_name: "Fluid Head", category: "Support", recommended: ["oconnor-ultimate-2560-fluid-head", "cartoni-maxima-30-video-fluid-head"], order: 2 },
        { template: "Sony Venice 2 Cine Package", slot_name: "Primary Lens Set", category: "Lenses", recommended: ["zeiss-supreme-prime-set", "cooke-s4i-prime-set"], order: 3 },

        // Alexa 35 Package
        { template: "ARRI Alexa 35 Production Package", slot_name: "Camera Body", category: "Cameras", recommended: ["arri-alexa-35"], order: 1 },
        { template: "ARRI Alexa 35 Production Package", slot_name: "Lens Control", category: "Lens Control", recommended: ["teradek-rt-fiz-wireless-lens-control", "arri-sxu-1-single-axis-unit"], order: 2 },
        { template: "ARRI Alexa 35 Production Package", slot_name: "Monitor", category: "Monitors", recommended: ["smallhd-ultra-7-uhd-4k-monitor"], order: 3 },

        // RED Monstro Package
        { template: "RED DSMC2 Monstro 8K Package", slot_name: "Camera Body", category: "Cameras", recommended: ["red-dsmc2-monstro-8k-vv"], order: 1 },
        { template: "RED DSMC2 Monstro 8K Package", slot_name: "Control Monitor", category: "Monitors", recommended: ["smallhd-cine-7-red-rcp2-monitor"], order: 2 },

        // FX9 Documentary Kit
        { template: "Sony FX9 Documentary Kit", slot_name: "Camera Body", category: "Cameras", recommended: ["sony-pxw-fx9"], order: 1 },
        { template: "Sony FX9 Documentary Kit", slot_name: "Zoom Lens", category: "Lenses", recommended: ["fujinon-cabrio-19-90mm-t29", "fujinon-cabrio-20-120mm-t35"], order: 2 },
        { template: "Sony FX9 Documentary Kit", slot_name: "Tripod System", category: "Support", recommended: ["sachtler-video-30-ii-tripod"], order: 3 },

        // Amira ENG Kit  
        { template: "ARRI Amira ENG Kit", slot_name: "Camera Body", category: "Cameras", recommended: ["arri-amira"], order: 1 },
        { template: "ARRI Amira ENG Kit", slot_name: "Zoom Lens", category: "Lenses", recommended: ["fujinon-cabrio-14-35mm-t29", "canon-cn-e-155-47mm-t28-wide-zoom"], order: 2 },

        // Anamorphic Bundle
        { template: "Indie Anamorphic Lens Bundle", slot_name: "Anamorphic Primes", category: "Lenses", recommended: ["atlas-orion-anamorphic-set", "servicevision-scorpion-anamorphic-set"], order: 1 },
        { template: "Indie Anamorphic Lens Bundle", slot_name: "Matte Box", category: "Matte Boxes", recommended: ["arri-lmb-25-matte-box-set", "arri-mmb-2-double-lws-set"], order: 2 },

        // Director's Monitor
        { template: "Wireless Director's Monitor Cage", slot_name: "Monitor", category: "Monitors", recommended: ["smallhd-703-bolt-7-wireless-monitor"], order: 1 },
        { template: "Wireless Director's Monitor Cage", slot_name: "Wireless Receiver", category: "Wireless Video", recommended: ["teradek-bolt-6-lt-750-kit", "teradek-bolt-sidekick-ii"], order: 2 },

        // Stabilization Package
        { template: "DJI RS 4 Pro Stabilization Package", slot_name: "Gimbal", category: "Stabilization", recommended: ["dji-rs-4-pro-combo", "dji-rs-3-pro-combo"], order: 1 },
        { template: "DJI RS 4 Pro Stabilization Package", slot_name: "Remote Controller", category: "Stabilization", recommended: ["dji-force-pro"], order: 2 }
    ]

    let slotsAdded = 0
    for (const slot of kitSlots) {
        const templateId = templateMap[slot.template]
        const categoryId = categoryMap[slot.category]

        if (!templateId) {
            console.log(`⚠️ Template not found: ${slot.template}`)
            continue
        }
        if (!categoryId) {
            console.log(`⚠️ Category not found: ${slot.category}`)
            continue
        }

        // Map recommended slugs to IDs
        const recommendedIds = slot.recommended
            .map(slug => equipmentMap[slug])
            .filter(id => id)

        const record = new Record(kitSlotsCollection)
        record.set("template_id", templateId)
        record.set("category_id", categoryId)
        record.set("slot_name", slot.slot_name)
        record.set("recommended_ids", JSON.stringify(recommendedIds))
        record.set("display_order", slot.order)

        app.save(record)
        slotsAdded++
    }

    console.log(`\n🎉 Migration complete! Added 4 lenses, ${Object.keys(templateMap).length} kit templates, and ${slotsAdded} kit slots.`)

}, (app) => {
    console.log("⬇️ Rolling back kit templates migration...")
    // Rollback would delete the added templates and slots
})
