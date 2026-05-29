import { useEffect, useState } from "react";
import { LayoutConfig, ResumeStyling } from "../types/resume";
import { Spinner } from "../components/utils/Spinner";
import { layoutApi, stylingApi } from "../lib/api";
import { LayoutConfigComponent } from "../components/LayoutConfigComponent";
import { StylingComponent } from "../components/StylingComponent";

export function LayoutConfigPage() {
    const [layoutConfig, setLayoutConfig] = useState<LayoutConfig | null>(null);
    const [isSavingLayout, setIsSavingLayout] = useState<boolean>(false);
    const [errorLayout, setErrorLayout] = useState<Error | null>(null);
    const [isLoadingLayout, setIsLoadingLayout] = useState<boolean>(true);

    const [styling, setStyling] = useState<ResumeStyling | null>(null);
    const [isSavingStyling, setIsSavingStyling] = useState<boolean>(false);
    const [errorStyling, setErrorStyling] = useState<Error | null>(null)
    const [isLoadingStyling, setIsLoadingStyling] = useState<boolean>(true);

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
            })
            .catch((error) => setErrorStyling(error))
            .finally(() => setIsLoadingStyling(false));
    }, [])

    const handleSaveStyling = async (styling: ResumeStyling) => {
        setIsSavingStyling(true);
        setErrorStyling(null);
        try {
            const data = await stylingApi.update(styling);
            setStyling(data);
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err))
            setErrorStyling(error);
            throw error;
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

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Resume Configuration</h1>
            {
                styling && <StylingComponent styling={styling} error={errorStyling} isSaving={isSavingStyling} isLoading={isLoadingStyling} handleSave={handleSaveStyling} isModal={false} />
            }
            {
                layoutConfig && <LayoutConfigComponent layoutConfig={layoutConfig} error={errorLayout} isSaving={isSavingLayout} isLoading={isLoadingLayout} handleSave={handleSaveLayout} isModal={false} />
            }
        </div>
    );
}
