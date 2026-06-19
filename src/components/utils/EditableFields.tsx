import { useLayoutEffect, useRef, type ClipboardEvent, type KeyboardEvent } from "react";

type EditableTextAreaProps = {
    className?: string,
    content: string,
    handleChange: (content:string) => void,
    as?: "p" | "span",
}

function normalizeEditableText(text: string) {
    return text.replace(/\u00a0/g, " ").replace(/[\r\n]+/g, " ");
}

function useEditableText(content: string, handleChange: (content: string) => void) {
    const editableRef = useRef<HTMLElement | null>(null);
    
    useLayoutEffect(() => {
        const el = editableRef.current;
        if (!el || document.activeElement === el || el.textContent === content) return;
        el.textContent = content;
    }, [content]);

    const syncFromElement = (el: HTMLElement) => {
        handleChange(normalizeEditableText(el.textContent ?? ""));
    };

    const onInput = () => {
        if (editableRef.current) syncFromElement(editableRef.current);
    };

    const onBlur = () => {
        const el = editableRef.current;
        if (!el) return;
        const normalized = normalizeEditableText(el.textContent ?? "");
        if (el.textContent !== normalized) el.textContent = normalized;
        handleChange(normalized);
    };

    const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
        if (e.key === "Enter") e.preventDefault();
    };

    const onPaste = (e: ClipboardEvent<HTMLElement>) => {
        e.preventDefault();
        document.execCommand("insertText", false, normalizeEditableText(e.clipboardData.getData("text/plain")));
    };

    return {
        ref: editableRef,
        contentEditable: true,
        suppressContentEditableWarning: true,
        onInput,
        onBlur,
        onKeyDown,
        onPaste,
    };
}

export function EditableTextArea({className,content,handleChange,as: Element = "p"}: EditableTextAreaProps) {
    const editableProps = useEditableText(content, handleChange);

    return (
        <Element
            {...editableProps}
            className={className}
        />
    )
}

export function EditableInline({className, content, handleChange}: EditableTextAreaProps) {
    const editableProps = useEditableText(content, handleChange);

    return (
        <span
            {...editableProps}
            className={className}
        />
    );
}
