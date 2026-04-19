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


const fetchApi = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
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
    } catch {
        throw new Error("Unable to connect to server");
    }

    if (response.status == 401) {
        clearToken();
        window.location.href = '/login';
        throw new ApiError(401, 'Unauthorized');
    }
    if (!response.ok) {
        throw new ApiError(response.status, response.statusText);
    }
    return await response.json();
};

function createProfileApi<T>(field: string) {
    return {
        get: () => fetchApi<T>(`/profile/${field}`),
        save: (data: T) => fetchApi<T>(`/profile/${field}`,{
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
    generate: (request:ResumeRequest) => fetchApi<ResumeMetadata>(`/resume/new`, {
        method: "POST",
        body: JSON.stringify(request)
    }),
    get: (id:string) => fetchApi<ResumeDataRaw>(`/resume/${id}`).then(data => addBulletIds(data)),
    update: (id:string, input: ResumeData) => {
        const rawData = removeBulletIds(input);
        return fetchApi<ResumeDataRaw>(`/resume/${id}`, {
            method: "PUT",
            body: JSON.stringify(rawData)
        }).then(addBulletIds)
    },
    delete: (id:string) => fetchApi<null>(`/resume/${id}`, {
        method: "DELETE",
    }),
    list: () => fetchApi<ResumeMetadata[]>(`/resume`),
}

export const promptApi = {
    get: () => fetchApi<PromptData>(`/prompt`),
    update: (data: PromptData) => fetchApi<PromptData>(`/prompt/update`, {
        method: "POST",
        body: JSON.stringify(data),
    }),
}