import { SectionConfig, ResumeData } from "../types/resume";
import { SectionRegistry } from "../types/SectionRegistry";

export function renderPanel(
    sections: SectionConfig[],
    resume: ResumeData, 
    panel: string, 
    registry: SectionRegistry, 
    updateSection: <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => void
) {
    return sections.map((section) => {
        if (!section.enabled || section.panel !== panel) return null;
        const Component = registry[section.name];
        return <Component key={section.name} draft={resume} updateSection={updateSection} />;        
    })
}
