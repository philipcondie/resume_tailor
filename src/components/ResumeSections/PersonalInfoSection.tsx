import { EditableInline } from "../utils/EditableFields";
import { EditableLinkableText } from "../utils/EditableLinkableText";
import { LinkableText } from "../../types/resume";
import { SectionProps } from "../../types/resume";


export function PersonalInfoSection({draft, updateSection}:SectionProps) {
    const handleExtraChange = (index:number, value:LinkableText) => {
        updateSection('personalInfo', { ...draft.personalInfo, extras: draft.personalInfo.extras?.map((extra, i) => i === index ? value : extra) })
    };

    return (
        <div className="header">
            <h1><EditableInline className='editable' content={draft.personalInfo.name} handleChange={(text) => updateSection('personalInfo',{...draft.personalInfo, name:text})}/></h1>
            <div className="contact-info">
                <EditableInline className='editable' content={draft.personalInfo.email} handleChange={(text) => updateSection('personalInfo', { ...draft.personalInfo, email: text })} /> &nbsp;|&nbsp; <EditableInline className='editable' content={draft.personalInfo.phonenumber} handleChange={(text) => updateSection('personalInfo', { ...draft.personalInfo,phonenumber:text})}/>{draft.personalInfo.extras?.map((extra,i:number) => (
                    <span key={i}>&nbsp;|&nbsp; <EditableLinkableText value={extra} handleChange={(value) => handleExtraChange(i,value)}/></span>
                ))}
            </div>
        </div>
    );
}
