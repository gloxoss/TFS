// Quick script to add valueFr to stats
// Run: node update_stats_valuefr.js

const PocketBase = require('pocketbase/cjs');

const translations = {
    "Yes": "Oui", "Fast-Track": "Accéléré", "All Morocco": "Tout le Maroc",
    "International": "International", "All": "Tous", "Unlimited": "Illimité",
    "Extensive": "Étendue", "Expert": "Expert", "Included": "Inclus",
    "Daily": "Quotidien", "High": "Élevé", "Budget-Luxury": "Budget-Luxe",
    "Managed": "Géré", "Large": "Grande", "Van/Truck/4x4": "Van/Camion/4x4",
    "Vetted": "Vérifiés", "National": "National", "Huge": "Énorme",
    "Available": "Disponible", "On-site": "Sur place", "Skilled": "Qualifiés",
    "Local/Intl": "Local/Intl", "Specialists": "Spécialistes",
    "Diverse": "Diversifiés", "Custom": "Sur mesure", "Rapid": "Rapide",
    "Trained": "Formés", "Secure": "Sécurisé", "Cloud": "Cloud",
    "Global": "Mondial", "Multi": "Multi", "ROI": "ROI", "Focused": "Orienté"
};

async function main() {
    const pb = new PocketBase('http://127.0.0.1:8090');

    // Get all services
    const services = await pb.collection('services').getFullList();
    console.log(`Found ${services.length} services\n`);

    // Show which need updating
    services.forEach(s => {
        if (!s.stats || s.stats.length === 0) return;
        const missing = s.stats.filter(stat => !stat.valueFr);
        if (missing.length > 0) {
            console.log(`${s.slug}: ${missing.map(m => m.value).join(', ')}`);
        }
    });

    console.log('\n---\nTo update these, log into PocketBase admin and run SQL or use dashboard.');
}

main().catch(console.error);
