import { useState } from "react";
import {
    DEMO_JOBS,
    DEMO_JOB_DESCRIPTION,
    DEMO_AFTER_SUMMARY,
} from "../../lib/demoData";

// Scripted before/after demo (no backend). Content is in demoData.ts.
export function DemoSection() {
    const [tailored, setTailored] = useState(false);

    return (
        <section id="demo" className="mx-auto max-w-5xl px-6 py-20">
            <h2 className="text-center text-2xl font-semibold tracking-tight">
                See it in action
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-gray-600">
                Here's the same work history, written casually. Watch it get
                polished, aligned to the posting's language, and trimmed to the
                bullets that actually matter for this role.
            </p>

            {/* Target job description — the thing we tailor toward */}
            <div className="mx-auto mt-10 max-w-2xl rounded-lg border border-gray-200 bg-gray-50 p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Target role
                </p>
                <p className="mt-1 font-medium text-gray-900">
                    {DEMO_JOB_DESCRIPTION.title} · {DEMO_JOB_DESCRIPTION.company}
                </p>
                <p className="mt-2 text-sm text-gray-600">
                    {DEMO_JOB_DESCRIPTION.body}
                </p>
            </div>

            {/* The action */}
            <div className="mt-8 flex justify-center">
                <button
                    type="button"
                    onClick={() => setTailored((t) => !t)}
                    className="rounded-md bg-slate-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-600 transition-colors"
                >
                    {tailored ? "Reset" : "Tailor for this job"}
                </button>
            </div>

            {/* The resume-like output. The `tailored` flag swaps bullet content. */}
            <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
                {/* Summary only appears in the tailored view */}
                {tailored && (
                    <div className="mb-6 border-b border-gray-100 pb-6">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Summary
                        </p>
                        <p className="mt-1 text-sm text-gray-700">
                            {DEMO_AFTER_SUMMARY}
                        </p>
                    </div>
                )}

                {DEMO_JOBS.map((job, jobIdx) => (
                    <div key={jobIdx} className={jobIdx > 0 ? "mt-6" : undefined}>
                        <div className="flex items-baseline justify-between">
                            <span className="font-medium text-gray-900">
                                {job.role} — {job.company}
                            </span>
                            <span className="text-xs text-gray-500">{job.dates}</span>
                        </div>
                        <ul className="mt-2 space-y-1.5">
                            {job.bullets.map((bullet, i) => {
                                // Three render states per bullet:
                                //   !tailored        -> show the casual `before` text.
                                //   tailored + kept  -> show the polished `after` text.
                                //   tailored + drop  -> keep `before` visible but
                                //                       fade + strike it, with a tag.
                                const isDropped = tailored && !bullet.selected;
                                const text =
                                    tailored && bullet.selected
                                        ? bullet.after
                                        : bullet.before;
                                // key includes `tailored` so the <li> remounts on
                                // swap and the fadeIn animation replays.
                                return (
                                    <li
                                        key={`${tailored}-${i}`}
                                        className={`flex gap-2 text-sm animate-[fadeIn_300ms_ease] ${
                                            isDropped ? "text-gray-400" : "text-gray-700"
                                        }`}
                                    >
                                        <span
                                            className={`mt-2 h-1 w-1 shrink-0 rounded-full ${
                                                isDropped ? "bg-gray-300" : "bg-gray-400"
                                            }`}
                                        />
                                        <span>
                                            <span className={isDropped ? "line-through" : undefined}>
                                                {text}
                                            </span>
                                            {isDropped && bullet.dropReason && (
                                                <span className="ml-2 inline-block rounded bg-gray-100 px-1.5 py-0.5 align-middle text-xs font-medium text-gray-500 no-underline">
                                                    {bullet.dropReason}
                                                </span>
                                            )}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Short clip of the real app's drag-and-drop + inline editing. */}
            <div className="mx-auto mt-16 max-w-3xl text-center">
                <h3 className="text-lg font-semibold tracking-tight text-gray-900">
                    Reorder and edit in place
                </h3>
                <p className="mx-auto mt-2 max-w-xl text-sm text-gray-600">
                    Drag any bullet to reorder it and edit the text inline — no
                    forms, no page reloads.
                </p>
                <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm">
                    <video
                        className="w-full"
                        src="/demo-editing.mp4"
                        poster="/demo-editing-poster.png"
                        autoPlay
                        muted
                        loop
                        playsInline
                    />
                </div>
            </div>
        </section>
    );
}
