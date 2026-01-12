/// <reference path="../pb_data/types.d.ts" />

/**
 * Custom Command: cleanup-empty-categories
 * Usage: ./pocketbase cleanup-empty-categories
 */
$app.rootCmd.addCommand(new Command({
    use: "cleanup-empty-categories",
    run: (cmd, args) => {
        const app = $app;

        console.log("🧹 SCANNING FOR EMPTY CATEGORIES...");

        const categories = app.findRecordsByFilter("categories", "id!=''");
        console.log(`Found ${categories.length} categories total.`);

        let deleted = 0;
        let kept = 0;
        let constrained = 0;

        categories.forEach(cat => {
            let hasEquipment = false;
            try {
                app.findFirstRecordByFilter("equipment", `category="${cat.id}"`);
                hasEquipment = true;
            } catch (e) {
                hasEquipment = false;
            }

            if (!hasEquipment) {
                const name = cat.getString("name");
                try {
                    app.delete(cat);
                    console.log(`   🗑️  Deleted EMPTY category: ${name}`);
                    deleted++;
                } catch (delErr) {
                    // Likely Foreign Key constraint (Relation in kit_slots, etc.)
                    const msg = delErr.message;
                    if (msg.includes("FOREIGN KEY")) {
                        console.log(`   🛡️  Skipping ${name}: Used by other system records (e.g. Kit Slots).`);
                        constrained++;
                    } else {
                        console.log(`   ❌ Error deleting ${name}: ${msg}`);
                    }
                    kept++;
                }
            } else {
                kept++;
            }
        });

        console.log(`\n✨ CLEANUP COMPLETE.`);
        console.log(`   Deleted: ${deleted}`);
        console.log(`   Kept (Total): ${kept}`);
        console.log(`   (of which ${constrained} were empty but constrained)`);
    }
}));
