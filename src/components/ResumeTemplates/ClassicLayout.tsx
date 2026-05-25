import { useMemo } from "react";
import { PersonalInfoSection } from "../ResumeSections/PersonalInfoSection"
import { LayoutProps } from "../../types/SectionRegistry"
import { classicSectionRegistry } from "../../types/SectionRegistry";
import { renderPanel } from "../../lib/renderPanel";

export function ClassicLayout({resume, sections, updateSection} : LayoutProps) {
    const sorted = useMemo(
        () => [...sections].sort((a, b) => a.ordering - b.ordering),
        [sections]
    );
    return (
        <>
            <PersonalInfoSection draft={resume} updateSection={updateSection}/>
            {renderPanel(sorted, resume, "main", classicSectionRegistry, updateSection)}
        </>
    )
}