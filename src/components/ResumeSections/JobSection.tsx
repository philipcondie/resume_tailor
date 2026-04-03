import { SectionProps } from "../../types/resume";
import { BulletSection } from "./BulletSection";
import { EditableInline } from "../utils/EditableFields";

export function JobSection({draft, updateSection}:SectionProps) {
    return (
        <section className="section">
            <h2 className="section-title">Work Experience</h2>
            <BulletSection
                items={draft.jobs}
                onItemsChange={(jobs) => updateSection('jobs', jobs)}
                renderHeader={(job, updateItemField) => (
                    <div className="section-item-header">
                        <span className="section-item-primary"><EditableInline className='editable' content={job.role} handleChange={(text) => updateItemField('role', text)} /> — <EditableInline className='editable' content={job.company} handleChange={(text) => updateItemField('company', text)} />{job.location && <> — <EditableInline className='editable' content={job.location} handleChange={(text) => updateItemField('location', text)} /></>}</span>
                        <span className="section-item-secondary"><EditableInline className='editable' content={job.startDate} handleChange={(text) => updateItemField('startDate', text)} /> - <EditableInline className='editable' content={job.endDate} handleChange={(text) => updateItemField('endDate', text)} /></span>
                    </div>
                )
            } />
        </section>
    )
}