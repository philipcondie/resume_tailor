import { 
    EducationEntry, 
    JobEntry, 
    PersonalInfoEntry, 
    ProjectEntry, 
    SkillEntry, 
    ResumeMetadata, 
    ResumeData, 
    PromptData, 
    ResumeRequest, 
    ResumeDataRaw,
    Bullet
} from "../types/resume";


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
export const jobsApi = createProfileApi<JobEntry[]>('jobs');
export const educationApi = createProfileApi<EducationEntry[]>('education');
export const projectsApi = createProfileApi<ProjectEntry[]>('projects');
export const skillsApi = createProfileApi<SkillEntry[]>('skills');


function addBulletIds(raw:ResumeDataRaw): ResumeData {
    const wrapBullets = <T extends { bullets: string[] }> (item: T) => ({
        ...item,
        bullets: item.bullets.map(text => ({id:crypto.randomUUID(), text:text})),
    });
    return {
        ...raw,
        jobs: raw.jobs.map(wrapBullets),
        education: raw.education.map(wrapBullets),
        projects: raw.projects.map(wrapBullets)
    };
}

function removeBulletIds(data: ResumeData): ResumeDataRaw {
    const unwrapBullets = <T extends { bullets: Bullet[] }> (item:T) => ({
        ...item,
        bullets: item.bullets.map(bullet => (bullet.text)),
    });
    return {
        ...data,
        jobs: data.jobs.map(unwrapBullets),
        education: data.education.map(unwrapBullets),
        projects: data.projects.map(unwrapBullets),
    }
}

export const resumeApi = {
    generate: (request:ResumeRequest): Promise<ResumeMetadata> => fetchApi(`/resume/new`, {
        method: "POST",
        body: JSON.stringify(request)
    }),
    get: (id:string): Promise<ResumeData> => fetchApi(`/resume/${id}`).then(data => addBulletIds(data)),
    update: (id:string, input: ResumeData): Promise<ResumeData> => {
        const rawData = removeBulletIds(input);
        return fetchApi(`/resume/${id}`, {
            method: "PUT",
            body: JSON.stringify(rawData)
        }).then(addBulletIds)
    },
    delete: (id:string): Promise<null> => fetchApi(`/resume/${id}`, {
        method: "DELETE",
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