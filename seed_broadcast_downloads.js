/**
 * Seed Broadcast Downloads
 * 
 * This script updates the Broadcast service's sections JSON with
 * the complete equipment downloads list.
 * 
 * Run with: node seed_broadcast_downloads.js
 */

const PocketBase = require('pocketbase/cjs');

const pb = new PocketBase('http://127.0.0.1:8090');

// Admin credentials - update these or use environment variables
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || 'admin@tfs.ma';
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD || 'adminpassword';

// Equipment data organized by category
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

async function seedBroadcastDownloads() {
    try {
        console.log('🔐 Authenticating as admin...');
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
        console.log('✅ Authenticated!');

        console.log('🔍 Finding Broadcast service...');

        // Find the broadcast service by slug
        const services = await pb.collection('services').getList(1, 50, {
            filter: 'slug ~ "broadcast"'
        });

        if (services.items.length === 0) {
            console.error('❌ Broadcast service not found!');
            return;
        }

        const broadcast = services.items[0];
        console.log(`✅ Found: ${broadcast.title} (ID: ${broadcast.id})`);

        // Get existing sections
        let sections = broadcast.sections || [];

        // Find or create downloads_categorized section
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

        // Update the service
        await pb.collection('services').update(broadcast.id, {
            sections: sections
        });

        console.log('✅ Broadcast downloads seeded successfully!');
        console.log(`📊 Total categories: ${downloadsCategories.length}`);
        console.log(`📊 Total items: ${downloadsCategories.reduce((acc, cat) => acc + cat.items.length, 0)}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.data) console.error('Details:', error.data);
    }
}

seedBroadcastDownloads();
