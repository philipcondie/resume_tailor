import { useEffect, useState } from "react";
import { promptApi } from "../lib/api";
import { PromptData } from "../types/resume";
import { Spinner } from "../components/utils/Spinner";

export function Prompt() {
    const [prompt, setPrompt] = useState<PromptData | null>(null);
    const [draft, setDraft] = useState<PromptData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const isEditing = JSON.stringify(draft) !== JSON.stringify(prompt);

    useEffect(() => {
        promptApi.get()
            .then((data) => {
                setPrompt(data);
                setDraft(data);
            })
            .catch((error) => setError(error))
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) return <Spinner />
    if (!draft || !prompt) {
        return <div>{error ? error.message : "No prompt data found"}</div>;
    }

    const onSave = async () => {
        setIsSaving(true);
        setError(null);
        try {
            await promptApi.update(draft);
            setPrompt(draft);
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
            setIsSaving(false);
        }
    };

    const onRestore = async () => {
        setIsSaving(true);
        setError(null);
        try {
            const data = await promptApi.update({prompt: ''});
            setPrompt(data);
            setDraft(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
            setIsSaving(false);
        }
    }
    
    return (
        <div className="flex flex-col gap-6 max-w-xxl bg-white rounded-xl border border-gray-200 p-8">
            <div>
                <h2 className="text-lg font-semibold text-gray-900">Prompt</h2>
                <p className="text-sm text-gray-500 mt-0.5">Specify custom instructions for creating your resumes.</p>
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium uppercase tracking-wide text-gray-600">User Prompt</label>
                <textarea
                    className="border border-gray-300 rounded bg-transparent px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-900 transition-colors resize-y"
                    placeholder="Add custom instructions for how your resume should be tailored..."
                    value={draft.prompt}
                    onChange={e => setDraft({prompt: e.target.value})}
                    rows={25}
                />
            </div>
            {error &&
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3">
                    {error.message}
                </div>
            }
            <div className="flex gap-3 pt-2 border-t border-gray-100 items-center justify-end">
                {isSaving && <Spinner />}
                <button
                    className="px-4 py-1.5 text-xs font-medium border border-gray-300 text-gray-600 bg-white rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    onClick={onRestore}
                    disabled={isSaving}
                >
                    Restore Default
                </button>
                <button
                    className="px-4 py-1.5 text-xs font-medium border border-gray-300 text-gray-600 bg-white rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    onClick={() => setDraft(prompt)}
                    disabled={!isEditing || isSaving}
                >
                    Reset
                </button>
                <button
                    className="px-4 py-1.5 text-xs font-medium text-white bg-slate-700 rounded hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    onClick={onSave}
                    disabled={!isEditing || isSaving}
                >
                    Save
                </button>
            </div>
        </div>
    )
}