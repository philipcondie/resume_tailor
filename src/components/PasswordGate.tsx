import { useState, type FormEvent, type ReactNode } from "react";

const GATE_PASSWORD = import.meta.env.VITE_GATE_PASSWORD ?? "";

export function PasswordGate({ children }: { children: ReactNode }) {
    const [authed, setAuthed] = useState(() => {
        if (!GATE_PASSWORD) return true;
        return sessionStorage.getItem("gate_authed") === "true";
    });
    const [input, setInput] = useState("");
    const [error, setError] = useState(false);

    if (authed) return <>{children}</>;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (input === GATE_PASSWORD) {
            sessionStorage.setItem("gate_authed", "true");
            setAuthed(true);
        } else {
            setError(true);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <form onSubmit={handleSubmit} className="w-80 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
                <h1 className="mb-1 text-lg font-semibold text-gray-900">Resume Tailor</h1>
                <p className="mb-6 text-sm text-gray-500">Enter the password to continue.</p>
                <input
                    type="password"
                    value={input}
                    onChange={(e) => { setInput(e.target.value); setError(false); }}
                    placeholder="Password"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
                    autoFocus
                />
                {error && <p className="mt-2 text-sm text-red-600">Wrong password.</p>}
                <button
                    type="submit"
                    className="mt-4 w-full rounded bg-gray-900 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                    Enter
                </button>
            </form>
        </div>
    );
}