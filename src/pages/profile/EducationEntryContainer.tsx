import { useState, useEffect, useRef } from "react";
import { Spinner } from "../../components/utils/Spinner";
import { EducationEntryForm } from "../../components/InputForms/EducationEntryForm"
import { EducationEntry } from "../../types/resume";
import { ApiError, educationApi } from "../../lib/api";
import { DragDropProvider, DragEndEvent } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';


export function EducationEntryContainer() {
    const [educationHistory, setEducationHistory] = useState<EducationEntry[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [isMutating, setIsMutating] = useState(false);
    const [mutationError, setMutationError] = useState<string | null>(null);
    const mutationInFlight = useRef(false);

    useEffect(() => {
        educationApi.get()
            .then(data => setEducationHistory(data))
            .catch((error) => {
                if (error instanceof ApiError && error.status == 404) {
                    setEducationHistory([]);
                } else {
                    setError(error);
                }
            })
            .finally(() => setIsLoading(false))
    }, [])

    const handleDragEnd = async (event:DragEndEvent) => {
        if (mutationInFlight.current) return;
        mutationInFlight.current = true;
        setIsMutating(true);
        setMutationError(null);
        const previous = educationHistory;
        const reordered = move(previous, event);
        setEducationHistory(reordered);
        try {
            const saved = await educationApi.save(reordered);
            setEducationHistory(saved);
        } catch (e) {
            setEducationHistory(previous);
            setMutationError(e instanceof Error ? e.message : 'Unable to reorder education entries');
        } finally {
            mutationInFlight.current = false;
            setIsMutating(false);
        }
    }

    const handleAddEducation = async () => {
        if (mutationInFlight.current) return;
        mutationInFlight.current = true;
        setIsMutating(true);
        setMutationError(null);
        const blank: EducationEntry = {
            id: crypto.randomUUID(),
            school: '',
            degree: '',
            bullets: [],
        }
        try {
            const saved = await educationApi.save([...educationHistory, blank]);
            setEducationHistory(saved);
        } catch (e) {
            setMutationError(e instanceof Error ? e.message : 'Unable to add education entry');
        } finally {
            mutationInFlight.current = false;
            setIsMutating(false);
        }
    };

    const updateEducation = async (id: string, updatedItem: EducationEntry) => {
        if (mutationInFlight.current) throw new Error('Another education change is currently being saved');
        mutationInFlight.current = true;
        setIsMutating(true);
        setMutationError(null);
        const updated = educationHistory.map(item => item.id !== id ? item : updatedItem)
        try {
            const saved = await educationApi.save(updated);
            setEducationHistory(saved);
        } finally {
            mutationInFlight.current = false;
            setIsMutating(false);
        }
    };

    const removeEducation = async (id: string) => {
        if (mutationInFlight.current) return;
        mutationInFlight.current = true;
        setIsMutating(true);
        setMutationError(null);
        const updated = educationHistory.filter(item => item.id !== id);
        try {
            const saved = await educationApi.save(updated);
            setEducationHistory(saved);
        } catch (e) {
            setMutationError(e instanceof Error ? e.message : 'Unable to delete education entry');
        } finally {
            mutationInFlight.current = false;
            setIsMutating(false);
        }
    };
    
    if (isLoading) return <Spinner />
    if (error) return (
        <div>
            {error.message}
        </div>
    )
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Education</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Schools, degrees, and relevant coursework.</p>
                </div>
                <button
                    className="min-w-[66px] px-4 py-1.5 text-xs font-medium text-white bg-slate-700 rounded hover:bg-slate-600 transition-colors"
                    onClick={handleAddEducation}
                    disabled={isMutating}
                >+ Add</button>
            </div>
            {mutationError && <p role="alert" className="text-sm text-red-600">{mutationError}</p>}
            <DragDropProvider onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,400px),1fr))] gap-4 items-start">
                    {educationHistory.map((education: EducationEntry, index: number) => (
                        <EducationEntryForm 
                            key={education.id}
                            index={index}
                            education={education} 
                            handleUpdate={updateEducation} 
                            handleDelete={removeEducation} 
                            isMutating={isMutating}
                        />
                    ))}
                </div>
            </DragDropProvider>
        </div>
    )

}
