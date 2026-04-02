import { PersonalInfoSection } from '../components/PersonalInfoSection';
import { SkillSection } from '../components/SkillsSection';
import { EducationSection } from '../components/EducationSection';
import { JobSection } from '../components/JobSection';
import { ProjectSection } from '../components/ProjectSection';
import { SummarySection } from '../components/SummarySection';
import { ResumeData, SectionProps } from './resume';


export const sectionRegistry: Record<keyof ResumeData,React.ComponentType<SectionProps>> = {
    summary: SummarySection,
    personalInfo: PersonalInfoSection,
    jobs: JobSection,
    educations: EducationSection,
    projects: ProjectSection,
    skills: SkillSection,
} 