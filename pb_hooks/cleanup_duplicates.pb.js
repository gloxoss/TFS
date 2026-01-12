/// <reference path="../pb_data/types.d.ts" />

/**
 * Custom Command: cleanup-duplicates
 * Usage: ./pocketbase cleanup-duplicates
 * Scans for duplicates by name and auto-deletes ones that don't match the "Golden Slug" list.
 */
$app.rootCmd.addCommand(new Command({
    use: "cleanup-duplicates",
    run: (cmd, args) => {
        console.log("🧹 STARTING INTELLIGENT DUPLICATE CLEANUP...");

        const app = $app;
        const records = app.findRecordsByFilter("equipment", "id!=''");

        // 1. Define Golden Slugs (The correct ones we just seeded)
        const goldenSlugs = new Set([
            "schneider-nd-03", "schneider-irnd-03", "schneider-grad-nd-09", "tiffen-bpm-1-4",
            "schneider-glimmerglass-1", "tiffen-soft-fx", "diopter-tray", "schneider-hbm",
            "arri-rota-pola", "schneider-true-pol", "tiffen-diopter-set", "tiffen-enhancing",
            "schneider-true-streak-blue", "tiffen-sky-1a", "movietech-magnum", "movietech-scooter",
            "panther-super-panther", "slider-mount-kit", "panther-husky", "chapman-peewee",
            "gfm-lite", "moviebird-45", "phoenix-crane", "multitower", "panther-pegasus",
            "abc-120", "jimmy-jib", "egripment-javelin", "gizmo-jib", "panther-u-bangi",
            "gfm-mini-jib", "panther-lightweight-jib", "panther-boogie-wheels", "system-low-rig",
            "panther-low-rig", "panther-straight-track", "panther-curved-track", "gfm-curved-track",
            "gfm-straight-track", "manfrotto-autopoles", "barracuda-bar", "euro-riser-set",
            "gas-riser", "ball-adapter-150mm"
        ]);

        // 2. Group by Name
        const nameMap = {};
        records.forEach(r => {
            const name = r.getString("name");
            if (!nameMap[name]) nameMap[name] = [];
            nameMap[name].push(r);
        });

        // 3. Analyze and Act
        let deletedCount = 0;
        let preservedCount = 0;

        for (const [name, group] of Object.entries(nameMap)) {
            if (group.length > 1) {
                console.log(`\n🔎 Assessing duplicates for: "${name}" (${group.length} records)`);

                // Find the winner
                let winner = null;
                const losers = [];

                // Criterion 1: Matches Golden Slug
                const goldenMatch = group.find(r => goldenSlugs.has(r.getString("slug")));

                if (goldenMatch) {
                    winner = goldenMatch;
                    console.log(`   🌟 Winner (Golden Slug): ${winner.getString("slug")}`);
                } else {
                    // Criterion 2: Heuristic - Shortest slug? Or check images?
                    // For now, if no golden match, we SKIP to avoid deleting good data.
                    console.log(`   ⚠️  No Golden Slug match found. Skipping auto-delete.`);
                    continue;
                }

                // Identify losers
                group.forEach(r => {
                    if (r.id !== winner.id) losers.push(r);
                });

                // Delete losers
                losers.forEach(l => {
                    console.log(`   🗑️  Deleting loser: ${l.getString("slug")} [${l.id}]`);
                    try {
                        app.delete(l);
                        deletedCount++;
                    } catch (e) {
                        console.log(`      Error deleting: ${e.message}`);
                    }
                });
                preservedCount++;
            }
        }


        console.log(`\n✅ CLEANUP COMPLETE.`);
        console.log(`   Preserved: ${preservedCount}`);
        console.log(`   Deleted:   ${deletedCount}`);
    }
}));

$app.rootCmd.addCommand(new Command({
    use: "audit-duplicates",
    run: (cmd, args) => {
        console.log("🔍 STARTING DUPLICATE AUDIT...");
        const app = $app;
        const records = app.findRecordsByFilter("equipment", "id!=''");

        const nameMap = {};
        records.forEach(r => {
            const name = r.getString("name");
            if (!nameMap[name]) nameMap[name] = [];
            nameMap[name].push(r);
        });

        let foundDuplicates = 0;

        for (const [name, group] of Object.entries(nameMap)) {
            if (group.length > 1) {
                console.log(`\n🔴 DUPLICATE FOUND: "${name}"`);
                group.forEach(r => {
                    console.log(`   - ID: ${r.id} | Slug: ${r.getString("slug")} | Created: ${r.getString("created")}`);
                });
                foundDuplicates++;
            }
        }

        if (foundDuplicates === 0) {
            console.log("\n✅ No duplicates found by name.");
        } else {
            console.log(`\n⚠️  Found ${foundDuplicates} sets of duplicate items.`);
        }
    }
}));
