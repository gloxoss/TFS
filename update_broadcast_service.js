import PocketBase from 'pocketbase';
import fs from 'fs';
import path from 'path';

const pb = new PocketBase('http://127.0.0.1:8090');

const BROADCAST_SLUG = 'broadcasting-live';

// IMAGES FOR SLIDER (Background)
const SLIDER_IMAGES = [
    'https://images.unsplash.com/photo-1598550476439-cce86eb9a274?q=80&w=2070&auto=format&fit=crop', // Camera
    'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2070&auto=format&fit=crop', // Lens
    'https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2070&auto=format&fit=crop', // Control
    'https://images.unsplash.com/photo-1534354226-224855866164?q=80&w=2072&auto=format&fit=crop'  // Lights
];

// PDF DOWNLOADS HIERARCHY
const DOWNLOAD_CATEGORIES = [
    {
        category: "OBVAN & Mobile Regie",
        items: [
            { title: "OBVAN 20 cameras Full HD", file: "obvan_20.pdf" },
            { title: "OBVAN 16 cameras Full HD", file: "obvan_16.pdf" },
            { title: "Mobil regie 8 cameras 4/HDR UHD", file: "mobile_8_4k.pdf" },
            { title: "Mobil regie 30 cameras Full HD", file: "mobile_30.pdf" },
            { title: "Mobil regie 20 cameras Full HD", file: "mobile_20.pdf" },
            { title: "Mobil regie 15 cameras Full HD", file: "mobile_15.pdf" },
            { title: "Mobil regie 10 cameras Full HD", file: "mobile_10.pdf" },
            { title: "Mobil regie 5 cameras Full HD", file: "mobile_5.pdf" }
        ]
    },
    {
        category: "Special cameras",
        items: [
            { title: "PTZ", file: "ptz.pdf" },
            { title: "Compact cameras", file: "compact_cameras.pdf" }
        ]
    },
    {
        category: "Cranes",
        items: [
            { title: "Crane Telescop Moviebird 45", file: "crane_moviebird.pdf" },
            { title: "Crane Panther Pegasus 14m", file: "crane_panther.pdf" },
            { title: "Crane Egripment Javelin 12,2m", file: "crane_javelin.pdf" },
            { title: "Crane Movietech Felix ?", file: "crane_movietech.pdf" },
            { title: "Crane ABC 120 12m", file: "crane_abc.pdf" },
            { title: "Crane Jimmy Jib 12m", file: "crane_jimmy.pdf" }
        ]
    },
    {
        category: "Steadicam's",
        items: [
            { title: "MK-V", file: "steadicam_mkv.pdf" },
            { title: "Arri Artemis 2", file: "steadicam_artemis.pdf" },
            { title: "Arri Trinity", file: "steadicam_trinity.pdf" }
        ]
    },
    {
        category: "Interphonie",
        items: [
            { title: "Intercom Riedel Bolero", file: "" }, // No PDF explicitly mentioned for these but keeping consistent
            { title: "Intercom Clear-Com", file: "" },
            { title: "Matrix Riedel 64x64", file: "" },
            { title: "Talkies Walkies", file: "" },
            { title: "In-Ear", file: "" }
        ]
    },
    {
        category: "Others",
        items: [
            { title: "Spidercam", file: "spidercam.pdf" },
            { title: "Cablecam", file: "cablecam.pdf" },
            { title: "Speedcam", file: "speedcam.pdf" },
            { title: "Electro Moto", file: "electro_moto.pdf" },
            { title: "Agito", file: "agito.pdf" }
        ]
    }
];

// SVG PARTNERS (Mapping provided file names to potential public paths)
// NOTE: These need to be accessible via URL. For now using placeholder paths that assume they might be in public/svg or similar.
// Since I can't move files easily without `mv`, I will assume they are in `public/assets/logos` for now, or use absolute URLs if uploaded.
// Current strategy: Use the filenames, and we'll ensure they are served.
const PARTNERS = [
    'Association Maroc Culture.svg',
    'CAF.svg',
    'CCM.svg',
    'CHAINE 2M MAROC.svg',
    'FIFA.svg',
    'FRMA.svg',
    'SNRT.svg',
    'sorec.svg'
].map(name => `/svg/${name}`); // Assuming they are in public/svg

