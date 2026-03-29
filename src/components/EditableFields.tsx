import { useEffect, useRef } from "react";

type EditableTextAreaProps = {
    className?: string,
    content: string,
    handleChange: (content:string) => void,
}

export function EditableTextArea({className,content,handleChange}: EditableTextAreaProps) {
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const autoResize = (el: HTMLTextAreaElement | null) => {
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + 'px';
    }

    useEffect(() => {
        autoResize(textAreaRef.current)
    },[content]);

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        handleChange(e.target.value);
        autoResize(textAreaRef.current);
    }
    return (
        <textarea ref={textAreaRef} className={className} onChange={onChange} value={content} rows={1} />
    )
}