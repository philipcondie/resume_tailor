import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getAccessToken, setAccessToken, clearAccessToken, onAccessTokenChange, setRefreshToken } from "./api";

const API_BASE_URL = import.meta.env.VITE_API_URL;

type AuthContextValue = {
    authToken: string | null;
    isAuthenticated: boolean,
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    signup: (username: string, password: string, inviteCode: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children } : {children: ReactNode}) {
    const [authToken, setAuthToken] = useState<string | null>(getAccessToken());

    // Keep context state in sync with token changes that originate in api.ts
    // (e.g. a successful refresh, or a failed refresh clearing the token).
    // onAccessTokenChange returns its own unsubscribe fn, so it doubles as the
    // effect cleanup.
    useEffect(() => onAccessTokenChange(setAuthToken), []);

    const login = async (username: string, password: string) => {
        let response: Response;
        try {
            response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    username: username,
                    password: password,
                }),
            });
        } catch {
            throw new Error("Unable to connect to server");
        }
    
        if (response.status == 401) {
            throw new Error(`Invalid username or password`)
        }
        if (response.status == 500) {
            throw new Error('Something went wrong. Please try again later.')
        }
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`)
        }
        const { accessToken, refreshToken } = (await response.json());
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
    }
    
    const logout = () => {
        clearAccessToken();
        setAuthToken(null)
        window.location.href = '/login';
    }

    const signup = async (email: string, password: string, inviteCode: string) => {
        let response: Response
        try {
            response = await fetch (`${API_BASE_URL}/auth/signup`, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email:email, password:password, inviteCode: inviteCode}),
            });
        } catch {
            throw new Error("Unable to connect to server")
        }
        if (response.status == 400) {
            throw new Error('Invite code invalid.')
        }
        if (response.status == 409) {
            throw new Error('Email already in use.')
        }
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`)
        }
        const { accessToken } = (await response.json());
        setAccessToken(accessToken);
    }

    const isAuthenticated = authToken !== null;
    return (
        <AuthContext.Provider value={{ authToken, isAuthenticated, login, logout, signup }}>
            {children}
        </AuthContext.Provider>
      );
}

// eslint-disable-next-line react-refresh/only-export-components 
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
  };