import { useRef, useState } from "react";
import { LinkableText, PersonalInfoEntry } from "../../types/resume"
import { normalizeWebUrl } from "../../lib/links";
type PersonalInfoProps = {
    info : PersonalInfoEntry,
    handleUpdate: (info: PersonalInfoEntry) => Promise<void>,
}
export function PersonalInfoForm({info, handleUpdate}:PersonalInfoProps) {
    const [draft, setDraft] = useState<PersonalInfoEntry>({...info, extras: info.extras?.map(extra => ({...extra}))})
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const saveInFlight = useRef(false);

    const handleExtraChange = (index:number, field:keyof LinkableText, value:string) => {
        if (field === 'url') setError(null);
        setDraft((prev:PersonalInfoEntry) => ({
            ...prev,
            extras: prev.extras?.map((extra,i) => i === index ? {...extra, [field]: value} : extra)
        }));
    };

    const handleExtraAdd = () => {
        setDraft((prev:PersonalInfoEntry) => ({
            ...prev,
            extras: [...(prev.extras ?? []), {text: '', url: null}],
        }))
    };

    const handleExtraDelete = (index: number) => {
        setDraft((prev:PersonalInfoEntry) => ({
            ...prev,
            extras: prev.extras?.filter((_,i) => i !== index)
        }))
    };

    const updateField = (field: keyof PersonalInfoEntry, value: string) => {
        setDraft(prev => ({...prev, [field]: value}));
    };

    const onSave = async () => {
        if (saveInFlight.current) return;
        saveInFlight.current = true;
        setIsSaving(true);
        try {
            const normalized = {
                ...draft,
                extras: draft.extras?.map(extra => ({...extra, url: normalizeWebUrl(extra.url)})),
            };
            await handleUpdate(normalized);
            setDraft(normalized);
            setError(null);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Unable to save personal info');
        } finally {
            saveInFlight.current = false;
            setIsSaving(false);
        }
    };

    const isEditing = JSON.stringify(draft) !== JSON.stringify(info);

    return (
        <div className="max-w-xl bg-white border border-gray-200 rounded-xl flex flex-col gap-6 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium uppercase tracking-wide text-gray-600">Name</label>
                    <input
                        className="border-b border-gray-400 bg-transparent px-0 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
                        type='text'
                        value={draft.name}
                        onChange={e => updateField('name', e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium uppercase tracking-wide text-gray-600">Email</label>
                    <input
                        className="border-b border-gray-400 bg-transparent px-0 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
                        type='text'
                        value={draft.email}
                        onChange={e => updateField('email',e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium uppercase tracking-wide text-gray-600">Phone</label>
                    <input
                        className="border-b border-gray-400 bg-transparent px-0 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
                        type='text'
                        value={draft.phonenumber}
                        onChange={e => updateField('phonenumber',e.target.value)}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-xs font-medium uppercase tracking-wide text-gray-600">Extra Contact Info</label>
                {draft.extras?.map((extra, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-3 items-end">
                        <label className="flex flex-col gap-1 min-w-0">
                            <span className="text-[10px] text-gray-500">Display text</span>
                            <input
                                className="min-w-0 border-b border-gray-400 bg-transparent px-0 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
                                type='text'
                                value={extra.text}
                                onChange={e => handleExtraChange(index, 'text', e.target.value)}
                            />
                        </label>
                        <label className="flex flex-col gap-1 min-w-0">
                            <span className="text-[10px] text-gray-500">Optional URL</span>
                            <input
                                className="min-w-0 border-b border-gray-400 bg-transparent px-0 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
                                type='url'
                                placeholder="example.com"
                                value={extra.url ?? ''}
                                onChange={e => handleExtraChange(index, 'url', e.target.value)}
                            />
                        </label>
                        <button className="text-red-300 hover:text-red-600 text-sm transition-colors" onClick={() => handleExtraDelete(index)}>✕</button>
                    </div>
                ))}
                <button className="self-start text-xs text-blue-500 hover:text-blue-700 transition-colors mt-1" onClick={handleExtraAdd}>+ Add field</button>
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
                <button
                    className="ml-auto px-4 py-1.5 text-xs font-medium text-white bg-slate-700 rounded hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    onClick={onSave}
                    disabled={!isEditing || isSaving}
                >{isSaving ? 'Saving…' : 'Save'}</button>
            </div>
        </div>
    )
}
