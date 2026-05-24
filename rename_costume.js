const PocketBase = require('pocketbase').default;
const pb = new PocketBase('http://127.0.0.1:8090');

(async () => {
    await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');
    
    // Rename costume-wardrobe to costume-makeup
    const service = await pb.collection('services').getFirstListItem(`slug="costume-wardrobe"`);
    await pb.collection('services').update(service.id, {
        slug: 'costume-makeup',
        title: 'Costume & Makeup',
        title_fr: 'Costume & Maquillage'
    });
    console.log('✅ Renamed costume-wardrobe → costume-makeup');
    console.log('   Title: Costume & Makeup');
    console.log('   Title FR: Costume & Maquillage');
})();
