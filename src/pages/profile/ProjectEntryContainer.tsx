import { ProjectEntry } from "../../types/resume";
import { ProjectEntryForm } from "../../components/ProjectEntryForm";
import { useProjectHistory } from "../../hooks/dataHooks";

export function ProjectEntryContainer() {
    const {projectHistory, newProject, updateProject, removeProject} = useProjectHistory();

    const handleAddProject = () => {
        const blank: ProjectEntry = {
            id: crypto.randomUUID(),
            title: '',
            bullets: [],
        }
        newProject(blank);
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Personal and professional projects.</p>
                </div>
                <button
                    className="px-4 py-1.5 text-xs font-medium text-white bg-slate-700 rounded hover:bg-slate-600 transition-colors"
                    onClick={handleAddProject}
                >+ Add</button>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,400px),1fr))] gap-4">
                {projectHistory.map(project => (
                    <ProjectEntryForm key={project.id} project={project} handleUpdate={updateProject} handleDelete={removeProject} />
                ))}
            </div>
        </div>
    )
}
