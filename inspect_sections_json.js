
async function inspect() {
    const { default: PocketBase } = await import('pocketbase');
    const pb = new PocketBase('http://127.0.0.1:8090');

    try {
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

        // Fetch a few services to find one with sections
        const services = await pb.collection('services').getFullList();
        const withSections = services.find(s => s.sections && s.sections.length > 0);

        if (withSections) {
            console.log(`--- Sections for ${withSections.slug} ---`);
            console.log(JSON.stringify(withSections.sections, null, 2));
        } else {
            console.log("No services with sections found.");
        }

    } catch (e) {
        console.error("Error:", e.message);
    }
}

inspect();
