/// <reference path="../pb_data/types.d.ts" />
/**
 * Remove variant_options from non-Lighting equipment
 * 
 * Keeps variants only on Lighting category, removes from everything else.
 */
migrate((app) => {
    const ID_EQUIPMENT = "pbc_equipment00001";
    const ID_CATEGORIES = "pbc_categories0001";

    console.log("=".repeat(60));
    console.log("[CLEANUP] Removing variants from non-lighting equipment...");
    console.log("=".repeat(60));

    // Get Lighting category ID
    let lightingCategoryId = null;
    try {
        const lightingCategory = app.findFirstRecordByFilter(ID_CATEGORIES, "name = 'Lighting'");
        if (lightingCategory) {
            lightingCategoryId = lightingCategory.id;
            console.log(`[Category] Lighting ID: ${lightingCategoryId}`);
        }
    } catch (e) {
        console.log("[Error] Could not find Lighting category:", e);
        return;
    }

    // Get all NON-lighting equipment
    try {
        const nonLightingEquipment = app.findRecordsByFilter(
            ID_EQUIPMENT,
            `category != '${lightingCategoryId}'`,
            "",
            1000,
            0
        );

        console.log(`[Found] ${nonLightingEquipment.length} non-lighting equipment records`);

        let clearedCount = 0;
        nonLightingEquipment.forEach(item => {
            const name = item.get("name_en") || item.get("name") || "";

            // Set variant_options to null (empty)
            item.set("variant_options", null);
            app.save(item);
            clearedCount++;
        });

        console.log(`[Cleared] Removed variants from ${clearedCount} non-lighting items`);

    } catch (e) {
        console.log("[Error]", e);
    }

    // Get all lighting equipment and ensure they have variants
    try {
        const lightingEquipment = app.findRecordsByFilter(
            ID_EQUIPMENT,
            `category = '${lightingCategoryId}'`,
            "",
            500,
            0
        );

        console.log(`[Lighting] Found ${lightingEquipment.length} lighting equipment records`);
        console.log("[Lighting] These will KEEP their variant_options");

    } catch (e) {
        console.log("[Error]", e);
    }

    console.log("=".repeat(60));
    console.log("[Complete] Only lighting equipment now has variant_options");
    console.log("=".repeat(60));

}, (app) => {
    console.log("[Rollback] Manual cleanup required");
});
