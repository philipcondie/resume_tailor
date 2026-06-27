import { useReducer, useRef, useCallback } from "react";
import { LayoutConfig, ResumeData, ResumeStyling } from "../types/resume";

const MAX_HISTORY = 10;
// Rapid edits within this window collapse into a single undo step, so typing a
// word doesn't become one undo per keystroke.
const COALESCE_MS = 450;

export type EditSnapshot = {
    resumeData: ResumeData;
    layout: LayoutConfig;
    styling: ResumeStyling;
};

type HistoryState = {
    past: EditSnapshot[];
    present: EditSnapshot | null;
    future: EditSnapshot[];
};

type HistoryAction =
    | { type: 'record'; next: EditSnapshot; coalesce: boolean }
    | { type: 'undo' }
    | { type: 'redo' }
    | { type: 'reinit'; snapshot: EditSnapshot };

function reducer(state: HistoryState, action: HistoryAction): HistoryState {
    switch (action.type) {
        case 'record': {
            // Coalesce: replace present in place without growing the past stack.
            if (action.coalesce && state.present) {
                return { ...state, present: action.next, future: [] };
            }
            const past = state.present ? [...state.past, state.present] : state.past;
            // Drop the oldest entry once we exceed the cap.
            if (past.length > MAX_HISTORY) past.shift();
            return { past, present: action.next, future: [] };
        }
        case 'undo': {
            if (state.past.length === 0 || !state.present) return state;
            const previous = state.past[state.past.length - 1];
            return {
                past: state.past.slice(0, -1),
                present: previous,
                future: [state.present, ...state.future],
            };
        }
        case 'redo': {
            if (state.future.length === 0 || !state.present) return state;
            const next = state.future[0];
            return {
                past: [...state.past, state.present],
                present: next,
                future: state.future.slice(1),
            };
        }
        case 'reinit':
            // Seed a fresh history for a newly loaded (or switched) resume.
            return { past: [], present: action.snapshot, future: [] };
        default:
            return state;
    }
}

export function useEditHistory() {
    const [state, dispatch] = useReducer(reducer, { past: [], present: null, future: [] });
    const lastRecordTs = useRef<number>(0);

    const record = useCallback((next: EditSnapshot) => {
        const now = Date.now();
        const coalesce = now - lastRecordTs.current < COALESCE_MS;
        lastRecordTs.current = now;
        dispatch({ type: 'record', next, coalesce });
    }, []);

    const undo = useCallback(() => {
        // Reset the coalesce window so the next edit always starts a fresh step.
        lastRecordTs.current = 0;
        dispatch({ type: 'undo' });
    }, []);

    const redo = useCallback(() => {
        lastRecordTs.current = 0;
        dispatch({ type: 'redo' });
    }, []);

    const reinit = useCallback((snapshot: EditSnapshot) => {
        lastRecordTs.current = 0;
        dispatch({ type: 'reinit', snapshot });
    }, []);

    return {
        present: state.present,
        canUndo: state.past.length > 0,
        canRedo: state.future.length > 0,
        record,
        undo,
        redo,
        reinit,
    };
}
