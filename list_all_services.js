const PocketBase = require('pocketbase').default;

async function listServices() {
    const pb = new PocketBase('http://127.0.0.1:8090');
    try {
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

        const services = await pb.collection('services').getFullList({
            sort: 'slug',
        });

        console.log(`Found ${services.length} services:`);
        services.forEach(s => {
            console.log(`- Slug: "${s.slug}" | Title: "${s.title}"`);
        });

    } catch (e) {
        console.error("Error:", e);
    }
}

listServices();
