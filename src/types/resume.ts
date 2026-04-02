import { z } from "zod";

export const JobEntrySchema = z.object({
    id: z.string(),
    company: z.string(),
    role: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    location: z.string().optional(),
    bullets: z.array(z.string()),
});

export type JobEntry = z.infer<typeof JobEntrySchema>;

export interface EducationEntry {
    id: string,
    school: string,
    degree: string,
    bullets: string[]
}

export interface ProjectEntry {
    id: string,
    title: string,
    bullets: string[]
}

export interface SkillEntry {
    id: string,
    title: string,
    text: string
}

export interface PersonalInfoEntry {
    name: string,
    email: string,
    phonenumber: string,
    extras?: string []
    // summary: string
}

export interface ResumeData {
    personalInfo: PersonalInfoEntry,
    summary: string,
    educations: EducationEntry[],
    jobs: JobEntry[],
    projects: ProjectEntry[],
    skills?: SkillEntry[]
}

export interface CandidateInfo {
    generalInfo: string,
}

export interface LLMInput {
    info: CandidateInfo,
    jobs: JobEntry[],
    userInstructions?: string,
}

export const LLMOutputSchema = z.object({
    jobs: z.array(JobEntrySchema),
    summary: z.string(),
});

export type LLMOutput = z.infer<typeof LLMOutputSchema>

export interface SectionData {
    name:string,
    enabled:boolean,
    ordering:number,
}

export type SectionProps = {
    draft: ResumeData,
    updateSection: <K extends keyof ResumeData>(key:K, value:ResumeData[K]) => void,
}
