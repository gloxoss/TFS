const PocketBase = require('pocketbase').default;
const pb = new PocketBase('http://127.0.0.1:8090');

async function check() {
    await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');
    
    // Check scouting sections
    const scouting = await pb.collection('services').getFirstListItem('slug="scouting"');
    console.log('\n=== SCOUTING SECTIONS ===');
    console.log('images array:', scouting.images);
    if (scouting.sections) {
        scouting.sections.forEach((sec, i) => {
            if (sec.image) {
                console.log(`Section ${i} (${sec.type}): image = ${sec.image}`);
            }
        });
    }
    
    // Check athletics sections
    const athletics = await pb.collection('services').getFirstListItem('slug="athletics"');
    console.log('\n=== ATHLETICS SECTIONS ===');
    console.log('images array:', athletics.images);
    if (athletics.sections) {
        athletics.sections.forEach((sec, i) => {
            if (sec.image) {
                console.log(`Section ${i} (${sec.type}): image = ${sec.image}`);
            }
        });
    }
    
    // Check football sections
    const football = await pb.collection('services').getFirstListItem('slug="football"');
    console.log('\n=== FOOTBALL SECTIONS ===');
    console.log('images array:', football.images);
    if (football.sections) {
        football.sections.forEach((sec, i) => {
            if (sec.image) {
                console.log(`Section ${i} (${sec.type}): image = ${sec.image}`);
            }
        });
    }
}

check().catch(console.error);
