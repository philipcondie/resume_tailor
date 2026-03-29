import { useEffect, useState } from "react";

import { usePrompts } from "../hooks/usePrompts";

export function Prompt() {
    const { systemPrompt, userPrompt, updateUserPrompt, resetUserPrompt } = usePrompts();
    const [draft, setDraft] = useState<string>(userPrompt);
    const isEditing = draft !== userPrompt;

    useEffect(() => { setDraft(userPrompt) }, [userPrompt]);
    
    return (
        <div className="flex flex-col gap-6 max-w-xxl bg-white rounded-xl border border-gray-200 p-8">
            <div>
                <h2 className="text-lg font-semibold text-gray-900">Prompt</h2>
                <p className="text-sm text-gray-500 mt-0.5">Specify custom instructions for creating your resumes.</p>
            </div>
            <details className="flex flex-col gap-1">
                <summary className="text-xs font-medium uppercase tracking-wide text-gray-600 cursor-pointer">System Prompt</summary>
                <div className="text-xs whitespace-pre-wrap bg-gray-50 border border-gray-200 rounded p-3 mt-1 max-h-64 overflow-y-auto">
                    {systemPrompt}
                </div>
            </details>
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium uppercase tracking-wide text-gray-600">User Prompt</label>
                <textarea
                    className="border border-gray-300 rounded bg-transparent px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-900 transition-colors resize-y"
                    placeholder="Add custom instructions for how your resume should be tailored..."
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    rows={10}
                />
            </div>
            <div className="flex gap-3 pt-2 border-t border-gray-100 items-center justify-end">
                <button
                    className="px-4 py-1.5 text-xs font-medium border border-gray-300 text-gray-600 bg-white rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    onClick={resetUserPrompt}
                >
                    Restore Default
                </button>
                <button
                    className="px-4 py-1.5 text-xs font-medium border border-gray-300 text-gray-600 bg-white rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    onClick={() => setDraft(userPrompt)}
                    disabled={!isEditing}
                >
                    Reset
                </button>
                <button
                    className="px-4 py-1.5 text-xs font-medium text-white bg-slate-700 rounded hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    onClick={() => updateUserPrompt(draft)}
                    disabled={!isEditing}
                >
                    Save
                </button>
            </div>
        </div>
    )
}