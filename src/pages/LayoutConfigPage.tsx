import { useEffect, useState, useMemo } from "react";
import { LayoutConfig, ResumeStyling } from "../types/resume";
import { Spinner } from "../components/utils/Spinner";
import { layoutApi, stylingApi } from "../lib/api";
import { COLOR_FAMILIES, FONT_PRESETS, fontFamilyCss} from "../lib/stylePresets";
import { LayoutConfigComponent } from "../components/LayoutConfigComponent";

export function LayoutConfigPage() {
    const [layoutConfig, setLayoutConfig] = useState<LayoutConfig | null>(null);
    const [isSavingLayout, setIsSavingLayout] = useState<boolean>(false);
    const [errorLayout, setErrorLayout] = useState<Error | null>(null);
    const [isLoadingLayout, setIsLoadingLayout] = useState<boolean>(true);

    const [styling, setStyling] = useState<ResumeStyling | null>(null);
    const [draftStyling, setDraftStyling] = useState<ResumeStyling | null>(null);
    const [isSavingStyling, setIsSavingStyling] = useState<boolean>(false);
    const [errorStyling, setErrorStyling] = useState<Error | null>(null)
    const [isLoadingStyling, setIsLoadingStyling] = useState<boolean>(true);

    const isEditingStyling = JSON.stringify(draftStyling) !== JSON.stringify(styling);
    const isLoading = isLoadingStyling || isLoadingLayout;

    const currentFontKey = (Object.keys(FONT_PRESETS) as Array<keyof typeof FONT_PRESETS>)
        .find(k => FONT_PRESETS[k][0] === draftStyling?.fontMain[0]) ?? '';

    const currentColorKey = (Object.keys(COLOR_FAMILIES) as Array<keyof typeof COLOR_FAMILIES>)
        .find(k => COLOR_FAMILIES[k].accent === draftStyling?.colorAccent) ?? '';


    useEffect(() => {
        layoutApi.get()
            .then((config) => {
                setLayoutConfig(config);
            })
            .catch(error => setErrorLayout(error))
            .finally(() => setIsLoadingLayout(false))
    }, []);

    useEffect(() => {
        stylingApi.get()
            .then((data)=> {
                setStyling(data);
                setDraftStyling(data);
            })
            .catch((error) => setErrorStyling(error))
            .finally(() => setIsLoadingStyling(false));
    }, [])


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

    const onResetStyling = () => {
        setDraftStyling(styling);
        setErrorStyling(null);
    };

    const onSaveStyling = async () => {
        setIsSavingStyling(true);
        setErrorStyling(null);
        if (!draftStyling) return;
        try {
            const data = await stylingApi.update(draftStyling);
            setStyling(data);
            setDraftStyling(data);
        } catch (err) {
            setErrorStyling(err instanceof Error ? err: new Error(String(err)));
        } finally {
            setIsSavingStyling(false);
        }
    };

    const handleSaveLayout = async (config: LayoutConfig) => {
        setIsSavingLayout(true);
        setErrorLayout(null);
        try {
            const data = await layoutApi.update(config);
            setLayoutConfig(data);
        } catch (err) {err instanceof Error ? err : new Error(String(err))
            const error = err instanceof Error ? err : new Error(String(err))
            setErrorLayout(error);
            throw error;
        } finally {
            setIsSavingLayout(false);
        }
    }

    if (isLoading) return <Spinner />;
    if (errorStyling && !styling) return <div className="p-8 text-sm text-red-600">{errorStyling.message}</div>;
    if (!draftStyling) return <div className="p-8 text-sm text-gray-500">No layout data found</div>;

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Resume Configuration</h1>
            <div className="max-w-lg mb-10">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Text Settings</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Choose the font and font colors.
                    </p>
                </div>

                {errorStyling && (
                    <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                        {errorStyling.message}
                    </div>
                )}

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
                                {Object.entries(FONT_PRESETS).map(([name,fonts]) => (
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
                                    Object.entries(COLOR_FAMILIES).map(([name,colors]) => (
                                        <option key={name} value={name}>{`${name[0].toUpperCase()}${name.slice(1)}`}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </label>
                </div>
                <div className="flex items-center justify-end gap-3 mt-6">
                    {isSavingStyling && <Spinner />}
                    <button
                        onClick={onResetStyling}
                        disabled={!isEditingStyling || isSavingStyling}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Reset
                    </button>
                    <button
                        onClick={onSaveStyling}
                        disabled={!isEditingStyling || isSavingStyling}
                        className="px-4 py-2 text-sm font-medium text-white bg-slate-700 rounded-lg hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Save
                    </button>
                </div>
            </div>
            {
                layoutConfig && <LayoutConfigComponent layoutConfig={layoutConfig} error={errorLayout} isSaving={isSavingLayout} handleSave={handleSaveLayout} isModal={false} />
            }
        </div>
    );
}
