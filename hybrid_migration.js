import PocketBase from 'pocketbase';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// import https from 'https'; // Removed to avoid potential conflicts
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pb = new PocketBase('http://127.0.0.1:8090');
const BROADCAST_SLUG = 'broadcasting-live';

const EXTERNAL_IMAGES = {
    'slider_1.jpg': 'https://images.unsplash.com/photo-1598550476439-cce86eb9a274?q=80&w=2070&auto=format&fit=crop',
    'slider_2.jpg': 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2070&auto=format&fit=crop',
    'slider_3.jpg': 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2070&auto=format&fit=crop',
    'slider_4.jpg': 'https://images.unsplash.com/photo-1534354226-224855866164?q=80&w=2072&auto=format&fit=crop',
    'desc_bg.jpg': 'https://images.unsplash.com/photo-1478720568477-152d9b164e63?q=80&w=2000&auto=format&fit=crop'
};

const SVG_DIR = path.join(__dirname, 'web', 'public', 'svg');

async function downloadImageWithCurl(url, filepath) {
    const absPath = path.resolve(filepath);
    const curlCmd = `curl.exe -L -o "${absPath}" "${url}"`;
    console.log(`Downloading: ${filenameFromUrl(url)} -> ${path.basename(filepath)}`);
    try {
        await execPromise(curlCmd);
    } catch (e) {
        console.error(`Download failed for ${url}:`, e.message);
        throw e;
    }
}

function filenameFromUrl(url) {
    return url.split('/').pop().split('?')[0];
}

async function uploadFileWithCurl(url, token, filepath, fieldName = 'images') {
    const absPath = path.resolve(filepath);
    // Use curl to upload
    const curlCmd = `curl.exe -X PATCH -H "Authorization: ${token}" -F "${fieldName}=@${absPath}" "${url}"`;

    console.log(`Uploading: ${path.basename(filepath)}`);
    try {
        const { stdout } = await execPromise(curlCmd);
        return JSON.parse(stdout);
    } catch (e) {
        console.error('Curl upload failed:', e.message);
        throw e;
    }
}

async function run() {
    try {
        console.log('Authenticating...');
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');
        const token = pb.authStore.token;
        console.log('Auth success.');

        const service = await pb.collection('services').getFirstListItem(`slug="${BROADCAST_SLUG}"`);
        console.log(`Service ID: ${service.id}`);
        const uploadUrl = `http://127.0.0.1:8090/api/collections/services/records/${service.id}`;

        // 1. Download & Upload External Images
        console.log('Processing external images...');
        for (const [filename, url] of Object.entries(EXTERNAL_IMAGES)) {
            const tempPath = path.join(__dirname, filename);
            if (!fs.existsSync(tempPath)) {
                await downloadImageWithCurl(url, tempPath);
            }
            await uploadFileWithCurl(uploadUrl, token, tempPath);
        }

        // 2. Upload SVGs
        console.log('Processing SVGs...');
        if (fs.existsSync(SVG_DIR)) {
            const svgFiles = fs.readdirSync(SVG_DIR).filter(f => f.endsWith('.svg'));
            for (const file of svgFiles) {
                const filePath = path.join(SVG_DIR, file);
                await uploadFileWithCurl(uploadUrl, token, filePath);
            }
        }

        // 3. Update JSON Metadata
        console.log('Refetching service to get new filenames...');
        const updatedService = await pb.collection('services').getOne(service.id);
        const uploadedImages = updatedService.images || [];

        const findImage = (partialName) => uploadedImages.find(img => img.includes(partialName) || img === partialName) || '';

        const sections = service.sections || [];
        const newSections = sections.map(section => {
            if (section.type === 'hero_slider') {
                return {
                    ...section,
                    images: [
                        findImage('slider_1'),
                        findImage('slider_2'),
                        findImage('slider_3'),
                        findImage('slider_4')
                    ].filter(Boolean)
                };
            }
            if (section.type === 'text_image_bg') {
                return {
                    ...section,
                    image: findImage('desc_bg')
                };
            }
            if (section.type === 'partners_svg') {
                // Find all SVGs in the uploaded list
                const svgs = uploadedImages.filter(img => img.toLowerCase().endsWith('.svg'));
                return {
                    ...section,
                    images: svgs
                };
            }
            return section;
        });

        await pb.collection('services').update(service.id, { sections: newSections });
        console.log('Migration Complete!');

        // Cleanup
        for (const filename of Object.keys(EXTERNAL_IMAGES)) {
            if (fs.existsSync(path.join(__dirname, filename))) fs.unlinkSync(path.join(__dirname, filename));
        }

    } catch (e) {
        console.error('Hybrid migration failed:', e);
    }
}

run();
