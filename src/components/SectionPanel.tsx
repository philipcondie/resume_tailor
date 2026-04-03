import { useRef, useEffect, useMemo } from 'react';
import { SectionData } from '../types/resume';

type SectionPanelProps = {
    open: boolean;
    onClose: () => void;
    layoutConfig: SectionData[];
    setLayoutConfig: (config: SectionData[]) => void;
};

export function SectionPanel({ open, onClose, layoutConfig, setLayoutConfig }: SectionPanelProps) {
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        if (open) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open, onClose]);

    const sorted = useMemo(
        () => [...layoutConfig].sort((a, b) => a.ordering - b.ordering),
        [layoutConfig]
    );

    const toggleSection = (name: string) => {
        setLayoutConfig(layoutConfig.map(s =>
            s.name === name ? { ...s, enabled: !s.enabled } : s
        ));
    };

    const moveSection = (name: string, direction: -1 | 1) => {
        const index = sorted.findIndex(s => s.name === name);
        const swapIndex = index + direction;
        if (swapIndex < 0 || swapIndex >= sorted.length) return;
        const updated = layoutConfig.map(s => {
            if (s.name === sorted[index].name) return { ...s, ordering: sorted[swapIndex].ordering };
            if (s.name === sorted[swapIndex].name) return { ...s, ordering: sorted[index].ordering };
            return s;
        });
        setLayoutConfig(updated);
    };

    return (
        <div className={`fixed inset-0 z-40 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute top-0 right-0 h-full flex items-start pt-14">
                <div
                    ref={panelRef}
                    className={`w-72 bg-white rounded-bl-xl border-l border-b border-gray-200 shadow-xl transition-transform duration-200 ${open ? 'translate-x-0' : 'translate-x-full'}`}
                >
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Sections</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">Toggle visibility and reorder</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                    <div className="p-3 flex flex-col gap-1">
                        {sorted.map((section, i) => (
                            <div
                                key={section.name}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <label className="relative inline-flex cursor-pointer shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={section.enabled}
                                        onChange={() => toggleSection(section.name)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-8 h-[18px] bg-gray-200 rounded-full peer-checked:bg-slate-700 transition-colors" />
                                    <div className="absolute top-[2px] left-[2px] w-[14px] h-[14px] bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-[14px]" />
                                </label>
                                <span className={`flex-1 text-xs capitalize ${section.enabled ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                                    {section.name}
                                </span>
                                <div className="flex flex-col -space-y-1">
                                    <button
                                        onClick={() => moveSection(section.name, -1)}
                                        disabled={i === 0}
                                        className="text-[10px] px-1 py-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                                    >&uarr;</button>
                                    <button
                                        onClick={() => moveSection(section.name, 1)}
                                        disabled={i === sorted.length - 1}
                                        className="text-[10px] px-1 py-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                                    >&darr;</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
