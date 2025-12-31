/// <reference path="../pb_data/types.d.ts" />

/**
 * Fix: Hide archived products and copy images to variants
 */
migrate((app) => {
    console.log("=== Fixing Archived Products ===");

    // 1. Hide all [ARCHIVED] products
    const archivedRecords = app.findRecordsByFilter("pbc_equipment00001", "name ~ '[ARCHIVED]'");
    for (const record of archivedRecords) {
        record.set("visibility", false);
        app.save(record);
        console.log("Hidden: " + record.get("name"));
    }
    console.log("Hidden " + archivedRecords.length + " archived products");

    // 2. Copy images from archived series to variants
    const imageMappings = [
        {
            sourceSlug: "nanlite-forza-series-300500",
            variants: ["nanlite-forza-60b", "nanlite-forza-300b", "nanlite-forza-500b"]
        },
        {
            sourceSlug: "aputure-light-storm-pro-series",
            variants: ["aputure-ls-600c-pro", "aputure-ls-600d-pro", "aputure-ls-600x-pro", "aputure-ls-1200d-pro"]
        }
    ];

    for (const mapping of imageMappings) {
        try {
            const source = app.findFirstRecordByFilter("pbc_equipment00001", `slug = "${mapping.sourceSlug}"`);
            if (!source) {
                console.log("Source not found: " + mapping.sourceSlug);
                continue;
            }

            const sourceImages = source.get("images");
            if (!sourceImages || sourceImages.length === 0) {
                console.log("No images in source: " + mapping.sourceSlug);
                continue;
            }

            console.log("Found " + sourceImages.length + " images in " + mapping.sourceSlug);

            for (const variantSlug of mapping.variants) {
                try {
                    const variant = app.findFirstRecordByFilter("pbc_equipment00001", `slug = "${variantSlug}"`);
                    if (variant) {
                        const existingImages = variant.get("images");
                        if (!existingImages || existingImages.length === 0) {
                            variant.set("images", sourceImages);
                            app.save(variant);
                            console.log("Copied images to: " + variantSlug);
                        }
                    }
                } catch (e) {
                    console.log("Variant not found: " + variantSlug);
                }
            }
        } catch (e) {
            console.log("Error with source: " + mapping.sourceSlug);
        }
    }

    console.log("=== Done ===");
}, (app) => { });
