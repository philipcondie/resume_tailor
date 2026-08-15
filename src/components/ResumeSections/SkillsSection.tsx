import { EditableInline } from "../utils/EditableFields";
import { SectionProps } from "../../types/resume";
import { shouldRenderSkill } from "../../lib/resumeVisibility";

export function SkillSection({draft, updateSection}:SectionProps) {
    const visibleSkills = draft.skills?.filter(shouldRenderSkill) ?? [];

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

    if (visibleSkills.length === 0) return null;

    return (
        <section className='section'>
            <h2 className="section-title">Skills</h2>
            <div className="skills-list section-item">
                {visibleSkills.map((skill) => (
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
