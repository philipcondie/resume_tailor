import { useState, useEffect } from "react";
import { Spinner } from "../../components/utils/Spinner";
import { EducationEntryForm } from "../../components/InputForms/EducationEntryForm"
import { EducationEntry } from "../../types/resume";
import { ApiError, educationApi } from "../../lib/api";


export function EducationEntryContainer() {
    const [educationHistory, setEducationHistory] = useState<EducationEntry[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

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

    const handleAddEducation = () => {
        const blank: EducationEntry = {
            id: crypto.randomUUID(),
            school: '',
            degree: '',
            bullets: [],
        }
        setEducationHistory(prev => [...prev, blank]);
    };

    const updateEducation = (id: string, updatedItem: EducationEntry) => {
        const updated = educationHistory.map(item => item.id !== id ? item : updatedItem)
        educationApi.save(updated);
        setEducationHistory(updated);
    };

    const removeEducation = (id: string) => {
        const updated = educationHistory.filter(item => item.id !== id);
        educationApi.save(updated);
        setEducationHistory(updated);
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
                    className="px-4 py-1.5 text-xs font-medium text-white bg-slate-700 rounded hover:bg-slate-600 transition-colors"
                    onClick={handleAddEducation}
                >+ Add</button>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,400px),1fr))] gap-4">
                {educationHistory.map((education: EducationEntry) => (
                    <EducationEntryForm 
                        key={education.id} 
                        education={education} 
                        handleUpdate={updateEducation} 
                        handleDelete={removeEducation} 
                    />
                ))}
            </div>
        </div>
    )

}