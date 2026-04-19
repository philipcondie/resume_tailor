import { PersonalInfoSection } from '../components/ResumeSections/PersonalInfoSection';
import { SkillSection } from '../components/ResumeSections/SkillsSection';
import { EducationSection } from '../components/ResumeSections/EducationSection';
import { JobSection } from '../components/ResumeSections/JobSection';
import { ProjectSection } from '../components/ResumeSections/ProjectSection';
import { SummarySection } from '../components/ResumeSections/SummarySection';
import { ResumeData, SectionProps } from './resume';


export const sectionRegistry: Record<keyof ResumeData,React.ComponentType<SectionProps>> = {
    summary: SummarySection,
    personalInfo: PersonalInfoSection,
    jobs: JobSection,
    education: EducationSection,
    projects: ProjectSection,
    skills: SkillSection,
} 