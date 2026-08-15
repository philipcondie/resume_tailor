import { useState, useEffect, useRef } from 'react';
import { SkillEntry } from "../../types/resume";
import { SkillEntryForm } from "../../components/InputForms/SkillEntryForm";
import { Spinner } from '../../components/utils/Spinner';
import { skillsApi, ApiError } from '../../lib/api';
import { DragDropProvider, DragEndEvent } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';

export function SkillEntryContainer() {
    const [skills, setSkills] = useState<SkillEntry[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [isMutating, setIsMutating] = useState(false);
    const [mutationError, setMutationError] = useState<string | null>(null);
    const mutationInFlight = useRef(false);

    useEffect(() => {
        skillsApi.get()
            .then((data) => setSkills(data))
            .catch((error) => {
                if (error instanceof ApiError && error.status == 404) {
                    setSkills([]);
                } else {
                    setError(error);
                }
            })
            .finally(() => setIsLoading(false))
    }, [])

    const handleAddSkill = async () => {
        if (mutationInFlight.current) return;
        mutationInFlight.current = true;
        setIsMutating(true);
        setMutationError(null);
        const blank: SkillEntry = {
            id: crypto.randomUUID(),
            title: '',
            text: '',
        }
        try {
            const saved = await skillsApi.save([...skills, blank]);
            setSkills(saved);
        } catch (e) {
            setMutationError(e instanceof Error ? e.message : 'Unable to add skill');
        } finally {
            mutationInFlight.current = false;
            setIsMutating(false);
        }
    };

    const updateSkill = async (id:string, updatedSkill: SkillEntry) => {
        if (mutationInFlight.current) throw new Error('Another skill change is currently being saved');
        mutationInFlight.current = true;
        setIsMutating(true);
        setMutationError(null);
        const updated = skills.map(skill => skill.id !== id ? skill : updatedSkill);
        try {
            const saved = await skillsApi.save(updated);
            setSkills(saved);
        } finally {
            mutationInFlight.current = false;
            setIsMutating(false);
        }
    };

    const removeSkill = async (id: string) => {
        if (mutationInFlight.current) return;
        mutationInFlight.current = true;
        setIsMutating(true);
        setMutationError(null);
        const updated = skills.filter(skill => skill.id !== id);
        try {
            const saved = await skillsApi.save(updated);
            setSkills(saved);
        } catch (e) {
            setMutationError(e instanceof Error ? e.message : 'Unable to delete skill');
        } finally {
            mutationInFlight.current = false;
            setIsMutating(false);
        }
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        if (mutationInFlight.current) return;
        mutationInFlight.current = true;
        setIsMutating(true);
        setMutationError(null);
        const previous = skills;
        const reordered = move(previous, event);
        setSkills(reordered);
        try {
            const saved = await skillsApi.save(reordered);
            setSkills(saved);
        } catch (e) {
            setSkills(previous);
            setMutationError(e instanceof Error ? e.message : 'Unable to reorder skills');
        } finally {
            mutationInFlight.current = false;
            setIsMutating(false);
        }
    }

    if (isLoading) return <Spinner />
    if (error) return (
        <div>
            {error.message}
        </div>
    );  

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Technologies, tools, and competencies.</p>
                </div>
                <button
                    className="min-w-[66px] px-4 py-1.5 text-xs font-medium text-white bg-slate-700 rounded hover:bg-slate-600 transition-colors"
                    onClick={handleAddSkill}
                    disabled={isMutating}
                >+ Add</button>
            </div>
            {mutationError && <p role="alert" className="text-sm text-red-600">{mutationError}</p>}
            <DragDropProvider onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-4">
                    {skills.map((skill: SkillEntry, index: number) => (
                        <SkillEntryForm key={skill.id} index={index} skill={skill} handleUpdate={updateSkill} handleDelete={removeSkill} isMutating={isMutating} />
                    ))}
                </div>
            </DragDropProvider>
        </div>
    )
}
