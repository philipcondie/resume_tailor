import { useState, useEffect, useRef } from "react";
import { ProjectEntry } from "../../types/resume";
import { ProjectEntryForm } from "../../components/InputForms/ProjectEntryForm";
import { ApiError, projectsApi } from "../../lib/api";
import { Spinner } from "../../components/utils/Spinner";
import { DragDropProvider, DragEndEvent } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';

export function ProjectEntryContainer() {
    const [projects, setProjects] = useState<ProjectEntry[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const saveInFlight = useRef(false);

    useEffect(() => {
        projectsApi.get()
            .then((data) => setProjects(data))
            .catch((error) => {
                if (error instanceof ApiError && error.status == 404) {
                    setProjects([]);
                } else {
                    setError(error);
                }
            })
            .finally(() => setIsLoading(false));
    }, []);

    const handleAddProject = () => {
        const blank: ProjectEntry = {
            id: crypto.randomUUID(),
            title: {text: '', url: null},
            bullets: [],
        }
        setProjects(prev => [...prev, blank]);
    }

    const updateProject = async (id: string, updatedProject: ProjectEntry) => {
        if (saveInFlight.current) throw new Error('Another project is currently being saved');
        saveInFlight.current = true;
        setIsSaving(true);
        const updated = projects.map(project => project.id !== id ? project : updatedProject);
        try {
            const saved = await projectsApi.save(updated);
            setProjects(saved);
        } finally {
            saveInFlight.current = false;
            setIsSaving(false);
        }
    };

    const removeProject = (id: string) => {
        const updated = projects.filter(project => project.id !== id);
        projectsApi.save(updated);
        setProjects(updated);
    }

    const handleDragEnd = (event: DragEndEvent) => {
        setProjects((prev) => {
            const reordered = move(prev, event);
            projectsApi.save(reordered);
            return reordered;
        });
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
                    <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Personal and professional projects.</p>
                </div>
                <button
                    className="min-w-[66px] px-4 py-1.5 text-xs font-medium text-white bg-slate-700 rounded hover:bg-slate-600 transition-colors"
                    onClick={handleAddProject}
                    disabled={isSaving}
                >+ Add</button>
            </div>
            <DragDropProvider onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,400px),1fr))] gap-4">
                    {projects.map((project, index) => (
                        <ProjectEntryForm key={project.id} index={index} project={project} handleUpdate={updateProject} handleDelete={removeProject} isSaving={isSaving} />
                    ))}
                </div>
            </DragDropProvider>
        </div>
    )
}
