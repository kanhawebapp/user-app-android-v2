import {useCallback, useEffect, useState} from 'react';
import {getPujaDetails} from './puja-services.api';
import {PujaServiceDetails} from './puja-services.types';

export const usePujaDetails = (slug?: string) => {
  const [service, setService] = useState<PujaServiceDetails | null>(null);
  const [loading, setLoading] = useState(Boolean(slug));
  const [error, setError] = useState<Error | null>(null);

  const fetchDetails = useCallback(async () => {
    if (!slug) {
      setService(null);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setService(null);
      const response = await getPujaDetails(slug);
      setService(response);
    } catch (err: any) {
      console.log('PUJA DETAILS HOOK ERROR:', err);
      setService(null);
      setError(
        err instanceof Error
          ? err
          : new Error(err?.message || 'Failed to load puja details'),
      );
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return {service, loading, error, refresh: fetchDetails};
};
