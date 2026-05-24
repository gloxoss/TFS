const PocketBase = require('pocketbase').default;

async function fetchService() {
    const pb = new PocketBase('http://127.0.0.1:8090');
    try {
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

        // Try to find by slug 'digital-production' or 'digital-services'
        try {
            const service = await pb.collection('services').getFirstListItem('slug="digital-production"');
            console.log('Found "digital-production":');
            console.log(JSON.stringify(service, null, 2));
        } catch (e) {
            console.log('"digital-production" not found, trying "digital-services"...');
            try {
                const service = await pb.collection('services').getFirstListItem('slug="digital-services"');
                console.log('Found "digital-services":');
                console.log(JSON.stringify(service, null, 2));
            } catch (e2) {
                console.log('Neither service found.');
            }
        }
    } catch (e) {
        console.error(e);
    }
}

fetchService();
