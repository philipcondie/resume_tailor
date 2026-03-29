import { useState } from "react";
import { SkillEntry } from "../types/resume";

type SkillEntryProps = {
    skill: SkillEntry,
    handleUpdate: (id: string, skill: SkillEntry) => void,
    handleDelete: (id: string) => void,
}

export function SkillEntryForm({skill, handleUpdate, handleDelete}: SkillEntryProps) {
    const [draft, setDraft] = useState<SkillEntry>(skill);
    const isEditing = JSON.stringify(draft) !== JSON.stringify(skill);

    const updateField = (key: keyof SkillEntry, value: string) => {
        setDraft(prev => ({
            ...prev, [key]: value
        }))
    };

    const onSave = () => {
        handleUpdate(skill.id, draft);
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-4">
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
            <div className="flex gap-3 pt-1 border-t border-gray-100">
                <button
                    className="px-3 py-1 text-xs font-medium text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    onClick={() => handleDelete(skill.id)}
                >Delete</button>
                <button
                    className="ml-auto px-3 py-1 text-xs font-medium text-white bg-slate-700 rounded hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    onClick={onSave}
                    disabled={!isEditing}
                >Save</button>
            </div>
        </div>
    )
}
