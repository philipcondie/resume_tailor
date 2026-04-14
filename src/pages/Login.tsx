import { useState, FormEvent } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

export function Login() {
    const { isAuthenticated, login} = useAuth();
    const navigate = useNavigate()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    if (isAuthenticated) return <Navigate to={'/'} replace/>

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await login(email,password)
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <form onSubmit={handleSubmit} className="w-80 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
                <h1 className="mb-1 text-lg font-semibold text-gray-900">Resume Tailor</h1>
                <p className="mb-6 text-sm text-gray-500">Enter your email and password to continue.</p>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(null); }}
                    placeholder="Email"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
                    autoFocus
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(null); }}
                    placeholder="Password"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
                />
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                <button
                    type="submit"
                    className="mt-4 w-full rounded bg-gray-900 py-2 text-sm font-medium text-white hover:bg-gray-800"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}