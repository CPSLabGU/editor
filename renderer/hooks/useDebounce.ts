import { useState } from "react";

function throttle<T>(delay: number, callback: (T) => void): (T) => void {
    let timeout: NodeJS.Timeout | undefined = undefined;
    return (newValue: T) => {
        if (timeout !== undefined) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            callback(newValue);
        }, delay);
    }
}

export function useDebounce<T>(initialValue: T, delay: number): [T, (newValue: T) => void] {
    const [value, setValue] = useState(initialValue);
    return [value, throttle(delay, setValue)];
}
