const PocketBase = require('pocketbase').default;
const pb = new PocketBase('http://127.0.0.1:8090');

(async () => {
    await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');
    
    // Get one service to see all fields
    const service = await pb.collection('services').getFirstListItem(`slug="football"`);
    console.log('All fields on football service:');
    console.log(Object.keys(service));
    console.log('\nFull service data:');
    console.log(JSON.stringify(service, null, 2));
})();
