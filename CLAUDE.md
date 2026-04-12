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
2. **Generation** — The Generate page (`src/pages/Generate.tsx`) collects a pasted job description and optional user instructions, then calls `resumeApi.generate()` in `src/lib/api.ts`. The backend pulls the user's profile, calls the LLM, and returns a `ResumeMetadata` record. The frontend then navigates to `/preview/:resumeId`.
3. **Resume list** — The Resumes page (`src/pages/Resumes.tsx`) calls `resumeApi.list()` and renders a table of saved resumes (filename, created, updated). Each row's filename links to `/preview/:resumeId`.
4. **Preview & print** — The Preview page (`src/pages/Preview.tsx`) reads `:resumeId` from the route via `useParams()`, fetches the resume via `resumeApi.get()`, and renders a print-ready resume. It holds two parallel copies of the data: `resume` (the server baseline) and `draft` (the in-progress local edits); the `isEditing` flag is derived by comparing them. Edits update `draft`; `onSave` calls `resumeApi.update()` and promotes `draft` to `resume`. Sections are driven by a **section registry** (`src/types/SectionRegistry.ts`) that maps `ResumeData` keys to React components in `src/components/ResumeSections/`. Section visibility and ordering are user-configurable via `useLayoutConfig` and the `SectionPanel` component. The `EditToolBar` component provides undo/redo, save, print, and section management controls. An overflow detector warns if content exceeds one page.

### Key patterns

- **API client** (`src/lib/api.ts`) — central place for all backend calls. Exposes a `fetchApi` helper that injects the JWT bearer token, redirects to `/login` on 401, and throws `ApiError` on other failures. Per-resource clients (`personalInfoApi`, `jobsApi`, `educationApi`, `projectsApi`, `skillsApi`, `resumeApi`) are built on top.
- **Container fetch pattern** — Backend-backed pages use a `useState` triple (`data`, `isLoading`, `error`) plus a `useEffect` that calls the relevant `someApi.get()`, with early returns for the loading and error states. A 404 is treated as "no data yet" and falls back to a default value rather than surfacing as an error. Mutations are imperative (call `someApi.save()` and `setData(...)` side-by-side in the handler) — there is no caching layer or refetch.
- **Authentication** — JWT-based. Token is stored in `localStorage` under `jwt_token` and attached as a `Bearer` header by `fetchApi`. A 401 response clears the token and redirects to `/login`.
- **`useLocalStorage<T>` hook** (`src/hooks/useLocalStorage.ts`) — generic localStorage hook, still used for client-only UI state: `useLayoutConfig` (section visibility/order), `useEditHistory` (undo/redo stack), and `usePrompts` (system/user prompt drafts). Profile data no longer uses this hook — it lives on the backend.
- **Section registry** — `sectionRegistry` maps each `keyof ResumeData` to a component implementing `SectionProps` in `src/components/ResumeSections/`. Adding a new resume section means: define the type in `resume.ts`, create the component in `ResumeSections/`, and register it.
- **Zod schemas for LLM output** — `LLMOutputSchema` in `src/types/resume.ts` defines the structured output contract used by the backend when calling the LLM.
- **PasswordGate** — optional auth gate controlled by `VITE_GATE_PASSWORD` env var; disabled when unset. This is separate from the JWT-based backend auth.

### In-progress migration

The project is mid-transition from a fully client-side app (browser-side Anthropic calls + localStorage profile data) to a backend-backed app. Profile containers, the resume list, the Preview page, and `resumeApi.generate()` have all been migrated. **`src/pages/Generate.tsx` is the main remaining piece**: its `handleGenerate` flow already calls the backend, but the page still imports from the deleted `src/hooks/dataHooks.ts` and `src/hooks/useApiKey.ts` and renders an "Anthropic API Key" input that is no longer needed (the backend owns the LLM call). Migrating Generate means: replace the deleted hooks with the Container fetch pattern (or pull profile data via the API), drop the API-key UI, and remove the `apiKey === ''` guard on the Generate button.

### File conventions

- **Component organization** — `src/components/` is organized into subdirectories:
  - `ResumeSections/` — preview/print resume section components (registered in `SectionRegistry`) and the `EditToolBar`
  - `InputForms/` — profile entry form components used by pages under `/profile/*`
  - `utils/` — shared UI utilities (`EditableFields`, `Icons`, `Spinner`)
- Styling uses Tailwind utility classes; `Preview.css` contains print-specific styles for the resume page.
- The Geist Sans font is loaded from a CDN in `index.html`.
