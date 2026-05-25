import { useMemo } from "react";
import { LayoutProps } from "../../types/SectionRegistry";
import { PersonalInfoSection } from "../ResumeSections/PersonalInfoSection";
import { sidebarSectionRegistry } from "../../types/SectionRegistry";
import { renderPanel } from "../../lib/renderPanel"

export function SidebarLayout({ resume, sections, updateSection }: LayoutProps) {
    const sorted = useMemo(
        () => [...sections].sort((a, b) => a.ordering - b.ordering),
        [sections]
    );

    return (
        <>
            <PersonalInfoSection draft={resume} updateSection={updateSection} />
            <div className="grid grid-cols-[1fr_2fr]">
                <div>
                    {renderPanel(
                        sorted, resume, "sidebar", sidebarSectionRegistry, updateSection
                    )}
                </div>
                <div>
                    {renderPanel(
                        sorted, resume, "main", sidebarSectionRegistry, updateSection
                    )}
                </div>
            </div>
        </>
    )
}