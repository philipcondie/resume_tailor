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

export const EducationEntrySchema = z.object({
    id: z.string(),
    school: z.string(),
    degree: z.string(),
    bullets: z.array(z.string()),
});

export type EducationEntry = z.infer<typeof EducationEntrySchema>;

export const ProjectEntrySchema = z.object({
    id: z.string(),
    title: z.string(),
    bullets: z.array(z.string()),
});

export type ProjectEntry = z.infer<typeof ProjectEntrySchema>;

export const SkillEntrySchema = z.object({
    id: z.string(),
    title: z.string(),
    text: z.string(),
});

export type SkillEntry = z.infer<typeof SkillEntrySchema>;

export const PersonalInfoEntrySchema = z.object({
    name: z.string(),
    email: z.string(),
    phonenumber: z.string(),
    extras: z.array(z.string()).optional(),
});

export type PersonalInfoEntry = z.infer<typeof PersonalInfoEntrySchema>;

export interface ResumeDataRaw {
    personalInfo: PersonalInfoEntry,
    summary: string,
    education: EducationEntry[],
    jobs: JobEntry[],
    projects: ProjectEntry[],
    skills?: SkillEntry[]
}

export interface ResumeData {
    personalInfo: PersonalInfoEntry,
    summary: string,
    education: WithBulletIds<EducationEntry>[],
    jobs: WithBulletIds<JobEntry>[],
    projects: WithBulletIds<ProjectEntry>[],
    skills?: SkillEntry[]
}

export interface ResumeMetadata {
    id: string,
    filename: string,
    createdAt: string,
    updatedAt: string,
}

export interface PromptData {
    prompt: string
}


export interface LLMInput {
    jobs: JobEntry[],
    jobDescription: string,
    userInstructions: string,
}

export interface ResumeRequest {
    filename: string
    input: LLMInput
}

export interface ResumeResponse {
    filename: string,
    resumeData: ResumeDataRaw,
    layout: LayoutConfig
    jobDescription: string,
}

export interface Resume {
    filename: string,
    resumeData: ResumeData,
    layout: LayoutConfig
    jobDescription:string
}

export const SectionConfigSchema = z.object({
    name: z.enum(['summary', 'jobs', 'education', 'projects', 'skills']),
    enabled: z.boolean(),
    ordering: z.number().int().min(0)
})

export type SectionConfig = z.infer<typeof SectionConfigSchema>

export type LayoutConfig = SectionConfig[]

export interface LayoutResponse {
    layout: LayoutConfig
}

export type SectionProps = {
    draft: ResumeData,
    updateSection: <K extends keyof ResumeData>(key:K, value:ResumeData[K]) => void,
}

export type Bullet = {
    id: string,
    text: string,
}

type WithBulletIds<T extends {bullets: string[]}> = Omit<T, 'bullets'> & {
    bullets: Bullet[]
}

export type ResumeStyling = {
    colorTextName: string,
    colorAccent: string,
    fontMain: string[]
}