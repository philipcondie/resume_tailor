import { useState } from 'react';
import { EducationEntry } from "../../types/resume"
import { EditableTextArea } from '../utils/EditableFields';

type EducationEntryProps = {
    education: EducationEntry,
    handleUpdate: (id:string, education: EducationEntry) => void,
    handleDelete: (id:string) => void,
}

export function EducationEntryForm({education, handleUpdate, handleDelete}: EducationEntryProps) {
    const [draft, setDraft] = useState<EducationEntry>(education);
    const isEditing = JSON.stringify(draft) !== JSON.stringify(education);

     const handleBulletChange = (index:number, value: string) => {
        setDraft((prev:EducationEntry) => ({
            ...prev,
            bullets: prev.bullets.map((bullet,i) => i === index ? value : bullet)
        }))
    };

    const handleBulletAdd = () => {
        setDraft((prev: EducationEntry) => ({
            ...prev,
            bullets: [...prev.bullets, '']
        }))
    };

    const handleBulletDelete = (index: number) => {
        setDraft((prev:EducationEntry) => ({
            ...prev,
            bullets: prev.bullets.filter((_, i) => i !== index)
        }))
    };

    const updateField = (field: keyof EducationEntry, value: string) => {
        setDraft(prev => ({
            ...prev, [field] : value
        }))
    }

    const onSave = () => {
        handleUpdate(education.id, draft)
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium uppercase tracking-wide text-gray-600">School</label>
                    <input
                        className="border-b border-gray-400 bg-transparent px-0 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
                        type='text' value={draft.school} onChange={e => updateField('school', e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium uppercase tracking-wide text-gray-600">Degree</label>
                    <input
                        className="border-b border-gray-400 bg-transparent px-0 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
                        type="text" value={draft.degree} onChange={e => updateField('degree', e.target.value)}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-xs font-medium uppercase tracking-wide text-gray-600">Bullets</label>
                {draft.bullets.map((bullet, index) => (
                    <div key={index} className="flex gap-2 items-center">
                        <EditableTextArea
                            className="flex-1 border-b border-gray-400 bg-transparent px-0 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors overflow-hidden"
                            content={bullet}
                            handleChange={(text) => handleBulletChange(index, text)}
                        />
                        <button className="text-red-300 hover:text-red-600 text-sm transition-colors" onClick={() => handleBulletDelete(index)}>✕</button>
                    </div>
                ))}
                <button className="self-start text-xs text-blue-500 hover:text-blue-700 transition-colors mt-1" onClick={handleBulletAdd}>+ Add bullet</button>
            </div>
            <div className="flex gap-3 pt-2 border-t border-gray-100">
                <button
                    className="px-4 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    onClick={() => handleDelete(education.id)}
                >Delete</button>
                <button
                    className="ml-auto px-4 py-1.5 text-xs font-medium text-white bg-slate-700 rounded hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    onClick={onSave}
                    disabled={!isEditing}
                >Save</button>
            </div>
        </div>
    )
}
