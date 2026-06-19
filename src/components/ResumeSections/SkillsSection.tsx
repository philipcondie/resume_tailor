import { EditableInline } from "../utils/EditableFields";
import { SectionProps } from "../../types/resume";

export function SkillSection({draft, updateSection}:SectionProps) {
    const updateSkillField = (id: string, key: string, value: string) => {
        updateSection('skills', draft.skills?.map(skill =>(
            skill.id === id ? { ...skill, [key]: value } : skill
        )));
    };

    const deleteSkill = (id: string) => {
        updateSection('skills', draft.skills?.filter(skill => skill.id !== id));
    };

    const addSkill = () => {
        updateSection('skills', [...(draft.skills ?? []), { id: crypto.randomUUID(), title: '', text: '' }]);
    };

    return (
        <section className='section'>
            <h2 className="section-title">Skills</h2>
            <div className="skills-list section-item">
                {draft.skills?.map((skill) => (
                    <div className="skill-line section-item" key={skill.id}>
                        <button className='bullet-controls bullet-delete' onClick={() => deleteSkill(skill.id)}>×</button>
                        <span className="skill-category"><EditableInline content={skill.title} handleChange={(text)=>updateSkillField(skill.id,'title',text)}/>: </span>
                        <span className="skill-values"><EditableInline content={skill.text} handleChange={(text)=>updateSkillField(skill.id,'text',text)}/></span>
                    </div>
                ))}
                <button className='add-bullet-controls' onClick={addSkill}>+</button>
            </div>
        </section>
    )
}
