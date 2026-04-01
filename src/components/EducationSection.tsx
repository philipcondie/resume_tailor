import { SetStateAction } from "react";
import { EducationEntry } from "../types/resume";
import { EditableInline, EditableTextArea } from "./EditableFields";

type EducationProps = {
    educations:EducationEntry[],
    onChange: (educations:EducationEntry[]) => void,
}
export function EducationSection({educations,onChange}:EducationProps) {
    const updateEducationField = (id: string, key: string, value: string) => {
        onChange(educations.map(edu => (
            edu.id === id 
            ? { ...edu, [key]: value } 
            : edu
        )));
    };

    const addEducationBullet = (id:string) => {
        onChange(educations.map(edu =>(
            edu.id === id
            ? { ...edu, bullets: [...(edu.bullets ?? []), '']}
            : edu
        )));
    };

    const updateEducationBullet = (id: string, bulletIndex: number, content: string) => {
        onChange(educations.map(edu => (
            edu.id === id
            ? { ...edu, bullets: edu.bullets?.map((b, i) => i === bulletIndex ? content : b) }
            : edu
        )));
    };

    const deleteEducationBullet = (id: string, bulletIndex: number) => {
        onChange(educations.map(edu => (
            edu.id === id
            ? { ...edu, bullets: edu.bullets?.filter((_,i) => i !== bulletIndex)}
            : edu
        )));
    };
    
    return (
        <section className="section">
            <h2 className="section-title">Education</h2>
            {/* map education entries */}
            {educations.map((education: EducationEntry) => (
                <div className="edu-entry" key={education.id}>
                    <div className="edu-header">
                        <span className="edu-school"><EditableInline className='editable' content={education.school} handleChange={(text) => updateEducationField(education.id,'school',text)}/></span>
                        <span className="edu-degree"><EditableInline className='editable' content={education.degree} handleChange={(text) => updateEducationField(education.id,'degree',text)}/></span>
                    </div>
                    {education.bullets?.map((bullet, i) => (
                        <div className="edu-details bullet-row" key={i}>
                            <EditableTextArea className='editable' content={bullet} handleChange={(text) => updateEducationBullet(education.id,i,text)} />
                            <button className='bullet-controls' onClick={() => deleteEducationBullet(education.id,i)}>×</button>
                        </div>
                    ))}
                    <button className='add-bullet-controls' onClick={() => addEducationBullet(education.id)}>+</button>
                </div>
            ))}
        </section>
    )
}