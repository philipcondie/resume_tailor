import { EducationEntry, JobEntry, PersonalInfoEntry, ProjectEntry, SkillEntry, LLMInput, ResumeMetadata, ResumeData, PromptData } from "../types/resume";


const API_BASE_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

const TOKEN_KEY = 'jwt_token';

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY)
};
export const setToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
};
export const clearToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};


const fetchApi = async (endpoint: string, options?: RequestInit): Promise<any> => {
    let response: Response;
    try {
        response = await fetch(`${API_BASE_URL}${endpoint}`,
            {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken() ?? ''}`,
                }

            }
        );
    } catch (error) {
        throw new Error("Unable to connect to server");
    }

    if (response.status == 401) {
        clearToken();
        window.location.href = '/login';
        return;
    }
    if (!response.ok) {
        throw new ApiError(response.status, response.statusText);
    }
    return await response.json();
};

function createProfileApi<T>(field: string) {
    return {
        get: () => fetchApi(`/profile/${field}`),
        save: (data: T) => fetchApi(`/profile/${field}`,{
            method: "POST",
            body: JSON.stringify(data)
        }),
    };
}

export const personalInfoApi = createProfileApi<PersonalInfoEntry>('personal_info');
export const jobsApi = createProfileApi<JobEntry[]>('job_history');
export const educationApi = createProfileApi<EducationEntry[]>('education_history');
export const projectsApi = createProfileApi<ProjectEntry[]>('project_history');
export const skillsApi = createProfileApi<SkillEntry[]>('skills');


export async function tailorResume(input: LLMInput): Promise<ResumeMetadata> {
    return fetchApi(`/resume/new`, {
        method: "POST",
        body: JSON.stringify(input)
    });
}

export const resumeApi = {
    generate: (input: LLMInput): Promise<ResumeMetadata> => fetchApi(`/resume/new`, {
        method: "POST",
        body: JSON.stringify(input)
    }),
    get: (id:string): Promise<ResumeData> => fetchApi(`/resume/${id}`),
    update: (id:string, input: ResumeData): Promise<ResumeData> => fetchApi(`/resume/${id}`, {
        method: "PUT",
        body: JSON.stringify(input)
    }),
    list: (): Promise<ResumeMetadata[]> => fetchApi(`/resume`),
}

export const promptApi = {
    get: (): Promise<PromptData> => fetchApi(`/prompt`),
    update: (data: PromptData): Promise<PromptData> => fetchApi(`/prompt/update`, {
        method: "POST",
        body: JSON.stringify(data),
    }),
}