const PocketBase = require('pocketbase').default;
const pb = new PocketBase('http://127.0.0.1:8090');

(async () => {
    await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');
    
    // Update sport service with new slug names (without tfs- prefix)
    const sportService = await pb.collection('services').getFirstListItem(`slug="sport"`);
    const newSubServices = [
        'football',
        'baseball',
        'basketball',
        'motorsports',
        'athletics',
        'combat-sports',
        'tennis',
        'rugby',
        'cycling',
        'extreme-sports'
    ];
    
    await pb.collection('services').update(sportService.id, { 
        sub_services: newSubServices 
    });
    console.log('✅ Updated sport sub_services to new slugs');
    console.log('   New sub_services:', newSubServices);
})();
