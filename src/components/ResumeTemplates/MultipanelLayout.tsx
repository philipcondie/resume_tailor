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
        <>
            <PersonalInfoSection draft={resume} updateSection={updateSection} />
            {renderPanel(
                sorted, resume, "main", multipanelSectionRegistry, updateSection
            )}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    {renderPanel(
                        sorted, resume, "left", multipanelSectionRegistry, updateSection
                    )}
                </div>
                <div className="border-l pl-4">
                    {renderPanel(
                        sorted, resume, "right", multipanelSectionRegistry, updateSection
                    )}
                </div>
            </div>
        </>
    )
}