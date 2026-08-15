import { SectionProps } from "../../types/resume";
import { BulletSection } from "./BulletSection";
import { EditableLinkableText } from "../utils/EditableLinkableText";
import { shouldRenderProject } from "../../lib/resumeVisibility";

export function ProjectSection({draft,updateSection}:SectionProps) {
    if (!draft.projects.some(shouldRenderProject)) return null;

    return (
        <section className="section">
            <h2 className="section-title">Projects</h2>
            <BulletSection 
                items={draft.projects} 
                shouldRenderItem={shouldRenderProject}
                onItemsChange={(projects) => updateSection('projects',projects)}
                renderHeader={(project,updateItemField) => (
                    <div className="section-item-header">
                        <span className="section-item-primary"><EditableLinkableText value={project.title} handleChange={(title) => updateItemField('title',title)}/></span>
                    </div>
                )}
            />
        </section>
    )
}
