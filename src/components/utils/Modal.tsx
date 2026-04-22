import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
    isOpen: boolean,
    onClose: () => void,
    children: ReactNode
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
    useEffect(() => {
        if (!isOpen) return;
        const closeOnEscapeKey = (e: KeyboardEvent) => {if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", closeOnEscapeKey);
        return () => {
            window.removeEventListener("keydown", closeOnEscapeKey);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const content = (
        <div 
            onClick={(e) => {if (e.target === e.currentTarget) onClose(); }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                {children}
            </div>
        </div>
    );
    const element = document.getElementById('modal-root')
    if (!element) return null;
    return createPortal(content,element)
}