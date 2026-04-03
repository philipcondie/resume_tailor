import { SectionProps } from "../../types/resume";
import { BulletSection } from "./BulletSection";
import { EditableInline } from "../utils/EditableFields";

export function ProjectSection({draft,updateSection}:SectionProps) {
    return (
        <section className="section">
            <h2 className="section-title">Projects</h2>
            <BulletSection 
                items={draft.projects} 
                onItemsChange={(projects) => updateSection('projects',projects)}
                renderHeader={(project,updateItemField) => (
                    <div className="section-item-header">
                        <span className="section-item-primary"><EditableInline className='editable' content={project.title} handleChange={(text) => updateItemField('title',text)}/></span>
                    </div>
                )}
            />
        </section>
    )
}