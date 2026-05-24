const PocketBase = require('pocketbase').default;

async function findBroadcastService() {
    const pb = new PocketBase('http://127.0.0.1:8090');
    try {
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

        const services = await pb.collection('services').getFullList({
            filter: 'title ~ "Broadcast" || slug ~ "broadcast"'
        });

        if (services.length > 0) {
            console.log("Found Services:");
            services.forEach(s => {
                console.log(`- Title: ${s.title}, Slug: ${s.slug}, ID: ${s.id}`);
            });
        } else {
            console.log("No 'Broadcast' service found. Listing all titles...");
            const all = await pb.collection('services').getFullList();
            all.forEach(s => console.log(`- ${s.title} (${s.slug})`));
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

findBroadcastService();
