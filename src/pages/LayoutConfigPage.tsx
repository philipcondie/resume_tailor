import { useEffect, useState, useMemo } from "react";
import { LayoutConfig } from "../types/resume";
import { Spinner } from "../components/utils/Spinner";
import { layoutApi } from "../lib/api";

export function LayoutConfigPage() {
    const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>([]);
    const [draftLayout, setDraftLayout] = useState<LayoutConfig>([]);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const isEditing = JSON.stringify(draftLayout) !== JSON.stringify(layoutConfig);

    useEffect(() => {
        layoutApi.get()
            .then((data) => {
                setLayoutConfig(data.layout);
                setDraftLayout(data.layout);
            })
            .catch((error) => setError(error))
            .finally(() => setIsLoading(false));
    }, []);

    const sorted = useMemo(
        () => [...draftLayout].sort((a, b) => a.ordering - b.ordering),
        [draftLayout]
    );

    const toggleSection = (name: string) => {
        setDraftLayout(draftLayout.map(s =>
            s.name === name ? { ...s, enabled: !s.enabled } : s
        ));
    };

    const moveSection = (name: string, direction: -1 | 1) => {
        const index = sorted.findIndex(s => s.name === name);
        const swapIndex = index + direction;
        if (swapIndex < 0 || swapIndex >= sorted.length) return;
        const updated = draftLayout.map(s => {
            if (s.name === sorted[index].name) return { ...s, ordering: sorted[swapIndex].ordering };
            if (s.name === sorted[swapIndex].name) return { ...s, ordering: sorted[index].ordering };
            return s;
        });
        setDraftLayout(updated);
    };

    const onSave = async () => {
        setIsSaving(true);
        setError(null);
        try {
            const data = await layoutApi.update(draftLayout);
            setLayoutConfig(data.layout);
            setDraftLayout(data.layout);
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
            setIsSaving(false);
        }
    };

    const onReset = () => {
        setDraftLayout(layoutConfig);
        setError(null);
    };

    if (isLoading) return <Spinner />;
    if (error && layoutConfig.length === 0) return <div className="p-8 text-sm text-red-600">{error.message}</div>;
    if (layoutConfig.length === 0) return <div className="p-8 text-sm text-gray-500">No layout data found</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-2xl mx-auto">
                <header className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Layout Settings</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Choose which sections appear on your resumes and the order they show up in.
                    </p>
                </header>

                {error && (
                    <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                        {error.message}
                    </div>
                )}

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm divide-y divide-gray-100">
                    {sorted.map((section, i) => (
                        <div
                            key={section.name}
                            className="flex items-center gap-4 px-5 py-4"
                        >
                            <label className="relative inline-flex cursor-pointer shrink-0">
                                <input
                                    type="checkbox"
                                    checked={section.enabled}
                                    onChange={() => toggleSection(section.name)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-slate-700 transition-colors" />
                                <div className="absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5" />
                            </label>
                            <span className={`flex-1 text-sm capitalize ${section.enabled ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                                {section.name}
                            </span>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => moveSection(section.name, -1)}
                                    disabled={i === 0}
                                    aria-label={`Move ${section.name} up`}
                                    className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="18 15 12 9 6 15" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => moveSection(section.name, 1)}
                                    disabled={i === sorted.length - 1}
                                    aria-label={`Move ${section.name} down`}
                                    className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-end gap-3 mt-6">
                    {isSaving && <Spinner />}
                    <button
                        onClick={onReset}
                        disabled={!isEditing || isSaving}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Reset
                    </button>
                    <button
                        onClick={onSave}
                        disabled={!isEditing || isSaving}
                        className="px-4 py-2 text-sm font-medium text-white bg-slate-700 rounded-lg hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
