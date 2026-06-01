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
    Bullet,
    LayoutConfig,
    ResumeResponse,
    Resume,
    ResumeStyling,
    ResumeDownload,
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
    get: (id:string) : Promise<Resume> => fetchApi<ResumeResponse>(`/resume/${id}`).then(data => {
        const resumeData = addBulletIds(data.resumeData);
        return {filename: data.filename, layout:data.layout, resumeData: resumeData, jobDescription:data.jobDescription, styling: data.styling}
    }),
    update: async (id: string, input: Resume): Promise<Resume> => {
        const rawResumeData = removeBulletIds(input.resumeData);
        return fetchApi<ResumeResponse>(`/resume/${id}`, {
            method: "PUT",
            body: JSON.stringify({...input, resumeData: rawResumeData})
        }).then((data) => {
            const resumeData = addBulletIds(data.resumeData)
            return {...data, resumeData: resumeData}
        })
    },
    updateData: async (id: string, input: ResumeData): Promise<Resume> => {
        const rawData = removeBulletIds(input);
        return fetchApi<ResumeResponse>(`/resume/${id}`, {
            method: "PUT",
            body: JSON.stringify(rawData)
        }).then((data) => {
            const resumeData = addBulletIds(data.resumeData);
            return { ...data, resumeData: resumeData }
        });
    },
    updateLayout: async (id: string, input: LayoutConfig): Promise<Resume> => {
        return fetchApi<ResumeResponse>(`/resume/${id}/layout`, {
            method: "PUT",
            body: JSON.stringify({ "layout": input })
        }).then((data) => {
            const resumeData = addBulletIds(data.resumeData);
            return { ...data, resumeData: resumeData }
        });
    },
    delete: (id:string) => fetchApi<null>(`/resume/${id}`, {
        method: "DELETE",
    }),
    list: () => fetchApi<ResumeMetadata[]>(`/resume`),
    duplicate: (id:string, filename:string) => fetchApi<ResumeMetadata>(`/resume/${id}/duplicate`, {
        method: "POST",
        body: JSON.stringify({"filename":filename})
    }),
    download: async (id:string) : Promise<ResumeDownload> => {
        let response: Response;
        try {
            response = await fetch(`${API_BASE_URL}/resume/${id}/pdf`, {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Authorization': `Bearer ${getToken() ?? ''}`,
                }
            });
        }
        catch {
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

        const pdfBlob = await response.blob();
        return {
            blob: pdfBlob,
            pageCountStr: response.headers.get("x-resume-page-count")
        }
    }
}

export const promptApi = {
    get: () => fetchApi<PromptData>(`/prompt`),
    update: (data: PromptData) => fetchApi<PromptData>(`/prompt/update`, {
        method: "POST",
        body: JSON.stringify(data),
    }),
}

export const layoutApi = {
    get: () => fetchApi<LayoutConfig>(`/layout`),
    update: (layout: LayoutConfig) => fetchApi<LayoutConfig>(`/layout/update`, {
        method: "POST",
        body: JSON.stringify({"layout": layout}),
    })
}

export const stylingApi = {
    get: () => fetchApi<ResumeStyling>(`/layout/styling`),
    update: (update: ResumeStyling) => fetchApi<ResumeStyling>(`/layout/styling/update`, {
        method: "POST",
        body: JSON.stringify(update)
    })
}