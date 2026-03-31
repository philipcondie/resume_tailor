import { PersonalInfoEntry } from "../types/resume";
import { EditableInline } from "./EditableFields";

type PersonalInfoProps = {
    draft: PersonalInfoEntry,
    onChange: (draft:PersonalInfoEntry) => void,
}

export function PersonalInfoComponent({draft, onChange}:PersonalInfoProps) {
    const handleExtraChange = (index:number, text:string) => {
        onChange({...draft,
            extras: draft.extras?.map((e,i) => i === index ? text: e)
        });
    };

    return (
        <header className="header">
            <h1><EditableInline className='editable' content={draft.name} handleChange={(text) => onChange({...draft, name:text})}/></h1>
            <div className="contact-info">
                <EditableInline className='editable' content={draft.email} handleChange={(text) => onChange({...draft,email:text})}/> &nbsp;|&nbsp; <EditableInline className='editable' content={draft.phonenumber} handleChange={(text) => onChange({...draft,phonenumber:text})}/>{draft.extras?.map((extra:string,i:number) => (
                    <span key={i}>&nbsp;|&nbsp; <EditableInline className='editable' content={extra} handleChange={(text) => handleExtraChange(i,text)}/></span>
                ))}
            </div>
        </header>
    );
}