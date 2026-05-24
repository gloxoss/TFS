/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Add French translations for stat values
 * 
 * Adds valueFr to all service stats for proper bilingual support.
 */

const VALUE_TRANSLATIONS = {
    // Numbers with units - keep as-is
    "200+": "200+",
    "48h": "48h",
    "0": "0",
    "100%": "100%",
    "50+": "50+",
    "30+": "30+",
    "500+": "500+",
    "99.9%": "99.9%",
    "1000+": "1000+",
    "10k+": "10k+",
    "100+": "100+",
    "4+": "4+",
    "4K+": "4K+",
    "24/7": "24/7",

    // Text values - need translation
    "Yes": "Oui",
    "ARRI/Sony/RED": "ARRI/Sony/RED",
    "Multi-Cam": "Multi-Cam",
    "Fast-Track": "Accéléré",
    "All Morocco": "Tout le Maroc",
    "International": "International",
    "All": "Tous",
    "Unlimited": "Illimité",
    "Extensive": "Étendue",
    "Expert": "Expert",
    "Included": "Inclus",
    "Daily": "Quotidien",
    "High": "Élevé",
    "Budget-Luxury": "Budget-Luxe",
    "Managed": "Géré",
    "Large": "Grande",
    "Van/Truck/4x4": "Van/Camion/4x4",
    "Vetted": "Vérifiés",
    "National": "National",
    "Huge": "Énorme",
    "Available": "Disponible",
    "On-site": "Sur place",
    "Skilled": "Qualifiés",
    "Local/Intl": "Local/Intl",
    "Specialists": "Spécialistes",
    "Diverse": "Diversifiés",
    "Custom": "Sur mesure",
    "Rapid": "Rapide",
    "Trained": "Formés",
    "Secure": "Sécurisé",
    "Cloud": "Cloud",
    "Global": "Mondial",
    "Multi": "Multi",
    "ROI": "ROI",
    "Focused": "Orienté",
    "Premium": "Premium"
};

migrate((app) => {
    const services = app.findRecordsByFilter("services", "1=1", "", 100);
    let updatedCount = 0;

    for (const service of services) {
        const statsJson = service.get("stats");
        if (!statsJson || !Array.isArray(statsJson) || statsJson.length === 0) {
            continue;
        }

        let modified = false;
        const updatedStats = statsJson.map(stat => {
            if (!stat.valueFr && stat.value) {
                const translation = VALUE_TRANSLATIONS[stat.value];
                if (translation) {
                    stat.valueFr = translation;
                    modified = true;
                } else {
                    // For unknown values, just copy the value as-is
                    stat.valueFr = stat.value;
                    modified = true;
                    console.log(`[Stats Migration] Unknown value for ${service.get("slug")}: "${stat.value}"`);
                }
            }
            return stat;
        });

        if (modified) {
            service.set("stats", updatedStats);
            app.save(service);
            updatedCount++;
            console.log(`[Stats Migration] Updated ${service.get("slug")}`);
        }
    }

    console.log(`[Stats Migration] Complete. Updated ${updatedCount} services.`);
}, (app) => {
    // Rollback: Remove valueFr from all stats
    const services = app.findRecordsByFilter("services", "1=1", "", 100);

    for (const service of services) {
        const statsJson = service.get("stats");
        if (!statsJson || !Array.isArray(statsJson)) {
            continue;
        }

        const cleanedStats = statsJson.map(stat => {
            delete stat.valueFr;
            return stat;
        });

        service.set("stats", cleanedStats);
        app.save(service);
    }

    console.log("[Stats Migration] Rollback complete. Removed valueFr from all stats.");
});
