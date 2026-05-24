const PocketBase = require('pocketbase').default;

async function checkSlugs() {
    const pb = new PocketBase('http://127.0.0.1:8090');
    try {
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

        const slugs = ['digital-production', 'digital-corporate'];

        for (const slug of slugs) {
            try {
                const s = await pb.collection('services').getFirstListItem(`slug="${slug}"`);
                console.log(`FOUND: ${slug}`);
                console.log(`Title: ${s.title}`);
                console.log(`TitleFr: ${s.titleFr}`);
            } catch (e) {
                console.log(`MISSING: ${slug}`);
            }
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

checkSlugs();
