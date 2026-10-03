import {useCallback, useEffect, useRef, useState} from 'react';

import {getService} from './get-service.api';

import type {Service} from '../getServices/services.types';

/**
 * Loads a single service (including its `astrologerMappings`) by slug.
 *
 * - `loading` covers the in-flight request.
 * - `error` holds network / GraphQL failures; `service` is `null` in that case.
 * - `service` is also `null` when the slug resolves to no service.
 * - A missing/empty slug resets the state without issuing a request.
 */
export const useGetService = (slug?: string | null) => {
  const [service, setService] = useState<Service | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<any>(null);

  // Guards against a slow response for a previous slug overwriting the
  // current one, and against a late setState after unmount.
  const requestIdRef = useRef(0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchService = useCallback(async (nextSlug?: string | null) => {
    const requestId = ++requestIdRef.current;

    if (!nextSlug) {
      setService(null);
      setError(null);
      setLoading(false);

      return;
    }

    try {
      setLoading(true);

      setError(null);

      const response = await getService(nextSlug);

      if (requestId !== requestIdRef.current || !isMountedRef.current) {
        return;
      }

      setService(response);
    } catch (err: any) {
      if (requestId !== requestIdRef.current || !isMountedRef.current) {
        return;
      }

      console.log('GET SERVICE HOOK ERROR:', err);

      setService(null);
      setError(err);
    } finally {
      if (requestId === requestIdRef.current && isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchService(slug);
  }, [fetchService, slug]);

  const refresh = useCallback(() => fetchService(slug), [fetchService, slug]);

  return {
    service,

    loading,

    error,

    refresh,
  };
};
