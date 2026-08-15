import { useRef, useState } from "react";
import { ProjectEntry } from "../../types/resume";
import { EditableTextArea } from "../utils/EditableFields";
import { useSortable } from '@dnd-kit/react/sortable';
import { normalizeWebUrl } from '../../lib/links';

type ProjectEntryProps = {
    project: ProjectEntry,
    index: number,
    handleUpdate: (id:string, project: ProjectEntry) => Promise<void>,
    handleDelete: (id:string) => Promise<void>,
    isMutating: boolean,
}

export function ProjectEntryForm({project, index, handleUpdate, handleDelete, isMutating}: ProjectEntryProps) {
    const [draft, setDraft] = useState<ProjectEntry>(project);
    const [error, setError] = useState<string | null>(null);
    const [isSavingThis, setIsSavingThis] = useState(false);
    const saveInFlight = useRef(false);
    const id = project.id;
    const { ref, handleRef } = useSortable({ id, index });

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

    const updateTitle = (field: 'text' | 'url', value: string) => {
        if (field === 'url') setError(null);
        setDraft(prev => ({
            ...prev, title: {...prev.title, [field]: value}
        }))
    }

    const onSave = async () => {
        if (saveInFlight.current || isMutating) return;
        saveInFlight.current = true;
        setIsSavingThis(true);
        try {
            const normalized = {...draft, title: {...draft.title, url: normalizeWebUrl(draft.title.url)}};
            await handleUpdate(project.id, normalized);
            setDraft(normalized);
            setError(null);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Unable to save project');
        } finally {
            saveInFlight.current = false;
            setIsSavingThis(false);
        }
    }

    return (
        <div ref={ref} className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1">
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-600">Title</span>
                    <input
                        className="border-b border-gray-400 bg-transparent px-0 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
                        type='text' value={draft.title.text} onChange={e => updateTitle('text', e.target.value)}
                    />
                </label>
                <label className="flex flex-col gap-1">
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-600">Optional URL</span>
                    <input
                        className="border-b border-gray-400 bg-transparent px-0 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
                        type='url' placeholder="example.com" value={draft.title.url ?? ''} onChange={e => updateTitle('url', e.target.value)}
                    />
                </label>
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
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
                    disabled={isMutating}
                >Delete</button>
                <button
                    className="ml-auto px-4 py-1.5 text-xs font-medium text-white bg-slate-700 rounded hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
