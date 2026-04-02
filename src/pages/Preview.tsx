import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { ResumeData } from '../types/resume';
import { EditableInline } from '../components/EditableFields';
import { SummaryComponent } from '../components/SummaryComponent';
import './Preview.css';
import { useResumeData } from '../hooks/dataHooks';
import { PersonalInfoComponent } from '../components/PersonalInfoComponent';
import { SkillSection } from '../components/SkillsSection';
import { BulletSection } from '../components/BulletSection';
import { EducationSection} from '../components/EducationSection';
import { JobSection } from '../components/JobSection';
import { ProjectSection } from '../components/ProjectSection';

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

    const updateSection = <K extends keyof ResumeData>(key:K, value:ResumeData[K]) => {
        setDraft((prev) => ({...prev, [key]:value}));
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
                    <PersonalInfoComponent draft={draft} updateSection={updateSection} />

                    {/* ══ SUMMARY ══ */}
                    {showSummary && 
                        <SummaryComponent draft={draft} updateSection={updateSection} />
                    }

                    {/* ══ WORK EXPERIENCE ══ */}
                    <JobSection draft={draft} updateSection={updateSection} />

                    {/* ══ EDUCATION ══ */}
                    <EducationSection draft={draft} updateSection={updateSection} />

                    {/* ══ PROJECTS ══ */}
                    {draft.projects.length > 0 &&
                        <ProjectSection draft={draft} updateSection={updateSection}/>
                    }

                    {/* ══ SKILLS ══ */}
                    {draft.skills && draft.skills.length > 0 && 
                        <SkillSection draft={draft} updateSection={updateSection} />
                    }
                </div>
            </div>
        </div>
    )
}