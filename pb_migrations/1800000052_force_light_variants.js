/// <reference path="../pb_data/types.d.ts" />
/**
 * Force Update All Lighting Equipment with Variant Options
 * 
 * This migration updates ALL existing lighting equipment to have variant options.
 */
migrate((app) => {
    const ID_EQUIPMENT = "pbc_equipment00001";
    const ID_CATEGORIES = "pbc_categories0001";

    console.log("=".repeat(60));
    console.log("[FORCE UPDATE] Starting lighting variants update...");
    console.log("=".repeat(60));

    // Get Lighting category ID first
    let lightingCategoryId = null;
    try {
        const lightingCategory = app.findFirstRecordByFilter(ID_CATEGORIES, "name = 'Lighting'");
        if (lightingCategory) {
            lightingCategoryId = lightingCategory.id;
            console.log(`[Category] Found Lighting category: ${lightingCategoryId}`);
        } else {
            console.log("[Category] Lighting category not found!");
            return;
        }
    } catch (e) {
        console.log("[Category] Error finding Lighting category:", e);
        return;
    }

    // Variant mappings based on product name patterns
    const variantMappings = [
        // HMI / Daylight
        { pattern: /m-series|m\.series|m series/i, variants: { "WATTAGE": ["M18 (1.8KW)", "M40 (4KW)", "M90 (9KW)"] } },
        { pattern: /arrisun/i, variants: { "WATTAGE": ["575W", "1.2KW", "2.5/4KW", "6KW", "12KW"] } },

        // Tungsten Fresnel
        { pattern: /fresnel|junior/i, variants: { "WATTAGE": ["150W", "300W", "650W", "1KW", "2KW", "5KW", "10KW"] } },
        { pattern: /true blue/i, variants: { "TYPE": ["Manual", "Pole-Operated"] } },
        { pattern: /blonde|redhead/i, variants: { "WATTAGE": ["800W", "2000W"] } },
        { pattern: /dino/i, variants: { "CONFIG": ["8×650W", "9×1000W", "12×1000W", "24×1000W"] } },
        { pattern: /par 64|par64/i, variants: { "WATTAGE": ["500W", "1000W"] } },
        { pattern: /source 4|source4/i, variants: { "BEAM": ["19°", "26°", "36°", "50°"] } },
        { pattern: /dedolight|dedo|dlh/i, variants: { "KIT": ["2-Light Kit", "3-Light Kit", "4-Light Kit"] } },

        // LED Panels
        { pattern: /creamsource|vortex/i, variants: { "ACCESSORY": ["Standard", "With Softbox", "With Barndoors"] } },
        { pattern: /skypanel/i, variants: { "MODEL": ["S30-C", "S60-C"] } },
        { pattern: /dmg|lumiere|lumière/i, variants: { "SIZE": ["MINI MIX", "SL1 MIX", "MAXI MIX"] } },
        { pattern: /astera/i, variants: { "MODEL": ["Titan Tube FP-1", "Pixel Tube AX-1", "AX-3", "AX-5", "AX10", "Bulb"] } },

        // LED COB / Point Source
        { pattern: /forza/i, variants: { "WATTAGE": ["60B", "300", "300B", "500", "500B"] } },
        { pattern: /light storm|ls\d|aputure.*\d{3,4}/i, variants: { "MODEL": ["1200d Pro", "600c Pro II", "600c Pro", "600x Pro", "600d Pro", "300c", "300d II", "60x"] } },
        { pattern: /storm.*xt|xt52|xt26/i, variants: { "ACCESSORY": ["Standard", "With Fresnel", "With Softbox"] } },
        { pattern: /electro storm|cs15/i, variants: { "ACCESSORY": ["Standard", "With Fresnel", "With Softbox"] } },
        { pattern: /mc pro/i, variants: { "KIT": ["Single", "4-Light Kit", "8-Light Kit"] } },

        // LED Mats/Panels
        { pattern: /amaran|f21|f22/i, variants: { "SIZE": ["F21c (2×1')", "F22c (2×2')"] } },
        { pattern: /litemat|lite mat/i, variants: { "SIZE": ["LiteMat 2 (21×21\")", "LiteMat 2L (11.5×40\")", "LiteMat 4 (21×40\")"] } },

        // Accessories
        { pattern: /modifier|softbox/i, variants: { "TYPE": ["Parabolic", "Lantern", "Umbrella", "Octagon", "Rectangle"] } },
        { pattern: /butterfly|overhead/i, variants: { "SIZE": ["4×4'", "6×6'", "8×8'", "12×12'", "20×20'"] } },
        { pattern: /reflector|flag|panel|scrim/i, variants: { "SIZE": ["24×36\"", "30×36\"", "40×60\""] } },
        { pattern: /dimmer/i, variants: { "CAPACITY": ["1KW", "2KW", "3KW", "5KW"] } },
    ];

    // Default variants for lights that don't match any pattern
    const defaultLightVariants = { "ACCESSORY": ["Standard", "With Modifier"] };

    // Get all lighting equipment
    console.log("[Update] Finding all lighting equipment...");
    try {
        const allLights = app.findRecordsByFilter(
            ID_EQUIPMENT,
            `category = '${lightingCategoryId}'`,
            "",
            500,
            0
        );

        console.log(`[Update] Found ${allLights.length} lighting items`);

        let updatedCount = 0;
        let skippedCount = 0;

        allLights.forEach(light => {
            const name = light.get("name_en") || light.get("name") || "";
            const currentVariants = light.get("variant_options");

            // Check if already has valid variant_options
            if (currentVariants && typeof currentVariants === 'object' && Object.keys(currentVariants).length > 0) {
                console.log(`[Skip] ${name} - already has variants`);
                skippedCount++;
                return;
            }

            // Find matching variant pattern
            let matchedVariants = null;
            for (const mapping of variantMappings) {
                if (mapping.pattern.test(name)) {
                    matchedVariants = mapping.variants;
                    break;
                }
            }

            // Use default if no match
            if (!matchedVariants) {
                matchedVariants = defaultLightVariants;
                console.log(`[Default] No pattern match for: ${name}`);
            }

            // Update the record
            light.set("variant_options", matchedVariants);
            app.save(light);
            console.log(`[Updated] ${name} → ${JSON.stringify(matchedVariants)}`);
            updatedCount++;
        });

        console.log("=".repeat(60));
        console.log(`[Complete] Updated: ${updatedCount}, Skipped: ${skippedCount}, Total: ${allLights.length}`);
        console.log("=".repeat(60));

    } catch (e) {
        console.log("[Error] Failed to update lighting equipment:", e);
    }

}, (app) => {
    console.log("[Rollback] This migration cannot be rolled back automatically");
});
