/**
 * Fix Broadcast Sections
 * 
 * Detects if 'sections' field is corrupted (byte array) and fixes it.
 * Also ensures downloads section is seeded correctly.
 */

const PocketBase = require('pocketbase/cjs');

const pb = new PocketBase('http://127.0.0.1:8090');

// Admin credentials
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || 'admin@tfs.ma';
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD || 'adminpassword';

// Equipment data to ensure is present
const downloadsCategories = [
    {
        category: "OBVAN & Mobile Regie",
        items: [
            { title: "OBVAN 20 cameras Full HD", file: "" },
            { title: "OBVAN 16 cameras Full HD", file: "" },
            { title: "Mobil regie 8 cameras 4/HDR UHD", file: "" },
            { title: "Mobil regie 30 cameras Full HD", file: "" },
            { title: "Mobil regie 20 cameras Full HD", file: "" },
            { title: "Mobil regie 15 cameras Full HD", file: "" },
            { title: "Mobil regie 10 cameras Full HD", file: "" },
            { title: "Mobil regie 5 cameras Full HD", file: "" }
        ]
    },
    {
        category: "Special cameras",
        items: [
            { title: "PTZ", file: "" },
            { title: "Compact cameras", file: "" }
        ]
    },
    {
        category: "Cranes",
        items: [
            { title: "Crane Telescop Moviebird 45", file: "" },
            { title: "Crane Panther Pegasus 14m", file: "" },
            { title: "Crane Egripment Javelin 12,2m", file: "" },
            { title: "Crane Movietech Felix", file: "" },
            { title: "Crane ABC 120 12m", file: "" },
            { title: "Crane Jimmy Jib 12m", file: "" }
        ]
    },
    {
        category: "Steadicam's",
        items: [
            { title: "MK-V", file: "" },
            { title: "Arri Artemis 2", file: "" },
            { title: "Arri Trinity", file: "" }
        ]
    },
    {
        category: "Interphonie",
        items: [
            { title: "Intercom Riedel Bolero", file: "" },
            { title: "Intercom Clear-Com", file: "" },
            { title: "Matrix Riedel 64x64", file: "" },
            { title: "Talkies Walkies", file: "" },
            { title: "In-Ear", file: "" }
        ]
    },
    {
        category: "Others",
        items: [
            { title: "Spidercam", file: "" },
            { title: "Cablecam", file: "" },
            { title: "Speedcam", file: "" },
            { title: "Electro Moto", file: "" },
            { title: "Agito", file: "" }
        ]
    }
];

async function fixBroadcast() {
    try {
        console.log('🔐 Authenticating...');
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);

        console.log('🔍 Finding Broadcast service...');
        const services = await pb.collection('services').getList(1, 1, {
            filter: 'slug ~ "broadcast"'
        });

        if (services.items.length === 0) {
            console.error('❌ Broadcast service not found!');
            return;
        }

        const broadcast = services.items[0];
        console.log(`✅ Found: ${broadcast.title}`);

        let sections = broadcast.sections;
        console.log('📦 Current sections type:', typeof sections);
        console.log('📦 Is array:', Array.isArray(sections));

        // Detect if sections is a byte array (array of numbers)
        // Check if first element is a number
        if (Array.isArray(sections) && sections.length > 0 && typeof sections[0] === 'number') {
            console.log('⚠️ DETECTED BYTE ARRAY! Attempting to decode...');
            try {
                // Convert byte array to string
                const jsonString = String.fromCharCode(...sections);
                // Parse string to object
                sections = JSON.parse(jsonString);
                console.log('✅ Successfully decoded sections from bytes.');
            } catch (e) {
                console.error('❌ Failed to decode byte array:', e.message);
                // Fallback: reset sections if decoding fails
            }
        }

        // Ensure sections is an array of objects
        if (!Array.isArray(sections) || (sections.length > 0 && typeof sections[0] === 'number')) {
            console.log('⚠️ Sections still invalid, resetting to empty array.');
            sections = [];
        }

        // Now ensure downloads section exists and is updated
        const downloadsIndex = sections.findIndex(s => s.type === 'downloads_categorized');

        const downloadsSection = {
            type: 'downloads_categorized',
            title: 'Equipment & Specifications',
            categories: downloadsCategories
        };

        if (downloadsIndex >= 0) {
            console.log('📝 Updating existing downloads section...');
            sections[downloadsIndex] = downloadsSection;
        } else {
            console.log('➕ Adding new downloads section...');
            sections.push(downloadsSection);
        }

        // Update the record
        // IMPORTANT: stringify? NO, pass object directly.
        // But sanitize it just in case
        const cleanSections = JSON.parse(JSON.stringify(sections));

        await pb.collection('services').update(broadcast.id, {
            sections: cleanSections
        });

        console.log('✅ Broadcast sections fixed and updated successfully!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

fixBroadcast();
