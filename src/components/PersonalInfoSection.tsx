import { EditableInline } from "./EditableFields";
import { SectionProps } from "../types/resume";


export function PersonalInfoSection({draft, updateSection}:SectionProps) {
    const handleExtraChange = (index:number, text:string) => {
        updateSection('personalInfo', { ...draft.personalInfo, extras: draft.personalInfo.extras?.map((e, i) => i === index ? text : e) })
    };

    return (
        <header className="header">
            <h1><EditableInline className='editable' content={draft.personalInfo.name} handleChange={(text) => updateSection('personalInfo',{...draft.personalInfo, name:text})}/></h1>
            <div className="contact-info">
                <EditableInline className='editable' content={draft.personalInfo.email} handleChange={(text) => updateSection('personalInfo', { ...draft.personalInfo, email: text })} /> &nbsp;|&nbsp; <EditableInline className='editable' content={draft.personalInfo.phonenumber} handleChange={(text) => updateSection('personalInfo', { ...draft.personalInfo,phonenumber:text})}/>{draft.personalInfo.extras?.map((extra:string,i:number) => (
                    <span key={i}>&nbsp;|&nbsp; <EditableInline className='editable' content={extra} handleChange={(text) => handleExtraChange(i,text)}/></span>
                ))}
            </div>
        </header>
    );
}