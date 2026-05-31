type Step = {
    title: string;
    body: string;
};

const STEPS: Step[] = [
    {
        title: "Build your profile once",
        body: "Add your work history, education, projects, and skills. Everything lives in one place, ready to reuse.",
    },
    {
        title: "Paste a job description",
        body: "Drop in the role you're targeting and add custom instructions for that resume to fine tune the base prompt.",
    },
    {
        title: "Get a tailored resume",
        body: "Bullets and summary are rewritten to match the job, then rendered into a print-ready, one-page resume you can style.",
    },
];

export function HowItWorks() {
    return (
        <section className="mx-auto max-w-4xl px-6 py-20">
            <h2 className="text-center text-2xl font-semibold tracking-tight">
                How it works
            </h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
                {STEPS.map((step, i) => (
                    <div key={i} className="text-center">
                        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                            {i + 1}
                        </div>
                        <h3 className="mt-4 font-medium text-gray-900">{step.title}</h3>
                        <p className="mt-2 text-sm text-gray-600">{step.body}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
