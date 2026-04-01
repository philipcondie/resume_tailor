import { PersonalInfoEntry } from "../types/resume";
import { EditableInline } from "./EditableFields";

type PersonalInfoProps = {
    personalInfo: PersonalInfoEntry,
    onChange: (personalInfo:PersonalInfoEntry) => void,
}

export function PersonalInfoComponent({personalInfo, onChange}:PersonalInfoProps) {
    const handleExtraChange = (index:number, text:string) => {
        onChange({...personalInfo,
            extras: personalInfo.extras?.map((e,i) => i === index ? text: e)
        });
    };

    return (
        <header className="header">
            <h1><EditableInline className='editable' content={personalInfo.name} handleChange={(text) => onChange({...personalInfo, name:text})}/></h1>
            <div className="contact-info">
                <EditableInline className='editable' content={personalInfo.email} handleChange={(text) => onChange({...personalInfo,email:text})}/> &nbsp;|&nbsp; <EditableInline className='editable' content={personalInfo.phonenumber} handleChange={(text) => onChange({...personalInfo,phonenumber:text})}/>{personalInfo.extras?.map((extra:string,i:number) => (
                    <span key={i}>&nbsp;|&nbsp; <EditableInline className='editable' content={extra} handleChange={(text) => handleExtraChange(i,text)}/></span>
                ))}
            </div>
        </header>
    );
}