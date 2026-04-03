import { useEducationHistory } from "../../hooks/dataHooks";
import { EducationEntryForm } from "../../components/InputForms/EducationEntryForm"
import { EducationEntry } from "../../types/resume";


export function EducationEntryContainer() {
    const {educationHistory, newEducation, updateEducation, removeEducation} = useEducationHistory();

    const handleAddEducation = () => {
        const blank: EducationEntry = {
            id: crypto.randomUUID(),
            school: '',
            degree: '',
            bullets: [],
        }
        newEducation(blank)
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Education</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Schools, degrees, and relevant coursework.</p>
                </div>
                <button
                    className="px-4 py-1.5 text-xs font-medium text-white bg-slate-700 rounded hover:bg-slate-600 transition-colors"
                    onClick={handleAddEducation}
                >+ Add</button>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,400px),1fr))] gap-4">
                {educationHistory.map((education: EducationEntry) => (
                    <EducationEntryForm key={education.id} education={education} handleUpdate={updateEducation} handleDelete={removeEducation} />
                ))}
            </div>
        </div>
    )

}