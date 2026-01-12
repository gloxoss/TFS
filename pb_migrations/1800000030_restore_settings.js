/// <reference path="../pb_data/types.d.ts" />

/**
 * Restore Settings
 * Seeds the default application settings.
 */

migrate((app) => {
    const collection = app.findCollectionByNameOrId("settings");

    // Check if settings record already exists
    const existing = app.findAllRecords("settings");
    if (existing.length > 0) {
        console.log("Settings already exist, skipping seed.");
        return;
    }

    const rec = new Record(collection);

    // Core Company Info
    rec.set("company_name", "TFS - TV Film Solutions");
    rec.set("contact_email", "info@tfs.ma");
    rec.set("company_phone", "+212 522 246 372");
    rec.set("company_fax", "+212 522 241 396");
    rec.set("company_address", "N°55-57, Rue Souleimane El Farissi, Ain Borja 20330 - Casablanca, Morocco");

    // System Config
    rec.set("email_notifications", true);
    rec.set("new_quote_alert", true);
    rec.set("quote_status_alert", true);
    rec.set("show_prices", false);
    rec.set("maintenance_mode", false);
    rec.set("default_language", "en");
    rec.set("currency", "MAD");

    // Socials (Optional - verify schemas support these, if not, remove or add via migration)
    // Based on legacy file, these fields weren't explicitly set there, but might exist in schema
    // rec.set("social_instagram", "https://instagram.com/tfs");
    // rec.set("social_linkedin", "https://linkedin.com/company/tfs");

    app.save(rec);

    console.log("✅ Restored Default Settings");

}, (app) => {
    // Rollback: delete settings
    const records = app.findAllRecords("settings");
    records.forEach(r => app.delete(r));
});
