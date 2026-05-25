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
        <div className="layout-sidebar">
            <PersonalInfoSection draft={resume} updateSection={updateSection} />
            <div className="sidebar-panel">
                {renderPanel(
                    sorted, resume, "sidebar", sidebarSectionRegistry, updateSection
                )}
            </div>
            <div className="main-panel">
                {renderPanel(
                    sorted, resume, "main", sidebarSectionRegistry, updateSection
                )}
            </div>
        </div>
    )
}