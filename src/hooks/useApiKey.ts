import { useState } from 'react';

export function useApiKey() {
    const [apiKey, setApiKey] = useState<string>(
        () => localStorage.getItem('claude_api_key') ?? ''
    );

    const saveApiKey = (key: string) => {
        localStorage.setItem('claude_api_key', key)
        setApiKey(key)
    };

    const clearApiKey = () => {
        localStorage.remove('claude_api_key');
        setApiKey('');
    };

    return { apiKey, saveApiKey, clearApiKey }
}