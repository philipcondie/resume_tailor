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
    educations: z.array(EducationEntrySchema),
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
    jobs: JobEntry[],
    jobDescription: string,
    systemPrompt: string,
    userInstructions: string,
}

export const LLMOutputSchema = z.object({
    jobs: z.array(JobEntrySchema),
    summary: z.string(),
});

export type LLMOutput = z.infer<typeof LLMOutputSchema>

export interface SectionData {
    name:keyof ResumeData,
    enabled:boolean,
    ordering:number,
}

export type SectionProps = {
    draft: ResumeData,
    updateSection: <K extends keyof ResumeData>(key:K, value:ResumeData[K]) => void,
}
