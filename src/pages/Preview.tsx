import { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { useResumeData } from '../hooks/dataHooks';
import { useEditHistory } from '../hooks/useEditHistory';
import { ResumeData } from '../types/resume';
import './Preview.css';
import { PersonalInfoSection } from '../components/PersonalInfoSection';
import { SectionPanel } from '../components/SectionPanel';
import { useLayoutConfig } from '../hooks/useLayoutConfig';
import { sectionRegistry } from '../types/SectionRegistry';

function UndoIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
    );
}

function RedoIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10" />
        </svg>
    );
}

export function Preview() {
    const location = useLocation();

    const {resumeData: savedResumeData, saveResumeData } = useResumeData();
    const data = location.state?.['resume-data'] ?? savedResumeData;

    const [draft, setDraft] = useState<ResumeData>(data);
    const isEditing = JSON.stringify(draft) !== JSON.stringify(data);

    const {layoutConfig, setLayoutConfig} = useLayoutConfig();
    const { save, canUndo, undo, canRedo, redo } = useEditHistory();
    const [moreOpen, setMoreOpen] = useState(false);
    const [sectionsOpen, setSectionsOpen] = useState(false);
    const moreRef = useRef<HTMLDivElement>(null);

    const pageRef = useRef<HTMLDivElement>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => {
            setIsOverflowing(!!pageRef.current && pageRef.current.scrollHeight > pageRef.current.clientHeight);
        })
    },[draft,layoutConfig]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
                setMoreOpen(false);
            }
        };
        if (moreOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [moreOpen]);

    const sorted = useMemo(
        () => [...layoutConfig].sort((a, b) => a.ordering - b.ordering),
        [layoutConfig]
    );

    const updateSection = <K extends keyof ResumeData>(key:K, value:ResumeData[K]) => {
        setDraft((prev) => ({...prev, [key]:value}));
    };

    const pillColor = isOverflowing
        ? 'bg-red-50 text-red-600 border-red-200'
        : 'bg-gray-100 text-gray-500';

    if (!data) {
        return (
            <div>
                No resume data found
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="edit-toolbar flex items-center gap-4 px-6 py-2.5 bg-white border-b border-gray-200">
                {/* ── Left: Title + Status ── */}
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Preview</p>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${pillColor}`}>
                    {isOverflowing ? '> 1 page' : '1 page'}
                </span>

                {/* ── Spacer ── */}
                <div className="flex-1" />

                {/* ── History Group: icon-only button group ── */}
                <div className="flex">
                    <button
                        className="p-1.5 border border-gray-300 bg-white text-gray-600 rounded-l hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        onClick={() => { const next = undo(draft); if (next) setDraft(next); }}
                        disabled={!canUndo}
                        title="Undo"
                    >
                        <UndoIcon />
                    </button>
                    <button
                        className="p-1.5 border border-l-0 border-gray-300 bg-white text-gray-600 rounded-r hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        onClick={() => { const next = redo(draft); if (next) setDraft(next); }}
                        disabled={!canRedo}
                        title="Redo"
                    >
                        <RedoIcon />
                    </button>
                </div>

                {/* ── System Group: Save + Print ── */}
                <button
                    className="px-4 py-1.5 text-xs font-medium border border-gray-300 text-gray-600 bg-white rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    onClick={() => window.print()}
                    disabled={isEditing || isOverflowing}
                >Print</button>
                <button
                    className="px-4 py-1.5 text-xs font-medium text-white bg-slate-700 rounded hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    onClick={() => { save(data); saveResumeData(draft); }}
                    disabled={!isEditing}
                >Save</button>

                {/* ── More menu ── */}
                <div ref={moreRef} className="relative">
                    <button
                        onClick={() => setMoreOpen(!moreOpen)}
                        className="p-1.5 border border-gray-300 bg-white text-gray-500 rounded hover:bg-gray-50 transition-colors"
                        title="More actions"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="5" r="2" />
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="12" cy="19" r="2" />
                        </svg>
                    </button>
                    {moreOpen && (
                        <div className="absolute top-full right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg z-50 min-w-[160px] py-1">
                            <button
                                onClick={() => { setDraft(data); setMoreOpen(false); }}
                                disabled={!isEditing}
                                className="w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                Reset to last save
                            </button>
                            <button
                                onClick={() => { setSectionsOpen(true); setMoreOpen(false); }}
                                className="w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                Sections
                            </button>
                        </div>
                    )}
                </div>
            </div>

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