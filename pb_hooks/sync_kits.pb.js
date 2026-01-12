/// <reference path="../pb_data/types.d.ts" />

/**
 * Custom Command: sync-kits
 * Usage: ./pocketbase sync-kits
 * Ensures every Camera Kit Template has a Slot for EVERY Category (except Cameras).
 */
$app.rootCmd.addCommand(new Command({
    use: "sync-kits",
    run: (cmd, args) => {
        console.log("🔄 STARTING KIT SYNC...");
        const app = $app;

        // 1. Get All Categories
        const categories = app.findAllRecords("categories");
        const cameraCat = categories.find(c => c.getString("slug") === "cameras");
        if (!cameraCat) throw new Error("Cameras category not found");

        const targetCategories = categories.filter(c => c.id !== cameraCat.id);
        console.log(`🎯 Target Categories for Slots: ${targetCategories.length}`);

        // 2. Get All Camera Kit Templates
        const templates = app.findAllRecords("kit_templates");

        let createdSlots = 0;

        templates.forEach(tpl => {
            const tplName = tpl.getString("name");

            // Get existing slots for this template
            const existingSlots = app.findRecordsByFilter("kit_slots", `template_id="${tpl.id}"`);
            const existingCatIds = existingSlots.map(s => s.getString("category_id"));

            // Check which are missing
            targetCategories.forEach(cat => {
                if (!existingCatIds.includes(cat.id)) {
                    // Create missing slot
                    const slot = new Record(app.findCollectionByNameOrId("kit_slots"));
                    slot.set("template_id", tpl.id);
                    slot.set("category_id", cat.id);
                    slot.set("slot_name", cat.getString("name")); // Default to Category Name
                    slot.set("display_order", 99); // Append to end
                    slot.set("required", false);

                    app.save(slot);
                    createdSlots++;
                    // console.log(`   + Added slot '${cat.getString("name")}' to ${tplName}`);
                }
            });
        });

        console.log(`✅ SYNC COMPLETE.`);
        console.log(`✨ Created ${createdSlots} new kit slots.`);
    }
}));
