import { useEffect, useState } from "react";

interface TriggerVerificationData {
    id: string;
    type: 'arrangement' | 'machine';
    spec: string;
    save: boolean;
}

interface UseTriggerVerificationReturn {
    verification: TriggerVerificationData;
    reset: () => void;
    triggerVerification: (verification: TriggerVerificationData) => void
}

const eventLabel = 'triggerVerification';

export function useTriggerVerification(): UseTriggerVerificationReturn {
    const [triggerVerification, setTriggerVerification] = useState<TriggerVerificationData | undefined>(undefined);
    useEffect(() => {
        const callback = (e) => {
            setTriggerVerification(e.detail)
        }
        document.addEventListener(eventLabel, callback);
        return () => {
            document.removeEventListener(eventLabel, callback);
        }
    });
    return {
        verification: triggerVerification,
        reset: () => {
            setTriggerVerification(undefined);
        },
        triggerVerification: (verification: TriggerVerificationData) => {
            document.dispatchEvent(new CustomEvent(eventLabel, {
                detail: verification,
            }));
        }
    }
}
