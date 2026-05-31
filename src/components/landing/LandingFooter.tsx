import { Link } from "react-router-dom";
import { REPO_LINKS } from "./links";

export function LandingFooter() {
    return (
        <footer className="border-t border-gray-200 py-12">
            <div className="mx-auto max-w-4xl px-6 text-center">
                <p className="text-sm text-gray-500">
                    Typescript · React · Python · FastAPI
                </p>

                <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                    <a
                        href={REPO_LINKS.frontend}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        Frontend
                    </a>
                    <span className="text-gray-300">·</span>
                    <a
                        href={REPO_LINKS.backend}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        Backend
                    </a>
                    <span className="text-gray-300">·</span>
                    <Link
                        to="/login"
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        Sign in
                    </Link>
                </div>
            </div>
        </footer>
    );
}
