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

export function EditableInline({className, content, handleChange}: EditableTextAreaProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const mirrorRef = useRef<HTMLSpanElement | null>(null);

    const autoWidth = () => {
        if (!mirrorRef.current || !inputRef.current) return;
        const style = window.getComputedStyle(inputRef.current);
        const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        const border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
        inputRef.current.style.width = mirrorRef.current.getBoundingClientRect().width + padding + border + 'px';
    };

    useEffect(() => {
        autoWidth();
    }, [content]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(e.target.value);
    };

    return (
        <>
            <span ref={mirrorRef} style={{ visibility: 'hidden', position: 'absolute', whiteSpace: 'pre', font: 'inherit' }}>
                {content || ' '}
            </span>
            <input ref={inputRef} type="text" className={className} onChange={onChange} value={content} />
        </>
    );
}