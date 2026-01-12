/// <reference path="../pb_data/types.d.ts" />

$app.rootCmd.addCommand(new Command({
    use: "force-cleanup-categories",
    run: (cmd, args) => {
        const app = $app;
        console.log("🔥 STARTING CASCADE CLEANUP...");

        const categories = app.findRecordsByFilter("categories", "id!=''");

        categories.forEach(cat => {
            const items = app.findRecordsByFilter("equipment", `category="${cat.id}"`);

            if (items.length === 0) {
                const name = cat.getString("name");
                console.log(`Targeting EMPTY category: ${name}`);

                // 1. Find referencing Kit Slots
                try {
                    // Check 'kit_slots' for usage. Field is 'category_id'
                    const referencingSlots = app.findRecordsByFilter("kit_slots", `category_id = "${cat.id}"`);

                    if (referencingSlots.length > 0) {
                        console.log(`   ⚠️  Found ${referencingSlots.length} referencing Kit Slots. Deleting them...`);
                        referencingSlots.forEach(slot => {
                            app.delete(slot);
                            console.log(`      🗑️  Deleted Slot: ${slot.id}`);
                        });
                    }
                } catch (fkErr) {
                    console.log(`   ⚠️  Error checking slots: ${fkErr.message}`);
                }

                // 2. Delete Category
                try {
                    app.delete(cat);
                    console.log(`   ✅ DELETED Category: ${name}`);
                } catch (e) {
                    console.log(`   ❌ STUBBORN ERROR for ${name}: ${e.message}`);
                }
            }
        });
        console.log("Done.");
    }
}));
