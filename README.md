# Resume Tailor

A React single-page app that helps you build a structured resume profile and then
tailors it to a specific job description. You enter your work history, education,
projects, and skills once; for each application you paste in a target job
description and the app asks a backend LLM service to rewrite your bullet points
and summary to match, then renders a print-ready resume you can fine-tune and export.

## Features

- **Profile builder** — forms for personal info, work history, education, projects, and skills, with drag-and-drop reordering.
- **Tailored generation** — paste a job description (plus optional instructions) and toggle individual jobs/bullets on or off before generating.
- **Live preview & print** — edit the generated resume inline, undo/redo changes, reorder sections, and print to a clean one-page layout with an overflow warning.
- **Saved resumes** — list, revisit, and re-edit previously generated resumes.
- **Custom prompts** — edit the LLM prompt used for generation.

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) (dev server & build)
- [React Router v7](https://reactrouter.com/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Zod](https://zod.dev/) for LLM output schemas
- [@dnd-kit](https://next.dndkit.com/) for drag-and-drop

JWT-authenticated; all profile data, resume generation, and persistence are handled
by a separate backend API ([resume_store](https://github.com/philipcondie/resume_store)).

## Getting started

```bash
# Install dependencies
npm install

# Configure the backend API URL
cp .env.example .env
# then set VITE_API_URL in .env to your backend's base URL

# Start the dev server
npm run dev
```

### Available scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the Vite dev server            |
| `npm run build`   | Build for production                 |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint                           |

## Configuration

The frontend expects a backend API. Set `VITE_API_URL` in your `.env` file to its
base URL. The backend ([resume_store](https://github.com/philipcondie/resume_store))
is responsible for profile storage, authentication, LLM calls, and resume persistence.

## License

[MIT](./LICENSE) © Philip Condie
