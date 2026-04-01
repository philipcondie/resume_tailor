import { EditableTextArea } from "./EditableFields";

type SummaryProps = {
    summary: string,
    onChange: (summary: string) => void,
}
export function SummaryComponent({summary, onChange}:SummaryProps) {
    return (
        <section className="section summary">
            <h2 className="section-title">Summary</h2>
            <EditableTextArea className='editable' content={summary} handleChange={onChange}/>
        </section>
    )
}