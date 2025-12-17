/// <reference path="../pb_data/types.d.ts" />
/**
 * Seed the settings collection with default values
 * Run after 1765918001_created_settings.js
 */
migrate((app) => {
    try {
        const settings = app.findCollectionByNameOrId("settings");
        if (!settings) {
            console.log("[Seed] Settings collection not found, skipping seed...");
            return;
        }

        // Check if a settings record already exists
        const existing = app.dao().findRecordsByFilter(
            "settings",
            "id != ''",
            "",
            1
        );

        if (existing && existing.length > 0) {
            console.log("[Seed] Settings record already exists, skipping...");
            return;
        }

        // Create default settings record
        const record = new Record(settings, {
            company_name: "TFS Equipment Rental",
            contact_email: "contact@tfs-rental.com",
            company_phone: "+212 522 123 456",
            company_address: "Casablanca, Morocco",
            email_notifications: true,
            new_quote_alert: true,
            quote_status_alert: true,
            show_prices: false,
            maintenance_mode: false,
            default_language: "en",
            currency: "MAD"
        });

        app.dao().saveRecord(record);
        console.log("[Seed] Created default settings record successfully!");

    } catch (e) {
        console.log("[Seed] Error seeding settings:", e);
    }
}, (app) => {
    // DOWN: Remove seeded record (optional)
    try {
        const records = app.dao().findRecordsByFilter(
            "settings",
            "id != ''",
            "",
            1
        );
        if (records && records.length > 0) {
            app.dao().deleteRecord(records[0]);
            console.log("[Seed] Removed settings record");
        }
    } catch (e) {
        console.log("[Seed] Error removing settings:", e);
    }
});
