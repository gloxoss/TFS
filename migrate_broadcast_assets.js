import PocketBase from 'pocketbase';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pb = new PocketBase('http://127.0.0.1:8090');
pb.autoCancellation(false);

const BROADCAST_SLUG = 'broadcasting-live';

// Placeholder Images to Download
const EXTERNAL_IMAGES = {
    'slider_1.jpg': 'https://images.unsplash.com/photo-1598550476439-cce86eb9a274?q=80&w=2070&auto=format&fit=crop',
    'slider_2.jpg': 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2070&auto=format&fit=crop',
    'slider_3.jpg': 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2070&auto=format&fit=crop',
    'slider_4.jpg': 'https://images.unsplash.com/photo-1534354226-224855866164?q=80&w=2072&auto=format&fit=crop',
    'desc_bg.jpg': 'https://images.unsplash.com/photo-1478720568477-152d9b164e63?q=80&w=2000&auto=format&fit=crop'
};

// Local SVGs to Upload
const SVG_DIR = path.join(__dirname, 'web', 'public', 'svg');

function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`Failed to fetch ${url}: ${res.statusCode}`));
                return;
            }
            const fileStream = fs.createWriteStream(filepath);
            res.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close();
                resolve(filepath);
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => { }); // Delete the file async. (But we don't check for this)
            reject(err);
        });
    });
}

async function migrateAssets() {
    try {
        console.log('Authenticating...');
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');
        console.log('Authenticated.');

        const service = await pb.collection('services').getFirstListItem(`slug="${BROADCAST_SLUG}"`)
            .catch(e => { console.error('Service lookup failed:', e.message); return null; });

        if (!service) {
            console.error(`Service "${BROADCAST_SLUG}" not found.`);
            return;
        }
        console.log(`Found service: ${service.id}`);

        // 1. Prepare files for upload
        const formData = new FormData();

        // Download and append external images
        console.log('Downloading external images...');
        for (const [filename, url] of Object.entries(EXTERNAL_IMAGES)) {
            const tempPath = path.join(__dirname, filename);
            if (!fs.existsSync(tempPath)) {
                await downloadImage(url, tempPath);
            }
            // Use openAsBlob if available, else read file
            let blob;
            if (typeof fs.openAsBlob === 'function') {
                blob = await fs.openAsBlob(tempPath);
            } else {
                blob = new Blob([fs.readFileSync(tempPath)]);
            }
            formData.append('images', blob, filename);
            console.log(`Prepared ${filename}`);
        }

        // Append local SVGs
        console.log('Reading local SVGs...');
        if (fs.existsSync(SVG_DIR)) {
            const svgFiles = fs.readdirSync(SVG_DIR).filter(f => f.endsWith('.svg'));
            for (const file of svgFiles) {
                const filePath = path.join(SVG_DIR, file);
                let blob;
                if (typeof fs.openAsBlob === 'function') {
                    blob = await fs.openAsBlob(filePath);
                } else {
                    blob = new Blob([fs.readFileSync(filePath)]);
                }
                formData.append('images', blob, file);
                console.log(`Prepared ${file}`);
            }
        } else {
            console.warn(`SVG directory not found at ${SVG_DIR}`);
        }

        // 2. Upload files
        console.log('Uploading files to PocketBase...');
        const updatedService = await pb.collection('services').update(service.id, formData);
        console.log('Files uploaded successfully.');

        // 3. Update Sections JSON to reference new filenames
        console.log('Updating sections with new filenames...');
        const sections = service.sections || [];
        const uploadedImages = updatedService.images || [];

        // Helper to find uploaded filename that matches our intended name (approx)
        const findImage = (partialName) => uploadedImages.find(img => img.includes(partialName) || img === partialName);

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
                // We uploaded them with original names, e.g. "CAF.svg"
                // PB might have renamed them to "CAF_abcdef.svg"
                // We should match by original base name if possible or just inclusion
                const svgs = uploadedImages.filter(img => img.toLowerCase().endsWith('.svg'));
                return {
                    ...section,
                    images: svgs
                };
            }
            return section;
        });

        // 4. Save updated sections
        await pb.collection('services').update(service.id, {
            sections: newSections
        });

        console.log('Migration complete!');

        // Clean up temp files
        for (const filename of Object.keys(EXTERNAL_IMAGES)) {
            const tempPath = path.join(__dirname, filename);
            if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        }

    } catch (error) {
        console.error('Migration failed:', error);
        // Clean up temp files even on error
        for (const filename of Object.keys(EXTERNAL_IMAGES)) {
            const tempPath = path.join(__dirname, filename);
            if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        }
    }
}

migrateAssets();
