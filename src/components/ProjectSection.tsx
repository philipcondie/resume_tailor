import { EditableInline, EditableTextArea } from "./EditableFields";
import { ProjectEntry } from "../types/resume";

type ProjectSectionProps = {
    projects: ProjectEntry[],
    onChange: (project: ProjectEntry[]) => void,
}

export function ProjectSection({projects,onChange}: ProjectSectionProps) {
    const updateProjectField = (id:string, key:string, value:string) => {
        onChange(projects.map(project => (
            project.id === id
            ? {...project, [key]:value}
            : project
        )));
    };

    const updateProjectBullet = (id:string, bulletIndex:number, content:string) => {
        onChange(projects.map(project => (
            project.id === id 
            ? {...project, bullets: project.bullets.map((b,i) => i === bulletIndex ? content : b )} 
            : project
        )));
    };

    const addProjectBullet = (projectId:string) => {
        onChange(projects.map(project => (
            project.id === projectId
            ? {...project, bullets: [...project.bullets, '']}
            : project
        )));
    };

    const deleteProjectBullet = (projectId:string, bulletIndex:number) => {
        onChange(projects.map( project =>(
            project.id === projectId
            ? {...project, bullets: project.bullets.filter((_,i) => i !== bulletIndex )}
            : project
        )));
    }

    return (
        <section className="section">
            <h2 className="section-title">Projects</h2>
            {projects.map((project: ProjectEntry) => (
                <div className="job" key={project.id}>
                    <div className="job-header">
                        <span className="job-title-line"><EditableInline className='editable' content={project.title} handleChange={(text) => updateProjectField(project.id,'title',text)}/></span>
                    </div>
                    <ul className="job-bullets">
                        {project.bullets.map((bullet, i) => (
                            <li key={i} className="bullet-row">
                                <EditableTextArea className='editable' content={bullet} handleChange={(text) => updateProjectBullet(project.id,i,text)}/>
                                <button className='bullet-controls' onClick={() => deleteProjectBullet(project.id,i)}>×</button>
                            </li>
                        ))}
                    </ul>
                    <button className='add-bullet-controls' onClick={() => addProjectBullet(project.id)}>+</button>
                </div>
            ))}
        </section>
    )
}