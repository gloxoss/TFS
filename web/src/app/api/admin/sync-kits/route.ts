/**
 * Admin API: Sync Kits
 * 
 * Fallback endpoint to sync equipment with kit slots.
 * Call this manually or on schedule if the PocketBase hook fails.
 * 
 * GET /api/admin/sync-kits - Run full sync
 * POST /api/admin/sync-kits - Sync single equipment by ID
 */

import { NextRequest, NextResponse } from 'next/server';
import { syncKitSlots, syncSingleEquipment } from '@/lib/kit-sync';

export async function GET() {
    try {
        console.log('📦 [API] Starting kit sync...');
        const result = await syncKitSlots();

        console.log(`✅ [API] Sync complete: ${result.equipmentProcessed} items, ${result.slotsUpdated} slots updated, ${result.templatesCreated} templates created`);

        return NextResponse.json({
            success: result.success,
            message: `Processed ${result.equipmentProcessed} equipment items`,
            slotsUpdated: result.slotsUpdated,
            templatesCreated: result.templatesCreated,
            errors: result.errors.length > 0 ? result.errors : undefined
        });
    } catch (error) {
        console.error('❌ [API] Sync failed:', error);
        return NextResponse.json(
            { success: false, error: 'Sync failed' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { equipmentId } = body;

        if (!equipmentId) {
            return NextResponse.json(
                { success: false, error: 'equipmentId required' },
                { status: 400 }
            );
        }

        console.log(`📦 [API] Syncing single equipment: ${equipmentId}`);
        const result = await syncSingleEquipment(equipmentId);

        return NextResponse.json({
            success: result.success,
            slotsUpdated: result.slotsUpdated,
            errors: result.errors.length > 0 ? result.errors : undefined
        });
    } catch (error) {
        console.error('❌ [API] Single sync failed:', error);
        return NextResponse.json(
            { success: false, error: 'Sync failed' },
            { status: 500 }
        );
    }
}
