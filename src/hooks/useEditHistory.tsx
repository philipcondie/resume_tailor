import { ResumeData } from "../types/resume";
import { useLocalStorage } from "./useLocalStorage";

const MAX_HISTORY = 10;

export function useEditHistory() {
    const [backStack, setBackStack] = useLocalStorage<ResumeData[]>('back-stack',[]);
    const [forwardStack, setForwardStack] = useLocalStorage<ResumeData[]>('forward-stack',[]);
    
    const pushToBack = (state:ResumeData) => {
        setBackStack(prev => {
            const next = [...prev, state];
            if (next.length > MAX_HISTORY) next.shift();
            return next;
        });
    };

    const pushToForward = (state:ResumeData) => {
        setForwardStack(prev => {
            const next = [...prev, state];
            if (next.length > MAX_HISTORY) next.shift();
            return next
        });
    };

    const popFromBack = () => {
        if (backStack.length === 0) return null;
        setBackStack(backStack.slice(0,-1));
        return backStack[backStack.length - 1];
    }

    const popFromForward = () => {
        if (forwardStack.length === 0) return null;
        setForwardStack(forwardStack.slice(0,-1));
        return forwardStack[forwardStack.length - 1];
    }

    const clearHistory = () => {
        setForwardStack([]);
        setBackStack([]);
    }

    const save = (state: ResumeData) => {
        pushToBack(state);
        setForwardStack([]);
    };

    const undo = (current: ResumeData) => {
        pushToForward(current);
        return popFromBack();
    }

    const redo = (current: ResumeData) => {
        pushToBack(current);
        return popFromForward();
    }

    const canRedo = forwardStack.length > 0;
    const canUndo = backStack.length > 0;
    

    return {save, canUndo, undo, canRedo, redo, clearHistory};
}