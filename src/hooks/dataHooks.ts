import { useLocalStorage } from "./useLocalStorage";
import { CandidateInfo, EducationEntry, JobEntry, PersonalInfoEntry, ProjectEntry, SkillEntry, ResumeData } from "../types/resume";

export function useJobHistory() {
    const [jobHistory, setJobHistory] = useLocalStorage<JobEntry[]>('job_history', [])

    const newJob = (newJob: JobEntry) => {
        setJobHistory(prev => [...prev, newJob])
    }

    const updateJob = (id: string, updatedJob: JobEntry) => {
        setJobHistory(prev => prev.map(job => job.id === id ? updatedJob : job))
    }

    const removeJob = (id: string) => {
        setJobHistory(prev => prev.filter(job => job.id !== id))
    }

    const clearJobHistory = () => setJobHistory([]);

    const bulkAddJobs = (jobs: JobEntry[]) => setJobHistory(jobs);

    return { jobHistory, newJob, updateJob, removeJob, clearJobHistory, bulkAddJobs }
}

export function usePersonalInfo() {
    const [personalInfo, setPersonalInfo] = useLocalStorage<PersonalInfoEntry>(
        'personal-info',
        {
            'name': '',
            'email': '',
            'phonenumber':'',
            'extras': []
        }
    )

    const updatePersonalInfo = (updatedPersonalInfo: PersonalInfoEntry) => {
        setPersonalInfo(updatedPersonalInfo)
    }
    const clearPersonalInfo = () => setPersonalInfo({
        'name': '',
        'email': '',
        'phonenumber':'',
        'extras': []
    });
    return {personalInfo, updatePersonalInfo, clearPersonalInfo}
}

export function useProjectHistory() {
    const [projectHistory, setProjectHistory] = useLocalStorage<ProjectEntry[]>('project-history',[]);

    const newProject = (newProject: ProjectEntry) => {
        setProjectHistory(prev => [...prev, newProject]);
    }

    const updateProject = (id:string, updatedProject:ProjectEntry) => {
        setProjectHistory(prev => prev.map(project => project.id !== id ? project : updatedProject))
    }

    const removeProject = (id:string) => {
        setProjectHistory(prev => prev.filter(project => project.id !== id))
    }

    const clearProjectHistory = () => {
        setProjectHistory([])
    };

    const bulkAddProjects = (projects:ProjectEntry[]) => setProjectHistory(projects);

    return {projectHistory, newProject, updateProject, removeProject, clearProjectHistory, bulkAddProjects}
}

export function useEducationHistory() {
    const [educationHistory, setEducationHistory] = useLocalStorage<EducationEntry[]>('education-history',[]);

    const newEducation = (education: EducationEntry) => {
        setEducationHistory(prev => [...prev, education])
    }
    
    const updateEducation = (id:string, updatedEducation: EducationEntry) => {
        setEducationHistory(prev => prev.map(education => education.id === id ? updatedEducation : education))
    }
    
    const removeEducation = (id:string) => {
        setEducationHistory(prev => prev.filter(education => education.id !== id))
    }
    
    const clearEducationHistory = () => {
        setEducationHistory([])
    }

    const bulkAddEducation = (educations:EducationEntry[]) => setEducationHistory(educations);

    return { educationHistory, newEducation, updateEducation, removeEducation, clearEducationHistory, bulkAddEducation}
}

export function useSkillList() {
    const [skillList, setSkillList] = useLocalStorage<SkillEntry[]>('skill-list',[]);
    
    const newSkill = (skill:SkillEntry) => {
        setSkillList(prev => [...prev, skill])
    }

    const updateSkill = (id:string, updatedSkill: SkillEntry) => {
        setSkillList(prev => prev.map(skill => skill.id === id ? updatedSkill : skill))
    }

    const removeSkill = (id:string) => {
        setSkillList(prev => prev.filter(skill => skill.id !== id))
    }

    const clearSkillList = () => {
        setSkillList([])
    }

    const bulkAddSkills = (skills: SkillEntry[]) => setSkillList(skills);

    return {skillList, newSkill, updateSkill, removeSkill, clearSkillList, bulkAddSkills}
}

export function useResumeData() {
    const [resumeData, setResumeData] = useLocalStorage<ResumeData | null >('resume-data',null);

    const saveResumeData = (updatedResumeData: ResumeData) => {
        setResumeData(updatedResumeData)
    }

    const clearResumeData = () => setResumeData(null);

    return { resumeData, saveResumeData, clearResumeData } 
}

