import { useSkillList } from "../../hooks/dataHooks";
import { SkillEntry } from "../../types/resume";
import { SkillEntryForm } from "../../components/SkillEntryForm";

export function SkillEntryContainer() {
    const {skillList, newSkill, updateSkill, removeSkill} = useSkillList();

    const handleAddSkill = () => {
        const blank: SkillEntry = {
            id: crypto.randomUUID(),
            text: '',
        }
        newSkill(blank);
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Technologies, tools, and competencies.</p>
                </div>
                <button
                    className="px-4 py-1.5 text-xs font-medium text-white bg-slate-700 rounded hover:bg-slate-600 transition-colors"
                    onClick={handleAddSkill}
                >+ Add</button>
            </div>
            <div className="grid grid-cols-4 gap-4">
                {skillList.map((skill: SkillEntry) => (
                    <SkillEntryForm key={skill.id} skill={skill} handleUpdate={updateSkill} handleDelete={removeSkill} />
                ))}
            </div>
        </div>
    )
}
