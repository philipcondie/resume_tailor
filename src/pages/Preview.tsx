import { useState, useRef, useEffect, useMemo } from 'react';
import { data, useParams } from 'react-router-dom';

import { useEditHistory } from '../hooks/useEditHistory';
import { LayoutConfig, ResumeData, ResumeStyling } from '../types/resume';
import './Preview.css';
import { templateRegistry } from '../types/SectionRegistry';
import { EditToolBar } from '../components/ResumeSections/EditToolBar';
import { resumeApi, stylingApi } from '../lib/api';
import { Spinner } from '../components/utils/Spinner';
import { Modal } from '../components/utils/Modal';
import { LayoutConfigComponent } from '../components/LayoutConfigComponent';


export function Preview() {
    const {resumeId} = useParams();
    const [resumeData, setResumeData] = useState<ResumeData | null>(null);
    const [jobDescription, setJobDescription] = useState<string>('');
    const [draft, setDraft] = useState<ResumeData | null>(null);
    const [filename, setFilename] = useState<string | null>(null);
    const [isLoadingResume, setIsLoadingResume] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null)
    const [saveError, setSaveError] = useState<string | null>(null);
    const [downloadError, setDownloadError] = useState<string | null>(null);
    const [layoutConfig, setLayoutConfig] = useState<LayoutConfig | null>(null);
    const [draftLayout, setDraftLayout] = useState<LayoutConfig | null >(null);
    const [styling, setStyling] = useState<ResumeStyling | null>(null);
    const [isLoadingStyling, setIsLoadingStyling] = useState<boolean>(true);
    const [stylingError, setStylingError] = useState<Error | null>(null);
    const isEditing = (JSON.stringify(draft) !== JSON.stringify(resumeData)) || (JSON.stringify(layoutConfig) !== JSON.stringify(draftLayout));
    const isLoading = isLoadingResume || isLoadingStyling;

    const { save, canUndo, undo, canRedo, redo } = useEditHistory();

    // modal state
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
                setJobDescription(data.jobDescription);
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

    if (isLoading) return <Spinner />;
    if (error) return <div>{error.message}</div>;
    if (stylingError) return <div>{stylingError.message}</div>;
    if (!draft || !resumeData || !styling || !draftLayout) return <div>No resume data found</div>;

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

    const handleSaveModal = (config: LayoutConfig) => {
        setDraftLayout(config);
        setIsModalOpen(false);
    }

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
    
    const template = templateRegistry[draftLayout.selectedTemplate];
    const Layout = template.layout;
    return (
        <div className="min-h-screen flex flex-col gap-6">
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <LayoutConfigComponent layoutConfig={draftLayout} isSaving={false} error={null} handleSave={handleSaveModal} isModal={true} />
            </Modal>
            <details className="group flex flex-col gap-1">
                <summary className="text-xs font-medium uppercase tracking-wide text-gray-600 cursor-pointer list-none flex items-center gap-1.5 select-none">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-open:rotate-90">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                    Job Description
                </summary>
                <div className="rounded border border-gray-200 overflow-hidden">
                    <p className="text-xs text-gray-700 whitespace-pre-wrap px-3 py-2 max-h-64 overflow-y-auto">{jobDescription}</p>
                </div>
            </details>
            <div>
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
                    onOpenLayout={() => setIsModalOpen(true)}
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
                <div className="bg-[#e8e8e8] min-h-screen p-4 overflow-x-auto" style={style}>
                    <div ref={pageRef} className="page" >
                        <Layout resume={draft} sections={draftLayout.templates[draftLayout.selectedTemplate].sections} updateSection={updateSection}/>
                    </div>
                </div>
            </div>
        </div>
    )
}