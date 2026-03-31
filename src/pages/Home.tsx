import { NavLink, Outlet } from "react-router-dom";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2 text-sm border-l-2 transition-colors ${
        isActive
            ? "border-gray-900 text-gray-900 font-medium"
            : "border-transparent text-gray-600 hover:text-gray-700 hover:border-gray-300"
    }`;

export function Home() {
    return (
            <div className="flex min-h-screen bg-gray-50">
                <aside className="w-52 shrink-0 border-r border-gray-200 bg-white pt-10 px-4 sticky top-0 h-screen">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 px-4 mb-4">Resume Builder</p>
                    <nav className="flex flex-col">
                        <NavLink to="profile/personal" className={navLinkClass}>Personal Info</NavLink>
                        <NavLink to="profile/education" className={navLinkClass}>Education</NavLink>
                        <NavLink to="profile/work" className={navLinkClass}>Work</NavLink>
                        <NavLink to="profile/projects" className={navLinkClass}>Projects</NavLink>
                        <NavLink to="profile/skills" className={navLinkClass}>Skills</NavLink>
                        <NavLink to="prompt" className={navLinkClass}>Prompt</NavLink>
                        <NavLink to="generate" className={navLinkClass}>Generate</NavLink>
                        <NavLink to="preview" className={navLinkClass}>Preview</NavLink>
                    </nav>
                </aside>
                <main className="flex-1 p-10">
                    <Outlet />
                </main>
            </div>
        )
}