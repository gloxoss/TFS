/// <reference path="../pb_data/types.d.ts" />

/**
 * Custom Command: import-catalog
 * Usage: ./pocketbase import-catalog
 * Action: Upserts (Create or Update) items from pb_data/catalog_import.json
 * Features: Matches by Slug OR Name. Updates Images if file exists in pb_data/.
 */
$app.rootCmd.addCommand(new Command({
    use: "import-catalog",
    run: (cmd, args) => {
        console.log("📥 STARTING CATALOG IMPORT...");
        const app = $app;
        const importPath = "pb_data/catalog_import.json";

        // 1. Read File
        let jsonData;
        try {
            const bytes = $os.readFile(importPath);
            const str = String.fromCharCode.apply(null, bytes);
            jsonData = JSON.parse(str);
            console.log(`✅ Loaded ${importPath}`);
        } catch (e) {
            console.log(`❌ Error reading ${importPath}: ${e}`);
            return;
        }

        const equipCollection = app.findCollectionByNameOrId("equipment");

        let updatedCount = 0;
        let createdCount = 0;
        let errorCount = 0;

        // 2. Iterate Categories
        for (const catName in jsonData) {
            const catData = jsonData[catName];
            const catSlug = catData.slug || "uncategorized";

            // Resolve Category ID
            let catId;
            try {
                const catRecord = app.findFirstRecordByFilter("categories", `slug="${catSlug}"`);
                catId = catRecord.id;
            } catch (e) {
                console.log(`⚠️  Category '${catName}' not found. Skipping items.`);
                continue;
            }

            // 3. Iterate Items
            if (catData.items && Array.isArray(catData.items)) {
                catData.items.forEach(item => {
                    try {
                        const slug = item.slug;
                        const name = item.name;

                        if (!slug && !name) throw new Error("Item missing slug and name");

                        // FIND EXISTING (Slug -> Name)
                        let record;
                        try {
                            if (slug) record = app.findFirstRecordByFilter("equipment", `slug="${slug}"`);
                        } catch (e) { }

                        if (!record && name) {
                            try {
                                record = app.findFirstRecordByFilter("equipment", `name="${name}"`);
                            } catch (e) { }
                        }

                        let isNew = false;
                        if (!record) {
                            record = new Record(equipCollection);
                            isNew = true;
                        }

                        // SET FIELDS
                        if (slug) record.set("slug", slug);
                        record.set("category", catId);

                        // Names
                        if (name) {
                            record.set("name", name);
                            record.set("name_en", name);
                        }

                        // Text fields
                        if (item.brand) record.set("brand", item.brand);
                        if (item.description) record.set("description_en", item.description);
                        if (item.type) record.set("type", item.type);

                        // Numbers
                        if (item.rate !== undefined) record.set("daily_rate", item.rate);
                        if (item.stock !== undefined) {
                            record.set("stock", item.stock);
                            record.set("stock_available", item.stock);
                        }

                        // Specs (JSON)
                        if (item.specs) {
                            record.set("specs", item.specs);
                            record.set("specs_en", item.specs);
                        }

                        // IMAGE UPDATE
                        // Expects item.image to be a filename in 'pb_data/' directory (e.g. "my_new_light.jpg")
                        if (item.image) {
                            const imagePath = `pb_data/${item.image}`;
                            try {
                                const f = $filesystem.fileFromPath(imagePath);
                                record.set("image", f);
                                // Auto-gallery
                                // const cur = record.get("images");
                                // if (!cur || cur.length === 0) record.set("images", [f]);
                            } catch (e) {
                                // Only warn if user explicitly provided an image string but file not found
                                // console.log(`   ⚠️ Image file not found: ${imagePath}`);
                            }
                        }

                        app.save(record);

                        if (isNew) {
                            console.log(`   ✨ Created: ${name || slug}`);
                            createdCount++;
                        } else {
                            console.log(`   📝 Updated: ${name || slug}`);
                            updatedCount++;
                        }

                    } catch (e) {
                        console.log(`❌ Error processing ${item.name}: ${e}`);
                        errorCount++;
                    }
                });
            }
        }

        console.log("\n=================================");
        console.log(`📝 Updated: ${updatedCount}`);
        console.log(`✨ Created: ${createdCount}`);
        console.log(`❌ Errors:  ${errorCount}`);
    }
}));
