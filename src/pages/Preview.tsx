import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ResumeData, EducationEntry, JobEntry, ProjectEntry, SkillEntry, PersonalInfoEntry } from '../types/resume';
import { EditableTextArea, EditableInline } from '../components/EditableFields';
import { SummaryComponent } from '../components/SummaryComponent';
import './Preview.css';
import { useResumeData } from '../hooks/dataHooks';
import { PersonalInfoComponent } from '../components/PersonalInfoComponent';
import { JobSection } from '../components/JobSection';

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

    const handleSummaryChange = (text: string) => {
        setDraft(prev => ({
            ...prev,
            'summary': text,
        }))
    };

    const handleJobChange = (jobs: JobEntry[]) => {
        setDraft(prev => ({
            ...prev,
            'jobs': jobs
        }))
    }

    const updatePersonalInfo = (draft: PersonalInfoEntry) => {
        setDraft(prev => ({
            ...prev,
            personalInfo: draft
        }));
    };

    const updateEducationField = (id: string, key: string, value: string) => {
        setDraft(prev => ({
            ...prev,
            educations: prev.educations.map(edu =>
                edu.id === id ? { ...edu, [key]: value } : edu
            )
        }));
    };

    const addEducationBullet = (id:string) => {
        setDraft(prev => ({
            ...prev,
            educations: prev.educations.map(edu =>
                edu.id === id
                ? { ...edu, bullets: [...(edu.bullets ?? []), '']}
                : edu
            )
        }));
    };

    const updateEducationBullet = (id: string, bulletIndex: number, content: string) => {
        setDraft(prev => ({
            ...prev,
            educations: prev.educations.map(edu =>
                edu.id === id
                    ? { ...edu, bullets: edu.bullets?.map((b, i) => i === bulletIndex ? content : b) }
                    : edu
            )
        }));
    };

    const deleteEducationBullet = (id: string, bulletIndex: number) => {
        setDraft(prev => ({
            ...prev,
            educations: prev.educations.map(edu => 
                edu.id === id
                ? { ...edu, bullets: edu.bullets?.filter((_,i) => i !== bulletIndex)}
                : edu
            )
        }));
    };

    const updateProjectField = (id: string, key: string, value: string) => {
        setDraft(prev => ({
            ...prev,
            projects: prev.projects?.map(project =>
                project.id === id ? { ...project, [key]: value } : project
            )
        }));
    };

    const updateProjectBullet = (projectId: string, bulletIndex: number, content: string) => {
        setDraft(prev => ({
            ...prev,
            projects: prev.projects?.map(project =>
                project.id === projectId
                    ? { ...project, bullets: project.bullets.map((b, i) => i === bulletIndex ? content : b) }
                    : project
            )
        }));
    };

    const addProjectBullet = (projectId: string) => {
        setDraft(prev => ({
            ...prev,
            projects: prev.projects?.map(project => 
                project.id === projectId
                ? {...project, bullets: [...project.bullets, '']}
                : project
            )
        }));
    };

    const deleteProjectBullet = (projectId: string, bulletIndex: number) => {
        setDraft(prev => ({
            ...prev,
            projects: prev.projects?.map(project =>
                project.id === projectId
                    ? { ...project, bullets: project.bullets.filter((_, i) => i !== bulletIndex) }
                    : project
            )
        }));
    };

    const updateSkillField = (id: string, key: string, value: string) => {
        setDraft(prev => ({
            ...prev,
            skills: prev.skills?.map(skill =>
                skill.id === id ? { ...skill, [key]: value } : skill
            )
        }));
    };

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
                <PersonalInfoComponent draft={draft.personalInfo} onChange={updatePersonalInfo} />

                {/* ══ SUMMARY ══ */}
                {showSummary && 
                    <SummaryComponent draft={draft.summary} onChange={handleSummaryChange} />
                }

                {/* ══ WORK EXPERIENCE ══ */}
                <JobSection jobs={draft.jobs} onChange={handleJobChange} />

                {/* ══ EDUCATION ══ */}
                <section className="section">
                <h2 className="section-title">Education</h2>
                {/* map education entries */}
                {draft.educations.map((education: EducationEntry) => (
                    <div className="edu-entry" key={education.id}>
                        <div className="edu-header">
                            <span className="edu-school"><EditableInline className='editable' content={education.school} handleChange={(text) => updateEducationField(education.id,'school',text)}/></span>
                            <span className="edu-degree"><EditableInline className='editable' content={education.degree} handleChange={(text) => updateEducationField(education.id,'degree',text)}/></span>
                        </div>
                        {education.bullets?.map((bullet, i) => (
                            <div className="edu-details bullet-row" key={i}>
                                <EditableTextArea className='editable' content={bullet} handleChange={(text) => updateEducationBullet(education.id,i,text)} />
                                <button className='bullet-controls' onClick={() => deleteEducationBullet(education.id,i)}>×</button>
                            </div>
                        ))}
                        <button className='add-bullet-controls' onClick={() => addEducationBullet(education.id)}>+</button>
                    </div>
                ))}
                </section>

                {/* ══ PROJECTS ══ */}
                {draft.projects && draft.projects.length > 0 && 
                    <section className="section">
                    <h2 className="section-title">Projects</h2>
                    {draft.projects.map((project: ProjectEntry) => (
                        <div className="job" key={project.id}>
                            <div className="job-header">
                                <span className="job-title-line"><EditableInline className='editable' content={project.title} handleChange={(text) => updateProjectField(project.id,'title',text)}/></span>
                            </div>
                            <ul className="job-bullets">
                                {project.bullets.map((bullet, i) => (
                                    <li key={i} className="bullet-row">
                                        <EditableTextArea className='editable' content={bullet} handleChange={(text) => updateProjectBullet(project.id,i,text)}/>
                                        <button className='bullet-controls' onClick={() => deleteProjectBullet(project.id,i)}>×</button>
                                    </li>
                                ))}
                            </ul>
                            <button className='add-bullet-controls' onClick={() => addProjectBullet(project.id)}>+</button>
                        </div>
                    ))}
                    </section>
                }

                {/* ══ SKILLS ══ */}
                {draft.skills && draft.skills.length > 0 && 
                    <section className='section'>
                        <h2 className="section-title">Technical Skills</h2>
                        <div className="skills-list">
                            {draft.skills.map((skill: SkillEntry) => (
                                <div className="skill-line" key={skill.id}>
                                    <span className="skill-category"><EditableInline content={skill.title} handleChange={(text)=>updateSkillField(skill.id,'title',text)}/>: </span>
                                    <span className="skill-values"><EditableInline content={skill.text} handleChange={(text)=>updateSkillField(skill.id,'text',text)}/></span></div>    
                            ))}
                        </div>
                    </section>
                }            

            </div>
            </div>
        </div>
    )
}