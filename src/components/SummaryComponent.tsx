import { SetStateAction } from "react";
import { EditableTextArea } from "./EditableFields";

type SummaryProps = {
    draft: string,
    onChange: (draft: string) => void,
}
export function SummaryComponent({draft, onChange}:SummaryProps) {
    return (
        <section className="section summary">
            <h2 className="section-title">Summary</h2>
            <EditableTextArea className='editable' content={draft} handleChange={onChange}/>
        </section>
    )
}