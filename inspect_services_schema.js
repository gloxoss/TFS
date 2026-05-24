
async function inspect() {
    const { default: PocketBase } = await import('pocketbase');
    const pb = new PocketBase('http://127.0.0.1:8090');

    try {
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

        console.log("--- Services Collection Schema ---");
        const collections = await pb.collections.getFullList();
        const serviceCol = collections.find(c => c.name === 'services');
        if (serviceCol) {
            console.log(JSON.stringify(serviceCol.schema, null, 2));
        } else {
            console.log("Services collection not found.");
        }

        console.log("\n--- Sample Service Record (Film Shipping) ---");
        const service = await pb.collection('services').getFirstListItem('slug="film-shipping"');
        console.log("Hero Image:", service.hero_image);
        console.log("Sections:", JSON.stringify(service.sections, null, 2));
        console.log("Images:", service.images);
        console.log("Full Record Keys:", Object.keys(service));

    } catch (e) {
        console.error("Error:", e.message);
    }
}

inspect();
