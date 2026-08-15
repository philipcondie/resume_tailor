import { useRef, useState } from "react";
import { SkillEntry } from "../../types/resume";
import { useSortable } from '@dnd-kit/react/sortable';

type SkillEntryProps = {
    skill: SkillEntry,
    index: number,
    handleUpdate: (id: string, skill: SkillEntry) => Promise<void>,
    handleDelete: (id: string) => Promise<void>,
    isMutating: boolean,
}

export function SkillEntryForm({skill, index, handleUpdate, handleDelete, isMutating}: SkillEntryProps) {
    const [draft, setDraft] = useState<SkillEntry>(skill);
    const [error, setError] = useState<string | null>(null);
    const [isSavingThis, setIsSavingThis] = useState(false);
    const saveInFlight = useRef(false);
    const id = skill.id;
    const { ref, handleRef } = useSortable({ id, index });
    const isEditing = JSON.stringify(draft) !== JSON.stringify(skill);

    const updateField = (key: keyof SkillEntry, value: string) => {
        setDraft(prev => ({
            ...prev, [key]: value
        }))
    };

    const onSave = async () => {
        if (saveInFlight.current || isMutating) return;
        saveInFlight.current = true;
        setIsSavingThis(true);
        try {
            await handleUpdate(skill.id, draft);
            setError(null);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Unable to save skill');
        } finally {
            saveInFlight.current = false;
            setIsSavingThis(false);
        }
    }

    return (
        <div ref={ref} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium uppercase tracking-wide text-gray-600">Skill Title</label>
                <input
                    className="border-b border-gray-400 bg-transparent px-0 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
                    type='text' value={draft.title} onChange={e => updateField('title', e.target.value)}
                />
                <label className="text-xs font-medium uppercase tracking-wide text-gray-600">Skill Text</label>
                <input
                    className="border-b border-gray-400 bg-transparent px-0 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
                    type='text' value={draft.text} onChange={e => updateField('text', e.target.value)}
                />
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <div className="flex gap-3 pt-1 border-t border-gray-100">
                <button
                    className="px-3 py-1 text-xs font-medium text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    onClick={() => handleDelete(skill.id)}
                    disabled={isMutating}
                >Delete</button>
                <button
                    className="ml-auto px-3 py-1 text-xs font-medium text-white bg-slate-700 rounded hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    onClick={onSave}
                    disabled={!isEditing || isMutating || isSavingThis}
                >{isSavingThis ? 'Saving…' : 'Save'}</button>
                <button ref={handleRef} disabled={isMutating} className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-30">
                    ⠿
                </button>
            </div>
        </div>
    )
}
