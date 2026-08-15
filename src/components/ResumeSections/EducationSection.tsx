import { SectionProps } from "../../types/resume";
import { BulletSection } from "./BulletSection";
import { EditableInline } from "../utils/EditableFields";
import { shouldRenderEducation } from "../../lib/resumeVisibility";

export function EducationSection({draft,updateSection}:SectionProps) {
    if (!draft.education.some(shouldRenderEducation)) return null;

    return (
        <section className="section">
            <h2 className="section-title">Education</h2>
            <BulletSection 
                items={draft.education} 
                shouldRenderItem={shouldRenderEducation}
                onItemsChange={(education) => updateSection('education',education)}
                renderHeader={(education,updateItemField) => (
                    <div className="section-item-header">
                        <span className="section-item-primary"><EditableInline className='editable' content={education.school} handleChange={(text) => updateItemField('school',text)}/></span>
                        <span className="section-item-secondary"><EditableInline className='editable' content={education.degree} handleChange={(text) => updateItemField('degree',text)}/></span>
                    </div>
                )}
            />
        </section>
    )
}
