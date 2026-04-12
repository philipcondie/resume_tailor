import { useState, useEffect } from "react";
import { JobEntryForm } from "../../components/InputForms/JobEntryForm";
import { JobEntry } from "../../types/resume";
import { ApiError, jobsApi } from "../../lib/api";
import { Spinner } from "../../components/utils/Spinner";

export function JobEntryContainer() {
    const [jobHistory, setJobHistory] = useState<JobEntry[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        jobsApi.get()
            .then((data) => setJobHistory(data))
            .catch((error) => {
                if (error instanceof ApiError && error.status == 404) {
                    setJobHistory([]);
                } else {
                    setError(error);
                }
            })
            .finally(() => setIsLoading(false))
    }, [])

    const handleAddJob = () => {
        const blankJob: JobEntry = {
            id: crypto.randomUUID(),
            company: '',
            role: '',
            location: '',
            startDate: '',
            endDate: '',
            bullets: [],
        }
        setJobHistory(prev => [...prev, blankJob]);
    }

    const updateJob = (id: string, updatedJob: JobEntry) => {
        const updated = jobHistory.map((job) => job.id !== id ? job : updatedJob);
        jobsApi.save(updated);
        setJobHistory(updated);
    };

    const removeJob = (id: string) => {
        const updated = jobHistory.filter(job => job.id !== id);
        jobsApi.save(updated);
        setJobHistory(updated);
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
                    className="px-4 py-1.5 text-xs font-medium text-white bg-slate-700 rounded hover:bg-slate-600 transition-colors"
                    onClick={handleAddJob}
                >+ Add</button>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,400px),1fr))] gap-4">
                {jobHistory.map((job: JobEntry) => (
                    <JobEntryForm key={job.id} job={job} handleUpdate={updateJob} handleDelete={removeJob} />
                ))}
            </div>
        </div>
    )
}
