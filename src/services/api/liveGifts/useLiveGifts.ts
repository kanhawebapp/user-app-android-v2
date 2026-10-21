import {useCallback, useEffect, useState} from 'react';
import {getLiveGifts} from './live-gifts.api';
import {LiveGift} from './live-gifts.types';

interface UseLiveGiftsOptions {
  /** When true, fetch gifts (e.g. gift panel is open). */
  enabled?: boolean;
}

export const useLiveGifts = ({enabled = true}: UseLiveGiftsOptions = {}) => {
  const [data, setData] = useState<LiveGift[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGifts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const gifts = await getLiveGifts();
      setData(Array.isArray(gifts) ? gifts : []);
    } catch (err: any) {
      const message = err?.message || 'Failed to load gifts. Please try again.';
      setError(message);
      console.log('LIVE GIFTS HOOK ERROR:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    fetchGifts();
  }, [enabled, fetchGifts]);

  return {
    data,
    loading,
    error,
    refresh: fetchGifts,
  };
};
