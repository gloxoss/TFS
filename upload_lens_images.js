// Script to upload local lens images to PocketBase equipment records
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const POCKETBASE_URL = 'http://127.0.0.1:8090';
const LENS_ASSETS_DIR = './lens_assets';

// Manual mapping for files that don't match DB slugs exactly
const SLUG_MAPPING = {
    'arri--zeiss-master-prime-set': 'arri-zeiss-master-prime-set',
    'arri--zeiss-super-speed-mk-iii-set': 'arri-zeiss-super-speed-mk-iii-set',
    'arri--zeiss-ultra-prime-set': 'arri-zeiss-ultra-prime-set',
};

async function main() {
    // Get all files in lens_assets
    const files = fs.readdirSync(LENS_ASSETS_DIR);
    console.log(`📂 Found ${files.length} lens images to upload\n`);

    let updated = 0;
    let failed = 0;
    let notFound = 0;

    for (const file of files) {
        // Extract slug from filename (remove extension)
        let slug = path.basename(file, path.extname(file));

        // Check for manual mapping
        if (SLUG_MAPPING[slug]) {
            slug = SLUG_MAPPING[slug];
        }
        const filePath = path.join(LENS_ASSETS_DIR, file);

        try {
            // First, find the equipment record by slug
            const searchUrl = `${POCKETBASE_URL}/api/collections/equipment/records?filter=(slug='${slug}')`;
            const searchRes = await fetch(searchUrl);
            const searchData = await searchRes.json();

            if (!searchData.items || searchData.items.length === 0) {
                console.log(`⚠️  Not found: ${slug}`);
                notFound++;
                continue;
            }

            const record = searchData.items[0];

            // Check if record already has an image
            if (record.image && record.image.length > 0) {
                console.log(`⏭️  Skipped (has image): ${slug}`);
                continue;
            }

            // Upload the image using multipart form data
            const formData = new FormData();
            formData.append('image', fs.createReadStream(filePath));

            const updateUrl = `${POCKETBASE_URL}/api/collections/equipment/records/${record.id}`;
            const updateRes = await fetch(updateUrl, {
                method: 'PATCH',
                body: formData,
                headers: formData.getHeaders()
            });

            if (updateRes.ok) {
                console.log(`✅ Updated: ${slug}`);
                updated++;
            } else {
                const err = await updateRes.text();
                console.log(`❌ Failed: ${slug} - ${err}`);
                failed++;
            }
        } catch (err) {
            console.log(`❌ Error: ${slug} - ${err.message}`);
            failed++;
        }
    }

    console.log(`\n✨ Upload complete!`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Failed: ${failed}`);
    console.log(`   Not found: ${notFound}`);
}

main();
