/**
 * Debug script to compare local files with DB
 */
const fs = require('fs');
const path = require('path');

async function compare() {
    const { default: PocketBase } = await import('pocketbase');
    const pb = new PocketBase('http://127.0.0.1:8090');
    await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');
    
    const BASE_DIR = path.join(__dirname, 'web', 'public', 'images', 'services');
    
    // Check one service - accommodation
    const service = await pb.collection('services').getFirstListItem('slug="accommodation"');
    
    console.log('=== ACCOMMODATION SERVICE ===');
    console.log('DB Hero:', service.hero_image);
    console.log('DB Images:', service.images);
    console.log('DB Sections:');
    service.sections?.forEach((s, i) => console.log('  ['+i+']', s.image));
    
    console.log('\n=== LOCAL FOLDER ===');
    const localDir = path.join(BASE_DIR, 'accommodation');
    const localFiles = fs.readdirSync(localDir);
    console.log('Files:', localFiles);
    
    // Check PocketBase file URL
    if (service.hero_image) {
        const url = pb.files.getURL(service, service.hero_image);
        console.log('\nHero URL:', url);
    }
    
    // List ALL folders and their contents
    console.log('\n\n=== ALL LOCAL FOLDERS ===');
    const folders = fs.readdirSync(BASE_DIR).filter(f => fs.statSync(path.join(BASE_DIR, f)).isDirectory());
    for (const folder of folders) {
        const files = fs.readdirSync(path.join(BASE_DIR, folder));
        console.log(`\n${folder}/`);
        files.forEach(f => console.log(`  - ${f}`));
    }
}

compare();
