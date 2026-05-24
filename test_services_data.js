
async function inspectServices() {
    const { default: PocketBase } = await import('pocketbase');
    const pb = new PocketBase('http://127.0.0.1:8090');

    try {
        console.log("--- Inspecting 'film-shipping' Service ---");
        const services = await pb.collection('services').getFullList({
            filter: 'slug = "film-shipping"'
        });

        if (services.length === 0) {
            console.log("No service found with slug 'film-shipping'. List all slugs:");
            const all = await pb.collection('services').getFullList();
            all.forEach(s => console.log(` - ${s.slug}`));
            return;
        }

        services.forEach(s => {
            console.log(`\nService: ${s.slug}`);
            console.log(`Title (En): ${s.title}`);
            console.log(`Title (Fr): ${s.title_fr}`);
            console.log(`\nBrief (En): \n${s.brief_description}`);
            console.log(`\nBrief (Fr): \n${s.brief_description_fr}`);
        });

    } catch (e) {
        console.error("Error:", e.message);
    }
}

inspectServices();
