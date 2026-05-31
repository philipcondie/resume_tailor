export type DemoBullet = {
    // Casual, natural-language version, as you'd jot it down.
    before: string;
    // Tuned version. `undefined` when the bullet is set aside for this role.
    after?: string;
    // Did this bullet make the cut for the target posting?
    selected: boolean;
    // Shown next to a set-aside bullet to explain the selection.
    dropReason?: string;
};

export type DemoJob = {
    role: string;
    company: string;
    dates: string;
    bullets: DemoBullet[];
};

// The role we're tailoring toward, shown as the "target" above the resume.
export const DEMO_JOB_DESCRIPTION = {
    title: "Business Analyst",
    company: "Meridian Health",
    body: "We're hiring a Business Analyst to partner with operations and product teams. You'll elicit and document requirements, map and improve business processes, and turn data into clear recommendations for stakeholders. Strong communication, SQL, and stakeholder-management skills required.",
};

// The summary the tailored view reveals at the top.
export const DEMO_AFTER_SUMMARY =
    "Business analyst who bridges operations and engineering by translating stakeholder needs into clear requirements, mapping and streamlining processes, and turning operational data into decisions.";

export const DEMO_JOBS: DemoJob[] = [
    {
        role: "Operations Analyst",
        company: "Globex",
        dates: "2021 — Present",
        bullets: [
            {
                before:
                    "Worked with ops and support teams to improve our reporting system. Required understanding workflows and documenting for engineering to build.",
                after:
                    "Elicited requirements from operations and support stakeholders to improve the reporting system, mapping existing workflows and documenting specs that drove engineering delivery.",
                selected: true,
            },
            {
                before:
                    "Looked through our order data in SQL to see why tickets were piling up, found where things were getting stuck, and changed the workflow to fix it.",
                after:
                    "Analyzed operational data in SQL to pinpoint a workflow bottleneck, driving a process change that reduced ticket backlog.",
                selected: true,
            },
            {
                before:
                    "Ran onboarding sessions for new hires on our internal tools and kept the training docs up to date.",
                selected: false,
                dropReason: "Less relevant to a Business Analyst role",
            },
        ],
    },
];
