import { useState, useEffect, useRef } from "react";
import { JobEntryForm } from "../../components/InputForms/JobEntryForm";
import { JobEntry } from "../../types/resume";
import { ApiError, jobsApi } from "../../lib/api";
import { Spinner } from "../../components/utils/Spinner";
import { DragDropProvider, DragEndEvent } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';

export function JobEntryContainer() {
    const [jobHistory, setJobHistory] = useState<JobEntry[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [isMutating, setIsMutating] = useState(false);
    const [mutationError, setMutationError] = useState<string | null>(null);
    const mutationInFlight = useRef(false);

    async function handleDragEnd(event:DragEndEvent) {
        if (mutationInFlight.current) return;
        mutationInFlight.current = true;
        setIsMutating(true);
        setMutationError(null);
        const previous = jobHistory;
        const reordered = move(previous, event);
        setJobHistory(reordered);
        try {
            const saved = await jobsApi.save(reordered);
            setJobHistory(saved);
        } catch (e) {
            setJobHistory(previous);
            setMutationError(e instanceof Error ? e.message : 'Unable to reorder jobs');
        } finally {
            mutationInFlight.current = false;
            setIsMutating(false);
        }
    }

    useEffect(() => {
        jobsApi.get()
            .then((data) => {
                setJobHistory(data);
            })
            .catch((error) => {
                if (error instanceof ApiError && error.status == 404) {
                    setJobHistory([]);
                } else {
                    setError(error);
                }
            })
            .finally(() => setIsLoading(false))
    }, [])

    const handleAddJob = async () => {
        if (mutationInFlight.current) return;
        mutationInFlight.current = true;
        setIsMutating(true);
        setMutationError(null);
        const blankJob: JobEntry = {
            id: crypto.randomUUID(),
            company: '',
            role: '',
            location: '',
            startDate: '',
            endDate: '',
            bullets: [],
        }
        try {
            const saved = await jobsApi.save([...jobHistory, blankJob]);
            setJobHistory(saved);
        } catch (e) {
            setMutationError(e instanceof Error ? e.message : 'Unable to add job');
        } finally {
            mutationInFlight.current = false;
            setIsMutating(false);
        }
    }

    const updateJob = async (id: string, updatedJob: JobEntry) => {
        if (mutationInFlight.current) throw new Error('Another job change is currently being saved');
        mutationInFlight.current = true;
        setIsMutating(true);
        setMutationError(null);
        const updated = jobHistory.map((job) => job.id !== id ? job : updatedJob);
        try {
            const saved = await jobsApi.save(updated);
            setJobHistory(saved);
        } finally {
            mutationInFlight.current = false;
            setIsMutating(false);
        }
    };

    const removeJob = async (id: string) => {
        if (mutationInFlight.current) return;
        mutationInFlight.current = true;
        setIsMutating(true);
        setMutationError(null);
        const updated = jobHistory.filter(job => job.id !== id);
        try {
            const saved = await jobsApi.save(updated);
            setJobHistory(saved);
        } catch (e) {
            setMutationError(e instanceof Error ? e.message : 'Unable to delete job');
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
                    <h2 className="text-lg font-semibold text-gray-900">Work History</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Your professional experience.</p>
                </div>
                <button
                    className="min-w-[66px] px-4 py-1.5 text-xs font-medium text-white bg-slate-700 rounded hover:bg-slate-600 transition-colors"
                    onClick={handleAddJob}
                    disabled={isMutating}
                >+ Add</button>
            </div>
            {mutationError && <p role="alert" className="text-sm text-red-600">{mutationError}</p>}
            <DragDropProvider onDragEnd={handleDragEnd} >
                <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,400px),1fr))] gap-4 items-start">
                    {jobHistory.map((job: JobEntry, index:number) => (
                        <JobEntryForm index={index} key={job.id} job={job} handleUpdate={updateJob} handleDelete={removeJob} isMutating={isMutating} />
                    ))}
                </div>
            </DragDropProvider>
        </div>
    )
}
