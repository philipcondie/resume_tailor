import { useMemo } from "react";
import { LayoutProps } from "../../types/SectionRegistry";
import { PersonalInfoSection } from "../ResumeSections/PersonalInfoSection";
import { multipanelSectionRegistry } from "../../types/SectionRegistry";
import { renderPanel } from "../../lib/renderPanel"

export function MultipanelLayout({resume, sections, updateSection}: LayoutProps) {
    const sorted = useMemo(
        () => [...sections].sort((a, b) => a.ordering - b.ordering),
        [sections]
    );

    return (
        <div className="layout-multipanel">
            <PersonalInfoSection draft={resume} updateSection={updateSection} />
            <div className="main-panel">
                {renderPanel(
                    sorted, resume, "main", multipanelSectionRegistry, updateSection
                )}
            </div>
            <div className="left-panel">
                {renderPanel(
                    sorted, resume, "left", multipanelSectionRegistry, updateSection
                )}
            </div>
            <div className="right-panel">
                {renderPanel(
                    sorted, resume, "right", multipanelSectionRegistry, updateSection
                )}
            </div>
        </div>
    )
}