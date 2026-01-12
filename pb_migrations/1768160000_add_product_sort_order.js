/// <reference path="../pb_data/types.d.ts" />
/**
 * Migration: Add category_sort_order to equipment
 * 
 * Adds a category_sort_order field to equipment collection and backfills it
 * from the related category's sort_order.
 */
migrate((app) => {
    const collection = app.findCollectionByNameOrId("equipment");

    // Check if field exists
    const existingField = collection.fields.find(f => f.name === "category_sort_order");
    if (!existingField) {
        // Add category_sort_order field
        collection.fields.push(new Field({
            name: "category_sort_order",
            type: "number",
            required: false,
            min: 0
        }));

        app.save(collection);
        console.log("[Migration] Added category_sort_order field to equipment collection");
    }

    // Backfill data
    try {
        const products = app.findRecordsByFilter("equipment", "category != ''", "", 0, 0); // 0 limit means all

        products.forEach(product => {
            try {
                const categoryId = product.get("category");
                if (categoryId) {
                    const category = app.findRecordById("categories", categoryId);
                    if (category) {
                        const sortOrder = category.getInt("sort_order");
                        // Only update if different to save DB writes
                        if (product.getInt("category_sort_order") !== sortOrder) {
                            product.set("category_sort_order", sortOrder);
                            app.save(product);
                            console.log(`[Migration] Updated product ${product.get("name")} with sort_order ${sortOrder}`);
                        }
                    }
                }
            } catch (e) {
                console.log(`[Migration] Failed to update product ${product.id}: ${e.message}`);
            }
        });
    } catch (e) {
        console.log(`[Migration] Error fetching products: ${e.message}`);
    }

}, (app) => {
    // Down migration - keep the field but reset values? Or just do nothing.
    console.log("[Migration] Rollback: category_sort_order values will remain");
});
