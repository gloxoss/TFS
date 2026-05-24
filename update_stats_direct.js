// Update stats with superuser auth (PocketBase v0.23+)
// Run: node update_stats_direct.js <email> <password>

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
    const email = process.argv[2];
    const password = process.argv[3];

    if (!email || !password) {
        console.log('Usage: node update_stats_direct.js <email> <password>');
        process.exit(1);
    }

    const pb = new PocketBase('http://127.0.0.1:8090');

    // PocketBase v0.23+ uses _superusers collection
    try {
        const authData = await pb.collection('_superusers').authWithPassword(email, password);
        console.log('✅ Authenticated as superuser:', authData.record.email, '\n');
    } catch (e) {
        console.log('❌ Superuser auth failed:', e.message);
        console.log('\nMake sure you use your PocketBase admin email/password.');
        console.log('You can create a superuser via: ./pocketbase superuser create <email> <password>');
        process.exit(1);
    }

    const services = await pb.collection('services').getFullList();
    console.log(`📋 Found ${services.length} services\n`);

    let updated = 0;
    for (const svc of services) {
        if (!svc.stats || !Array.isArray(svc.stats) || svc.stats.length === 0) continue;

        let changed = false;
        const newStats = svc.stats.map(stat => {
            if (!stat.valueFr && stat.value) {
                stat.valueFr = translations[stat.value] || stat.value;
                changed = true;
            }
            return stat;
        });

        if (changed) {
            await pb.collection('services').update(svc.id, { stats: newStats });
            console.log(`✅ ${svc.slug}`);
            updated++;
        }
    }

    console.log(`\n🎉 Done! Updated ${updated} services.`);
}

main().catch(e => console.error('Error:', e.message));
