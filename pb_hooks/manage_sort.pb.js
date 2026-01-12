/// <reference path="../pb_data/types.d.ts" />

/**
 * Command: set-custom-order
 * Usage: ./pocketbase set-custom-order
 * 
 * HOW TO USE:
 * 1. Edit the 'customOrder' object below.
 *    Key = Product Slug
 *    Value = Sort Order (1 being first/top)
 * 2. Run the command.
 * 
 * Note: Any item NOT in this list will default to 999 (bottom).
 */
$app.rootCmd.addCommand(new Command({
    use: "set-custom-order",
    run: (cmd, args) => {
        const app = $app;

        console.log("🔢 UPDATING CUSTOM SORT ORDERS...");

        // --- EDIT YOUR ORDER HERE ---
        const customOrder = {
            // Cameras
            'arri-alexa-35-xtreme': 1,
            'arri-alexa-35': 2,
            'arri-alexa-mini-lf': 3,
            'arri-alexa-mini': 4,
            'arri-amira': 5,
            'panasonic-varicam-lt': 6,
            'dsmc2-monstro-8k': 7,
            'sony-venice-2-8k': 8,
            'sony-f55': 9,
            'sony-pxw-fx9': 10,
            'sony-fx6': 11,
            'sony-fx3': 12,

            // Add more items here...
            // 'my-new-lens': 13,
        };
        // ----------------------------

        const collection = app.findCollectionByNameOrId("equipment");

        // 1. Reset everyone to 999 first? 
        // Optional: If you want to ensure only the list below is at top.
        // Uncomment next line to reset all before applying:
        // app.db().newQuery("UPDATE equipment SET item_sort_order = 999").execute();

        app.runInTransaction((txApp) => {
            Object.entries(customOrder).forEach(([slug, order]) => {
                try {
                    const record = txApp.findFirstRecordByFilter("equipment", `slug='${slug}'`);
                    if (record) {
                        const oldOrder = record.getInt("item_sort_order");
                        if (oldOrder !== order) {
                            record.set("item_sort_order", order);
                            txApp.save(record);
                            console.log(`   ✅ Set [${slug}] to order ${order}`);
                        }
                    }
                } catch (e) {
                    console.log(`   ⚠️  Product [${slug}] not found.`);
                }
            });
        });

        console.log("🏁 ORDER UPDATE COMPLETE.");
    }
}));
