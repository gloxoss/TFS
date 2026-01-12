/// <reference path="../pb_data/types.d.ts" />

$app.rootCmd.addCommand(new Command({
    use: "inspect-slots",
    run: (cmd, args) => {
        const app = $app;
        try {
            const slot = app.findFirstRecordByFilter("kit_slots", "id!=''");
            console.log("Slot Keys:", JSON.stringify(slot.publicExport(), null, 2));
        } catch (e) {
            console.log("Error:", e.message);
        }
    }
}));
