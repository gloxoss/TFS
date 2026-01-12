/// <reference path="../pb_data/types.d.ts" />

/**
 * Custom Command: audit
 * Usage: ./pocketbase audit
 */
$app.rootCmd.addCommand(new Command({
    use: "audit",
    run: (cmd, args) => {
        console.log("🔍 STARTING DATABASE AUDIT...");
        const app = $app;

        let cameraCatId;
        try {
            const cat = app.findFirstRecordByFilter("categories", 'slug="cameras"');
            cameraCatId = cat.id;
        } catch (e) {
            console.log("❌ CRITICAL: 'cameras' category not found!");
            return;
        }

        // DUPLICATES
        console.log("\n📦 CHECKING FOR DUPLICATE EQUIPMENT...");
        const allEquip = app.findAllRecords("equipment");
        const nameMap = {};
        let dupeCount = 0;

        allEquip.forEach(item => {
            const name = item.getString("name");
            const id = item.id;
            if (nameMap[name]) {
                console.log(`⚠️  DUPLICATE NAME: "${name}"`);
                console.log(`   - Existing ID: ${nameMap[name]}`);
                console.log(`   - Current ID:  ${id}`);
                dupeCount++;
            } else {
                nameMap[name] = id;
            }
        });

        if (dupeCount === 0) console.log("✅ No duplicate names found.");

        // KITS
        console.log("\n🎥 CHECKING CAMERA KIT INTEGRITY...");
        const cameras = app.findRecordsByFilter("equipment", `category = "${cameraCatId}"`);
        const allCategories = app.findAllRecords("categories");
        const categorySlugs = allCategories.map(c => c.getString("slug")).filter(s => s !== "cameras");

        let missingKits = 0;
        let missingSlots = 0;

        cameras.forEach(cam => {
            const camName = cam.getString("name");
            try {
                const tpl = app.findFirstRecordByFilter("kit_templates", `main_product_id="${cam.id}"`);
                const slots = app.findRecordsByFilter("kit_slots", `template_id="${tpl.id}"`);
                if (slots.length === 0) {
                    console.log(`⚠️  EMPTY KIT: ${camName}`);
                    missingSlots++;
                }
            } catch (e) {
                console.log(`❌ MISSING TEMPLATE: ${camName}`);
                missingKits++;
            }
        });

        if (missingKits === 0 && missingSlots === 0) {
            const totalSlots = app.findAllRecords("kit_slots").length;
            const expected = cameras.length * categorySlugs.length;
            console.log(`✅ All ${cameras.length} cameras have templates.`);
            console.log(`📊 Total Slots: ${totalSlots} / Target: ~${expected}`);

            if (totalSlots < expected - 5) { // Allow small margin
                console.log(`⚠️  DISCREPANCY: You have gaps. Run './pocketbase sync-kits'`);
            } else {
                console.log(`✅ Kits appear fully populated.`);
            }
        }
        console.log("AUDIT COMPLETE.");
    }
}));


/**
 * Custom Command: export-catalog
 * Usage: ./pocketbase export-catalog > catalog.json
 */
$app.rootCmd.addCommand(new Command({
    use: "export-catalog",
    run: (cmd, args) => {
        // We write to stdout so user can pipe it: ./pocketbase export-catalog > file.json
        // We ALSO try to write to a file for convenience.

        const app = $app;
        const catalog = {};

        // 1. Data Gathering
        const categories = app.findAllRecords("categories");
        const catMap = {};

        categories.forEach(cat => {
            const name = cat.getString("name");
            catalog[name] = { slug: cat.getString("slug"), id: cat.id, items: [] };
            catMap[cat.id] = name;
        });

        const equipment = app.findAllRecords("equipment");

        equipment.forEach(item => {
            const catName = catMap[item.getString("category")] || "Uncategorized";
            if (!catalog[catName]) catalog[catName] = { items: [] };

            catalog[catName].items.push({
                id: item.id,
                name: item.getString("name"),
                slug: item.getString("slug"),
                brand: item.getString("brand"),
                rate: item.getInt("daily_rate"),
                stock: item.getInt("stock"),
                specs: (function (s) { try { return JSON.parse(s) } catch (e) { return {} } })(item.getString("specs")),
                type: item.getString("type"),
                image: item.getString("image"),
                description: item.getString("description_en")
            });
        });

        const jsonStr = JSON.stringify(catalog, null, 2);

        // Try to write to file
        try {
            $os.writeFile("pb_data/catalog_export.json", jsonStr, 0o644);
            // We only log success message to stderr to not pollute stdout JSON
            console.error("✅ Saved to pb_data/catalog_export.json");
        } catch (e) {
            console.error("⚠️  Could not write file (permission error?), printing to stdout only.");
        }

        // PRINT TO STDOUT (Standard Output)
        console.log(jsonStr);
    }
}));
