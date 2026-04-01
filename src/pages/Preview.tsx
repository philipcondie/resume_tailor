import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ResumeData, EducationEntry, JobEntry, ProjectEntry, SkillEntry, PersonalInfoEntry } from '../types/resume';
import { EditableTextArea, EditableInline } from '../components/EditableFields';
import { SummaryComponent } from '../components/SummaryComponent';
import './Preview.css';
import { useResumeData } from '../hooks/dataHooks';
import { PersonalInfoComponent } from '../components/PersonalInfoComponent';
import { JobSection } from '../components/JobSection';
import { EducationSection } from '../components/EducationSection';
import { ProjectSection } from '../components/ProjectSection';
import { SkillSection } from '../components/SkillsSection';
import { BulletSection } from '../components/BulletSection';

export function Preview() {
    const location = useLocation();
    
    const {resumeData: savedResumeData, saveResumeData } = useResumeData();
    const data = location.state?.['resume-data'] ?? savedResumeData;
    
    const [draft, setDraft] = useState<ResumeData>(data);
    const isEditing = JSON.stringify(draft) !== JSON.stringify(data);

    const [showSummary, setShowSummary] = useState<boolean>(true);

    const pageRef = useRef<HTMLDivElement>(null);
    const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
    useEffect(() => {
        requestAnimationFrame(() => {
            setIsOverflowing(!!pageRef.current && pageRef.current.scrollHeight > pageRef.current.clientHeight);
        })
    },[draft,showSummary])

    const updateField = <K extends keyof ResumeData>(key:K, value:ResumeData[K]) => {
        setDraft(prev => ({
            ...prev,
            [key]: value,
        }))
    }

    if (!data) {
        return (
            <div>
                No resume data found
            </div>
        )
    }
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="edit-toolbar flex items-center gap-3 px-6 py-3 bg-white border-b border-gray-200">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mr-auto">Preview</p>
                {isOverflowing && <p className="text-xs font-medium text-red-500">Content exceeds one page</p>}
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 cursor-pointer select-none hover:text-gray-800 transition-colors">
                    <input type='checkbox' checked={showSummary} onChange={()=>setShowSummary(!showSummary)} className="accent-slate-700 w-3.5 h-3.5 cursor-pointer rounded"/>
                    Show Summary
                </label>
                <button
                    className="px-4 py-1.5 text-xs font-medium border border-gray-300 text-gray-600 bg-white rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        onClick={() => setDraft(data)}
                        disabled={!isEditing}
                >Reset</button>
                <button
                        className="px-4 py-1.5 text-xs font-medium text-white bg-slate-700 rounded hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        onClick={()=> saveResumeData(draft)}
                        disabled={!isEditing}
                >Save</button>
                <button
                    className="px-4 py-1.5 text-xs font-medium text-white bg-slate-700 rounded hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    onClick={()=> window.print()}
                    disabled={isEditing || isOverflowing}
                >Print</button>
            </div>
            <div className="preview-wrapper">
                <div ref={pageRef} className="page" >
                    <PersonalInfoComponent personalInfo={draft.personalInfo} onChange={(personalInfo) => updateField('personalInfo',personalInfo)} />

                    {/* ══ SUMMARY ══ */}
                    {showSummary && 
                        <SummaryComponent summary={draft.summary} onChange={(summary) => updateField('summary',summary)} />
                    }

                    {/* ══ WORK EXPERIENCE ══ */}
                    <BulletSection 
                        items={draft.jobs} 
                        onChange={(jobs) => updateField('jobs',jobs)} 
                        renderHeader={(job,updateField) => (
                            <div className="job-header">
                                <span className="job-title-line"><EditableInline className='editable' content={job.role} handleChange={(text)=>updateField('role',text)} /> — <EditableInline className='editable' content={job.company} handleChange={(text)=>updateField('company',text)} />{job.location && <> — <EditableInline className='editable' content={job.location} handleChange={(text)=>updateField('location',text)} /></>}</span>
                                <span className="job-date"><EditableInline className='editable' content={job.startDate} handleChange={(text)=>updateField('startDate',text)} /> - <EditableInline className='editable' content={job.endDate} handleChange={(text)=>updateField('endDate',text)} /></span>
                            </div>
                        )
                    }/>

                    {/* ══ EDUCATION ══ */}
                    <BulletSection items={draft.educations} onChange={(educations) => updateField('educations',educations)}
                        renderHeader={(education,updateField) => (
                            <div className="edu-header">
                                <span className="edu-school"><EditableInline className='editable' content={education.school} handleChange={(text) => updateField('school',text)}/></span>
                                <span className="edu-degree"><EditableInline className='editable' content={education.degree} handleChange={(text) => updateField('degree',text)}/></span>
                            </div>
                        )}
                    />

                    {/* ══ PROJECTS ══ */}
                    {draft.projects && draft.projects.length > 0 && 
                        <BulletSection 
                            items={draft.projects} 
                            onChange={(projects) => updateField('projects',projects)}
                            renderHeader={(project,updateField) => (
                                <div className="job-header">
                                    <span className="job-title-line"><EditableInline className='editable' content={project.title} handleChange={(text) => updateField('title',text)}/></span>
                                </div>
                            )}
                        />
                    }

                    {/* ══ SKILLS ══ */}
                    {draft.skills && draft.skills.length > 0 && 
                        <SkillSection skills={draft.skills} onChange={(skills) => updateField('skills',skills)} />
                    }
                </div>
            </div>
        </div>
    )
}