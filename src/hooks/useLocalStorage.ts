import { useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
    const [value, setValue] = useState<T>(() => {
        const stored = localStorage.getItem(key)
        return stored ? (JSON.parse(stored) as T): initialValue
    })

    const set = (newValue: T | ((prev:T) => T)) => {
        setValue(prev => {
            const resolved = typeof newValue === 'function'
            ? (newValue as (prev:T) => T)(prev) : newValue
            localStorage.setItem(key, JSON.stringify(resolved))
            return resolved
        })
    }

    return [value, set] as const
}