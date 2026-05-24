"use server";

import { createAdminClient } from "@/lib/pocketbase/server";

export interface ServiceItem {
    id: string;
    title: string;
    title_fr?: string;
    slug: string;
    is_active: boolean;
    display_order: number;
    template?: string;
    sub_services?: string | string[];
}

interface ServiceRecord {
    id: string;
    title: string;
    title_fr?: string;
    slug: string;
    is_active: boolean;
    display_order: number;
    template?: string;
    sub_services?: string;
}

export async function getServicesForNav(): Promise<ServiceItem[]> {
    try {
        const pb = await createAdminClient();
        const records = await pb.collection('services').getFullList<ServiceRecord>({
            sort: 'display_order',
            fields: 'id,title,title_fr,slug,is_active,display_order,template,sub_services',
        });

        return records
            .filter((r) => r.is_active !== false)
            .map((r) => ({
                id: r.id,
                title: r.title,
                title_fr: r.title_fr,
                slug: r.slug,
                is_active: r.is_active,
                display_order: r.display_order,
                template: r.template,
                sub_services: r.sub_services,
            }));
    } catch (error) {
        console.error('[getServicesForNav] Error:', error);
        return [];
    }
}

