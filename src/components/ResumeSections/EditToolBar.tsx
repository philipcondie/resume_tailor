import { useState, useRef, useEffect} from 'react';
import { UndoIcon, RedoIcon } from '../utils/Icons';

type EditToolBarProps = {
    filename: string,
    isOverflowing: boolean,
    isEditing: boolean,
    canUndo: boolean,
    onUndo: () => void,
    canRedo: boolean,
    onRedo: () => void,
    onSave: () => void,
    onReset: () => void,
    onOpenLayout: () => void,
    onOpenStyling: () => void,
    onDownload: () => void,
}

export function EditToolBar({ filename, isOverflowing, isEditing, canUndo, onUndo, canRedo, onRedo, onSave, onReset, onOpenLayout, onOpenStyling, onDownload }:EditToolBarProps) {

    const [moreOpen, setMoreOpen] = useState(false);
    const moreRef = useRef<HTMLDivElement>(null);

    const pillColor = isOverflowing
        ? 'bg-red-50 text-red-600 border-red-200'
        : 'bg-gray-100 text-gray-500';

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
                setMoreOpen(false);
            }
        };
        if (moreOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [moreOpen]);

    return (
        <div className="edit-toolbar flex items-center gap-4 px-6 py-2.5 bg-white border-b border-gray-200">
            {/* ── Left: Title + Status ── */}
            <p className="text-sm font-semibold text-gray-600">{filename}</p>
            {isOverflowing && <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${pillColor}`}>
                &gt; 1 page
            </span>}

            {/* ── Spacer ── */}
            <div className="flex-1" />

            {/* ── History Group: icon-only button group ── */}
            <div className="flex">
                <button
                    className="p-1.5 border border-gray-300 bg-white text-gray-600 rounded-l hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    onClick={onUndo}
                    disabled={!canUndo}
                    title="Undo"
                >
                    <UndoIcon />
                </button>
                <button
                    className="p-1.5 border border-l-0 border-gray-300 bg-white text-gray-600 rounded-r hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    onClick={onRedo}
                    disabled={!canRedo}
                    title="Redo"
                >
                    <RedoIcon />
                </button>
            </div>

            {/* ── System Group: Save + Print ── */}
            <button
                className="px-2 py-1.5 text-xs font-medium border border-gray-300 text-gray-600 bg-white rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                onClick={onDownload}
                disabled={isEditing}
            >Download</button>
            <button
                className="px-4 py-1.5 text-xs font-medium border border-gray-300 text-gray-600 bg-white rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                onClick={() => window.print()}
                disabled={isEditing}
            >Print</button>
            <button
                className="px-4 py-1.5 text-xs font-medium text-white bg-slate-700 rounded hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                onClick={onSave}
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
                    <div className="absolute top-full right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg z-50 min-w-40 py-1">
                        <button
                            onClick={() => { onReset(); setMoreOpen(false); }}
                            disabled={!isEditing}
                            className="w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            Reset to last save
                        </button>
                        <button
                            onClick={() => { onOpenLayout(); setMoreOpen(false); }}
                            className="w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Layout
                        </button>
                        <button
                            onClick={() => { onOpenStyling(); setMoreOpen(false); }}
                            className="w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Styling
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}