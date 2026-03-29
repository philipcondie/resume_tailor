import { useLocalStorage } from "./useLocalStorage";
import { systemPrompt } from "../lib/prompts";

const defaultUserPrompt = `## Summary
- Frame the candidate's background as a strength for the target role.
- Reference relevant experience across jobs, education, and projects.

## Work Experience
- The candidate's most recent role in the target field should generally have the most bullets.

## General
- Maintain the overall framing around the candidate's target field, even when tailoring for a specific niche.
`
export function usePrompts() {
    const [userPrompt, setUserPrompt] = useLocalStorage<string>('user-prompt',defaultUserPrompt)
    const updateUserPrompt = (newPrompt: string) => {
        setUserPrompt(newPrompt);
    }
    const resetUserPrompt = () => {
        setUserPrompt(defaultUserPrompt);
    }
    return {systemPrompt, userPrompt, updateUserPrompt, resetUserPrompt}
}