
async function listSlugs() {
    const { default: PocketBase } = await import('pocketbase');
    const pb = new PocketBase('http://127.0.0.1:8090');

    try {
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

        const services = await pb.collection('services').getFullList({
            fields: 'id,slug,title'
        });

        console.log("--- Service Slugs ---");
        services.forEach(s => {
            console.log(`Slug: ${s.slug.padEnd(30)} | Title: ${s.title}`);
        });

    } catch (e) {
        console.error("Error:", e.message);
    }
}

listSlugs();
