import { SectionProps } from "../../types/resume";
import { BulletSection } from "./BulletSection";
import { EditableLinkableText } from "../utils/EditableLinkableText";

export function ProjectSection({draft,updateSection}:SectionProps) {
    return (
        <section className="section">
            <h2 className="section-title">Projects</h2>
            <BulletSection 
                items={draft.projects} 
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
