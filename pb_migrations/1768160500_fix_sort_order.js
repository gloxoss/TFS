/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    // 1. Fix Categories with 0 or null sort_order
    try {
        // Fetch categories that might have been missed or defaulted to 0
        // 'stabilizers' likely has 0. 'cameras' has 1.
        // We want strict check: sort_order < 1 (excluding cameras if it was 0, but we know it's 1)
        // Actually, just finding by specific slugs is safest for the known issue.

        // Stabilizers should be group 4 (Support/Grip) or 12 (Accessories)
        const stabilizers = app.findFirstRecordByFilter("categories", "slug='stabilizers' || slug='stabilization'");
        if (stabilizers) {
            stabilizers.set("sort_order", 4); // Same as Grip/Dollies
            app.save(stabilizers);
            console.log("[Fix] Updated stabilizers sort_order to 4");
        }

        // Generic sweep for any other 0s (that are NOT cameras)
        const zeroCats = app.findRecordsByFilter("categories", "sort_order <= 0 && slug != 'cameras'", "", 100, 0);
        zeroCats.forEach((cat, idx) => {
            const newOrder = 200 + idx;
            cat.set("sort_order", newOrder);
            app.save(cat);
            console.log(`[Fix] Updated ${cat.get("slug")} from 0 to ${newOrder}`);
        });

    } catch (e) {
        console.log("[Fix] Error fixing categories: " + e.message);
    }

    // 2. Re-trigger product backfill to ensure products get the new sort_order
    // We can just run the same logic as the previous migration
    try {
        const products = app.findRecordsByFilter("equipment", "category != ''", "", 0, 0); // All products

        products.forEach(product => {
            try {
                const categoryId = product.get("category");
                if (categoryId) {
                    const category = app.findRecordById("categories", categoryId);
                    if (category) {
                        const sortOrder = category.getInt("sort_order");
                        if (product.getInt("category_sort_order") !== sortOrder) {
                            product.set("category_sort_order", sortOrder);
                            app.save(product);
                            console.log(`[Fix] Synced product ${product.get("name")} to sort_order ${sortOrder}`);
                        }
                    }
                }
            } catch (e) {
                // Ignore errors
            }
        });
    } catch (e) {
        console.log("[Fix] Error syncing products: " + e.message);
    }

}, (app) => {
    // Down migration
});
