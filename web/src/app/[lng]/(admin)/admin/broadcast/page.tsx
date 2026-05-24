import { verifyPermission } from "@/services/auth/access-control";
import { PERMISSIONS } from "@/types/auth";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/pocketbase/server";
import ServiceDownloadsEditor from "@/components/admin/broadcast/service-downloads-editor";
import type { ServiceDownload } from "@/services/services/interface";

interface PageProps {
    params: Promise<{
        lng: string;
    }>;
}

export default async function AdminBroadcastPage({ params }: PageProps) {
    const { lng } = await params;

    // 1. Verify Permission
    const canView = await verifyPermission(PERMISSIONS.DOWNLOADS_VIEW);
    if (!canView) {
        redirect(`/${lng}/admin`);
    }

    // 2. Fetch Broadcast Service
    const pb = await createServerClient(false);
    let broadcastService = null;

    try {
        const records = await pb.collection('services').getList(1, 1, {
            filter: 'slug ~ "broadcast"'
        });
        if (records.items.length > 0) {
            broadcastService = records.items[0];
        }
    } catch (e) {
        console.error("Error fetching broadcast service:", e);
    }

    if (!broadcastService) {
        return (
            <div className="p-6 text-red-500 border border-red-500/20 bg-red-500/10 rounded-lg">
                Error: Broadcast service not found.
            </div>
        );
    }

    // Parse downloads field (JSON array)
    let downloads: ServiceDownload[] = [];
    try {
        if (typeof broadcastService.downloads === 'string') {
            downloads = JSON.parse(broadcastService.downloads);
        } else if (Array.isArray(broadcastService.downloads)) {
            downloads = broadcastService.downloads;
        }
    } catch (e) {
        console.error("Error parsing downloads:", e);
    }

    // 3. Render Editor
    return (
        <div className="max-w-6xl mx-auto pb-12">
            <ServiceDownloadsEditor
                serviceId={broadcastService.id}
                serviceName={broadcastService.title || "Broadcast"}
                initialDownloads={downloads}
            />
        </div>
    );
}
