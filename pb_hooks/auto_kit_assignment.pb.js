/// <reference path="../pb_data/types.d.ts" />

/**
 * PocketBase Hook: Auto Kit Assignment
 * 
 * Automatically adds new equipment to relevant kit slots based on category Relation.
 * Creates kit templates for featured cameras and generates default slots.
 * 
 * Uses ID-based matching for accuracy.
 */

onRecordAfterCreateSuccess((e) => {
    const record = e.record;
    const equipmentId = record.id;
    const equipmentName = record.get("name") || "Unknown";
    const categoryId = record.get("category");
    const isFeatured = record.get("is_featured");

    console.log(`🔧 [AutoKit] Processing: ${equipmentName} (${equipmentId})`);

    if (!categoryId) {
        console.log("⚠️ [AutoKit] No category, skipping.");
        return;
    }

    // --- 1. Auto-Assign to Kit Slots ---
    // DISABLED: Preventing JSON size limit errors on kit_slots.
    // Logic removed to stop filling recommended_ids automatically.
    /*
    try {
        // Find all slots that belong to this category
        const slots = $app.findRecordsByFilter("kit_slots", `category_id = '${categoryId}'`);

        console.log(`🔍 [AutoKit] Found ${slots.length} slots for category ${categoryId}`);

        let updateCount = 0;
        for (const slot of slots) {
            try {
                // Safely get existing IDs
                const rawIds = slot.get("recommended_ids");
                // Ensure we have a JS array copy
                let ids = Array.isArray(rawIds) ? [...rawIds] : [];

                // Add if not present
                if (!ids.includes(equipmentId)) {
                    ids.push(equipmentId);
                    slot.set("recommended_ids", ids);
                    $app.save(slot);
                    updateCount++;
                }
            } catch (slotErr) {
                console.log(`❌ [AutoKit] Error updating slot ${slot.id}: ${slotErr}`);
            }
        }

        if (updateCount > 0) {
            console.log(`✅ [AutoKit] Added to ${updateCount} slots.`);
        }

    } catch (err) {
        console.log(`❌ [AutoKit] Slot lookup failed: ${err}`);
    }
    */

    // --- 2. Create Template for Featured Cameras ---
    if (isFeatured) {
        try {
            // Check if category is "Cameras"
            const catRecord = $app.findRecordById("categories", categoryId);
            const catSlug = (catRecord.get("slug") || "").toLowerCase();
            const catName = (catRecord.get("name") || "").toLowerCase();

            if (catSlug === "cameras" || catName === "cameras") {
                const templateName = `${equipmentName} Production Package`;

                try {
                    $app.findFirstRecordByFilter("kit_templates", `name = "${templateName}"`);
                    console.log(`⏭️ [AutoKit] Template exists: ${templateName}`);
                } catch (notFound) {
                    // Create Template
                    const templates = $app.findCollectionByNameOrId("kit_templates");
                    const newTemplate = new Record(templates);
                    newTemplate.set("name", templateName);
                    newTemplate.set("main_product_id", equipmentId);
                    newTemplate.set("base_price_modifier", 0);
                    newTemplate.set("description", `Complete production package for the ${equipmentName}.`);

                    $app.save(newTemplate);
                    console.log(`✅ [AutoKit] Created template: ${templateName}`);

                    // --- Create Default Slots (Dynamic) ---
                    // Fetch ALL categories excluding "cameras" (case-insensitive check handled by loop or slug)
                    // Note: findRecordsByFilter returns array.
                    const allCategories = $app.findRecordsByFilter("categories", "slug != 'cameras'");
                    const slotsCol = $app.findCollectionByNameOrId("kit_slots");

                    let displayOrder = 1;

                    // Sort categories alphabetically or by some logic if needed, default likely creation order
                    // We can sort in JS if needed, but iteration order is acceptable.

                    allCategories.forEach((cat) => {
                        const catName = cat.get("name");
                        const catId = cat.id;
                        const catSlug = cat.get("slug");

                        // Double check strictly not cameras (though filter catches it)
                        if (catSlug === 'cameras' || catName === 'Cameras') return;

                        try {
                            const newSlot = new Record(slotsCol);
                            newSlot.set("template_id", newTemplate.id);
                            newSlot.set("category_id", catId);
                            newSlot.set("slot_name", catName);
                            newSlot.set("recommended_ids", []);
                            newSlot.set("display_order", displayOrder++);
                            $app.save(newSlot);
                            console.log(`   ➕ [AutoKit] Created dynamic slot: ${catName}`);
                        } catch (err) {
                            console.log(`   ⚠️ [AutoKit] Failed to create slot ${catName}: ${err}`);
                        }
                    });
                }
            }
        } catch (err) {
            console.log(`❌ [AutoKit] Template check failed: ${err}`);
        }
    }

}, "equipment");

console.log("✅ [AutoKit] Hook registered (Template + Slots support)");
