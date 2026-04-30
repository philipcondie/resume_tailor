import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { MenuIcon } from "../components/utils/Icons";

export function Home() {
    const [sidebarIsOpen, setSidebarIsOpen] = useState<boolean>(true);

    return (
            <div className="flex flex-col h-screen bg-gray-50">
                <header className="flex items-center h-14 px-4 border-b bg-white shrink-0">
                    <button
                        onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
                        aria-label="Toggle sidebar"
                        aria-expanded={sidebarIsOpen}
                        className="p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                        <MenuIcon />
                    </button>
                    <span className="ml-4 font-semibold text-lg">Resume Tailor</span>
                </header>
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar isOpen={sidebarIsOpen} />
                    <main className="flex-1 p-10 overflow-y-auto">
                        <Outlet />
                    </main>
                </div>
            </div>
        )
}