/**
 * Image Download & Upload Script for Equipment
 * 
 * This script:
 * 1. Fetches all equipment from PocketBase
 * 2. Downloads images from specs.image_url
 * 3. Uploads them as file attachments to the equipment record
 * 
 * Run with: node scripts/sync-equipment-images.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const PB_URL = 'http://127.0.0.1:8090';
const COLLECTION = 'equipment';
const TEMP_DIR = path.join(__dirname, 'temp_images');

// Global admin token
let ADMIN_TOKEN = null;

async function authenticate() {
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(`${PB_URL}/api/admins/auth-with-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identity: 'superadmin@example.com', password: 'SuperSecret123!' })
        });

        const data = await response.json();
        if (data.token) {
            ADMIN_TOKEN = data.token;
            console.log('🔑 Admin authenticated successfully');
            return true;
        } else {
            console.log('⚠️ Authentication failed:', data);
            return false;
        }
    } catch (err) {
        console.error('⚠️ Auth error:', err.message);
        return false;
    }
}

// Create temp directory
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Download image from URL
function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        if (!url || url.trim() === '') {
            reject(new Error('Empty URL'));
            return;
        }

        const protocol = url.startsWith('https') ? https : http;

        const request = protocol.get(url, {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        }, (response) => {
            // Handle redirects
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
                return;
            }

            if (response.statusCode !== 200) {
                reject(new Error(`HTTP ${response.statusCode}`));
                return;
            }

            const file = fs.createWriteStream(filepath);
            response.pipe(file);

            file.on('finish', () => {
                file.close();
                resolve(filepath);
            });

            file.on('error', (err) => {
                fs.unlink(filepath, () => { });
                reject(err);
            });
        });

        request.on('error', reject);
        request.on('timeout', () => {
            request.destroy();
            reject(new Error('Timeout'));
        });
    });
}

// Upload image to PocketBase
async function uploadImageToPocketBase(recordId, imagePath) {
    const FormData = (await import('form-data')).default;
    const fetch = (await import('node-fetch')).default;

    const form = new FormData();
    form.append('image', fs.createReadStream(imagePath));

    const headers = form.getHeaders();
    if (ADMIN_TOKEN) {
        headers['Authorization'] = ADMIN_TOKEN;
    }

    const response = await fetch(`${PB_URL}/api/collections/${COLLECTION}/records/${recordId}`, {
        method: 'PATCH',
        body: form,
        headers: headers
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Upload failed: ${response.status} - ${text}`);
    }

    return await response.json();
}

// Get extension from URL or content-type
function getExtension(url) {
    const urlPath = new URL(url).pathname;
    const ext = path.extname(urlPath).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
        return ext;
    }
    return '.jpg'; // Default
}

// Main function
async function main() {
    const fetch = (await import('node-fetch')).default;

    console.log('🚀 Starting equipment image sync...\n');

    await authenticate();

    // Fetch all equipment records
    let allRecords = [];
    let page = 1;
    const perPage = 100;

    while (true) {
        const response = await fetch(`${PB_URL}/api/collections/${COLLECTION}/records?page=${page}&perPage=${perPage}`);
        const data = await response.json();

        allRecords = allRecords.concat(data.items);

        if (data.items.length < perPage) break;
        page++;
    }

    console.log(`📦 Found ${allRecords.length} equipment records\n`);

    let downloaded = 0;
    let uploaded = 0;
    let skipped = 0;
    let failed = 0;

    for (const record of allRecords) {
        const name = record.name || record.id;

        // Skip if already has an image
        if (record.image && record.image.length > 0) {
            console.log(`⏭️  ${name} - already has image`);
            skipped++;
            continue;
        }

        // Get image URL from specs
        let imageUrl = null;
        try {
            const specs = typeof record.specs === 'string' ? JSON.parse(record.specs) : record.specs;
            imageUrl = specs?.image_url;
        } catch (e) { }

        if (!imageUrl || imageUrl.trim() === '') {
            console.log(`⚠️  ${name} - no image URL in specs`);
            skipped++;
            continue;
        }

        // Download image
        const ext = getExtension(imageUrl);
        const tempFile = path.join(TEMP_DIR, `${record.id}${ext}`);

        try {
            console.log(`⬇️  ${name} - downloading...`);
            await downloadImage(imageUrl, tempFile);
            downloaded++;

            // Upload to PocketBase
            console.log(`⬆️  ${name} - uploading...`);
            await uploadImageToPocketBase(record.id, tempFile);
            uploaded++;
            console.log(`✅ ${name} - done!\n`);

            // Clean up temp file
            fs.unlinkSync(tempFile);

            // Small delay to be nice to servers
            await new Promise(r => setTimeout(r, 200));

        } catch (err) {
            console.log(`❌ ${name} - failed: ${err.message}\n`);
            failed++;

            // Clean up on failure
            if (fs.existsSync(tempFile)) {
                fs.unlinkSync(tempFile);
            }
        }
    }

    // Cleanup temp directory
    try {
        fs.rmdirSync(TEMP_DIR);
    } catch (e) { }

    console.log('\n📊 Summary:');
    console.log(`   Downloaded: ${downloaded}`);
    console.log(`   Uploaded:   ${uploaded}`);
    console.log(`   Skipped:    ${skipped}`);
    console.log(`   Failed:     ${failed}`);
    console.log('\n🎉 Done!');
}

main().catch(console.error);
