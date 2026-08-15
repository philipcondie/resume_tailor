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
    const [isMutating, setIsMutating] = useState(false);
    const [mutationError, setMutationError] = useState<string | null>(null);
    const mutationInFlight = useRef(false);

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

    const handleAddProject = async () => {
        if (mutationInFlight.current) return;
        mutationInFlight.current = true;
        setIsMutating(true);
        setMutationError(null);
        const blank: ProjectEntry = {
            id: crypto.randomUUID(),
            title: {text: '', url: null},
            bullets: [],
        }
        try {
            const saved = await projectsApi.save([...projects, blank]);
            setProjects(saved);
        } catch (e) {
            setMutationError(e instanceof Error ? e.message : 'Unable to add project');
        } finally {
            mutationInFlight.current = false;
            setIsMutating(false);
        }
    }

    const updateProject = async (id: string, updatedProject: ProjectEntry) => {
        if (mutationInFlight.current) throw new Error('Another project change is currently being saved');
        mutationInFlight.current = true;
        setIsMutating(true);
        setMutationError(null);
        const updated = projects.map(project => project.id !== id ? project : updatedProject);
        try {
            const saved = await projectsApi.save(updated);
            setProjects(saved);
        } finally {
            mutationInFlight.current = false;
            setIsMutating(false);
        }
    };

    const removeProject = async (id: string) => {
        if (mutationInFlight.current) return;
        mutationInFlight.current = true;
        setIsMutating(true);
        setMutationError(null);
        const updated = projects.filter(project => project.id !== id);
        try {
            const saved = await projectsApi.save(updated);
            setProjects(saved);
        } catch (e) {
            setMutationError(e instanceof Error ? e.message : 'Unable to delete project');
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
        const previous = projects;
        const reordered = move(previous, event);
        setProjects(reordered);
        try {
            const saved = await projectsApi.save(reordered);
            setProjects(saved);
        } catch (e) {
            setProjects(previous);
            setMutationError(e instanceof Error ? e.message : 'Unable to reorder projects');
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
                    <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Personal and professional projects.</p>
                </div>
                <button
                    className="min-w-[66px] px-4 py-1.5 text-xs font-medium text-white bg-slate-700 rounded hover:bg-slate-600 transition-colors"
                    onClick={handleAddProject}
                    disabled={isMutating}
                >+ Add</button>
            </div>
            {mutationError && <p role="alert" className="text-sm text-red-600">{mutationError}</p>}
            <DragDropProvider onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,400px),1fr))] gap-4">
                    {projects.map((project, index) => (
                        <ProjectEntryForm key={project.id} index={index} project={project} handleUpdate={updateProject} handleDelete={removeProject} isMutating={isMutating} />
                    ))}
                </div>
            </DragDropProvider>
        </div>
    )
}
