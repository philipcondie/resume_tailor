import { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { ResumeData, SectionProps } from '../types/resume';

import './Preview.css';
import { useResumeData } from '../hooks/dataHooks';
import { PersonalInfoSection } from '../components/PersonalInfoSection';
import { useLayoutConfig } from '../hooks/useLayoutConfig';
import { sectionRegistry } from '../types/SectionRegistry';
import { SectionSelector } from '../components/SectionSelector';

export function Preview() {
    const location = useLocation();
    
    const {resumeData: savedResumeData, saveResumeData } = useResumeData();
    const data = location.state?.['resume-data'] ?? savedResumeData;
    
    const [draft, setDraft] = useState<ResumeData>(data);
    const isEditing = JSON.stringify(draft) !== JSON.stringify(data);

    const {layoutConfig, setLayoutConfig} = useLayoutConfig();
    const sortedConfig = useMemo(
        () => [...layoutConfig].sort((a,b) => a.ordering - b.ordering),
        [layoutConfig]
    )

    const pageRef = useRef<HTMLDivElement>(null);
    const [isOverflowing, setIsOverflowing] = useState<boolean>(false);

    useEffect(() => {
        requestAnimationFrame(() => {
            setIsOverflowing(!!pageRef.current && pageRef.current.scrollHeight > pageRef.current.clientHeight);
        })
    },[draft,layoutConfig])

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
               <SectionSelector layoutConfig={layoutConfig} setLayoutConfig={setLayoutConfig}/>
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
                <div ref={pageRef} className="page">
                    <PersonalInfoSection draft={draft} updateSection={updateSection} />
                    {sortedConfig.map(section => {
                        if (section.enabled) {
                            const Component = sectionRegistry[section.name];
                            return <Component key={section.name} draft={draft} updateSection={updateSection} />
                        }
                    })}
                </div>
            </div>
        </div>
    )
}