import { SectionProps } from "../../types/resume";
import { BulletSection } from "./BulletSection";
import { EditableProjectTitle } from "./EditableProjectTitle";
import { shouldRenderProject } from "../../lib/resumeVisibility";

export function ProjectSection({draft,updateSection}:SectionProps) {
    if (!draft.projects.some(shouldRenderProject)) return null;

    return (
        <section className="section">
            <h2 className="section-title">Projects</h2>
            <BulletSection 
                items={draft.projects} 
                shouldRenderItem={shouldRenderProject}
                onItemsChange={(projects) => updateSection('projects',projects)}
                renderHeader={(project,updateItemField) => (
                    <div className="section-item-header">
                        <span className="section-item-primary">
                            <EditableProjectTitle
                                title={project.title}
                                description={project.description}
                                websiteUrl={project.websiteUrl}
                                githubUrl={project.githubUrl}
                                onTitleChange={(title) => updateItemField('title', title)}
                                onDescriptionChange={(description) => updateItemField('description', description)}
                                onWebsiteUrlChange={(websiteUrl) => updateItemField('websiteUrl', websiteUrl)}
                                onGithubUrlChange={(githubUrl) => updateItemField('githubUrl', githubUrl)}
                            />
                        </span>
                    </div>
                )}
            />
        </section>
    )
}
