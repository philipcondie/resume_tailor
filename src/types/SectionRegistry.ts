import { PersonalInfoSection } from '../components/ResumeSections/PersonalInfoSection';
import { SkillSection } from '../components/ResumeSections/SkillsSection';
import { EducationSection } from '../components/ResumeSections/EducationSection';
import { JobSection } from '../components/ResumeSections/JobSection';
import { ProjectSection } from '../components/ResumeSections/ProjectSection';
import { SummarySection } from '../components/ResumeSections/SummarySection';
import { ResumeData, SectionProps, SectionConfig, TemplateName } from './resume';
import { ClassicLayout } from "../components/ResumeTemplates/ClassicLayout"
import { SidebarLayout } from '../components/ResumeTemplates/SidebarLayout';
import { MultipanelLayout } from '../components/ResumeTemplates/MultipanelLayout';

export type SectionRegistry = Record<keyof ResumeData, React.ComponentType<SectionProps>>;

export type LayoutProps = {
    resume: ResumeData,
    sections: SectionConfig[]
    updateSection: <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => void
};

export type Template = {
    layout: React.ComponentType<LayoutProps>;
    sections: SectionRegistry;
    displayName: string;
}

export const classicSectionRegistry: SectionRegistry = {
    summary: SummarySection,
    personalInfo: PersonalInfoSection,
    jobs: JobSection,
    education: EducationSection,
    projects: ProjectSection,
    skills: SkillSection,
}

export const multipanelSectionRegistry: SectionRegistry = {
    summary: SummarySection,
    personalInfo: PersonalInfoSection,
    jobs: JobSection,
    education: EducationSection,
    projects: ProjectSection,
    skills: SkillSection,
}

export const sidebarSectionRegistry: SectionRegistry = {
    summary: SummarySection,
    personalInfo: PersonalInfoSection,
    jobs: JobSection,
    education: EducationSection,
    projects: ProjectSection,
    skills: SkillSection,
}

export const classicTemplate: Template = {
    layout: ClassicLayout,
    sections: classicSectionRegistry,
    displayName: "Classic"
}
export const sidebarTemplate: Template = {
    layout: SidebarLayout,
    sections: sidebarSectionRegistry,
    displayName: "Sidebar"
}

export const multipanelTemplate: Template = {
    layout: MultipanelLayout,
    sections: multipanelSectionRegistry,
    displayName: "Multipanel"
}

export const templateRegistry: Record<TemplateName, Template> = {
    classic: classicTemplate,
    sidebar: sidebarTemplate,
    multipanel: multipanelTemplate
}
