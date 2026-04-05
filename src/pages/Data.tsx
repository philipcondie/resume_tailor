import { useRef } from "react";
import { ProfileData, ProfileExportData, ProfileExportDataSchema, JobEntry, EducationEntry, ProjectEntry, SkillEntry, PersonalInfoEntry } from "../types/resume";
import { useJobHistory, usePersonalInfo, useEducationHistory, useProjectHistory, useSkillList, useResumeData } from "../hooks/dataHooks";

function serializeExportData(personalInfo: PersonalInfoEntry, jobs:JobEntry[], education:EducationEntry[], projects:ProjectEntry[], skills:SkillEntry[]): ProfileExportData {
    return {
        exportedAt: new Date().toISOString(),
        profile: {
            personalInfo: personalInfo,
            jobs: jobs,
            educations: education,
            projects: projects,
            skills: skills
        },
    };
}

function downloadJson(data: unknown, filename: string) {
    const json = JSON.stringify(data,null,2);
    const blob = new Blob([json],{ type: "application/json"});
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();

    URL.revokeObjectURL(url);
}

function deserializeProfileData(text: string): ProfileData | null {
    let parsed: unknown;
    try {
        parsed = JSON.parse(text);
    } catch {
        alert("Invalid file - could not parse data");
        return null;
    }
    const result = ProfileExportDataSchema.safeParse(parsed);
    if (!result.success) {
        alert("File format is not recognized");
        return null;
    }
    return result.data.profile;
}

export function Data() {
    const { jobHistory, clearJobHistory, bulkAddJobs } = useJobHistory();
    const { personalInfo, clearPersonalInfo, updatePersonalInfo } = usePersonalInfo();
    const { educationHistory, clearEducationHistory, bulkAddEducation } = useEducationHistory();
    const { projectHistory, clearProjectHistory, bulkAddProjects } = useProjectHistory();
    const { skillList, clearSkillList, bulkAddSkills } = useSkillList();
    
    const handleExport = () => {
        const exportData = serializeExportData(personalInfo,jobHistory,educationHistory,projectHistory,skillList);
        const filename = `profile-${Date.now()}.json`;
        downloadJson(exportData,filename);
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!confirm("This will override your existing data. Continue?")) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const data = deserializeProfileData(text);
            if (data) {
                if (data.personalInfo) {
                    clearPersonalInfo();
                    updatePersonalInfo(data.personalInfo);
                }
                if (data.jobs.length > 0) {
                    clearJobHistory();
                    bulkAddJobs(data.jobs);
                }
                if (data.educations.length > 0) {
                    clearEducationHistory();
                    bulkAddEducation(data.educations);
                }
                if (data.projects.length > 0) {
                    clearProjectHistory();
                    bulkAddProjects(data.projects);
                }
                if (data.skills.length > 0) {
                    clearSkillList();
                    bulkAddSkills(data.skills);
                }
            }
        };       
        reader.readAsText(file);
        event.target.value = "";
    }
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const dataStats = [
        { label: "Jobs", count: jobHistory.length },
        { label: "Education", count: educationHistory.length },
        { label: "Projects", count: projectHistory.length },
        { label: "Skills", count: skillList.length },
    ];

    const hasData = personalInfo.name || dataStats.some(s => s.count > 0);

    return (
        <div className="flex flex-col gap-6 max-w-xl">
            <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col gap-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Profile Data</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Export your profile as JSON or import from a previous export.</p>
                </div>

                {hasData && (
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-medium uppercase tracking-wide text-gray-600">Current Data</label>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                            {personalInfo.name && (
                                <p className="text-sm text-gray-900 col-span-2">{personalInfo.name} &middot; {personalInfo.email}</p>
                            )}
                            {dataStats.map(s => (
                                <div key={s.label} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">{s.label}</span>
                                    <span className="text-gray-900 font-medium">{s.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex gap-3 pt-2 border-t border-gray-100">
                    <button
                        className="px-4 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        Import
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={handleImport}
                    />
                    <button
                        className="ml-auto px-4 py-1.5 text-xs font-medium text-white bg-slate-700 rounded hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        onClick={handleExport}
                        disabled={!hasData}
                    >
                        Export
                    </button>
                </div>
            </div>
        </div>
    )
}