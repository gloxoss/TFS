"use client";

/**
 * Service Downloads Editor
 * 
 * Admin UI for managing downloadable files (PDFs, specs) on a service.
 * Files are uploaded directly to the service record's `download_files` field.
 * The `downloads` JSON field stores metadata (title, url, category) referencing those files.
 */

import { useState, useRef } from "react";
import { usePocketBase } from "@/components/pocketbase-provider";
import { uploadServiceFile } from "@/lib/actions/service-files";
import {
    Save, Download, Plus, Trash2, FileText, Upload,
    ChevronDown, ChevronRight, GripVertical, ExternalLink,
    FolderPlus
} from "lucide-react";
import { useSuccessToast, useErrorToast } from "@/stores/useUIStore";
import { useRouter } from "next/navigation";
import type { ServiceDownload } from "@/services/services/interface";
import { cn } from "@/lib/utils";
import { PB_URL } from "@/lib/pocketbase/config";

/** Resolve a download URL: filenames → full PB URL, full URLs → passthrough */
function resolveDownloadUrl(url: string, serviceId: string): string {
    if (!url || !url.trim()) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) return url;
    return `${PB_URL}/api/files/services/${serviceId}/${url}`;
}

interface ServiceDownloadsEditorProps {
    serviceId: string;
    serviceName: string;
    initialDownloads: ServiceDownload[];
}

