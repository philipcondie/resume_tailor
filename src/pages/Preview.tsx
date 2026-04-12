import { useState, useRef, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useEditHistory } from '../hooks/useEditHistory';
import { ResumeData } from '../types/resume';
import './Preview.css';
import { PersonalInfoSection } from '../components/ResumeSections/PersonalInfoSection';
import { SectionPanel } from '../components/SectionPanel';
import { useLayoutConfig } from '../hooks/useLayoutConfig';
import { sectionRegistry } from '../types/SectionRegistry';
import { EditToolBar } from '../components/ResumeSections/EditToolBar';
import { resumeApi } from '../lib/api';
import { Spinner } from '../components/utils/Spinner';

export function Preview() {
    const {resumeId} = useParams();
    const [resume, setResume] = useState<ResumeData | null>(null);
    const [draft, setDraft] = useState<ResumeData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null)
    const isEditing = JSON.stringify(draft) !== JSON.stringify(resume);

    const {layoutConfig, setLayoutConfig} = useLayoutConfig();
    const { save, canUndo, undo, canRedo, redo } = useEditHistory();
    const [sectionsOpen, setSectionsOpen] = useState(false);

    const pageRef = useRef<HTMLDivElement>(null);
    const [isOverflowing, setIsOverflowing] = useState(true);

    useEffect(() => {
        if (!resumeId) return;
        resumeApi.get(resumeId)
            .then((data) => {
                setResume(data);
                setDraft(data);
            })
            .catch(setError)
            .finally(() => setIsLoading(false))
    }, [resumeId]);

    useEffect(() => {
        requestAnimationFrame(() => {
            setIsOverflowing(!!pageRef.current && pageRef.current.scrollHeight > pageRef.current.clientHeight);
        })
    },[draft,layoutConfig]);

    const sorted = useMemo(
        () => [...layoutConfig].sort((a, b) => a.ordering - b.ordering),
        [layoutConfig]
    );

    if (isLoading) return <Spinner />;
    if (error) return <div>{error.message}</div>;
    if (!draft || !resume) return <div>No resume data found</div>;

    const updateSection = <K extends keyof ResumeData>(key:K, value:ResumeData[K]) => {
        setDraft((prev) => prev ? ({...prev, [key]:value}) : prev);
    };

    const onRedo = () => {
        const next = redo(draft);
        if (next) setDraft(next);
    };
    const onUndo = () => {
        const next = undo(draft);
        if (next) setDraft(next);
    };
    const onSave = async () => {
        if (!draft || !resumeId) return; 
        await resumeApi.update(resumeId,draft);
        save(resume);
        setResume(draft);
    };
    const onReset = () => {
        setDraft(resume);
    };
    const onOpenSections = () => {setSectionsOpen(true)};

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