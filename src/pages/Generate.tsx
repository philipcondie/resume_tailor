import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { LLMInput, LLMOutput, ResumeData } from "../types/resume";
import { useJobHistory, usePersonalInfo, useEducationHistory, useProjectHistory, useSkillList, useResumeData } from "../hooks/dataHooks";
import { tailorResume } from "../lib/claude";
import { useApiKey } from "../hooks/useApiKey";
import { Spinner } from "../components/utils/Spinner";
import { useEditHistory } from "../hooks/useEditHistory";
/**
 * 
 * generate button to kick off process X
 * overview of information to be sent
 * input for job description X
 * assemble info for api call
 * parse response then redirect with location state and local storage
 */

export function Generate() {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [userInstructions, setUserInstructions] = useState<string>('');

    const [jobDescription, setJobDescription] = useState<string>('');
    const { apiKey, saveApiKey } = useApiKey();
    const { jobHistory } = useJobHistory();
    const { personalInfo } = usePersonalInfo();
    const { educationHistory } = useEducationHistory();
    const { projectHistory } = useProjectHistory();
    const { skillList} = useSkillList();
    const { saveResumeData } = useResumeData();
    const { clearHistory } = useEditHistory();


    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            // assemble llm input
            const input: LLMInput = {
                info: {
                    generalInfo: ''
                },
                jobs: jobHistory,
                userInstructions: userInstructions,
            }
            // do api call
            const response : LLMOutput = await tailorResume(apiKey,jobDescription,input);
            // assemble resume data
            const resumeData : ResumeData = {
                personalInfo: personalInfo,
                educations: educationHistory,
                projects: projectHistory,
                skills: skillList,
                jobs: response.jobs,
                summary: response.summary
            }
            // save data to local storage
            saveResumeData(resumeData);
            clearHistory();

            // navigate to preview START HERE
            navigate("/preview", {
                state: {'resumeData': resumeData}
            })
        } catch(err) {
            setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
            setIsLoading(false);
        }
    }
    
    return (
        <div className="flex flex-col gap-6 max-w-xxl bg-white rounded-xl border border-gray-200 p-8">
            <div>
                <h2 className="text-lg font-semibold text-gray-900">Generate Resume</h2>
                <p className="text-sm text-gray-500 mt-0.5">Paste a job description and generate a tailored resume.</p>
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium uppercase tracking-wide text-gray-600">Anthropic API Key</label>
                <input
                    className="border-b border-gray-400 bg-transparent px-0 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
                    type="password"
                    value={apiKey}
                    onChange={e => saveApiKey(e.target.value)}
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
                    disabled={jobDescription === '' || apiKey === '' || isLoading}
                >
                    Generate Resume
                </button>
                {isLoading && <Spinner />}
            </div>
        </div>
    )
}