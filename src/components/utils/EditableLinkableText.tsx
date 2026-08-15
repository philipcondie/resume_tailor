import { useId, useState } from "react";
import { normalizeWebUrl } from "../../lib/links";
import { LinkableText } from "../../types/resume";
import { EditableInline } from "./EditableFields";
import { LinkIcon } from "./Icons";
import { Modal } from "./Modal";

type EditableLinkableTextProps = {
    value: LinkableText,
    handleChange: (value: LinkableText) => void,
};

type LinkEditorProps = EditableLinkableTextProps & {
    onClose: () => void,
};

function LinkEditor({value, handleChange, onClose}: LinkEditorProps) {
    const [urlDraft, setUrlDraft] = useState(value.url ?? '');
    const [error, setError] = useState<string | null>(null);

    const applyUrl = () => {
        try {
            handleChange({...value, url: normalizeWebUrl(urlDraft)});
            onClose();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Enter a valid web address');
        }
    };

    const removeUrl = () => {
        handleChange({...value, url: null});
        onClose();
    };

    return (
        <Modal isOpen={true} onClose={onClose}>
            <div className="flex flex-col gap-4">
                <div>
                    <h2 className="text-base font-semibold text-gray-900">Edit hyperlink</h2>
                    <p className="text-xs text-gray-500 mt-1">Leave the URL empty to keep this as plain text.</p>
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
                    {value.url && (
                        <a
                            className="mr-auto px-3 py-1.5 text-xs text-blue-600 hover:text-blue-800"
                            href={value.url}
                            target="_blank"
                            rel="noreferrer"
                        >Open link</a>
                    )}
                    {value.url && (
                        <button type="button" className="px-3 py-1.5 text-xs text-red-600" onClick={removeUrl}>Remove</button>
                    )}
                    <button type="button" className="px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded" onClick={onClose}>Cancel</button>
                    <button type="button" className="px-3 py-1.5 text-xs text-white bg-slate-700 rounded" onClick={applyUrl}>Apply</button>
                </div>
            </div>
        </Modal>
    );
}

export function EditableLinkableText({value, handleChange}: EditableLinkableTextProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditingText, setIsEditingText] = useState(false);
    const interactionDescriptionId = useId();

    const openEditor = () => {
        setIsOpen(true);
    };

    return (
        <span className="linkable-editor">
            {value.url && !isEditingText ? (
                <a
                    className="editable resume-link linkable-display"
                    href={value.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-describedby={interactionDescriptionId}
                    onClick={(event) => {
                        if (event.metaKey || event.ctrlKey) return;
                        event.preventDefault();
                        setIsEditingText(true);
                    }}
                    onKeyDown={(event) => {
                        if (event.key !== 'Enter') return;
                        event.preventDefault();
                        if (event.metaKey || event.ctrlKey) {
                            window.open(value.url!, '_blank', 'noopener,noreferrer');
                        } else {
                            setIsEditingText(true);
                        }
                    }}
                >{value.text}</a>
            ) : (
                <EditableInline
                    className={`editable${value.url ? ' resume-link' : ''}`}
                    content={value.text}
                    handleChange={(text) => handleChange({...value, text})}
                    autoFocus={isEditingText}
                    onBlur={() => setIsEditingText(false)}
                />
            )}
            {value.url && (
                <span id={interactionDescriptionId} className="sr-only">
                    Press Enter to edit this text. Press Command or Control plus Enter to open the link.
                </span>
            )}
            <button
                type="button"
                className="linkable-editor-control"
                aria-label={value.url ? `Edit link for ${value.text}` : `Add link to ${value.text}`}
                title={value.url ? 'Edit link' : 'Add link'}
                onClick={openEditor}
            >
                <LinkIcon />
            </button>
            {isOpen && (
                <LinkEditor
                    key={value.url ?? ''}
                    value={value}
                    handleChange={handleChange}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </span>
    );
}
