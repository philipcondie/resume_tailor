import { useEffect, useState } from "react";
import { ResumeMetadata } from "../types/resume";
import { resumeApi } from "../lib/api";
import { Spinner } from "../components/utils/Spinner";
import { TrashIcon } from "../components/utils/Icons";
import { Link } from "react-router-dom";
// get list of resumes, display list of resumes in a table, make the resumes clickable

export function Resumes() {
    const [resumes, setResumes] = useState<ResumeMetadata[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        resumeApi.list()
            .then(setResumes)
            .catch(setError)
            .finally(() => setIsLoading(false));
    },[]);

    if (isLoading) return <Spinner />;
    if (error) return <div className="text-sm text-red-600">{error.message}</div>;

    const formatDate = (iso: string) => new Date(iso).toLocaleDateString();

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this resume? This cannot be undone.")) return;
        await resumeApi.delete(id);
        setResumes(prev => prev.filter(r => `${r.id}` !== id));
    };

    return (
        <div className="max-w-4xl">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Resumes</h1>

            {resumes.length === 0 ? (
                <div className="border border-dashed border-gray-300 rounded-md p-10 text-center">
                    <p className="text-sm text-gray-600 mb-4">You haven't generated any resumes yet.</p>
                    <Link
                        to="/generate"
                        className="inline-block px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded hover:bg-gray-700 transition-colors"
                    >
                        Create your first resume
                    </Link>
                </div>
            ) : (
                <div className="border border-gray-200 rounded-md bg-white">
                    <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-4 py-3 border-b border-gray-200 text-xs font-semibold uppercase tracking-widest text-gray-400">
                        <div>Filename</div>
                        <div>Created</div>
                        <div>Updated</div>
                        <div><span className="sr-only">Actions</span></div>
                    </div>
                    {resumes.map(r => (
                        <div
                            key={r.id}
                            className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-4 py-3 border-b border-gray-100 last:border-b-0 text-sm"
                        >
                            <div>
                                <Link
                                    to={`/preview/${r.id}`}
                                    className="text-gray-900 font-medium hover:text-gray-600 hover:underline"
                                >
                                    {r.filename}
                                </Link>
                            </div>
                            <div className="text-gray-600">{formatDate(r.createdAt)}</div>
                            <div className="text-gray-600">{formatDate(r.updatedAt)}</div>
                            <button
                                onClick={() => handleDelete(`${r.id}`)}
                                aria-label="Delete resume"
                                title="Delete"
                                className="p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <TrashIcon />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}