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

export const ProfileDataSchema = z.object({
    personalInfo: PersonalInfoEntrySchema,
    education: z.array(EducationEntrySchema),
    jobs: z.array(JobEntrySchema),
    projects: z.array(ProjectEntrySchema),
    skills: z.array(SkillEntrySchema),
});

export type ProfileData = z.infer<typeof ProfileDataSchema>;

export const ProfileExportDataSchema = z.object({
    exportedAt: z.string(),
    profile: ProfileDataSchema,
});

export type ProfileExportData = z.infer<typeof ProfileExportDataSchema>;

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
    id: number,
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

export const SectionDataSchema = z.object({
    name: z.enum(['summary', 'personalInfo', 'jobs', 'education', 'projects', 'skills']),
    enabled: z.boolean(),
    ordering: z.number().int().min(0)
})

export const SectionDataArraySchema = z.array(SectionDataSchema)

export type SectionData = z.infer<typeof SectionDataSchema>

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