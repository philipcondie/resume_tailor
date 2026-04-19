import { SectionData } from "../types/resume";
import { useLocalStorage } from "./useLocalStorage";

const DEFAULT_CONFIG: SectionData[] = [
    { name: 'summary', enabled: true, ordering: 0 },
    { name: 'jobs', enabled: true, ordering: 1 },
    { name: 'education', enabled: true, ordering: 2 },
    { name: 'projects', enabled: true, ordering: 3 },                                               
    { name: 'skills', enabled: true, ordering: 4 },
];

export function useLayoutConfig() {
    const [layoutConfig, setLayoutConfig] = useLocalStorage<SectionData[]>('config',DEFAULT_CONFIG);
    return {layoutConfig,setLayoutConfig} 
}