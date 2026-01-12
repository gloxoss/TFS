/// <reference path="../pb_data/types.d.ts" />
/**
 * Fix ALL Equipment with null variant_options
 * 
 * This migration updates ALL equipment records that have null variant_options,
 * regardless of category.
 */
migrate((app) => {
    const ID_EQUIPMENT = "pbc_equipment00001";

    console.log("=".repeat(60));
    console.log("[FIX ALL] Updating ALL equipment with null variants...");
    console.log("=".repeat(60));

    // Variant mappings based on product name patterns
    const variantMappings = [
        // HMI / Daylight
        { pattern: /m-series|m\.series|m series/i, variants: { "WATTAGE": ["M18 (1.8KW)", "M40 (4KW)", "M90 (9KW)"] } },
        { pattern: /arrisun/i, variants: { "WATTAGE": ["575W", "1.2KW", "2.5/4KW", "6KW", "12KW"] } },

        // Tungsten
        { pattern: /fresnel|junior/i, variants: { "WATTAGE": ["150W", "300W", "650W", "1KW", "2KW", "5KW", "10KW"] } },
        { pattern: /true blue/i, variants: { "TYPE": ["Manual", "Pole-Operated"] } },
        { pattern: /blonde|redhead/i, variants: { "WATTAGE": ["800W", "2000W"] } },
        { pattern: /dino/i, variants: { "CONFIG": ["8×650W", "9×1000W", "12×1000W", "24×1000W"] } },
        { pattern: /par 64|par64/i, variants: { "WATTAGE": ["500W", "1000W"] } },
        { pattern: /source 4|source4/i, variants: { "BEAM": ["19°", "26°", "36°", "50°"] } },
        { pattern: /dedolight|dedo|dlh/i, variants: { "KIT": ["2-Light Kit", "3-Light Kit", "4-Light Kit"] } },

        // LED
        { pattern: /creamsource|vortex/i, variants: { "ACCESSORY": ["Standard", "With Softbox", "With Barndoors"] } },
        { pattern: /skypanel/i, variants: { "MODEL": ["S30-C", "S60-C"] } },
        { pattern: /dmg|lumiere|lumière/i, variants: { "SIZE": ["MINI MIX", "SL1 MIX", "MAXI MIX"] } },
        { pattern: /astera/i, variants: { "MODEL": ["Titan Tube", "Pixel Tube", "AX-3", "AX-5", "AX10", "Bulb"] } },
        { pattern: /forza/i, variants: { "WATTAGE": ["60B", "300", "300B", "500", "500B"] } },
        { pattern: /light storm|ls\d|aputure.*\d{3,4}/i, variants: { "MODEL": ["1200d Pro", "600c Pro II", "600c Pro", "600x Pro", "600d Pro", "300c", "300d II", "60x"] } },
        { pattern: /storm|xt52|xt26|cs15/i, variants: { "ACCESSORY": ["Standard", "With Fresnel", "With Softbox"] } },
        { pattern: /mc pro/i, variants: { "KIT": ["Single", "4-Light Kit", "8-Light Kit"] } },
        { pattern: /amaran|f21|f22/i, variants: { "SIZE": ["F21c (2×1')", "F22c (2×2')"] } },
        { pattern: /litemat|lite mat/i, variants: { "SIZE": ["LiteMat 2", "LiteMat 2L", "LiteMat 4"] } },
        { pattern: /modifier|softbox/i, variants: { "TYPE": ["Parabolic", "Lantern", "Umbrella", "Octagon", "Rectangle"] } },
        { pattern: /butterfly|overhead/i, variants: { "SIZE": ["4×4'", "6×6'", "8×8'", "12×12'", "20×20'"] } },
        { pattern: /reflector|flag|panel|scrim/i, variants: { "SIZE": ["Small", "Medium", "Large"] } },
        { pattern: /dimmer/i, variants: { "CAPACITY": ["1KW", "2KW", "3KW", "5KW"] } },

        // Cameras
        { pattern: /alexa|arri.*camera/i, variants: { "SENSOR": ["LF", "35", "Mini LF", "Mini"] } },
        { pattern: /red|komodo|raptor|v-raptor|dsmc/i, variants: { "SENSOR": ["8K VV", "6K S35", "6K"] } },
        { pattern: /sony.*fx|fx3|fx6|fx9/i, variants: { "MODEL": ["FX3", "FX6", "FX9"] } },
        { pattern: /venice/i, variants: { "MODEL": ["Venice", "Venice 2"] } },
        { pattern: /canon.*c\d|c70|c300|c500/i, variants: { "MODEL": ["C70", "C300 III", "C500 II"] } },
        { pattern: /blackmagic|bmpcc|ursa/i, variants: { "MODEL": ["BMPCC 6K Pro", "URSA Mini Pro 12K", "URSA G2"] } },

        // Lenses
        { pattern: /signature prime|sp.*arri/i, variants: { "FOCAL": ["18mm", "25mm", "35mm", "47mm", "65mm", "95mm", "125mm"] } },
        { pattern: /master prime|mp.*zeiss/i, variants: { "FOCAL": ["14mm", "18mm", "21mm", "25mm", "32mm", "50mm", "65mm", "75mm", "100mm", "135mm"] } },
        { pattern: /ultra prime|up.*zeiss/i, variants: { "FOCAL": ["16mm", "20mm", "24mm", "32mm", "50mm", "85mm", "135mm"] } },
        { pattern: /cooke.*s4|s4i/i, variants: { "FOCAL": ["18mm", "25mm", "32mm", "50mm", "75mm", "100mm", "135mm"] } },
        { pattern: /cooke.*anamorphic|anam.*cooke/i, variants: { "FOCAL": ["25mm", "32mm", "40mm", "50mm", "75mm", "100mm", "135mm", "180mm"] } },
        { pattern: /atlas|orion.*anam/i, variants: { "FOCAL": ["32mm", "40mm", "50mm", "65mm", "80mm", "100mm"] } },

        // Support
        { pattern: /oconnor|o'connor/i, variants: { "MODEL": ["2560", "2575D", "Ultimate 2560"] } },
        { pattern: /sachtler/i, variants: { "MODEL": ["Cine 75 HD", "Video 18 S2", "FSB 10"] } },
        { pattern: /ronin/i, variants: { "MODEL": ["RS 2", "RS 3 Pro", "RS 4 Pro"] } },
        { pattern: /movi|freefly/i, variants: { "MODEL": ["MōVI Pro", "MōVI XL"] } },

        // Audio
        { pattern: /lectrosonics/i, variants: { "CHANNEL": ["Block 20", "Block 21", "Block 22", "Block 23", "Block 24"] } },
        { pattern: /sennheiser/i, variants: { "MODEL": ["G4", "G3", "EW 500"] } },
        { pattern: /zoom.*f/i, variants: { "MODEL": ["F6", "F8", "F8n Pro"] } },
        { pattern: /sound devices/i, variants: { "MODEL": ["MixPre-3", "MixPre-6", "MixPre-10", "888", "Scorpio"] } },
    ];

    // Default variants
    const defaultVariants = { "OPTION": ["Standard"] };

    // Get ALL equipment
    console.log("[Query] Finding ALL equipment records...");
    try {
        const allEquipment = app.findRecordsByFilter(
            ID_EQUIPMENT,
            "id != ''", // Get all records
            "",
            1000,
            0
        );

        console.log(`[Found] ${allEquipment.length} total equipment records`);

        let updatedCount = 0;
        let skippedCount = 0;

        allEquipment.forEach(item => {
            const name = item.get("name_en") || item.get("name") || "";
            const currentVariants = item.get("variant_options");

            // Check if already has valid variant_options (not null, not empty object)
            const hasValidVariants = currentVariants &&
                typeof currentVariants === 'object' &&
                currentVariants !== null &&
                Object.keys(currentVariants).length > 0;

            if (hasValidVariants) {
                skippedCount++;
                return; // Skip - already has variants
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
                matchedVariants = defaultVariants;
            }

            // Update the record
            item.set("variant_options", matchedVariants);
            app.save(item);
            console.log(`[Updated] ${name} → ${JSON.stringify(matchedVariants)}`);
            updatedCount++;
        });

        console.log("=".repeat(60));
        console.log(`[Complete] Updated: ${updatedCount}, Already had variants: ${skippedCount}`);
        console.log("=".repeat(60));

    } catch (e) {
        console.log("[Error]", e);
    }

}, (app) => {
    console.log("[Rollback] Manual cleanup required");
});
