import { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { useResumeData } from '../hooks/dataHooks';
import { useEditHistory } from '../hooks/useEditHistory';
import { ResumeData } from '../types/resume';
import './Preview.css';
import { PersonalInfoSection } from '../components/ResumeSections/PersonalInfoSection';
import { SectionPanel } from '../components/SectionPanel';
import { useLayoutConfig } from '../hooks/useLayoutConfig';
import { sectionRegistry } from '../types/SectionRegistry';
import { EditToolBar } from '../components/ResumeSections/EditToolBar';

export function Preview() {
    const location = useLocation();

    const {resumeData: savedResumeData, saveResumeData } = useResumeData();
    const data = location.state?.['resume-data'] ?? savedResumeData;

    const [draft, setDraft] = useState<ResumeData>(data);
    const isEditing = JSON.stringify(draft) !== JSON.stringify(data);

    const {layoutConfig, setLayoutConfig} = useLayoutConfig();
    const { save, canUndo, undo, canRedo, redo } = useEditHistory();
    const [sectionsOpen, setSectionsOpen] = useState(false);

    const pageRef = useRef<HTMLDivElement>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => {
            setIsOverflowing(!!pageRef.current && pageRef.current.scrollHeight > pageRef.current.clientHeight);
        })
    },[draft,layoutConfig]);

    const sorted = useMemo(
        () => [...layoutConfig].sort((a, b) => a.ordering - b.ordering),
        [layoutConfig]
    );

    const updateSection = <K extends keyof ResumeData>(key:K, value:ResumeData[K]) => {
        setDraft((prev) => ({...prev, [key]:value}));
    };

    const onRedo = () => {
        const next = redo(draft);
        if (next) setDraft(next);
    };
    const onUndo = () => {
        const next = undo(draft);
        if (next) setDraft(next);
    };
    const onSave = () => {
        save(data); saveResumeData(draft);
    };
    const onReset = () => {
        setDraft(data);
    };
    const onOpenSections = () => {setSectionsOpen(true)};

    if (!data) {
        return (
            <div>
                No resume data found
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <EditToolBar 
                isOverflowing={isOverflowing}
                isEditing={isEditing}
                canUndo={canUndo}
                onUndo={onUndo}
                canRedo={canRedo}
                onRedo={onRedo}
                onReset={onReset}
                onSave={onSave}
                onOpenSections={onOpenSections}
            />
            <SectionPanel
                open={sectionsOpen}
                onClose={() => setSectionsOpen(false)}
                layoutConfig={layoutConfig}
                setLayoutConfig={setLayoutConfig}
            />

            <div className="preview-wrapper">
                <div ref={pageRef} className="page">
                    <PersonalInfoSection draft={draft} updateSection={updateSection} />
                    {sorted.map(section => {
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