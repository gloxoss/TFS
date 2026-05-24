const PocketBase = require('pocketbase').default;

async function inspectService() {
    const pb = new PocketBase('http://127.0.0.1:8090');
    try {
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

        let service;
        try {
            service = await pb.collection('services').getFirstListItem('slug="digital-production"');
        } catch (e) {
            console.log("Service digital-production not found");
            return;
        }

        console.log("Service found:", service.slug);
        const sections = service.sections; // it's already a JSON object if coming from JS SDK usually, or string? SDK parses json fields automatically?
        // Actually SDK returns object for JSON fields

        console.log("Sections count:", sections.length);
        sections.forEach((s, i) => {
            console.log(`[${i}] Type: ${s.type}, Title: ${s.title}`);
        });

    } catch (e) {
        console.error("Error:", e);
    }
}

inspectService();
