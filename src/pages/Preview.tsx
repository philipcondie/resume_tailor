import { useState, useRef, useEffect, useMemo } from 'react';
import { data, useParams } from 'react-router-dom';

import { useEditHistory } from '../hooks/useEditHistory';
import { LayoutConfig, ResumeData, ResumeStyling } from '../types/resume';
import './Preview.css';
import { PersonalInfoSection } from '../components/ResumeSections/PersonalInfoSection';
import { SectionPanel } from '../components/SectionPanel';
import { sectionRegistry } from '../types/SectionRegistry';
import { EditToolBar } from '../components/ResumeSections/EditToolBar';
import { resumeApi, stylingApi } from '../lib/api';
import { Spinner } from '../components/utils/Spinner';

export function Preview() {
    const {resumeId} = useParams();
    const [resumeData, setResumeData] = useState<ResumeData | null>(null);
    const [draft, setDraft] = useState<ResumeData | null>(null);
    const [filename, setFilename] = useState<string | null>(null);
    const [isLoadingResume, setIsLoadingResume] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null)
    const [saveError, setSaveError] = useState<string | null>(null);
    const [downloadError, setDownloadError] = useState<string | null>(null);
    const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>([]);
    const [draftLayout, setDraftLayout] = useState<LayoutConfig>([]);
    const [styling, setStyling] = useState<ResumeStyling | null>(null);
    const [isLoadingStyling, setIsLoadingStyling] = useState<boolean>(true);
    const [stylingError, setStylingError] = useState<Error | null>(null);
    const isEditing = (JSON.stringify(draft) !== JSON.stringify(resumeData)) || (JSON.stringify(layoutConfig) !== JSON.stringify(draftLayout));
    const isLoading = isLoadingResume || isLoadingStyling;

    const { save, canUndo, undo, canRedo, redo } = useEditHistory();
    const [sectionsOpen, setSectionsOpen] = useState(false);

    const pageRef = useRef<HTMLDivElement>(null);
    const [isOverflowing, setIsOverflowing] = useState(true);

    useEffect(() => {
        if (!resumeId) return;
        resumeApi.get(resumeId)
            .then((data) => {
                setResumeData(data.resumeData);
                setDraft(data.resumeData);
                setFilename(data.filename);
                setLayoutConfig(data.layout);
                setDraftLayout(data.layout);
            })
            .catch(setError)
            .finally(() => setIsLoadingResume(false))
    }, [resumeId]);

    useEffect(() => {
        stylingApi.get()
            .then((data) => setStyling(data))
            .catch(setStylingError)
            .finally(() => setIsLoadingStyling(false))
    },[])

    useEffect(() => {
        requestAnimationFrame(() => {
            setIsOverflowing(!!pageRef.current && pageRef.current.scrollHeight > pageRef.current.clientHeight);
        })
    },[draft,draftLayout]);

    const sorted = useMemo(
        () => [...draftLayout].sort((a, b) => a.ordering - b.ordering),
        [draftLayout]
    );

    if (isLoading) return <Spinner />;
    if (error) return <div>{error.message}</div>;
    if (stylingError) return <div>{stylingError.message}</div>;
    if (!draft || !resumeData || !styling) return <div>No resume data found</div>;

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
        const failures: string[] = [];
        if(JSON.stringify(draft) !== JSON.stringify(resumeData)) {
            try {
                await resumeApi.updateData(resumeId,draft);
                save(resumeData);
                setResumeData(draft);
            } catch (e) {
                failures.push(`Failed to save content: ${e instanceof Error ? e.message : 'unknown error'}`);
            }
        }
        if (JSON.stringify(layoutConfig) !== JSON.stringify(draftLayout)) {
            try {
                await resumeApi.updateLayout(resumeId,draftLayout);
                setLayoutConfig(draftLayout);
            } catch (e) {
                failures.push(`Failed to save layout: ${e instanceof Error ? e.message : 'unknown error'}`);
            }
        }
        setSaveError(failures.length ? failures.join(' ') : null);
    };

    const onReset = () => {
        setDraft(resumeData);
        setDraftLayout(layoutConfig);
        setSaveError(null);
    };

    const onOpenSections = () => {setSectionsOpen(true)};

    const onDownload = async () => {
        if (!resumeId) return
        try {
            const blob = await resumeApi.download(resumeId)
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename + ".pdf";
            a.click();
            URL.revokeObjectURL(url);
        }
        catch (e) {
            setDownloadError(`Failed to download resume: ${e instanceof Error ? e.message : 'unknown error'}`)
        }
        
    };

    const style: React.CSSProperties & Record<`--${string}`, string> = {
        '--color-text-name': styling.colorTextName,
        '--color-accent': styling.colorAccent,
        '--font-main': styling.fontMain.map(f => f.includes(' ') ? `"${f}"` : f).join(', ')
      };

    return (
        <div className="min-h-screen">
            <EditToolBar
                filename={filename || "Preview"}
                isOverflowing={isOverflowing}
                isEditing={isEditing}
                canUndo={canUndo}
                onUndo={onUndo}
                canRedo={canRedo}
                onRedo={onRedo}
                onReset={onReset}
                onSave={onSave}
                onOpenSections={onOpenSections}
                onDownload={onDownload}
            />
            {saveError && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2 text-sm flex items-center justify-between">
                    <span>{saveError}</span>
                    <button onClick={() => setSaveError(null)} className="ml-2 underline">dismiss</button>
                </div>
            )}
            {downloadError && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2 text-sm flex items-center justify-between">
                    <span>{downloadError}</span>
                    <button onClick={() => setDownloadError(null)} className="ml-2 underline">dismiss</button>
                </div>
            )}
            <SectionPanel
                open={sectionsOpen}
                onClose={() => setSectionsOpen(false)}
                layoutConfig={draftLayout}
                setLayoutConfig={setDraftLayout}
            />

            <div className="preview-wrapper" style={style}>
                <div ref={pageRef} className="page" >
                    <PersonalInfoSection draft={draft} updateSection={updateSection} />
                    {sorted.map((section) => {
                        if (!section.enabled) return null;
                        const value = draft[section.name];
                        if (Array.isArray(value) && value.length === 0) return null;
                        if (typeof value === 'string' && value.trim() === '') return null;
                        const Component = sectionRegistry[section.name];
                        return <Component key={section.name} draft={draft} updateSection={updateSection} />
                        
                    })}
                </div>
            </div>
        </div>
    )
}