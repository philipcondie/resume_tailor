import { useState, useRef, useEffect } from "react";
import { SectionData } from "../types/resume";

type SectionSelectorProps = {
    layoutConfig: SectionData[],
    setLayoutConfig: (config: SectionData[]) => void,
}

export function SectionSelector({ layoutConfig, setLayoutConfig }: SectionSelectorProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        if (open) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    const sorted = [...layoutConfig].sort((a, b) => a.ordering - b.ordering);

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
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="px-4 py-1.5 text-xs font-medium border border-gray-300 text-gray-600 bg-white rounded hover:bg-gray-50 transition-colors"
            >Sections</button>
            {open &&
                <div className="absolute top-full right-0 mt-1 flex flex-col gap-1 p-3 bg-white rounded-lg border border-gray-200 shadow-lg w-48 z-50">
                    {sorted.map((section, i) => (
                        <div key={section.name} className="flex items-center gap-1.5 text-xs text-gray-700">
                            <input
                                type="checkbox"
                                checked={section.enabled}
                                onChange={() => toggleSection(section.name)}
                                className="accent-slate-700 w-3.5 h-3.5 cursor-pointer rounded"
                            />
                            <span className="flex-1 capitalize">{section.name}</span>
                            <button
                                onClick={() => moveSection(section.name, -1)}
                                disabled={i === 0}
                                className="px-1 text-gray-400 hover:text-gray-700 disabled:opacity-20 disabled:cursor-not-allowed"
                            >&uarr;</button>
                            <button
                                onClick={() => moveSection(section.name, 1)}
                                disabled={i === sorted.length - 1}
                                className="px-1 text-gray-400 hover:text-gray-700 disabled:opacity-20 disabled:cursor-not-allowed"
                            >&darr;</button>
                        </div>
                    ))}
                </div>
            }
        </div>
    );
}