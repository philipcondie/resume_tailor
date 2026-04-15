import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { JobEntry, LLMInput, ResumeMetadata, ResumeRequest } from "../types/resume";
import { resumeApi, jobsApi, ApiError } from "../lib/api";
import { Spinner } from "../components/utils/Spinner";
import { useEditHistory } from "../hooks/useEditHistory";

export function Generate() {
    const navigate = useNavigate();
    const { clearHistory } = useEditHistory();
    
    const [jobHistory, setJobHistory] = useState<JobEntry[]>([]);
    const [filename, setFilename] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [jobDescription, setJobDescription] = useState<string>('');
    const [userInstructions, setUserInstructions] = useState<string>('');
    const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set());

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

    const formBulletId = (jobId: string, bullet: string) => {
        return `${jobId}::${bullet}`;
    };

    const [enabledBullets, setEnabledBullets] = useState<Set<string>>(
        () => new Set(jobHistory.flatMap(job => 
            job.bullets.map(bullet => formBulletId(job.id,bullet))
        ))
    );
    
    const isJobEnabled = (job:JobEntry) => job.bullets.some(b => enabledBullets.has(`${job.id}::${b}`));
    const isJobFullyEnabled = (job:JobEntry) => job.bullets.every(b => enabledBullets.has(`${job.id}::${b}`));

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            // assemble llm input
            const input: LLMInput = {
                jobs: jobHistory
                    .filter(j => isJobEnabled(j))
                    .map(j => ({...j, bullets: j.bullets.filter(b => enabledBullets.has(formBulletId(j.id,b)))})),
                userInstructions: userInstructions,
                jobDescription: jobDescription,
            }
            const request: ResumeRequest = {
                input: input,
                filename: filename,
            }
            // do api call
            const response: ResumeMetadata = await resumeApi.generate(request);
            
            clearHistory();

            // navigate to preview
            navigate(`/preview/${response.id}`)
        } catch(err) {
            setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
            setIsLoading(false);
        }
    }

    const onJobChange = (job: JobEntry) => {
        const next = new Set(enabledBullets)
        if (isJobFullyEnabled(job)) {
            job.bullets.forEach(bullet => next.delete(formBulletId(job.id,bullet)));
        } else {
            job.bullets.forEach(bullet => next.add(formBulletId(job.id,bullet)));
        }
        setEnabledBullets(next);
    };

    const onBulletChange = (targetId:string) => {
        const next = new Set(enabledBullets);
        if (next.has(targetId)) {
            next.delete(targetId);
        } else {
            next.add(targetId);
        }
        setEnabledBullets(next);
    };

    const toggleExpanded = (jobId:string) => {
        const next = new Set(expandedJobs);
        if (next.has(jobId)) {
            next.delete(jobId)
        } else {
            next.add(jobId);
        }
        setExpandedJobs(next);
    };
    
    return (
        <div className="flex flex-col gap-6 max-w-xxl bg-white rounded-xl border border-gray-200 p-8">
            <div>
                <h2 className="text-lg font-semibold text-gray-900">Generate Resume</h2>
                <p className="text-sm text-gray-500 mt-0.5">Paste a job description and generate a tailored resume.</p>
            </div>
            <details className="flex flex-col gap-1">
                <summary className="text-xs font-medium uppercase tracking-wide text-gray-600 cursor-pointer list-none flex items-center gap-1.5 select-none">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform [[open]>&]:rotate-90">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                    Filter Job History
                </summary>
                <div className="flex flex-col gap-1.5 mt-2">
                    {jobHistory.map((job) => (
                        <div key={job.id} className="rounded border border-gray-200 overflow-hidden">
                            {/* Job header row */}
                            <div className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                <button
                                    type="button"
                                    onClick={() => toggleExpanded(job.id)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg
                                        width="12" height="12" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                        className={`transition-transform ${expandedJobs.has(job.id) ? 'rotate-90' : ''}`}
                                    >
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </button>
                                <label className="flex items-center gap-2.5 cursor-pointer flex-1">
                                    <input
                                        type="checkbox"
                                        className="accent-slate-700"
                                        ref={el => { if (el) el.indeterminate = isJobEnabled(job) && !isJobFullyEnabled(job); }}
                                        checked={isJobFullyEnabled(job)}
                                        onChange={() => onJobChange(job)}
                                    />
                                    <span>{job.role} <span className="text-gray-400">—</span> {job.company}</span>
                                </label>
                            </div>
                            {/* Bullet list (collapsible) */}
                            {expandedJobs.has(job.id) && (
                                <div className="flex flex-col gap-0.5 px-3 pb-2 ml-10.5">
                                    {job.bullets.map((bullet, i) => (
                                        <label key={i} className="flex items-start gap-2 py-1 text-xs text-gray-600 cursor-pointer hover:text-gray-900 transition-colors">
                                            <input
                                                type="checkbox"
                                                className="accent-slate-700 mt-0.5"
                                                checked={enabledBullets.has(formBulletId(job.id, bullet))}
                                                onChange={() => onBulletChange(formBulletId(job.id, bullet))}
                                            />
                                            <span>{bullet}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </details>
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium uppercase tracking-wide text-gray-600">File Name</label>
                <input
                    className="border border-gray-300 rounded bg-transparent px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors resize-y"
                    value={filename}
                    placeholder="Enter file name..."
                    onChange={e => setFilename(e.target.value)}
                />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium uppercase tracking-wide text-gray-600">Job Description</label>
                <textarea
                    className="border border-gray-300 rounded bg-transparent px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors resize-y"
                    value={jobDescription}
                    onChange={e => setJobDescription(e.target.value)}
                    rows={10}
                />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium uppercase tracking-wide text-gray-600">User Instructions</label>
                <textarea
                    className="border border-gray-300 rounded bg-transparent px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors resize-y"
                    value={userInstructions}
                    onChange={e => setUserInstructions(e.target.value)}
                    rows={10}
                />
            </div>
            {error &&
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3">
                    {error.message}
                </div>
            }
            <div className="flex gap-3 pt-2 border-t border-gray-100 items-center">
                <button
                    className="ml-auto px-4 py-1.5 text-xs font-medium text-white bg-slate-700 rounded hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    onClick={handleGenerate}
                    disabled={jobDescription === '' || filename === '' || isLoading}
                >
                    Generate Resume
                </button>
                {isLoading && <Spinner />}
            </div>
        </div>
    )
}