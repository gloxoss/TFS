"use client";

import { useState } from "react";
import { usePocketBase } from "@/components/pocketbase-provider";
import { uploadServiceFile } from "@/lib/actions/service-files";
import { Save, Download, ChevronDown, ChevronRight, FileText, ExternalLink, Upload } from "lucide-react";
import { ServiceSection } from "@/services/services/interface";
import { useSuccessToast, useErrorToast } from "@/stores/useUIStore";
import { useRouter } from "next/navigation";

interface DownloadsEditorProps {
    serviceId: string;
    initialSections: ServiceSection[];
}

export default function DownloadsEditor({ serviceId, initialSections }: DownloadsEditorProps) {
    const pb = usePocketBase();
    const successToast = useSuccessToast();
    const errorToast = useErrorToast();
    const router = useRouter();
    const [sections, setSections] = useState<ServiceSection[]>(initialSections);
    const [saving, setSaving] = useState(false);

    // Find the downloads section index
    const downloadsIndex = sections.findIndex(s => s.type === 'downloads_categorized');
    const downloadsSection = downloadsIndex !== -1 ? sections[downloadsIndex] : null;

    // Local state for expanded categories in the UI
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

    const [uploadingState, setUploadingState] = useState<Record<string, boolean>>({});

    const toggleCategory = (catIdx: number) => {
        setExpandedCategories(prev => ({
            ...prev,
            [catIdx]: !prev[catIdx]
        }));
    };

    const handleUrlChange = (catIdx: number, itemIdx: number, newUrl: string) => {
        if (!downloadsSection || !downloadsSection.categories) return;

        const newSections = [...sections];
        const newDownloads = { ...newSections[downloadsIndex] };

        // Deep copy the categories to avoid mutation issues
        newDownloads.categories = newDownloads.categories?.map((cat, cIdx) => {
            if (cIdx !== catIdx) return cat;
            return {
                ...cat,
                items: cat.items.map((item, iIdx) => {
                    if (iIdx !== itemIdx) return item;
                    return { ...item, file: newUrl };
                })
            };
        });

        newSections[downloadsIndex] = newDownloads;
        setSections(newSections);
    };

    const handleUpload = async (file: File, catIdx: number, itemIdx: number) => {
        const key = `${catIdx}-${itemIdx}`;
        setUploadingState(prev => ({ ...prev, [key]: true }));

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

            handleUrlChange(catIdx, itemIdx, result.url);
            successToast(`Uploaded ${file.name}`);
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : 'Failed to upload file';
            errorToast(msg);
        } finally {
            setUploadingState(prev => ({ ...prev, [key]: false }));
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await pb.collection('services').update(serviceId, {
                sections: sections
            });
            successToast("Downloads updated successfully");
            router.refresh();
        } catch (error) {
            console.error("Error saving downloads:", error);
            errorToast("Failed to save changes");
        } finally {
            setSaving(false);
        }
    };

    if (!downloadsSection || !downloadsSection.categories) {
        return (
            <div className="p-8 text-center text-zinc-500 bg-zinc-900/50 rounded-lg border border-zinc-800">
                <Download className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium text-zinc-300">No Downloads Section Found</h3>
                <p className="mt-2 text-sm text-zinc-500">
                    The Broadcast service does not appear to have a "downloads_categorized" section configured.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between sticky top-4 z-10 bg-zinc-950/80 backdrop-blur-md p-4 -mx-4 rounded-xl border border-white/5 shadow-lg">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Download className="w-6 h-6 text-red-500" />
                        Manage Downloads
                    </h2>
                    <p className="text-sm text-zinc-400">
                        Update PDF links for the Broadcast service
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save className="w-4 h-4" />
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            <div className="space-y-4">
                {downloadsSection.categories.map((category, catIdx) => {
                    const isExpanded = expandedCategories[catIdx];
                    const itemCount = category.items.length;
                    const filledCount = category.items.filter(i => i.file && i.file.trim().length > 0).length;

                    return (
                        <div key={catIdx} className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/30">
                            <button
                                onClick={() => toggleCategory(catIdx)}
                                className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    {isExpanded ? (
                                        <ChevronDown className="w-5 h-5 text-zinc-500" />
                                    ) : (
                                        <ChevronRight className="w-5 h-5 text-zinc-500" />
                                    )}
                                    <span className="font-medium text-zinc-200">{category.category}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                                        {filledCount} / {itemCount} Active
                                    </div>
                                </div>
                            </button>

                            {isExpanded && (
                                <div className="p-4 pt-0 space-y-3 border-t border-zinc-800/50 bg-black/20">
                                    <div className="h-4"></div> {/* Spacer */}
                                    {category.items.map((item, itemIdx) => (
                                        <div key={itemIdx} className="group relative grid grid-cols-1 md:grid-cols-[2fr,3fr] gap-4 items-start p-3 rounded-md border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all">
                                            <div className="flex items-start gap-3 mt-2">
                                                <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                                                    <FileText className="w-4 h-4 text-zinc-500" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-zinc-300">{item.title}</p>
                                                    {item.file && (
                                                        <a
                                                            href={item.file}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-[10px] text-red-400 hover:text-red-300 mt-1"
                                                        >
                                                            Test Link <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="relative">
                                                <div className="flex gap-2">
                                                    <input
                                                        type="url"
                                                        value={item.file || ""}
                                                        onChange={(e) => handleUrlChange(catIdx, itemIdx, e.target.value)}
                                                        placeholder="Paste https://... URL here"
                                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all font-mono"
                                                    />
                                                    <label className="flex-shrink-0 cursor-pointer flex items-center justify-center p-2 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors" title="Upload PDF">
                                                        <input
                                                            type="file"
                                                            accept="application/pdf"
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) handleUpload(file, catIdx, itemIdx);
                                                                // Reset value to allow re-uploading same file if needed
                                                                e.target.value = '';
                                                            }}
                                                        />
                                                        {uploadingState[`${catIdx}-${itemIdx}`] ? (
                                                            <div className="w-4 h-4 border-2 border-zinc-400 border-t-white rounded-full animate-spin" />
                                                        ) : (
                                                            <Upload className="w-4 h-4" />
                                                        )}
                                                    </label>
                                                </div>
                                                {!item.file && (
                                                    <div className="absolute right-14 top-2.5 pointer-events-none">
                                                        <span className="text-[10px] text-zinc-600 uppercase tracking-wider font-semibold">Disabled</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
