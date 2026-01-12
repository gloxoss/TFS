/// <reference path="../pb_data/types.d.ts" />
/**
 * Debug and Force Fix ALL Equipment variant_options
 * 
 * This migration inspects and FORCE UPDATES all equipment regardless of current value.
 */
migrate((app) => {
    const ID_EQUIPMENT = "pbc_equipment00001";

    console.log("=".repeat(60));
    console.log("[DEBUG] Inspecting and force-fixing variant_options...");
    console.log("=".repeat(60));

    // Variant mappings
    const variantMappings = [
        { pattern: /dedolight|dedo|dlh/i, variants: { "KIT": ["2-Light Kit", "3-Light Kit", "4-Light Kit"] } },
        { pattern: /m-series/i, variants: { "WATTAGE": ["M18 (1.8KW)", "M40 (4KW)", "M90 (9KW)"] } },
        { pattern: /arrisun/i, variants: { "WATTAGE": ["575W", "1.2KW", "2.5/4KW", "6KW", "12KW"] } },
        { pattern: /fresnel|junior/i, variants: { "WATTAGE": ["150W", "300W", "650W", "1KW", "2KW", "5KW", "10KW"] } },
        { pattern: /true blue/i, variants: { "TYPE": ["Manual", "Pole-Operated"] } },
        { pattern: /blonde|redhead/i, variants: { "WATTAGE": ["800W", "2000W"] } },
        { pattern: /dino/i, variants: { "CONFIG": ["8×650W", "9×1000W", "12×1000W", "24×1000W"] } },
        { pattern: /par 64|par64/i, variants: { "WATTAGE": ["500W", "1000W"] } },
        { pattern: /source 4|source4/i, variants: { "BEAM": ["19°", "26°", "36°", "50°"] } },
        { pattern: /creamsource|vortex/i, variants: { "ACCESSORY": ["Standard", "With Softbox", "With Barndoors"] } },
        { pattern: /skypanel/i, variants: { "MODEL": ["S30-C", "S60-C"] } },
        { pattern: /dmg|lumiere|lumière/i, variants: { "SIZE": ["MINI MIX", "SL1 MIX", "MAXI MIX"] } },
        { pattern: /astera/i, variants: { "MODEL": ["Titan Tube", "Pixel Tube", "AX-3", "AX-5", "AX10", "Bulb"] } },
        { pattern: /forza/i, variants: { "WATTAGE": ["60B", "300", "300B", "500", "500B"] } },
        { pattern: /light storm|aputure.*pro/i, variants: { "MODEL": ["1200d Pro", "600c Pro II", "600c Pro", "600x Pro", "600d Pro", "300c", "300d II", "60x"] } },
        { pattern: /storm|xt52|xt26|cs15/i, variants: { "ACCESSORY": ["Standard", "With Fresnel", "With Softbox"] } },
        { pattern: /mc pro/i, variants: { "KIT": ["Single", "4-Light Kit", "8-Light Kit"] } },
        { pattern: /amaran|f21|f22/i, variants: { "SIZE": ["F21c (2×1')", "F22c (2×2')"] } },
        { pattern: /litemat/i, variants: { "SIZE": ["LiteMat 2", "LiteMat 2L", "LiteMat 4"] } },
        { pattern: /alexa|arri.*camera/i, variants: { "SENSOR": ["LF", "35", "Mini LF", "Mini"] } },
        { pattern: /red|komodo|raptor/i, variants: { "SENSOR": ["8K VV", "6K S35", "6K"] } },
        { pattern: /sony.*fx|venice/i, variants: { "MODEL": ["FX3", "FX6", "FX9", "Venice 2"] } },
        { pattern: /canon.*c\d/i, variants: { "MODEL": ["C70", "C300 III", "C500 II"] } },
        { pattern: /signature prime/i, variants: { "FOCAL": ["18mm", "25mm", "35mm", "47mm", "65mm", "95mm", "125mm"] } },
        { pattern: /master prime/i, variants: { "FOCAL": ["14mm", "18mm", "21mm", "25mm", "32mm", "50mm", "65mm", "75mm", "100mm", "135mm"] } },
        { pattern: /ultra prime/i, variants: { "FOCAL": ["16mm", "20mm", "24mm", "32mm", "50mm", "85mm", "135mm"] } },
        { pattern: /cooke/i, variants: { "FOCAL": ["25mm", "32mm", "40mm", "50mm", "75mm", "100mm"] } },
        { pattern: /atlas|orion/i, variants: { "FOCAL": ["32mm", "40mm", "50mm", "65mm", "80mm", "100mm"] } },
        { pattern: /oconnor|sachtler/i, variants: { "MODEL": ["Standard", "Heavy Duty"] } },
        { pattern: /ronin/i, variants: { "MODEL": ["RS 2", "RS 3 Pro", "RS 4 Pro"] } },
        { pattern: /lectro/i, variants: { "CHANNEL": ["Block 20", "Block 21", "Block 22", "Block 23"] } },
        { pattern: /sennheiser/i, variants: { "MODEL": ["G4", "G3", "EW 500"] } },
        { pattern: /zoom/i, variants: { "MODEL": ["F6", "F8", "F8n Pro"] } },
        { pattern: /sound devices/i, variants: { "MODEL": ["MixPre-6", "888", "Scorpio"] } },
    ];

    const defaultVariants = { "OPTION": ["Standard"] };

    try {
        const allEquipment = app.findRecordsByFilter(ID_EQUIPMENT, "id != ''", "", 1000, 0);
        console.log(`[Found] ${allEquipment.length} equipment records`);

        let forcedCount = 0;

        // Show first 5 records with their actual variant_options value
        console.log("\n[DEBUG] First 10 records variant_options values:");
        for (let i = 0; i < Math.min(10, allEquipment.length); i++) {
            const item = allEquipment[i];
            const name = item.get("name_en") || item.get("name") || "";
            const variants = item.get("variant_options");
            console.log(`  ${i + 1}. ${name.substring(0, 40)}`);
            console.log(`     Type: ${typeof variants}, Value: ${JSON.stringify(variants)}`);
        }
        console.log("");

        // FORCE update all records
        allEquipment.forEach(item => {
            const name = item.get("name_en") || item.get("name") || "";

            // Find matching variant
            let matchedVariants = null;
            for (const mapping of variantMappings) {
                if (mapping.pattern.test(name)) {
                    matchedVariants = mapping.variants;
                    break;
                }
            }

            if (!matchedVariants) {
                matchedVariants = defaultVariants;
            }

            // FORCE update regardless of current value
            item.set("variant_options", matchedVariants);
            app.save(item);
            forcedCount++;
        });

        console.log("=".repeat(60));
        console.log(`[Complete] Force updated ALL ${forcedCount} equipment records`);
        console.log("=".repeat(60));

    } catch (e) {
        console.log("[Error]", e);
    }

}, (app) => {
    console.log("[Rollback] Manual cleanup required");
});
