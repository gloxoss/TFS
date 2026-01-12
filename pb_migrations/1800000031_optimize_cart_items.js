/// <reference path="../pb_data/types.d.ts" />

/**
 * Cleanup & Optimize Cart Items
 * Consolidates duplicate cart items (same product + dates + config) into single rows with summed quantity.
 * Fixes the "58 rows per user" bloat.
 */

migrate((app) => {
    const carts = app.findAllRecords("carts");

    let totalDeleted = 0;
    let totalUpdated = 0;

    carts.forEach(cart => {
        // Fetch items for this cart
        const items = app.findAllRecords("cart_items",
            $dbx.hashExp({ cart: cart.id })
        );

        if (items.length < 2) return;

        // Group by unique signature
        // Signature = product_id + dates_json + kit_selections_json
        const groups = {};

        items.forEach(item => {
            const pid = item.getString("product");
            // Normalize JSON strings for comparison
            const dates = JSON.stringify(item.get("dates"));
            const kits = JSON.stringify(item.get("kit_selections"));

            const key = `${pid}|${dates}|${kits}`;

            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
        });

        // Process duplicates
        for (const key in groups) {
            const groupItems = groups[key];
            if (groupItems.length > 1) {
                // Keep the first one (usually oldest created), sum the rest
                const keeper = groupItems[0];
                let newQty = keeper.getInt("quantity");

                // Iterate others
                for (let i = 1; i < groupItems.length; i++) {
                    const dupe = groupItems[i];
                    newQty += dupe.getInt("quantity");

                    // Delete duplicate
                    app.delete(dupe);
                    totalDeleted++;
                }

                // Update keeper if qty changed
                if (newQty !== keeper.getInt("quantity")) {
                    keeper.set("quantity", newQty);
                    app.save(keeper);
                    totalUpdated++;
                }
            }
        }
    });

    console.log(`✅ Cart Optimization Complete`);
    console.log(`   - Merged & Deleted: ${totalDeleted} rows`);
    console.log(`   - Consolidated: ${totalUpdated} rows`);

}, (app) => {
    // Cannot revert deletion of duplicates easily without backup
    console.log("Revert of optimization not possible (deleted duplicates)");
});
