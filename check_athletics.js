const PocketBase = require('pocketbase').default;
const pb = new PocketBase('http://127.0.0.1:8090');

async function check() {
    await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');
    
    // Check athletics full sections structure
    const athletics = await pb.collection('services').getFirstListItem('slug="athletics"');
    console.log('\n=== ATHLETICS FULL SECTIONS ===');
    console.log(JSON.stringify(athletics.sections, null, 2));
}

check().catch(console.error);
