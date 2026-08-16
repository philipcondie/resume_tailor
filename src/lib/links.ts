import { LinkableText, PersonalInfoEntry, ProjectEntry, ResumeDataRaw } from "../types/resume";

export function normalizeWebUrl(value: string | null | undefined): string | null {
    let normalized = value?.trim() ?? '';
    if (!normalized) return null;
    if (/\s/.test(normalized)) throw new Error('Links cannot contain spaces');
    if (normalized.startsWith('//')) throw new Error('Links cannot be scheme-relative');

    const schemeMatch = normalized.match(/^([A-Za-z][A-Za-z0-9+.-]*):/);
    if (schemeMatch) {
        const scheme = schemeMatch[1].toLowerCase();
        if (!['http', 'https'].includes(scheme)) {
            throw new Error('Links must use http or https');
        }
        normalized = `${scheme}${normalized.slice(schemeMatch[1].length)}`;
    } else {
        normalized = `https://${normalized}`;
    }

    let parsed: URL;
    try {
        parsed = new URL(normalized);
    } catch {
        throw new Error('Enter a valid web address');
    }
    if (!['http:', 'https:'].includes(parsed.protocol) || !parsed.hostname) {
        throw new Error('Links must use http or https and include a hostname');
    }
    if (parsed.username || parsed.password) {
        throw new Error('Links cannot include a username or password');
    }
    if (!schemeMatch && !parsed.hostname.includes('.')) {
        throw new Error('Links without a scheme need a dotted hostname');
    }
    return normalized;
}

export function normalizeLinkableText(value: LinkableText | string): LinkableText {
    return typeof value === 'string' ? { text: value, url: null } : {
        text: value.text,
        url: value.url ?? null,
    };
}

type LegacyPersonalInfo = Omit<PersonalInfoEntry, 'extras'> & {
    extras?: Array<LinkableText | string>;
};

type LegacyProject = Omit<ProjectEntry, 'title' | 'description' | 'websiteUrl' | 'githubUrl'> & {
    title: LinkableText | string;
    description?: string;
    websiteUrl?: string | null;
    githubUrl?: string | null;
};

type LegacyResumeData = Omit<ResumeDataRaw, 'personalInfo' | 'projects'> & {
    personalInfo: LegacyPersonalInfo;
    projects: LegacyProject[];
};

export function normalizePersonalInfo(info: LegacyPersonalInfo): PersonalInfoEntry {
    return {
        ...info,
        extras: info.extras?.map(normalizeLinkableText),
    };
}

export function normalizeProjects(projects: LegacyProject[]): ProjectEntry[] {
    return projects.map((project) => {
        const legacyTitle = normalizeLinkableText(project.title);
        return {
            ...project,
            title: legacyTitle.text,
            description: project.description ?? '',
            websiteUrl: project.websiteUrl ?? legacyTitle.url,
            githubUrl: project.githubUrl ?? null,
        };
    });
}

export function normalizeResumeLinks(data: LegacyResumeData): ResumeDataRaw {
    return {
        ...data,
        personalInfo: normalizePersonalInfo(data.personalInfo),
        projects: normalizeProjects(data.projects),
    };
}
