import { JobEntryForm } from "../../components/JobEntryForm";
import { JobEntry } from "../../types/resume";
import { useJobHistory } from "../../hooks/dataHooks";

export function JobEntryContainer() {
    const {jobHistory, newJob, updateJob, removeJob} = useJobHistory();

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
        newJob(blankJob);
    }

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
