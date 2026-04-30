import { NavLink } from "react-router-dom";
import { useAuth } from "../lib/auth";


const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2 text-sm border-l-2 transition-colors ${isActive
        ? "border-gray-900 text-gray-900 font-medium"
        : "border-transparent text-gray-600 hover:text-gray-700 hover:border-gray-300"
    }`;

export function Sidebar({isOpen}:{isOpen:boolean}) {
    const { logout } = useAuth();

    const baseClassName = "shrink-0 border-r border-gray-200 bg-white h-full overflow-hidden transition-all duration-300 ease-in-out"
    const openClassName = baseClassName + " w-52";
    const closedClassName = baseClassName + " w-0";
    return (
        <aside className={isOpen ? openClassName : closedClassName}>
            <div className="w-52 pt-4 px-4 h-full flex flex-col">
                <nav className="flex flex-col">
                    <NavLink to="resumes" className={navLinkClass}>Resumes</NavLink>
                    <NavLink to="profile/personal" className={navLinkClass}>Personal Info</NavLink>
                    <NavLink to="profile/education" className={navLinkClass}>Education</NavLink>
                    <NavLink to="profile/work" className={navLinkClass}>Work</NavLink>
                    <NavLink to="profile/projects" className={navLinkClass}>Projects</NavLink>
                    <NavLink to="profile/skills" className={navLinkClass}>Skills</NavLink>
                    <NavLink to="prompt" className={navLinkClass}>Prompt</NavLink>
                    <NavLink to="layout" className={navLinkClass}>Layout</NavLink>
                    <NavLink to="generate" className={navLinkClass}>Generate</NavLink>
                </nav>
                <button
                    onClick={logout}
                    className="mt-auto mb-4 px-4 pt-4 text-left text-sm text-gray-500 hover:text-gray-900 transition-colors border-t border-gray-200"
                >
                    Log out
                </button>
            </div>
        </aside>
    )
}