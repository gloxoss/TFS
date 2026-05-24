/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Add French translations for stat values (v2)
 * 
 * This version uses a different approach to find all records.
 */

const VALUE_TRANSLATIONS = {
    "200+": "200+", "48h": "48h", "0": "0", "100%": "100%", "50+": "50+",
    "30+": "30+", "500+": "500+", "99.9%": "99.9%", "1000+": "1000+",
    "10k+": "10k+", "100+": "100+", "4+": "4+", "4K+": "4K+", "24/7": "24/7",
    "Yes": "Oui", "ARRI/Sony/RED": "ARRI/Sony/RED", "Multi-Cam": "Multi-Cam",
    "Fast-Track": "Accéléré", "All Morocco": "Tout le Maroc",
    "International": "International", "All": "Tous", "Unlimited": "Illimité",
    "Extensive": "Étendue", "Expert": "Expert", "Included": "Inclus",
    "Daily": "Quotidien", "High": "Élevé", "Budget-Luxury": "Budget-Luxe",
    "Managed": "Géré", "Large": "Grande", "Van/Truck/4x4": "Van/Camion/4x4",
    "Vetted": "Vérifiés", "National": "National", "Huge": "Énorme",
    "Available": "Disponible", "On-site": "Sur place", "Skilled": "Qualifiés",
    "Local/Intl": "Local/Intl", "Specialists": "Spécialistes",
    "Diverse": "Diversifiés", "Custom": "Sur mesure", "Rapid": "Rapide",
    "Trained": "Formés", "Secure": "Sécurisé", "Cloud": "Cloud",
    "Global": "Mondial", "Multi": "Multi", "ROI": "ROI", "Focused": "Orienté",
    "Premium": "Premium"
};

migrate((app) => {
    const collection = app.findCollectionByNameOrId("services");
    if (!collection) {
        console.log("[Stats v2] Services collection not found!");
        return;
    }

    // Use raw SQL to get all service records
    const result = arrayOf(new Record());
    app.recordQuery(collection).all(result);

    console.log(`[Stats v2] Found ${result.length} services`);
    let updatedCount = 0;

    for (const service of result) {
        const statsRaw = service.get("stats");
        if (!statsRaw) continue;

        let stats;
        try {
            stats = typeof statsRaw === 'string' ? JSON.parse(statsRaw) : statsRaw;
        } catch (e) {
            console.log(`[Stats v2] Cannot parse stats for ${service.get("slug")}`);
            continue;
        }

        if (!Array.isArray(stats) || stats.length === 0) continue;

        let modified = false;
        const updatedStats = stats.map(stat => {
            if (!stat.valueFr && stat.value) {
                stat.valueFr = VALUE_TRANSLATIONS[stat.value] || stat.value;
                modified = true;
            }
            return stat;
        });

        if (modified) {
            service.set("stats", updatedStats);
            app.save(service);
            updatedCount++;
            console.log(`[Stats v2] Updated: ${service.get("slug")}`);
        }
    }

    console.log(`[Stats v2] Complete. Updated ${updatedCount} services.`);
}, (app) => {
    console.log("[Stats v2] Rollback not implemented - valueFr is additive.");
});
