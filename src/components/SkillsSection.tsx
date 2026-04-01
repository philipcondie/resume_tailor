import { EditableInline, EditableTextArea } from "./EditableFields";
import { SkillEntry } from "../types/resume";

type SkillSectionProps = {
    skills: SkillEntry[],
    onChange: (skills: SkillEntry[]) => void,
}

export function SkillSection({skills, onChange}:SkillSectionProps) {
    const updateSkillField = (id: string, key: string, value: string) => {
        onChange(skills.map(skill =>(
            skill.id === id ? { ...skill, [key]: value } : skill
        )));
    };

    return (
        <section className='section'>
            <h2 className="section-title">Technical Skills</h2>
            <div className="skills-list">
                {skills.map((skill: SkillEntry) => (
                    <div className="skill-line" key={skill.id}>
                        <span className="skill-category"><EditableInline content={skill.title} handleChange={(text)=>updateSkillField(skill.id,'title',text)}/>: </span>
                        <span className="skill-values"><EditableInline content={skill.text} handleChange={(text)=>updateSkillField(skill.id,'text',text)}/></span></div>    
                ))}
            </div>
        </section>
    )
}