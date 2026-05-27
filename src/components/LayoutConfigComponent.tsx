import { useState } from "react";
import { LayoutConfig, TemplateName } from "../types/resume";
import { Spinner } from "./utils/Spinner";
import { PANEL_OPTIONS } from "../lib/stylePresets";
import { templateRegistry } from "../types/SectionRegistry";

export type LayoutConfigProps = {
    layoutConfig: LayoutConfig,
    error: Error | null,
    isSaving: boolean,
    handleSave: (config: LayoutConfig) => void | Promise<void>,
    isModal: boolean
}

export function LayoutConfigComponent({layoutConfig, isSaving, error, handleSave, isModal}: LayoutConfigProps) {
    const [draftLayout, setDraftLayout] = useState<LayoutConfig | null>(layoutConfig);

    if (error) return (
        <div>
            {error.message}
        </div>
    );
    if (!layoutConfig || !draftLayout) return (
        <div>
            Warning: Could not retrieve data
        </div>
    );
    const currentTemplate = draftLayout.templates[draftLayout.selectedTemplate];
    const sortedSections = [...currentTemplate.sections].sort((a,b) => a.ordering - b.ordering)
    const panelOptions = PANEL_OPTIONS[draftLayout.selectedTemplate];
    const isEditing = JSON.stringify(draftLayout) !== JSON.stringify(layoutConfig);

    const toggleSection = (sectionName: string) => {
        setDraftLayout((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                templates: {
                    ...prev.templates,
                    [prev.selectedTemplate]: {
                        ...prev.templates[prev.selectedTemplate], 
                        sections: prev.templates[prev.selectedTemplate].sections.map((section) => section.name === sectionName ? { ...section, enabled: !section.enabled } : section)
                    }
                }
            }
        });
    };

    const moveSection = (sectionName:string, direction: -1 | 1) => {
        const index = sortedSections.findIndex(s => s.name === sectionName);
        const swapIndex = index + direction;
        if (swapIndex < 0 || swapIndex >= sortedSections.length) return;
        const updatedSections = draftLayout.templates[draftLayout.selectedTemplate].sections.map(s => {
            if (s.name === sortedSections[index].name) return {...s, ordering: sortedSections[swapIndex].ordering}
            if (s.name === sortedSections[swapIndex].name) return {...s, ordering: sortedSections[index].ordering}
            return s;
        });
        setDraftLayout((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                templates: {
                    ...prev.templates,
                    [prev.selectedTemplate]: {...prev.templates[prev.selectedTemplate], sections: updatedSections}
                }
            }
        })
    }

    const handlePanelChange = (sectionName: string, panel: string) => {
        setDraftLayout((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                templates: {
                    ...prev.templates,
                    [prev.selectedTemplate]: {
                        ...prev.templates[prev.selectedTemplate], sections: prev.templates[prev.selectedTemplate].sections.map((section) => section.name === sectionName ? {...section, panel: panel} : section)
                    }
                }
            }
        });
    };

    const handleReset = () => {
        setDraftLayout(layoutConfig);
    };

    const handleSelectedTemplateChange = (selectedTemplateUpdate: TemplateName) => {
        setDraftLayout((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                selectedTemplate: selectedTemplateUpdate,
            }
        })
    }
    
    return (
        <div className="max-w-lg">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Layout Settings</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Choose the template and which sections appear and their order on your resumes.
                </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm divide-y divide-gray-100 mb-6">
                <label className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                    <span className="text-sm font-medium text-gray-900">Layout</span>
                    <div className="flex items-center gap-2">
                        <select
                            name="selectedTemplate"
                            value={draftLayout.selectedTemplate}
                            onChange={(e) => {handleSelectedTemplateChange(e.target.value as TemplateName)}}
                            className="min-w-30 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-transparent"
                        >
                            {
                               Object.entries(templateRegistry).map(([templateKey, templateValue]) => (
                                   <option key={templateKey} value={templateKey}>{templateValue.displayName}</option>
                               )) 
                            }
                        </select>
                    </div>
                </label>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm divide-y divide-gray-100">
                {sortedSections.map((section, i) => (
                    <div
                        key={section.name} className="flex flex-wrap items-center gap-4 px-5 py-4"
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
                        <span className={`flex-1 min-w-[45px] text-sm capitalize ${section.enabled ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                            {section.name}
                        </span>
                        <label className="relative inline-flex cursor-pointer shrink-0">
                            <select
                                value={section.panel}
                                onChange={(e) => handlePanelChange(section.name, e.target.value)}
                                className="min-w-30 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-transparent"
                            >
                                {panelOptions.map((panel) => (
                                    <option key={panel} value={panel}>{`${panel[0].toUpperCase()}${panel.slice(1)}`}</option>
                                ))}
                            </select>
                        </label>
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
                                disabled={i === sortedSections.length - 1}
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
                    onClick={handleReset}
                    disabled={!isEditing || isSaving }
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    Reset
                </button>
                <button
                    onClick={async () => {
                        try {
                            await handleSave(draftLayout);
                        } catch {
                            
                        }
                        
                    }}
                    disabled={!isEditing || isSaving }
                    className="px-4 py-2 text-sm font-medium text-white bg-slate-700 rounded-lg hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    {isModal ? "OK": "Save"}
                </button>
            </div>
        </div>
    );
}