# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Collaboration Style
- This project is a learning exercise. Act as a tutor, not a code generator.
- Do NOT write code or edit files unless explicitly asked to.
- Explain concepts, point out issues, discuss best practices, and suggest approaches - let the user implement. 

## Commands

- **Dev server:** `npm run dev` (Vite)
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Preview prod build:** `npm run preview`

No test framework is configured.

## Architecture

Resume Tailor is a React SPA (Vite + Tailwind v4 + React Router v7) that helps users build a resume profile and then asks a backend service to tailor job-history bullets and a summary to a target job description. The frontend talks to a backend API for all profile data, resume generation, and persistence. Deployed to Vercel.

### Data flow

1. **Profile entry** — Users fill out personal info, work history, education, projects, and skills via form pages under `/profile/*`. Each form has a *Container* component (e.g., `PersonalInfoContainer.tsx`) that owns the data: it fetches the current value from the backend via `src/lib/api.ts` on mount, holds it in local `useState`, and writes back imperatively on save. Containers render presentational form components from `src/components/InputForms/`.
2. **Generation** — The Generate page (`src/pages/Generate.tsx`) fetches the user's job history via `jobsApi.get()` and displays a filter UI where users can toggle individual jobs and bullets on/off (tracked via a `disabledBullets` Set). The user pastes a job description and optional instructions, then calls `resumeApi.generate()` in `src/lib/api.ts`. The backend pulls the user's profile, calls the LLM, and returns a `ResumeMetadata` record. The frontend then navigates to `/preview/:resumeId`.
3. **Resume list** — The Resumes page (`src/pages/Resumes.tsx`) calls `resumeApi.list()` and renders a table of saved resumes (filename, created, updated). Each row's filename links to `/preview/:resumeId`.
4. **Preview & print** — The Preview page (`src/pages/Preview.tsx`) reads `:resumeId` from the route via `useParams()`, fetches the resume via `resumeApi.get()`, and renders a print-ready resume. It holds two parallel copies of the data: `resume` (the server baseline) and `draft` (the in-progress local edits); the `isEditing` flag is derived by comparing them. Edits update `draft`; `onSave` calls `resumeApi.update()` and promotes `draft` to `resume`. Sections are driven by a **section registry** (`src/types/SectionRegistry.ts`) that maps `ResumeData` keys to React components in `src/components/ResumeSections/`. Section visibility and ordering are user-configurable via `useLayoutConfig` and the `SectionPanel` component. The `EditToolBar` component provides undo/redo, save, print, and section management controls. An overflow detector warns if content exceeds one page. Project headers render through `EditableProjectTitle`, which keeps website/GitHub icons beside the plain title and before an optional description. Personal-info extras continue to use `EditableLinkableText`.

### Key patterns

- **API client** (`src/lib/api.ts`) — central place for all backend calls. Exposes `fetchApi`/`fetchApiResponse` helpers that inject the JWT bearer token, make one retry after a coordinated access-token refresh on 401, and throw `ApiError` on unsuccessful responses. Per-resource clients (`personalInfoApi`, `jobsApi`, `educationApi`, `projectsApi`, `skillsApi`, `resumeApi`, `promptApi`) are built on top.
- **Container fetch pattern** — Backend-backed pages use a `useState` triple (`data`, `isLoading`, `error`) plus a `useEffect` that calls the relevant `someApi.get()`, with early returns for the loading and error states. A 404 is treated as "no data yet" and falls back to a default value rather than surfacing as an error. Mutations are imperative and there is no caching layer or refetch. Personal-info and project edits await `save()` and adopt the server response; project card saves are serialized with an in-flight guard.
- **Authentication** — JWT-based. The access token is stored in `localStorage` under `jwt_token` and the rotating refresh token under `refreshToken`. `fetchApi` attaches the access token as a `Bearer` header. Concurrent 401 responses share one refresh request; a failed refresh clears both tokens. `AuthProvider` (`src/lib/auth.tsx`) exposes `login`, `signup` (requires invite code), and `logout` via React context. `ProtectedRoute` (`src/pages/ProtectedRoute.tsx`) guards authenticated routes; public routes are `/login` and `/signup`.
- **`useLocalStorage<T>` hook** (`src/hooks/useLocalStorage.ts`) — generic localStorage hook, used for client-only UI state: `useLayoutConfig` (section visibility/order) and `useEditHistory` (undo/redo stack). Profile and prompt data live on the backend.
- **Section registry** — `sectionRegistry` maps each `keyof ResumeData` to a component implementing `SectionProps` in `src/components/ResumeSections/`. Adding a new resume section means: define the type in `resume.ts`, create the component in `ResumeSections/`, and register it.
- **Zod schemas for LLM output** — `LLMOutputSchema` in `src/types/resume.ts` defines the structured output contract used by the backend when calling the LLM.
- **Linkable text and projects** — `LinkableText` in `src/types/resume.ts` is `{ text: string, url: string | null }` and is used by `personalInfo.extras`. Projects use separate `title`, `description`, `websiteUrl`, and `githubUrl` fields. `src/lib/links.ts` normalizes URLs and upgrades legacy string or linkable project titles returned by older profiles and saved resumes.
- **Drag-and-drop** — `@dnd-kit/react` is used across all list containers (jobs, education, projects, skills) for reordering entries, and within resume bullet editing on the Preview page. `api.ts` adds temporary UUIDs to bullets on fetch (`addBulletIds`) and strips them before save (`removeBulletIds`) so dnd-kit has stable keys without persisting IDs to the backend.
- **Custom prompts** — The Prompt page (`src/pages/Prompt.tsx`) lets users edit a custom LLM prompt stored on the backend via `promptApi`. Includes save, reset, and restore-default controls.

### File conventions

- **Component organization** — `src/components/` is organized into subdirectories:
  - `ResumeSections/` — preview/print resume section components (registered in `SectionRegistry`) and the `EditToolBar`
  - `InputForms/` — profile entry form components used by pages under `/profile/*`
  - `utils/` — shared UI utilities (`EditableFields`, `EditableLinkableText`, `Icons`, `Modal`, `Spinner`)
- Styling uses Tailwind utility classes; `Preview.css` contains print-specific styles for the resume page.
- The Geist Sans font is loaded from a CDN in `index.html`.
