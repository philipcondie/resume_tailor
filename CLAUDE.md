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

Resume Tailor is a React SPA (Vite + Tailwind v4 + React Router v7) that helps users build a resume profile and then calls the Claude API to tailor job-history bullets and a summary to a target job description. Deployed to Vercel.

### Data flow

1. **Profile entry** — Users fill out personal info, work history, education, projects, and skills via form pages under `/profile/*`. Each data type has a `useLocalStorage`-backed hook in `src/hooks/dataHooks.ts` that persists to browser localStorage.
2. **Generation** — The Generate page (`src/pages/Generate.tsx`) collects all profile data, a pasted job description, and optional user instructions, then calls `tailorResume()` in `src/lib/claude.ts`. This makes a browser-side Anthropic API call (`dangerouslyAllowBrowser: true`) using structured output via Zod (`LLMOutputSchema`). The LLM returns tailored job bullets and a summary.
3. **Preview & print** — The Preview page (`src/pages/Preview.tsx`) renders a print-ready resume. Sections are driven by a **section registry** (`src/types/SectionRegistry.ts`) that maps `ResumeData` keys to React components in `src/components/ResumeSections/`. Section visibility and ordering are user-configurable via `useLayoutConfig` and the `SectionPanel` component. The `EditToolBar` component provides undo/redo, save, print, and section management controls. An overflow detector warns if content exceeds one page.

### Key patterns

- **`useLocalStorage<T>` hook** (`src/hooks/useLocalStorage.ts`) — generic hook used by all data hooks; supports functional updates.
- **Section registry** — `sectionRegistry` maps each `keyof ResumeData` to a component implementing `SectionProps` in `src/components/ResumeSections/`. Adding a new resume section means: define the type in `resume.ts`, create the component in `ResumeSections/`, and register it.
- **Zod schemas for LLM output** — `LLMOutputSchema` in `src/types/resume.ts` defines the structured output contract with the Claude API.
- **PasswordGate** — optional auth gate controlled by `VITE_GATE_PASSWORD` env var; disabled when unset.

### File conventions

- **Component organization** — `src/components/` is organized into subdirectories:
  - `ResumeSections/` — preview/print resume section components (registered in `SectionRegistry`) and the `EditToolBar`
  - `InputForms/` — profile entry form components used by pages under `/profile/*`
  - `utils/` — shared UI utilities (`EditableFields`, `Icons`, `Spinner`)
- Styling uses Tailwind utility classes; `Preview.css` contains print-specific styles for the resume page.
- The Geist Sans font is loaded from a CDN in `index.html`.
