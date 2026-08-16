import { ReactNode, useState } from "react";
import { normalizeWebUrl } from "../../lib/links";
import { EditableInline } from "../utils/EditableFields";
import { ExternalLinkIcon, GithubIcon } from "../utils/Icons";
import { Modal } from "../utils/Modal";

type ProjectLinkControlProps = {
    label: string;
    url: string | null | undefined;
    icon: ReactNode;
    onChange: (url: string | null) => void;
};

function ProjectLinkControl({label, url, icon, onChange}: ProjectLinkControlProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [urlDraft, setUrlDraft] = useState(url ?? '');
    const [error, setError] = useState<string | null>(null);

    const openEditor = () => {
        setUrlDraft(url ?? '');
        setError(null);
        setIsOpen(true);
    };

    const applyUrl = () => {
        try {
            onChange(normalizeWebUrl(urlDraft));
            setIsOpen(false);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Enter a valid web address');
        }
    };

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
        if (url && (event.metaKey || event.ctrlKey)) return;
        event.preventDefault();
        openEditor();
    };

    const className = `project-link-control${url ? ' has-url' : ''}`;
    const actionLabel = url ? `Edit ${label}` : `Add ${label}`;

    return (
        <>
            {url ? (
                <a
                    className={className}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    title={actionLabel}
                    aria-label={actionLabel}
                    onClick={handleClick}
                >{icon}</a>
            ) : (
                <button
                    type="button"
                    className={className}
                    title={actionLabel}
                    aria-label={actionLabel}
                    onClick={handleClick}
                >{icon}</button>
            )}
            {isOpen && (
                <Modal isOpen={true} onClose={() => setIsOpen(false)}>
                    <div className="flex flex-col gap-4">
                        <div>
                            <h2 className="text-base font-semibold text-gray-900">Edit {label}</h2>
                            <p className="text-xs text-gray-500 mt-1">Leave the URL empty to hide this icon.</p>
                        </div>
                        <label className="flex flex-col gap-1">
                            <span className="text-xs font-medium uppercase tracking-wide text-gray-600">Web address</span>
                            <input
                                type="url"
                                autoFocus
                                className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-700"
                                value={urlDraft}
                                placeholder="https://example.com"
                                onChange={(event) => {
                                    setUrlDraft(event.target.value);
                                    setError(null);
                                }}
                                onKeyDown={(event) => { if (event.key === 'Enter') applyUrl(); }}
                            />
                        </label>
                        {error && <p className="text-xs text-red-600">{error}</p>}
                        <div className="flex gap-2 justify-end">
                            {url && (
                                <button
                                    type="button"
                                    className="mr-auto px-3 py-1.5 text-xs text-red-600"
                                    onClick={() => {
                                        onChange(null);
                                        setIsOpen(false);
                                    }}
                                >Remove</button>
                            )}
                            <button type="button" className="px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded" onClick={() => setIsOpen(false)}>Cancel</button>
                            <button type="button" className="px-3 py-1.5 text-xs text-white bg-slate-700 rounded" onClick={applyUrl}>Apply</button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
}

type EditableProjectTitleProps = {
    title: string;
    description?: string;
    websiteUrl?: string | null;
    githubUrl?: string | null;
    onTitleChange: (title: string) => void;
    onDescriptionChange: (description: string) => void;
    onWebsiteUrlChange: (url: string | null) => void;
    onGithubUrlChange: (url: string | null) => void;
};

export function EditableProjectTitle({title, description, websiteUrl, githubUrl, onTitleChange, onDescriptionChange, onWebsiteUrlChange, onGithubUrlChange}: EditableProjectTitleProps) {
    return (
        <span className="project-title-editor">
            <span className="project-title-primary">
                <EditableInline
                    className="editable"
                    content={title}
                    handleChange={onTitleChange}
                />
                {(websiteUrl || githubUrl) && (
                    <span className="project-link-controls">
                        {websiteUrl && (
                            <ProjectLinkControl
                                label="project website"
                                url={websiteUrl}
                                icon={<ExternalLinkIcon />}
                                onChange={onWebsiteUrlChange}
                            />
                        )}
                        {githubUrl && (
                            <ProjectLinkControl
                                label="GitHub repository"
                                url={githubUrl}
                                icon={<GithubIcon />}
                                onChange={onGithubUrlChange}
                            />
                        )}
                    </span>
                )}
            </span>
            {description?.trim() && (
                <span className="project-title-description">
                    <span aria-hidden="true">—</span>
                    <EditableInline
                        className="editable"
                        content={description}
                        handleChange={onDescriptionChange}
                    />
                </span>
            )}
        </span>
    );
}
