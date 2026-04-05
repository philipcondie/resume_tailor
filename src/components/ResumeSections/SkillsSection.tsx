import { EditableInline } from "../utils/EditableFields";
import { SectionProps } from "../../types/resume";

export function SkillSection({draft, updateSection}:SectionProps) {
    const updateSkillField = (id: string, key: string, value: string) => {
        updateSection('skills',draft.skills?.map(skill =>(
            skill.id === id ? { ...skill, [key]: value } : skill
        )));
    };

    return (
        <section className='section'>
            <h2 className="section-title">Technical Skills</h2>
            <div className="skills-list">
                {draft.skills?.map((skill) => (
                    <div className="skill-line" key={skill.id}>
                        <span className="skill-category"><EditableInline content={skill.title} handleChange={(text)=>updateSkillField(skill.id,'title',text)}/>: </span>
                        <span className="skill-values"><EditableInline content={skill.text} handleChange={(text)=>updateSkillField(skill.id,'text',text)}/></span></div>    
                ))}
            </div>
        </section>
    )
}