import { useCallback, useEffect, useRef, useState } from "react";
import { ResumeMetadata } from "../types/resume";
import { resumeApi } from "../lib/api";
import { Modal } from "../components/utils/Modal";
import { Spinner } from "../components/utils/Spinner";
import { TrashIcon, DuplicateIcon, ChevronLeftIcon, ChevronRightIcon } from "../components/utils/Icons";
import { Link } from "react-router-dom";

const LIMITS_LIST = [10,25,50]

export function Resumes() {
    const [resumes, setResumes] = useState<ResumeMetadata[]>([]);
    const [resumeCount, setResumeCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isPaging, setIsPaging] = useState<boolean>(false);
    const [listError, setListError] = useState<Error | null>(null);
    const [actionError, setActionError] = useState<Error | null>(null);
    const [offset, setOffset] = useState<number>(0);
    const [limit, setLimit] = useState<number>(LIMITS_LIST[0]);

    // modal state
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [resumeId, setResumeId] = useState<string>('');
    const [filename, setFilename] = useState<string>('');
    const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);
    const [modalError, setModalError] = useState<Error | null>(null);

    const hasLoadedOnce = useRef<boolean>(false);

    const loadPage = useCallback(() => {
        // First fetch shows a full-page spinner immediately; later fetches only
        const isFirstLoad = !hasLoadedOnce.current;
        let spinnerTimer: ReturnType<typeof setTimeout> | undefined;
        if (isFirstLoad) {
            setIsLoading(true);
        } else {
            spinnerTimer = setTimeout(() => setIsPaging(true), 150);
        }
        return resumeApi.list(limit, offset)
            .then(response => {
                setResumeCount(response.resumeCount);
                setResumes(response.resumes);
                // If a mutation emptied the current page, step back a page.
                if (offset > 0 && offset >= response.resumeCount) {
                    setOffset(Math.max(0, offset - limit));
                }
            })
            .catch(setListError)
            .finally(() => {
                clearTimeout(spinnerTimer);
                setIsLoading(false);
                setIsPaging(false);
                hasLoadedOnce.current = true;
            });
    }, [limit, offset]);

    useEffect(() => {
        loadPage();
    }, [loadPage]);

    if (isLoading) return <Spinner />;
    if (listError) return <div className="text-sm text-red-600">{listError.message}</div>;

    const formatDate = (iso: string) => new Date(iso).toLocaleDateString();

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this resume? This cannot be undone.")) return;
        setActionError(null);
        try {
            await resumeApi.delete(id);
            await loadPage();
        } catch (err) {
            setActionError(err instanceof Error ? err : new Error(String(err)));
        }
    };

    const onModalClose = () => {
        setIsModalOpen(false);
        setResumeId('');
        setFilename('');
        setModalError(null);
    };
    
    const handleDuplicate = async () => {
        setIsLoadingModal(true);
        setModalError(null);

        try {
            await resumeApi.duplicate(resumeId, filename);
            await loadPage();
            onModalClose();
        } catch (err) {
            setModalError(err instanceof Error ? err : new Error(String(err)));
        } finally {
            setIsLoadingModal(false);
        }
    };

    const handleOffsetUpdate = (update:number) => {
        const newOffset = offset + limit * update;
        if (newOffset >= 0 && newOffset < resumeCount) {
            setOffset(newOffset);
        }
    }
    return (
        <div className="max-w-4xl">
            <h1 className="text-lg font-semibold text-gray-900 mb-6">Resumes</h1>
            {resumeCount === 0 ? (
                <div className="border border-dashed border-gray-300 rounded-md p-10 text-center">
                    <p className="text-sm text-gray-600 mb-4">You haven't generated any resumes yet.</p>
                    <Link
                        to="/app/generate"
                        className="inline-block px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded hover:bg-gray-700 transition-colors"
                    >
                        Create your first resume
                    </Link>
                </div>
            ) : (
                <>
                    {actionError && (
                        <div className="flex items-start justify-between bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 mb-3 text-sm">
                            <span>{actionError.message}</span>
                            <button
                                onClick={() => setActionError(null)}
                                aria-label="Dismiss"
                                className="ml-3 font-semibold leading-none"
                            >
                                ×
                            </button>
                        </div>
                    )}
                    <div className="relative overflow-x-auto rounded-md">
                        {isPaging && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center">
                                <Spinner />
                            </div>
                        )}
                        <div className={`border border-gray-200 rounded-md bg-white min-w-[520px] transition-opacity ${isPaging ? "opacity-50 pointer-events-none" : ""}`}>
                            <Modal isOpen={isModalOpen} onClose={onModalClose} >
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Duplicate Resume</h2>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium uppercase tracking-wide text-gray-600">File Name</label>
                                    <input
                                        className="border border-gray-300 rounded bg-transparent px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors resize-y"
                                        type="text" placeholder="Enter file name..."
                                        value={filename}
                                        onChange={(e) => setFilename(e.target.value)}
                                    />
                                    {modalError &&
                                        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3 mt-2">
                                            {modalError.message}
                                        </div>
                                    }
                                    <div className="flex justify-end items-center gap-2 mt-4">
                                        {isLoadingModal && <Spinner />}
                                        <button
                                            className="px-4 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                                            onClick={onModalClose}
                                            disabled={isLoadingModal}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="px-4 py-1.5 text-xs font-medium text-white bg-slate-700 rounded hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                            onClick={handleDuplicate}
                                            disabled={filename === '' || isLoadingModal}
                                        >
                                            Create
                                        </button>
                                    </div>
                                </div>
                            </Modal>
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
                                    <div className="min-w-0">
                                        <Link
                                            to={`/app/preview/${r.id}`}
                                            className="block truncate text-gray-900 font-medium hover:text-gray-600 hover:underline"
                                        >
                                            {r.filename}
                                        </Link>
                                    </div>
                                    <div className="text-gray-600">{formatDate(r.createdAt)}</div>
                                    <div className="text-gray-600">{formatDate(r.updatedAt)}</div>
                                    <div className="flex items-center gap-1 justify-end">
                                        <button 
                                            onClick={() => {setIsModalOpen(true); setResumeId(r.id); }}
                                            aria-label="Duplicate resume"
                                            title="Duplicate"
                                            className="p-1 rounded"
                                        >
                                            <DuplicateIcon />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(r.id)}
                                            aria-label="Delete resume"
                                            title="Delete"
                                            className="p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 border-t border-gray-200">
                                <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-600">
                                    Per page
                                    <select
                                        name="resumesPerPage"
                                        value={limit}
                                        onChange={(e) => {
                                            setLimit(Number(e.target.value));
                                            setOffset(0);
                                        }}
                                        className="border border-gray-300 rounded bg-transparent px-2 py-1 text-xs text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
                                    >
                                        {LIMITS_LIST.map(value => (
                                            <option key={value} value={value}>{value}</option>
                                        ))}
                                    </select>
                                </label>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-gray-500 tabular-nums">
                                        {offset + 1}–{Math.min(offset + limit, resumeCount)} of {resumeCount}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleOffsetUpdate(-1)}
                                            disabled={offset === 0}
                                            aria-label="Previous page"
                                            title="Previous page"
                                            className="p-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
                                        >
                                            <ChevronLeftIcon />
                                        </button>
                                        <button
                                            onClick={() => handleOffsetUpdate(1)}
                                            disabled={offset + limit >= resumeCount}
                                            aria-label="Next page"
                                            title="Next page"
                                            className="p-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
                                        >
                                            <ChevronRightIcon />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}