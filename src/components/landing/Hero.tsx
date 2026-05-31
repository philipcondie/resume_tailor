import { Link } from "react-router-dom";
import { REPO_LINKS } from "./links";

export function Hero() {
    return (
        <header className="mx-auto max-w-4xl px-6 pt-24 pb-20 text-center">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Tailor your resume for any job in seconds.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
                Record your job history, education, and other highlights once, then create job specific resumes as many times as you'd like. Customize the style and layout across each resume.
            </p>

            <div className="mt-10 flex items-center justify-center gap-3">
                <button
                    type="button"
                    className="rounded-md bg-slate-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-600 transition-colors"
                    onClick={() => document.getElementById("demo")?.scrollIntoView({behavior: "smooth"})}
                >
                    Try the demo
                </button>
                <a
                    href={REPO_LINKS.frontend}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                >
                    Frontend source
                </a>
                <a
                    href={REPO_LINKS.backend}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                >
                    Backend source
                </a>
            </div>

            <p className="mt-6 text-sm text-gray-400">
                <Link to="/login" className="hover:text-gray-600 transition-colors">
                    Sign in to the app &rarr;
                </Link>
            </p>

            <p className="mt-6 text-sm text-gray-400">
                Built with Typescript · React · Python · FastAPI
            </p>
        </header>
    );
}
