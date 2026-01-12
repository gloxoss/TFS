/**
 * Kit Sync Utility
 * 
 * Fallback mechanism to sync equipment with kit slots.
 * Can be called manually or on schedule to catch any items 
 * the PocketBase hook missed.
 */

import { createAdminClient } from '@/lib/pocketbase/server';

// Category to slot keyword mapping
const CATEGORY_SLOT_MAP: Record<string, string> = {
    'lenses': 'lens',
    'monitors': 'monitor',
    'wireless video': 'wireless',
    'power': 'power',
    'grip & support': 'support',
    'batteries': 'power'
};

export interface SyncResult {
    success: boolean;
    equipmentProcessed: number;
    slotsUpdated: number;
    templatesCreated: number;
    errors: string[];
}

/**
 * Syncs all equipment to kit slots based on category
 * Idempotent - safe to run multiple times
 */
export async function syncKitSlots(): Promise<SyncResult> {
    const result: SyncResult = {
        success: true,
        equipmentProcessed: 0,
        slotsUpdated: 0,
        templatesCreated: 0,
        errors: []
    };

    try {
        const pb = await createAdminClient();

        // Fetch all equipment
        const equipment = await pb.collection('equipment').getFullList({
            expand: 'category'
        });

        // Fetch all kit slots
        const kitSlots = await pb.collection('kit_slots').getFullList();

        // Fetch all categories for lookup
        const categories = await pb.collection('categories').getFullList();
        const categoryMap = new Map(categories.map(c => [c.id, c.name?.toLowerCase() || '']));

        // Fetch existing templates
        const templates = await pb.collection('kit_templates').getFullList();
        const templateNames = new Set(templates.map(t => t.name));

        // Reverse map for slug/name lookup
        const categoryIdMap = new Map(categories.map(c => [
            (c.slug || c.name || '').toLowerCase(),
            c.id
        ]));

        for (const item of equipment) {
            result.equipmentProcessed++;

            const categoryId = item.category;
            const categoryName = categoryMap.get(categoryId) || '';
            const slotKeyword = CATEGORY_SLOT_MAP[categoryName];

            // Handle cameras - create kit template if featured
            if (categoryName === 'cameras' && item.is_featured) {
                const templateName = `${item.name} Production Package`;
                let templateId: string | null = null;

                // 1. Ensure Template Exists
                if (!templateNames.has(templateName)) {
                    try {
                        const newTemplate = await pb.collection('kit_templates').create({
                            name: templateName,
                            main_product_id: item.id,
                            base_price_modifier: 0,
                            description: `Complete production package for the ${item.name}. Customize with lenses, monitors, and accessories.`
                        });
                        result.templatesCreated++;
                        templateNames.add(templateName);
                        templateId = newTemplate.id;
                    } catch (err) {
                        result.errors.push(`Template creation failed for ${item.name}: ${err}`);
                    }
                } else {
                    const tmpl = templates.find(t => t.name === templateName);
                    if (tmpl) templateId = tmpl.id;
                }

                // 2. Ensure Default Slots Exist (Self-Healing, Dynamic)
                if (templateId) {
                    const existingTemplateSlots = kitSlots.filter(s => s.template_id === templateId);
                    const existingSlotNames = new Set(existingTemplateSlots.map(s => s.slot_name));

                    // Get potential slots from ALL categories (except cameras)
                    const potentialSlots = categories.filter(c => {
                        const slug = (c.slug || c.name || '').toLowerCase();
                        return slug !== 'cameras';
                    });

                    // Determine next display order
                    let nextDisplayOrder = existingTemplateSlots.length > 0
                        ? Math.max(...existingTemplateSlots.map(s => s.display_order || 0)) + 1
                        : 1;

                    for (const cat of potentialSlots) {
                        const catName = cat.name || 'Unknown';

                        if (!existingSlotNames.has(catName)) {
                            try {
                                const newSlot = await pb.collection('kit_slots').create({
                                    template_id: templateId,
                                    category_id: cat.id,
                                    slot_name: catName,
                                    recommended_ids: [],
                                    display_order: nextDisplayOrder++
                                });
                                kitSlots.push(newSlot); // Update local cache
                                result.slotsUpdated++;
                            } catch (err) {
                                result.errors.push(`Slot creation failed for ${catName} on ${templateName}: ${err}`);
                            }
                        }
                    }
                }
            }

            // Add to relevant kit slots
            if (slotKeyword) {
                for (const slot of kitSlots) {
                    const slotName = (slot.slot_name || '').toLowerCase();

                    if (slotName.includes(slotKeyword)) {
                        const existingIds: string[] = slot.recommended_ids || [];

                        if (!existingIds.includes(item.id)) {
                            try {
                                await pb.collection('kit_slots').update(slot.id, {
                                    recommended_ids: [...existingIds, item.id]
                                });
                                result.slotsUpdated++;
                            } catch (err) {
                                result.errors.push(`Slot update failed for ${item.name}: ${err}`);
                            }
                        }
                    }
                }
            }
        }
    } catch (err) {
        result.success = false;
        result.errors.push(`Sync failed: ${err}`);
    }

    return result;
}

/**
 * Syncs a single equipment item to kit slots
 * Useful for testing or manual triggering
 */
export async function syncSingleEquipment(equipmentId: string): Promise<SyncResult> {
    const result: SyncResult = {
        success: true,
        equipmentProcessed: 1,
        slotsUpdated: 0,
        templatesCreated: 0,
        errors: []
    };

    try {
        const pb = await createAdminClient();

        const item = await pb.collection('equipment').getOne(equipmentId, {
            expand: 'category'
        });

        const categories = await pb.collection('categories').getFullList();
        const categoryMap = new Map(categories.map(c => [c.id, c.name?.toLowerCase() || '']));

        const categoryName = categoryMap.get(item.category) || '';
        const slotKeyword = CATEGORY_SLOT_MAP[categoryName];

        if (slotKeyword) {
            const kitSlots = await pb.collection('kit_slots').getFullList();

            for (const slot of kitSlots) {
                const slotName = (slot.slot_name || '').toLowerCase();

                if (slotName.includes(slotKeyword)) {
                    const existingIds: string[] = slot.recommended_ids || [];

                    if (!existingIds.includes(item.id)) {
                        await pb.collection('kit_slots').update(slot.id, {
                            recommended_ids: [...existingIds, item.id]
                        });
                        result.slotsUpdated++;
                    }
                }
            }
        }
    } catch (err) {
        result.success = false;
        result.errors.push(`Sync failed: ${err}`);
    }

    return result;
}
