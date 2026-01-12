/// <reference path="../pb_data/types.d.ts" />

$app.rootCmd.addCommand(new Command({
    use: "audit-categories-detailed",
    run: (cmd, args) => {
        const app = $app;
        console.log("📊 CATEGORY AUDIT (Total vs Active Items)");

        const categories = app.findRecordsByFilter("categories", "id!=''");

        console.log(`Checking ${categories.length} categories...`);
        console.log("---------------------------------------------------");
        console.log(pad("Category Name", 30) + " | " + pad("Total", 8) + " | " + pad("Active", 8));
        console.log("---------------------------------------------------");

        categories.forEach(cat => {
            const allItems = app.findRecordsByFilter("equipment", `category="${cat.id}"`);
            const activeItems = allItems.filter(i => i.getBool("active") === true); // Assuming 'active' field exists

            const total = allItems.length;
            const active = activeItems.length;

            if (total === 0) {
                console.log(pad(cat.getString("name"), 30) + " | " + pad(total.toString(), 8) + " | " + pad(active.toString(), 8) + " 🔴 EMPTY");
            } else if (active === 0) {
                console.log(pad(cat.getString("name"), 30) + " | " + pad(total.toString(), 8) + " | " + pad(active.toString(), 8) + " 🟡 HIDDEN ONLY");
            } else {
                // console.log(pad(cat.getString("name"), 30) + " | " + pad(total.toString(), 8) + " | " + pad(active.toString(), 8));
            }
        });
    }
}));

function pad(str, len) {
    if (str.length > len) return str.substring(0, len - 3) + "...";
    return str + " ".repeat(len - str.length);
}
