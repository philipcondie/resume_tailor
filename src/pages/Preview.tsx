import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ResumeData, EducationEntry, JobEntry, ProjectEntry, SkillEntry } from '../types/resume';
import { EditableTextArea } from '../components/EditableFields';
import './Preview.css';
import { useResumeData } from '../hooks/dataHooks';

export function Preview() {
    const location = useLocation();
    
    const {resumeData: savedResumeData, saveResumeData } = useResumeData();
    const data = location.state?.['resume-data'] ?? savedResumeData;
    
    const [draft, setDraft] = useState<ResumeData>(data);
    const isEditing = JSON.stringify(draft) !== JSON.stringify(data);

    const [showSummary, setShowSumamry] = useState<boolean>(true);

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

    const updateJobBullet = (jobId:string, bulletIndex:number, content:string) => {
        setDraft(prev => ({
            ...prev,
            jobs: prev.jobs.map( job => 
                job.id === jobId 
                ? {...job, bullets: job.bullets.map((b,i) => i === bulletIndex ? content : b )} 
                : job
            )
        }));
    }

    const addJobBullet = (jobId:string) => {
        setDraft(prev => ({
            ...prev,
            jobs: prev.jobs.map(job => 
                job.id === jobId
                ? {...job, bullets: [...job.bullets, '']}
                : job
            )
        }));
    };

    const deleteJobBullet = (jobId:string, bulletIndex:number) => {
        setDraft(prev => ({
            ...prev,
            jobs: prev.jobs.map( job => 
                job.id === jobId 
                ? {...job, bullets: job.bullets.filter((_,i) => i !== bulletIndex )} 
                : job
            )
        }));
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
                <input type='checkbox' checked={showSummary} onChange={()=>setShowSumamry(!showSummary)} className="accent-slate-700 w-3.5 h-3.5 cursor-pointer rounded"/>
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
            {/* == HEADER == */}
            <header className="header">
            <h1>{data.personalInfo.name}</h1>
            <div className="contact-info">
                {data.personalInfo.email} &nbsp;|&nbsp; {data.personalInfo.phonenumber} {data.personalInfo.extras?.map((extra:string,i:number) => (
                    <span key={i}>&nbsp;|&nbsp; {extra}</span>
                ))}
            </div>
            </header>

            {/* ══ SUMMARY ══ */}
            {showSummary && 
                <section className="section summary">
                    <h2 className="section-title">Summary</h2>
                    <EditableTextArea className='editable' content={draft.summary} handleChange={handleSummaryChange}/>
                </section>
            }

            {/* ══ WORK EXPERIENCE ══ */}
            <section className="section">
            <h2 className="section-title">Work Experience</h2>
            {draft.jobs.map((job : JobEntry) => (
                <div className="job" key={job.id}>
                    <div className="job-header">
                        <span className="job-title-line">{job.role} — {job.company}{job.location && <> — {job.location}</>}</span>
                        <span className="job-date">{job.startDate} - {job.endDate}</span>
                    </div>
                    <ul className="job-bullets">
                        {job.bullets.map((bullet, i) => (
                            <li key={i} className="bullet-row">
                                <EditableTextArea className='editable' content={bullet} handleChange={(text) => updateJobBullet(job.id,i,text)}/>
                                <button className='bullet-controls' onClick={() => deleteJobBullet(job.id,i)}>×</button>
                            </li>
                        ))}
                    </ul>
                    <button className='add-bullet-controls' onClick={() => addJobBullet(job.id)}>+</button>
                </div>
            ))}
            </section>

            {/* ══ EDUCATION ══ */}
            <section className="section">
            <h2 className="section-title">Education</h2>
            {/* map education entries */}
            {data.educations.map((education: EducationEntry) => (
                <div className="edu-entry" key={education.id}>
                <div className="edu-header">
                <span className="edu-school">{education.school}</span>
                <span className="edu-degree">{education.degree}</span>
                </div>
                {education.bullets?.map((bullet, i) => (
                    <div className="edu-details" key={i}>
                        {bullet}
                    </div>
                ))}
            </div>
            ))}
            </section>

            {/* ══ PROJECTS ══ */}
            {data.projects && data.projects.length > 0 && 
                <section className="section">
                <h2 className="section-title">Projects</h2>
                {data.projects.map((project: ProjectEntry) => (
                    <div className="job" key={project.id}>
                        <div className="job-header">
                            <span className="job-title-line">{project.title}</span>
                        </div>
                        <ul className="job-bullets">
                            {project.bullets.map((bullet, i) => (
                                <li key={i}>{bullet}</li>
                            ))}
                        </ul>
                    </div>
                ))}
                </section>
            }

            {/* ══ SKILLS ══ */}
            {data.skills && data.skills.length > 0 && 
                <section className='section'>
                    <h2 className="section-title">Technical Skills</h2>
                    <div className="skills-list">
                        {data.skills.map((skill: SkillEntry) => (
                            <div className="skill-line" key={skill.id}>
                                <span className="skill-category">{skill.title}: </span>
                                <span className="skill-values">{skill.text}</span></div>    
                        ))}
                    </div>
                </section>
            }            

        </div>
        </div>
        </div>
    )
}