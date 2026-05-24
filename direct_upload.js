import PocketBase from 'pocketbase';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pb = new PocketBase('http://127.0.0.1:8090');
const BROADCAST_SLUG = 'broadcasting-live';

const EXTERNAL_IMAGES = {
    'slider_1.jpg': 'https://images.unsplash.com/photo-1598550476439-cce86eb9a274?q=80&w=2070&auto=format&fit=crop',
    'desc_bg.jpg': 'https://images.unsplash.com/photo-1478720568477-152d9b164e63?q=80&w=2000&auto=format&fit=crop'
};

function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) return reject(new Error(res.statusMessage));
            const stream = fs.createWriteStream(filepath);
            res.pipe(stream);
            stream.on('finish', () => { stream.close(); resolve(); });
        }).on('error', reject);
    });
}

async function run() {
    try {
        console.log('Authenticating...');
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');
        const token = pb.authStore.token;

        const service = await pb.collection('services').getFirstListItem(`slug="${BROADCAST_SLUG}"`);
        console.log(`Service ID: ${service.id}`);

        const formData = new FormData();

        // Single test image
        const filename = 'slider_1.jpg';
        const url = EXTERNAL_IMAGES[filename];
        const tempPath = path.join(__dirname, filename);

        if (!fs.existsSync(tempPath)) await downloadImage(url, tempPath);

        const buffer = fs.readFileSync(tempPath);
        const blob = new Blob([buffer], { type: 'image/jpeg' });
        formData.append('images', blob, filename);

        console.log('Uploading via native fetch...');
        const res = await fetch(`http://127.0.0.1:8090/api/collections/services/records/${service.id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': token
            },
            body: formData
        });

        if (!res.ok) {
            const txt = await res.text();
            throw new Error(`Upload failed: ${res.status} ${txt}`);
        }

        const updated = await res.json();
        console.log('Upload success!', updated.images);

    } catch (e) {
        console.error(e);
    }
}

run();
