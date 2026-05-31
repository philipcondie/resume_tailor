type Feature = {
    title: string;
    body: string;
};

const FEATURES: Feature[] = [
    {
        title: "Tailored to the job, not generic",
        body: "An LLM selects your most relevant work experience and finetunes your resume to the job description while keeping your specific job history.",
    },
    {
        title: "Print-ready templates with live theming",
        body: "Switch between classic, sidebar, and multi-panel layouts, and adjust colors and fonts on the fly. What you see is exactly what prints.",
    },
    {
        title: "Drag-and-drop editing",
        body: "Reorder sections and individual bullets directly in the preview. Fine-tune every resume without leaving the page.",
    },
    {
        title: "Download a polished PDF",
        body: "Export any resume as a clean, print-ready PDF in one click to attach to an application or hand to a recruiter.",
    },
];

export function Features() {
    return (
        <section className="bg-gray-50 py-20">
            <div className="mx-auto max-w-4xl px-6">
                <h2 className="text-center text-2xl font-semibold tracking-tight">
                    What it does
                </h2>
                <div className="mt-12 grid gap-6 sm:grid-cols-2">
                    {FEATURES.map((feature, i) => (
                        <div
                            key={i}
                            className="rounded-xl border border-gray-200 bg-white p-6"
                        >
                            <h3 className="font-medium text-gray-900">{feature.title}</h3>
                            <p className="mt-2 text-sm text-gray-600">{feature.body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