export default function ServiceDownloadsEditor({
    serviceId,
    serviceName,
    initialDownloads
}: ServiceDownloadsEditorProps) {
    const pb = usePocketBase();
    const successToast = useSuccessToast();
    const errorToast = useErrorToast();
    const router = useRouter();

    const [downloads, setDownloads] = useState<ServiceDownload[]>(initialDownloads || []);
    const [saving, setSaving] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [showAddCategory, setShowAddCategory] = useState(false);

    const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

    // Group downloads by category
    const groupedDownloads = downloads.reduce((acc, download, index) => {
        const category = download.category || "Uncategorized";
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push({ ...download, _index: index });
        return acc;
    }, {} as Record<string, (ServiceDownload & { _index: number })[]>);

    const categories = Object.keys(groupedDownloads);

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    // Add new category with first item
    const handleAddCategory = () => {
        if (!newCategoryName.trim()) return;

        const newDownload: ServiceDownload = {
            title: "New Item",
            url: "",
            category: newCategoryName.trim(),
        };

        setDownloads([...downloads, newDownload]);
        setExpandedCategories(prev => ({ ...prev, [newCategoryName.trim()]: true }));
        setNewCategoryName("");
        setShowAddCategory(false);
    };

    // Add item to existing category
    const handleAddItem = (category: string) => {
        const newDownload: ServiceDownload = {
            title: "New Item",
            url: "",
            category,
        };
        setDownloads([...downloads, newDownload]);
    };

    // Update item field
    const handleUpdateItem = (index: number, field: keyof ServiceDownload, value: string) => {
        const newDownloads = [...downloads];
        newDownloads[index] = { ...newDownloads[index], [field]: value };
        setDownloads(newDownloads);
    };

    // Remove item
    const handleRemoveItem = (index: number) => {
        setDownloads(downloads.filter((_, i) => i !== index));
    };

    // Upload file to service record's download_files field
    const handleUpload = async (file: File, index: number) => {
        setUploadingIndex(index);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const result = await uploadServiceFile(serviceId, formData);

            if (!result.success) {
                throw new Error(result.error || 'Upload failed');
            }

            if (!result.url) {
                throw new Error('Upload succeeded but no file URL was returned');
            }

            handleUpdateItem(index, 'url', result.url);

            // Auto-fill title if still the default
            if (downloads[index]?.title === 'New Item') {
                const cleanName = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
                handleUpdateItem(index, 'title', cleanName);
            }

            successToast(`Uploaded ${file.name}`);
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : 'Failed to upload file';
            errorToast(msg);
        } finally {
            setUploadingIndex(null);
        }
    };

    // Save to database
    const handleSave = async () => {
        try {
            setSaving(true);
            await pb.collection('services').update(serviceId, {
                downloads: downloads
            });
            successToast("Downloads saved successfully");
            router.refresh();
        } catch (error) {
            console.error("Save error:", error);
            errorToast("Failed to save changes");
        } finally {
            setSaving(false);
        }
    };

    // Stats
    const totalItems = downloads.length;
    const linkedItems = downloads.filter(d => d.url && d.url.trim()).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between sticky top-4 z-10 bg-zinc-950/90 backdrop-blur-md p-4 -mx-4 rounded-xl border border-white/10 shadow-lg">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Download className="w-6 h-6 text-red-500" />
                        {serviceName} Downloads
                    </h2>
                    <p className="text-sm text-zinc-400 mt-1">
                        {linkedItems}/{totalItems} items have PDF links
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save className="w-4 h-4" />
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            {/* Add Category Button */}
            <div className="flex gap-2">
                {showAddCategory ? (
                    <div className="flex gap-2 flex-1">
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Category name..."
                            className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                        />
                        <button
                            onClick={handleAddCategory}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                        >
                            Add
                        </button>
                        <button
                            onClick={() => setShowAddCategory(false)}
                            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowAddCategory(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors"
                    >
                        <FolderPlus className="w-4 h-4" />
                        Add Category
                    </button>
                )}
            </div>

            {/* Categories */}
            <div className="space-y-4">
                {categories.length === 0 ? (
                    <div className="p-12 text-center text-zinc-500 bg-zinc-900/50 rounded-xl border border-zinc-800 border-dashed">
                        <Download className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <h3 className="text-lg font-medium text-zinc-300">No Downloads Yet</h3>
                        <p className="mt-2 text-sm">
                            Add a category to start organizing your downloadable files.
                        </p>
                    </div>
                ) : (
                    categories.map((category) => {
                        const items = groupedDownloads[category];
                        const isExpanded = expandedCategories[category] !== false; // Default expanded
                        const filledCount = items.filter(i => i.url && i.url.trim()).length;

                        return (
                            <div
                                key={category}
                                className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/30"
                            >
                                {/* Category Header */}
                                <button
                                    onClick={() => toggleCategory(category)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        {isExpanded ? (
                                            <ChevronDown className="w-5 h-5 text-zinc-500" />
                                        ) : (
                                            <ChevronRight className="w-5 h-5 text-zinc-500" />
                                        )}
                                        <span className="font-semibold text-white">{category}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={cn(
                                            "text-xs px-2 py-1 rounded-full border",
                                            filledCount === items.length
                                                ? "bg-green-500/10 text-green-400 border-green-500/30"
                                                : "bg-zinc-800 text-zinc-400 border-zinc-700"
                                        )}>
                                            {filledCount}/{items.length} linked
                                        </span>
                                    </div>
                                </button>

                                {/* Items */}
                                {isExpanded && (
                                    <div className="border-t border-zinc-800">
                                        {items.map((item) => (
                                            <div
                                                key={item._index}
                                                className="flex items-center gap-3 p-4 border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/30 transition-colors"
                                            >
                                                {/* Drag Handle */}
                                                <GripVertical className="w-4 h-4 text-zinc-600 cursor-move" />

                                                {/* File Icon */}
                                                <div className={cn(
                                                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                                                    item.url ? "bg-red-500/10" : "bg-zinc-800"
                                                )}>
                                                    <FileText className={cn(
                                                        "w-5 h-5",
                                                        item.url ? "text-red-500" : "text-zinc-500"
                                                    )} />
                                                </div>

                                                {/* Title Input */}
                                                <input
                                                    type="text"
                                                    value={item.title}
                                                    onChange={(e) => handleUpdateItem(item._index, 'title', e.target.value)}
                                                    className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-red-500"
                                                    placeholder="Item title..."
                                                />

                                                {/* URL Input */}
                                                <input
                                                    type="text"
                                                    value={item.url}
                                                    onChange={(e) => handleUpdateItem(item._index, 'url', e.target.value)}
                                                    className="w-64 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-red-500"
                                                    placeholder="PDF URL or upload..."
                                                />

                                                {/* Upload Button */}
                                                <input
                                                    type="file"
                                                    ref={(el) => { fileInputRefs.current[item._index] = el }}
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) handleUpload(file, item._index);
                                                    }}
                                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.webp"
                                                    className="hidden"
                                                />
                                                <button
                                                    onClick={() => fileInputRefs.current[item._index]?.click()}
                                                    disabled={uploadingIndex === item._index}
                                                    className={cn(
                                                        "p-2 rounded-lg transition-colors",
                                                        uploadingIndex === item._index
                                                            ? "bg-zinc-700 text-zinc-400"
                                                            : "bg-zinc-800 hover:bg-zinc-700 text-white"
                                                    )}
                                                    title="Upload file"
                                                >
                                                    {uploadingIndex === item._index ? (
                                                        <div className="w-5 h-5 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
                                                    ) : (
                                                        <Upload className="w-5 h-5" />
                                                    )}
                                                </button>

                                                {/* Preview Link */}
                                                {item.url && (
                                                    <a
                                                        href={resolveDownloadUrl(item.url, serviceId)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-colors"
                                                        title="Preview"
                                                    >
                                                        <ExternalLink className="w-5 h-5" />
                                                    </a>
                                                )}

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleRemoveItem(item._index)}
                                                    className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-500 hover:text-red-500 transition-colors"
                                                    title="Remove item"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}

                                        {/* Add Item Button */}
                                        <button
                                            onClick={() => handleAddItem(category)}
                                            className="w-full flex items-center justify-center gap-2 p-3 text-zinc-500 hover:text-white hover:bg-zinc-800/50 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Item
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
