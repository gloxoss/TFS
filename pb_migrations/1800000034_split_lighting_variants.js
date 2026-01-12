/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Split Lighting "Series" Products into Individual Variant-Linked Records
 * 
 * This migration:
 * 1. Creates individual records for each wattage variant
 * 2. Links them using the `variants` relation field
 * 3. Archives the old "series" parent products
 */

function slugify(text) {
    return text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
}

migrate((app) => {
    console.log("🔧 Starting Lighting Variants Split Migration...")

    const equipmentCollection = app.findCollectionByNameOrId("equipment")
    if (!equipmentCollection) {
        console.log("⚠️ Equipment collection not found, aborting")
        return
    }

    // Get Lighting category ID
    let lightingCategoryId = null
    try {
        const lightingCat = app.findFirstRecordByFilter("categories", `name = "Lighting"`)
        if (lightingCat) lightingCategoryId = lightingCat.id
    } catch (e) {
        console.log("⚠️ Lighting category not found, aborting")
        return
    }

    // Products to split and their individual variants
    const productsToSplit = [
        {
            oldSlug: "nanlite-forza-series-300500",
            brand: "Nanlite",
            baseDescription: "High-output, compact point-source fixtures. COB technology.",
            variants: [
                { name: "Nanlite Forza 60B", wattage: "60W", stock: 2, specs: { type: "COB Monolight", mount: "Bowens", wattage: "60W", color_temp: "Bi-Color" } },
                { name: "Nanlite Forza 300B", wattage: "300W", stock: 2, specs: { type: "COB Monolight", mount: "Bowens", wattage: "300W", color_temp: "Bi-Color" } },
                { name: "Nanlite Forza 500B", wattage: "500W", stock: 1, specs: { type: "COB Monolight", mount: "Bowens", wattage: "500W", color_temp: "Bi-Color" } }
            ]
        },
        {
            oldSlug: "aputure-light-storm-pro-series",
            brand: "Aputure",
            baseDescription: "Industry standard point-source LED fixtures. Bowens mount. Sidus Link control.",
            variants: [
                { name: "Aputure LS 600c Pro", wattage: "600W", stock: 2, specs: { type: "RGB COB Monolight", mount: "Bowens", wattage: "600W", color_temp: "RGBWW" } },
                { name: "Aputure LS 600d Pro", wattage: "600W", stock: 2, specs: { type: "COB Monolight", mount: "Bowens", wattage: "600W", color_temp: "Daylight 5600K" } },
                { name: "Aputure LS 600x Pro", wattage: "600W", stock: 1, specs: { type: "COB Monolight", mount: "Bowens", wattage: "600W", color_temp: "Bi-Color" } },
                { name: "Aputure LS 1200d Pro", wattage: "1200W", stock: 1, specs: { type: "COB Monolight", mount: "Bowens", wattage: "1200W", color_temp: "Daylight 5600K" } }
            ]
        },
        {
            oldSlug: "arri-m-series-daylight-hmi",
            brand: "ARRI",
            baseDescription: "Academy Award-winning daylight products featuring patented MAX Technology reflector (lens-less).",
            variants: [
                { name: "ARRI M18 HMI", wattage: "1800W", stock: 2, specs: { type: "HMI Daylight", technology: "MAX Reflector", wattage: "1800W" } },
                { name: "ARRI M40 HMI", wattage: "4000W", stock: 1, specs: { type: "HMI Daylight", technology: "MAX Reflector", wattage: "4000W" } },
                { name: "ARRI M90 HMI", wattage: "9000W", stock: 1, specs: { type: "HMI Daylight", technology: "MAX Reflector", wattage: "9000W" } }
            ]
        },
        {
            oldSlug: "dmg-lumiere-mix-series",
            brand: "Rosco / DMG",
            baseDescription: "High-performance RGBWW color mixing. Lightweight and modular.",
            variants: [
                { name: "DMG MINI MIX", wattage: "40W", stock: 2, specs: { type: "RGBWW Panel", color_engine: "6-Chip LED", size: "Mini" } },
                { name: "DMG SL1 MIX", wattage: "100W", stock: 2, specs: { type: "RGBWW Panel", color_engine: "6-Chip LED", size: "SL1" } },
                { name: "DMG MAXI MIX", wattage: "300W", stock: 1, specs: { type: "RGBWW Panel", color_engine: "6-Chip LED", size: "Maxi" } }
            ]
        }
    ]

    let createdCount = 0
    let linkedCount = 0

    for (const product of productsToSplit) {
        console.log(`\n📦 Processing: ${product.oldSlug}`)

        // Check if old product exists
        let oldRecord = null
        try {
            oldRecord = app.findFirstRecordByFilter("equipment", `slug = "${product.oldSlug}"`)
        } catch (e) {
            console.log(`  ⏭️ Old product not found, creating variants anyway...`)
        }

        // Create individual variant records
        const createdIds = []

        for (const variant of product.variants) {
            const variantSlug = slugify(variant.name)

            // Check if already exists
            try {
                const existing = app.findFirstRecordByFilter("equipment", `slug = "${variantSlug}"`)
                if (existing) {
                    console.log(`  ⏭️ Variant already exists: ${variant.name}`)
                    createdIds.push(existing.id)
                    continue
                }
            } catch (e) { /* doesn't exist, create it */ }

            // Create new record
            const record = new Record(equipmentCollection)
            record.set("name", variant.name)
            record.set("name_en", variant.name)
            record.set("name_fr", variant.name)
            record.set("slug", variantSlug)
            record.set("brand", product.brand)
            record.set("category", lightingCategoryId)
            record.set("description", `${product.baseDescription} ${variant.wattage} model.`)
            record.set("description_en", `${product.baseDescription} ${variant.wattage} model.`)
            record.set("description_fr", `${product.baseDescription} Modèle ${variant.wattage}.`)
            record.set("specs", JSON.stringify(variant.specs))
            record.set("specs_en", JSON.stringify(variant.specs))
            record.set("specs_fr", JSON.stringify(variant.specs))
            record.set("stock_available", variant.stock || 1)
            record.set("is_featured", false)
            record.set("visibility", "published")
            if (variant.specs.type) record.set("type", variant.specs.type)

            // Copy images from old record if available
            if (oldRecord) {
                const oldImages = oldRecord.get("images")
                if (oldImages && oldImages.length > 0) {
                    record.set("images", oldImages)
                }
            }

            app.save(record)
            createdIds.push(record.id)
            createdCount++
            console.log(`  ✅ Created: ${variant.name} (Stock: ${variant.stock})`)
        }

        // Link all variants to each other
        if (createdIds.length > 1) {
            for (const id of createdIds) {
                try {
                    const record = app.findRecordById(equipmentCollection, id)
                    // Link to all OTHER variants (not self)
                    const siblings = createdIds.filter(otherId => otherId !== id)
                    record.set("variants", siblings)
                    app.save(record)
                    linkedCount++
                } catch (e) {
                    console.log(`  ⚠️ Could not link: ${id}`)
                }
            }
            console.log(`  🔗 Linked ${createdIds.length} variants together`)
        }

        // Archive old "series" product
        if (oldRecord) {
            try {
                oldRecord.set("visibility", "archived")
                oldRecord.set("name", `[ARCHIVED] ${oldRecord.get("name")}`)
                app.save(oldRecord)
                console.log(`  🗄️ Archived old product: ${product.oldSlug}`)
            } catch (e) {
                console.log(`  ⚠️ Could not archive: ${product.oldSlug}`)
            }
        }
    }

    console.log(`\n🎉 Migration complete!`)
    console.log(`   Created: ${createdCount} new variant products`)
    console.log(`   Linked: ${linkedCount} variant relationships`)

}, (app) => {
    console.log("⬇️ Rolling back lighting variants migration...")
    console.log("   Manual rollback required: Delete new variants and unarchive old products")
})
