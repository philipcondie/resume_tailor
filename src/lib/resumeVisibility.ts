import { ResumeData } from "../types/resume";

const hasText = (value: string | null | undefined) => Boolean(value?.trim());

const hasBulletText = (entry: { bullets: Array<{ text: string }> }) =>
    entry.bullets.some((bullet) => hasText(bullet.text));

export const shouldRenderJob = (job: ResumeData['jobs'][number]) =>
    hasText(job.company)
    || hasText(job.role)
    || hasText(job.location)
    || hasText(job.startDate)
    || hasText(job.endDate)
    || hasBulletText(job);

export const shouldRenderEducation = (education: ResumeData['education'][number]) =>
    hasText(education.school)
    || hasText(education.degree)
    || hasBulletText(education);

export const shouldRenderProject = (project: ResumeData['projects'][number]) =>
    hasText(project.title)
    || hasText(project.description)
    || hasBulletText(project);

export const shouldRenderSkill = (skill: NonNullable<ResumeData['skills']>[number]) =>
    hasText(skill.title) || hasText(skill.text);
