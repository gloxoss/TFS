const PocketBase = require('pocketbase').default;
const pb = new PocketBase('http://127.0.0.1:8090');

async function check() {
    await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');
    
    // Check scouting
    const scouting = await pb.collection('services').getFirstListItem('slug="scouting"');
    console.log('\n=== SCOUTING ===');
    console.log('hero_image:', scouting.hero_image);
    console.log('images:', scouting.images);
    
    // Check casting
    const casting = await pb.collection('services').getFirstListItem('slug="casting"');
    console.log('\n=== CASTING ===');
    console.log('hero_image:', casting.hero_image);
    console.log('images:', casting.images);
    
    // Check all sports
    const sports = ['athletics', 'baseball', 'basketball', 'football', 'cycling', 'rugby', 'tennis', 'motorsports', 'combat-sports', 'extreme-sports'];
    for (const slug of sports) {
        try {
            const s = await pb.collection('services').getFirstListItem(`slug="${slug}"`);
            console.log(`\n=== ${slug.toUpperCase()} ===`);
            console.log('hero_image:', s.hero_image);
            console.log('images:', s.images);
        } catch (e) {
            console.log(`\n=== ${slug.toUpperCase()} === NOT FOUND`);
        }
    }
}

check().catch(console.error);
