import { SectionProps } from "../types/resume";
import { EditableTextArea } from "./EditableFields";

export function SummarySection({draft, updateSection}:SectionProps) {
    return (
        <section className="section summary">
            <h2 className="section-title">Summary</h2>
            <EditableTextArea className='editable' content={draft.summary} handleChange={(text) => updateSection('summary', text)}/>
        </section>
    )
}