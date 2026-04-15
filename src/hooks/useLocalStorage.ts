import { useState } from "react";
import { z } from "zod";

export function useLocalStorage<T>(key: string, initialValue: T, schema?: z.ZodType<T>) {
    const [value, setValue] = useState<T>(() => {
        const stored = localStorage.getItem(key)
        if (stored === null) {
            return initialValue;
        }
        let parsed: unknown
        try {
            parsed = JSON.parse(stored);
        } catch {
            console.warn(`useLocalStorage: failed to parse JSON for key "${key}", using initial value`);
            return initialValue;
        }
        if (!schema) return parsed as T;
        const result = schema.safeParse(parsed);
        if (result.success) {
            return result.data
        } else {
            console.warn(`useLocalStorage: validation failed for key "${key}":`, result.error.issues);
            return initialValue;
        }
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