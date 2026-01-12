/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Update cameras with local images and create kit templates for ALL cameras
 */
migrate((app) => {
    const EQUIPMENT_COLLECTION = "equipment";
    const IMAGES_DIR = "./camera_images";

    // Camera slug to image file mapping
    const cameraImages = {
        "arri-alexa-35": { main: "arri-alexa-35.jpg", gallery: ["arri-alexa-35_gallery_1.jpg"] },
        "sony-venice-2-8k": { main: "sony-venice-2-8k.jpg", gallery: [] },
        "arri-alexa-mini-lf": { main: "arri-alexa-mini-lf.jpg", gallery: ["arri-alexa-mini-lf_gallery_1.jpg"] },
        "arri-alexa-mini": { main: "arri-alexa-mini.jpg", gallery: [] },
        "arri-amira": { main: "arri-amira.jpg", gallery: [] },
        "panasonic-varicam-lt": { main: "panasonic-varicam-lt.jpg", gallery: [] },
        "sony-pxw-fx9": { main: "sony-pxw-fx9.jpg", gallery: [] },
        "sony-fx3": { main: "sony-fx3.jpg", gallery: [] },
        "sony-f55": { main: "sony-f55.jpg", gallery: [] },
        "dsmc2-monstro-8k": { main: "dsmc2-monstro-8k.jpg", gallery: [] }
    };

    // Helper function to load file from disk
    function loadLocalFile(filename) {
        try {
            const filepath = `${IMAGES_DIR}/${filename}`;
            const file = $filesystem.fileFromPath(filepath);
            return file;
        } catch (e) {
            console.log(`⚠️ Could not load: ${filename} - ${e}`);
            return null;
        }
    }

    // --- 1. Update cameras with images ---
    console.log("📷 [Update] Adding images to cameras...");

    for (const [slug, images] of Object.entries(cameraImages)) {
        try {
            const record = app.findFirstRecordByFilter(EQUIPMENT_COLLECTION, `slug = "${slug}"`);

            // Add main image
            const mainFile = loadLocalFile(images.main);
            if (mainFile) {
                record.set("image", mainFile);
            }

            // Add gallery images
            if (images.gallery.length > 0) {
                const galleryFiles = [];
                for (const galleryFile of images.gallery) {
                    const f = loadLocalFile(galleryFile);
                    if (f) galleryFiles.push(f);
                }
                if (galleryFiles.length > 0) {
                    record.set("images", galleryFiles);
                }
            }

            app.save(record);
            console.log(`✅ Updated image: ${slug}`);
        } catch (e) {
            console.log(`❌ Failed to update ${slug}: ${e}`);
        }
    }

    // --- 2. Create kit templates for ALL cameras (not just featured) ---
    console.log("\n🔧 [Kits] Creating kit templates for all cameras...");

    // Get cameras category
    let camerasCategory;
    try {
        camerasCategory = app.findFirstRecordByFilter("categories", `slug = "cameras"`);
    } catch (e) {
        console.log("❌ Cameras category not found!");
        return;
    }

    // Get all cameras
    const cameras = app.findRecordsByFilter(EQUIPMENT_COLLECTION, `category = "${camerasCategory.id}"`);
    console.log(`Found ${cameras.length} cameras`);

    // Get all non-camera categories for slots
    const allCategories = app.findRecordsByFilter("categories", `slug != "cameras"`);

    const templatesCol = app.findCollectionByNameOrId("kit_templates");
    const slotsCol = app.findCollectionByNameOrId("kit_slots");

    for (const camera of cameras) {
        const cameraName = camera.get("name");
        const cameraId = camera.id;
        const templateName = `${cameraName} Production Package`;

        // Check if template already exists
        try {
            app.findFirstRecordByFilter("kit_templates", `name = "${templateName}"`);
            console.log(`⏭️ Template exists: ${templateName}`);
            continue;
        } catch (e) {
            // Template doesn't exist, create it
        }

        // Create the template
        const template = new Record(templatesCol);
        template.set("name", templateName);
        template.set("main_product_id", cameraId);
        template.set("base_price_modifier", 0);
        template.set("description", `Complete production package for the ${cameraName}.`);
        app.save(template);
        console.log(`✅ Created template: ${templateName}`);

        // Create slots for each non-camera category
        let displayOrder = 1;
        for (const cat of allCategories) {
            const catName = cat.get("name");
            const catId = cat.id;

            try {
                const slot = new Record(slotsCol);
                slot.set("template_id", template.id);
                slot.set("category_id", catId);
                slot.set("slot_name", catName);
                slot.set("recommended_ids", []);
                slot.set("display_order", displayOrder++);
                app.save(slot);
            } catch (err) {
                console.log(`   ⚠️ Failed to create slot ${catName}: ${err}`);
            }
        }
        console.log(`   ➕ Created ${allCategories.length} slots`);
    }

    console.log("\n✅ [Migration] Camera images and kits updated!");

}, (app) => {
    // Down migration - remove templates we created
    console.log("[Rollback] This would require manual cleanup");
});
