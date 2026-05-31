import { useState } from "react";
import { ResumeStyling } from "../types/resume";
import { Spinner } from "./utils/Spinner";
import { COLOR_FAMILIES, FONT_PRESETS, fontFamilyCss } from "../lib/stylePresets";

export type StylingProps = {
    styling: ResumeStyling,
    error: Error | null,
    isSaving: boolean,
    isLoading: boolean,
    handleSave: (styling: ResumeStyling) => void | Promise<void>,
    isModal: boolean
}
export function StylingComponent({ styling, error, isSaving, isLoading, handleSave, isModal }: StylingProps) {
    const [draftStyling, setDraftStyling] = useState<ResumeStyling>(styling);
    
    const isEditing = JSON.stringify(draftStyling) !== JSON.stringify(styling);

     if (error) return (
        <div>
            {error.message}
        </div>
    );
    if (!styling || !draftStyling) return (
        <div>
            Warning: Could not retrieve data
        </div>
    );

    const currentFontKey = (Object.keys(FONT_PRESETS) as Array<keyof typeof FONT_PRESETS>)
        .find(k => FONT_PRESETS[k][0] === draftStyling?.fontMain[0]) ?? '';

    const currentColorKey = (Object.keys(COLOR_FAMILIES) as Array<keyof typeof COLOR_FAMILIES>)
        .find(k => COLOR_FAMILIES[k].accent === draftStyling?.colorAccent) ?? '';

    const handleFontChange = (value:string) => {
        const isPresetKey = (v: string): v is keyof typeof FONT_PRESETS => v in FONT_PRESETS;
        if (!isPresetKey(value)) return;
        const fonts = FONT_PRESETS[value]
        setDraftStyling(prev => {
            if (!prev) return prev;
            return { ...prev, fontMain: fonts };
        });
    }

    const handleColorChange = (value: string) => {
        const isPresetKey = (v: string): v is keyof typeof COLOR_FAMILIES => v in COLOR_FAMILIES;
        if (!isPresetKey(value)) return;
        const colors = COLOR_FAMILIES[value];
        setDraftStyling(prev => {
            if (!prev) return prev;
            return {...prev, colorAccent: colors.accent, colorTextName: colors.name};
        });
    }

    const handleReset = () => {
        setDraftStyling(styling);
    };

    return (
        <div className="max-w-lg mb-5">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Text Settings</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Choose the font and font colors.
                </p>
            </div>
            {isLoading ? <Spinner /> : 
                <>
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm divide-y divide-gray-100">
                <label className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                    <span className="text-sm font-medium text-gray-900">Font Style</span>
                    <div className="flex items-center gap-2">
                        <span
                            className="text-base text-gray-900 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md"
                            style={{ fontFamily: fontFamilyCss(draftStyling.fontMain) }}
                        >
                            Aa
                        </span>
                        <select
                            name="fontMain"
                            value={currentFontKey}
                            onChange={(e) => handleFontChange(e.target.value)}
                            className="min-w-30 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-transparent"
                        >
                            {Object.entries(FONT_PRESETS).map(([name]) => (
                                <option key={name} value={name}>{`${name[0].toUpperCase()}${name.slice(1)}`}</option>
                            ))}
                        </select>
                    </div>
                </label>
                <label className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                    <span className="text-sm font-medium text-gray-900">Color Theme</span>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            <span className="w-5 h-5 rounded border border-gray-300" style={{ backgroundColor: draftStyling.colorTextName }} />
                            <span className="w-5 h-5 rounded border border-gray-300" style={{ backgroundColor: draftStyling.colorAccent }} />
                        </div>
                        <select
                            name="colorTextName"
                            value={currentColorKey}
                            onChange={(e) => handleColorChange(e.target.value)}
                            className="min-w-30 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-transparent"
                        >
                            {
                                Object.entries(COLOR_FAMILIES).map(([name]) => (
                                    <option key={name} value={name}>{`${name[0].toUpperCase()}${name.slice(1)}`}</option>
                                ))
                            }
                        </select>
                    </div>
                </label>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
                {isSaving && <Spinner />}
                <button
                    onClick={handleReset}
                    disabled={!isEditing || isSaving}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    Reset
                </button>
                <button
                    onClick={async () => {
                        try {
                            await handleSave(draftStyling);
                        } catch {
                            // handled upstream: handleSave sets the error state before rethrowing
                        }
                    }}
                    disabled={!isEditing || isSaving}
                    className="px-4 py-2 text-sm font-medium text-white bg-slate-700 rounded-lg hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    {isModal ? "OK" : "Save"}
                </button>
            </div>
            </>
            }
            
        </div>
    )
}