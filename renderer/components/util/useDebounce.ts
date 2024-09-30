import { useEffect, useState } from "react";

export function useDebounce<T>(initialValue: T, delay: number): [T, (newValue: T) => void] {
    const [value, setValue] = useState(initialValue);
    const [debounceValue, setDebounceValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceValue(value);
        });
        return () => {
            clearTimeout(handler);
        }
    }, [value, delay]);
    return [debounceValue, setValue];
}
