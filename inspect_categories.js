
async function inspect() {
    const { default: PocketBase } = await import('pocketbase');
    const pb = new PocketBase('http://127.0.0.1:8090');

    try {
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

        const categories = await pb.collection('categories').getFullList({
            sort: 'sort_order'
        });

        console.log("--- First Record Structure ---");
        console.log(JSON.stringify(categories[0], null, 2));

        console.log("\n--- All Slugs ---");
        categories.forEach(c => {
            console.log(`[${c.slug}] Name: ${c.name} | Order: ${c.sort_order}`);
        });

    } catch (e) {
        console.error("Error:", e.message);
    }
}

inspect();
