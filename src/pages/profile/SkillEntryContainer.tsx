import { useState, useEffect } from 'react';
import { SkillEntry } from "../../types/resume";
import { SkillEntryForm } from "../../components/InputForms/SkillEntryForm";
import { Spinner } from '../../components/utils/Spinner';
import { skillsApi, ApiError } from '../../lib/api';

export function SkillEntryContainer() {
    const [skills, setSkills] = useState<SkillEntry[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

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

    const handleAddSkill = () => {
        const blank: SkillEntry = {
            id: crypto.randomUUID(),
            title: '',
            text: '',
        }
        setSkills(prev => [...prev, blank]);
    };

    const updateSkill = (id:string, updatedSkill: SkillEntry) => {
        const updated = skills.map(skill => skill.id !== id ? skill : updatedSkill);
        skillsApi.save(updated);
        setSkills(updated);
    };

    const removeSkill = (id: string) => {
        const updated = skills.filter(skill => skill.id !== id);
        skillsApi.save(updated);
        setSkills(updated);
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
                    className="px-4 py-1.5 text-xs font-medium text-white bg-slate-700 rounded hover:bg-slate-600 transition-colors"
                    onClick={handleAddSkill}
                >+ Add</button>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-4">
                {skills.map((skill: SkillEntry) => (
                    <SkillEntryForm key={skill.id} skill={skill} handleUpdate={updateSkill} handleDelete={removeSkill} />
                ))}
            </div>
        </div>
    )
}
