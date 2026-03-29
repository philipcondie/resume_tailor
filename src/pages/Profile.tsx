import { NavLink, Outlet } from "react-router-dom";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2 text-sm border-l-2 transition-colors ${
        isActive
            ? "border-gray-900 text-gray-900 font-medium"
            : "border-transparent text-gray-600 hover:text-gray-700 hover:border-gray-300"
    }`;

export function Profile() {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <aside className="w-52 shrink-0 border-r border-gray-200 bg-white pt-10 px-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 px-4 mb-4">Profile</p>
                <nav className="flex flex-col">
                    <NavLink to="personal" className={navLinkClass}>Personal Info</NavLink>
                    <NavLink to="education" className={navLinkClass}>Education</NavLink>
                    <NavLink to="work" className={navLinkClass}>Work</NavLink>
                    <NavLink to="projects" className={navLinkClass}>Projects</NavLink>
                    <NavLink to="skills" className={navLinkClass}>Skills</NavLink>
                </nav>
            </aside>
            <main className="flex-1 p-10">
                <Outlet />
            </main>
        </div>
    )
}