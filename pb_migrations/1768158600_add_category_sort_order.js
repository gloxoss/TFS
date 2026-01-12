/// <reference path="../pb_data/types.d.ts" />
/**
 * Migration: Add sort_order to categories and prioritize cameras first
 * 
 * Adds a sort_order field to categories collection and sets cameras as #1
 */
migrate((app) => {
    const collection = app.findCollectionByNameOrId("categories");

    // Check if sort_order field already exists
    const existingField = collection.fields.find(f => f.name === "sort_order");
    if (!existingField) {
        // Add sort_order field
        collection.fields.push(new Field({
            name: "sort_order",
            type: "number",
            required: false,
            min: 0,
            max: 999
        }));

        app.save(collection);
        console.log("[Migration] Added sort_order field to categories collection");
    }

    // Set sort_order for categories - cameras first (1), then alphabetically
    const categoryOrder = {
        'cameras': 1,
        'lenses': 2,
        'lighting': 3,
        'grip-dollies': 4,
        'grip': 4,  // Alias
        'lens-control': 5,
        'filters': 6,
        'matte-boxes': 7,
        'monitors': 8,
        'power': 9,
        'power-cables': 10,
        'audio': 11,
        'accessories': 12,
        'recording-media': 13
    };

    // Update each category with its sort order
    Object.entries(categoryOrder).forEach(([slug, order]) => {
        try {
            const record = app.findFirstRecordByFilter("categories", `slug="${slug}"`);
            if (record) {
                record.set("sort_order", order);
                app.save(record);
                console.log(`[Migration] Set sort_order ${order} for category: ${slug}`);
            }
        } catch (e) {
            console.log(`[Migration] Category "${slug}" not found, skipping`);
        }
    });

    // Set default sort_order for any remaining categories without one
    try {
        const allCategories = app.findRecordsByFilter("categories", "sort_order = 0 || sort_order = null", "", 0, 100);
        allCategories.forEach((cat, index) => {
            cat.set("sort_order", 100 + index);
            app.save(cat);
            console.log(`[Migration] Set default sort_order ${100 + index} for category: ${cat.get("slug")}`);
        });
    } catch (e) {
        console.log("[Migration] No categories with missing sort_order found");
    }

}, (app) => {
    // Down migration - keep the field but reset values
    console.log("[Migration] Rollback: sort_order values will remain");
});