const BROADCAST_CONTENT = {
    title: 'Broadcast & Live Transmission',
    description: 'State-of-the-art broadcast solutions for global events.',
    sections: [
        // 1. HERO + SLIDER (Combined in UI, stored as 'hero_slider')
        {
            type: 'hero_slider',
            title: 'Broadcast & Live Transmission',
            description: 'State-of-the-art broadcast solutions for global events, ensuring seamless live transmission and high-quality production.',
            images: SLIDER_IMAGES
        },

        // 2. DESCRIPTION with Image Background
        {
            type: 'text_image_bg',
            title: 'BROADCASTING',
            content: `
                <p>We provide comprehensive broadcasting solutions that bridge the gap between live events and global audiences. Our technical expertise spans across satellite transmission, IP streaming, and complex multi-camera productions.</p>
                <p>From sports championships to large-scale corporate conferences, our mission is to deliver flawless visual experiences. We leverage cutting-edge technology to ensure that every frame transmitted is of the highest fidelity, low latency, and maximum reliability.</p>
                <p>Our team of seasoned engineers and creative directors work in unison to craft broadcasts that are not just seen, but felt. We handle the pressure of "live" with precision and calm professional execution.</p>
            `,
            image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e63?q=80&w=2000&auto=format&fit=crop' // Dark background image (camera/tech)
        },

        // 3. CATEGORIZED DOWNLOADS
        {
            type: 'downloads_categorized',
            title: 'Equipment & Specifications',
            categories: DOWNLOAD_CATEGORIES
        },

        // 4. PARTNERS (SVG Marquee)
        {
            type: 'partners_svg',
            title: 'Trusted Partners',
            images: PARTNERS
        },

        // 5. VIDEO (Coming Soon)
        {
            type: 'video_featured',
            title: 'Live in Action',
            video_url: '', // Empty to trigger "Coming Soon" or explicitly set state
            status: 'coming_soon'
        }
    ]
};


// --- ASSET MIGRATION LOGIC ---
import https from 'https';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES modules (already imported path above)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Placeholder Images to Download
const EXTERNAL_IMAGES = {
    'slider_1.jpg': 'https://images.unsplash.com/photo-1598550476439-cce86eb9a274?q=80&w=2070&auto=format&fit=crop',
    'slider_2.jpg': 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2070&auto=format&fit=crop',
    'slider_3.jpg': 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2070&auto=format&fit=crop',
    'slider_4.jpg': 'https://images.unsplash.com/photo-1534354226-224855866164?q=80&w=2072&auto=format&fit=crop',
    'desc_bg.jpg': 'https://images.unsplash.com/photo-1478720568477-152d9b164e63?q=80&w=2000&auto=format&fit=crop'
};

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
            fs.unlink(filepath, () => { });
            reject(err);
        });
    });
}

async function updateBroadcastService() { // Modified to include asset migration
    try {
        pb.autoCancellation(false); // Important for file uploads
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

        const service = await pb.collection('services').getFirstListItem(`slug="${BROADCAST_SLUG}"`).catch(() => null);

        if (!service) {
            console.error(`Service with slug "${BROADCAST_SLUG}" not found!`);
            return;
        }

        console.log(`Found service: ${service.title} (${service.id})`);

        // 1. Prepare files for upload
        const formData = new FormData();
        let hasFiles = false;

        // Download and append external images
        console.log('Downloading external images...');
        for (const [filename, url] of Object.entries(EXTERNAL_IMAGES)) {
            const tempPath = path.join(__dirname, filename);
            if (!fs.existsSync(tempPath)) {
                await downloadImage(url, tempPath);
            }

            let blob;
            if (typeof fs.openAsBlob === 'function') {
                blob = await fs.openAsBlob(tempPath);
            } else {
                blob = new Blob([fs.readFileSync(tempPath)]);
            }
            formData.append('images', blob, filename);
            hasFiles = true;
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
                hasFiles = true;
                console.log(`Prepared ${file}`);
            }
        }

        // 2. Upload files if any
        let updatedService = service;
        if (hasFiles) {
            console.log('Uploading files to PocketBase...');
            updatedService = await pb.collection('services').update(service.id, formData);
            console.log('Files uploaded successfully.');
        }

        // 3. Construct Sections with Filenames
        const uploadedImages = updatedService.images || [];
        const findImage = (partialName) => uploadedImages.find(img => img.includes(partialName) || img === partialName) || '';

        // Update content structure with resolved filenames
        const updatedContent = {
            ...BROADCAST_CONTENT,
            sections: BROADCAST_CONTENT.sections.map(section => {
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
                    const svgs = uploadedImages.filter(img => img.toLowerCase().endsWith('.svg'));
                    return {
                        ...section,
                        images: svgs
                    };
                }
                return section;
            })
        };

        // 4. Update Service Record
        await pb.collection('services').update(service.id, {
            title: updatedContent.title,
            briefDescription: updatedContent.description,
            sections: updatedContent.sections
        });

        console.log(`Successfully updated "${BROADCAST_SLUG}" with refined content and assets.`);

        // Clean up temp files
        for (const filename of Object.keys(EXTERNAL_IMAGES)) {
            const tempPath = path.join(__dirname, filename);
            if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        }

    } catch (error) {
        console.error('Error updating service:', error);
    }
}

updateBroadcastService();
