import { SectionData } from "../types/resume";
import { useLocalStorage } from "./useLocalStorage";

export function useLayoutConfig() {
    const [layoutConfig, setLayoutConfig] = useLocalStorage<SectionData[]>('config',[]);

    const addSection = (newSection:SectionData) => {
        setLayoutConfig(prev => [...prev, newSection])
    }
    return {layoutConfig, addSection}
}