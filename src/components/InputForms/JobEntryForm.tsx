import { useRef, useState } from "react";
import { JobEntry } from "../../types/resume";
import { EditableTextArea } from "../utils/EditableFields";
import { useSortable } from '@dnd-kit/react/sortable';

type JobEntryProps = {
    job: JobEntry,
    index: number,
    handleUpdate: (id: string, updatedJob: JobEntry) => Promise<void>,
    handleDelete: (id: string) => Promise<void>,
    isMutating: boolean,
}

export function JobEntryForm({job, index, handleUpdate, handleDelete, isMutating} : JobEntryProps) {
    const [draft, setDraft] = useState<JobEntry>(job);
    const [error, setError] = useState<string | null>(null);
    const [isSavingThis, setIsSavingThis] = useState(false);
    const saveInFlight = useRef(false);
    
    const id: string = job.id;
    const { ref, handleRef } = useSortable({id, index})
    

    const isEditing = JSON.stringify(draft) !== JSON.stringify(job);

    const handleBulletChange = (index:number, value: string) => {
        setDraft((prev:JobEntry) => ({
            ...prev,
            bullets: prev.bullets.map((bullet,i) => i === index ? value : bullet)
        }))
    };

    const handleBulletAdd = () => {
        setDraft((prev: JobEntry) => ({
            ...prev,
            bullets: [...prev.bullets, '']
        }))
    };

    const handleBulletDelete = (index: number) => {
        setDraft((prev:JobEntry) => ({
            ...prev,
            bullets: prev.bullets.filter((_, i) => i !== index)
        }))
    };

    const updateField = (field: keyof JobEntry, value:string) => {
        setDraft(prev => ({...prev, [field]: value}))
    }

    const onSave = async () => {
        if (saveInFlight.current || isMutating) return;
        saveInFlight.current = true;
        setIsSavingThis(true);
        try {
            await handleUpdate(job.id, draft);
            setError(null);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Unable to save job');
        } finally {
            saveInFlight.current = false;
            setIsSavingThis(false);
        }
    }

    return (
        <div ref={ref} className="bg-white border border-gray-200 rounded-xl flex flex-col gap-6 p-6">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium uppercase tracking-wide text-gray-600">Company</label>
                    <input className="border-b border-gray-400 bg-transparent px-0 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
                        type='text' value={draft.company} onChange={e => updateField('company', e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium uppercase tracking-wide text-gray-600">Role</label>
                    <input className="border-b border-gray-400 bg-transparent px-0 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
                        type="text" value={draft.role} onChange={e => updateField('role', e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium uppercase tracking-wide text-gray-600">Location</label>
                    <input className="border-b border-gray-400 bg-transparent px-0 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
                        type="text" value={draft.location} onChange={e => updateField('location', e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium uppercase tracking-wide text-gray-600">Start Date</label>
                    <input className="border-b border-gray-400 bg-transparent px-0 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
                        type="text" value={draft.startDate} onChange={e => updateField('startDate', e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium uppercase tracking-wide text-gray-600">End Date</label>
                    <input className="border-b border-gray-400 bg-transparent px-0 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
                        type="text" value={draft.endDate} onChange={e => updateField('endDate', e.target.value)}
                    />
                </div>
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
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
                    onClick={() => handleDelete(job.id)}
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
