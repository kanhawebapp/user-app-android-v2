import {
    useCallback,
    useEffect,
    useState,
} from 'react';
import { getSessionRemedies } from './session-remedies.api';
import { SessionRemedy } from './session-remedies.types';

export const useSessionRemedies = (
    sessionId?: string,
) => {
    const [remedies, setRemedies] =
        useState<SessionRemedy[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<any>(null);

    const fetchRemedies =
        useCallback(
            async (
                id?: string,
            ) => {
                const currentSessionId =
                    id || sessionId;

                if (!currentSessionId) {
                    setRemedies([]);
                    return;
                }

                try {
                    setLoading(true);

                    setError(null);

                    const response =
                        await getSessionRemedies(
                            currentSessionId,
                        );

                    setRemedies(
                        response || [],
                    );
                } catch (err: any) {
                    console.log(
                        'SESSION REMEDIES HOOK ERROR:',
                        err,
                    );

                    setError(err);
                } finally {
                    setLoading(false);
                }
            },
            [sessionId],
        );

    useEffect(() => {
        if (sessionId) {
            fetchRemedies();
        }
    }, [
        sessionId,
        fetchRemedies,
    ]);

    return {
        remedies,

        loading,

        error,

        refresh: fetchRemedies,
    };
};