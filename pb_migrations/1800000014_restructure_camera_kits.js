// Migration: Restructure Kits - One per Camera with Category Slots
// Creates a kit template for each camera, with slots for all other equipment categories

const ID_EQUIPMENT = "pbc_equipment00001"
const ID_CATEGORIES = "pbc_categories0001"
const ID_KIT_TEMPLATES = "pbc_kittemplates01"
const ID_KIT_SLOTS = "pbc_kitslots000001"

migrate((app) => {
    console.log("🚀 Restructuring kit templates - one per camera...")

    const equipmentCollection = app.findCollectionByNameOrId(ID_EQUIPMENT)
    const categoriesCollection = app.findCollectionByNameOrId(ID_CATEGORIES)
    const kitTemplatesCollection = app.findCollectionByNameOrId(ID_KIT_TEMPLATES)
    const kitSlotsCollection = app.findCollectionByNameOrId(ID_KIT_SLOTS)

    // ===== STEP 1: Clear existing kit slots and templates =====
    console.log("🗑️ Clearing existing kit slots...")
    const existingSlots = app.findRecordsByFilter(kitSlotsCollection, "1=1", "", 500, 0)
    for (const slot of existingSlots) {
        app.delete(slot)
    }
    console.log(`   Deleted ${existingSlots.length} kit slots`)

    console.log("🗑️ Clearing existing kit templates...")
    const existingTemplates = app.findRecordsByFilter(kitTemplatesCollection, "1=1", "", 100, 0)
    for (const template of existingTemplates) {
        app.delete(template)
    }
    console.log(`   Deleted ${existingTemplates.length} kit templates`)

    // ===== STEP 2: Build category map =====
    const categoryRecords = app.findRecordsByFilter(categoriesCollection, "1=1", "", 100, 0)
    const categoryMap = {}  // name -> id
    const categoryIdMap = {} // id -> name
    for (const rec of categoryRecords) {
        categoryMap[rec.get("name")] = rec.id
        categoryIdMap[rec.id] = rec.get("name")
    }
    console.log("📂 Categories:", Object.keys(categoryMap))

    // ===== STEP 3: Get all cameras =====
    const cameraCategoryId = categoryMap["Cameras"]
    if (!cameraCategoryId) {
        console.log("❌ Cameras category not found!")
        return
    }

    const cameras = app.findRecordsByFilter(equipmentCollection, `category = "${cameraCategoryId}"`, "", 100, 0)
    console.log(`📷 Found ${cameras.length} cameras`)

    // ===== STEP 4: Define accessory categories (all except Cameras) =====
    const accessoryCategories = [
        { name: "Lenses", slot_name: "Lens Set", order: 1 },
        { name: "Lens Control", slot_name: "Lens Control", order: 2 },
        { name: "Support", slot_name: "Tripod & Head", order: 3 },
        { name: "Matte Boxes", slot_name: "Matte Box", order: 4 },
        { name: "Filters", slot_name: "Filter Set", order: 5 },
        { name: "Monitors", slot_name: "Monitor", order: 6 },
        { name: "Wireless Video", slot_name: "Wireless Video", order: 7 },
        { name: "Stabilization", slot_name: "Stabilization", order: 8 },
        { name: "Lighting", slot_name: "Lighting", order: 9 },
        { name: "Grip & Support", slot_name: "Grip Equipment", order: 10 },
        { name: "Power", slot_name: "Power & Distribution", order: 11 }
    ]

    // ===== STEP 5: Get equipment by category for recommendations =====
    const equipmentByCategory = {}
    const allEquipment = app.findRecordsByFilter(equipmentCollection, "1=1", "", 500, 0)

    for (const equip of allEquipment) {
        const catId = equip.get("category")
        const catName = categoryIdMap[catId]
        if (catName && catName !== "Cameras") {
            if (!equipmentByCategory[catName]) {
                equipmentByCategory[catName] = []
            }
            equipmentByCategory[catName].push(equip.id)
        }
    }

    console.log("📦 Equipment by category:")
    for (const [cat, items] of Object.entries(equipmentByCategory)) {
        console.log(`   ${cat}: ${items.length} items`)
    }

    // ===== STEP 6: Create kit template for each camera =====
    let templatesCreated = 0
    let slotsCreated = 0

    for (const camera of cameras) {
        const cameraName = camera.get("name")
        const cameraId = camera.id
        const cameraBrand = camera.get("brand") || ""

        // Create kit template
        const kitName = `${cameraName} Production Package`
        const kitDesc = `Complete production package built around the ${cameraName}. Customize with your choice of lenses, support, monitoring, and accessories.`
        const kitDescFr = `Package de production complet construit autour du ${cameraName}. Personnalisez avec votre choix d'objectifs, support, monitoring et accessoires.`

        const templateRecord = new Record(kitTemplatesCollection)
        templateRecord.set("name", kitName)
        templateRecord.set("description", kitDesc)
        templateRecord.set("main_product_id", cameraId)
        templateRecord.set("base_price_modifier", 0)
        app.save(templateRecord)
        templatesCreated++

        console.log(`✅ Created kit: ${kitName}`)

        // Create slots for each accessory category
        for (const accCat of accessoryCategories) {
            const catId = categoryMap[accCat.name]
            if (!catId) continue

            const equipmentIds = equipmentByCategory[accCat.name] || []
            if (equipmentIds.length === 0) continue

            // Get top 5 as recommended (or all if less than 5)
            const recommendedIds = equipmentIds.slice(0, 5)

            const slotRecord = new Record(kitSlotsCollection)
            slotRecord.set("template_id", templateRecord.id)
            slotRecord.set("category_id", catId)
            slotRecord.set("slot_name", accCat.slot_name)
            slotRecord.set("recommended_ids", JSON.stringify(recommendedIds))
            slotRecord.set("display_order", accCat.order)
            app.save(slotRecord)
            slotsCreated++
        }
    }

    console.log(`\n🎉 Migration complete!`)
    console.log(`   Created ${templatesCreated} kit templates (one per camera)`)
    console.log(`   Created ${slotsCreated} kit slots (accessory categories per kit)`)

}, (app) => {
    console.log("⬇️ Rolling back camera kit restructure...")
    // Would need to restore previous structure from backup
})
