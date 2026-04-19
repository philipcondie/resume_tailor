import { useState } from "react";
import { ProjectEntry } from "../../types/resume";
import { EditableTextArea } from "../utils/EditableFields";

type ProjectEntryProps = {
    project: ProjectEntry,
    handleUpdate: (id:string, project: ProjectEntry) => void,
    handleDelete: (id:string) => void,
}

export function ProjectEntryForm({project, handleUpdate, handleDelete}: ProjectEntryProps) {
    const [draft, setDraft] = useState<ProjectEntry>(project);

    const isEditing = JSON.stringify(draft) !== JSON.stringify(project);

    const handleBulletChange = (index:number, updatedBullet:string) => {
        setDraft(prev => ({
            ...prev,
            bullets: prev.bullets.map((bullet, i) => i === index ? updatedBullet : bullet)
        }))
    };

    const handleBulletAdd = () => {
        setDraft(prev => ({
            ...prev,
            bullets: [...prev.bullets, '']
        }))
    };

    const handleBulletDelete = (index: number) => {
        setDraft(prev => ({
            ...prev,
            bullets: prev.bullets.filter((_, i) => i !== index)
        }))
    };

    const updateField = (key: keyof ProjectEntry, value: string) => {
        setDraft(prev => ({
            ...prev, [key]: value
        }))
    }

    const onSave = () => {
        handleUpdate(project.id, draft);
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium uppercase tracking-wide text-gray-600">Title</label>
                <input
                    className="border-b border-gray-400 bg-transparent px-0 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
                    type='text' value={draft.title} onChange={e => updateField('title', e.target.value)}
                />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-xs font-medium uppercase tracking-wide text-gray-600">Bullets</label>
                {draft.bullets.map((bullet, index) => (
                    <div key={index} className="flex gap-2 items-center">
                        <EditableTextArea
                            className="flex-1 border-b border-gray-400 bg-transparent px-0 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors overflow-hidden"
                            content={bullet}
                            handleChange={(e) => handleBulletChange(index, e)}
                        />
                        <button className="text-red-300 hover:text-red-600 text-sm transition-colors" onClick={() => handleBulletDelete(index)}>✕</button>
                    </div>
                ))}
                <button className="self-start text-xs text-blue-500 hover:text-blue-700 transition-colors mt-1" onClick={handleBulletAdd}>+ Add bullet</button>
            </div>
            <div className="flex gap-3 pt-2 border-t border-gray-100">
                <button
                    className="px-4 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    onClick={() => handleDelete(project.id)}
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
