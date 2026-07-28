import {useEffect, useState} from 'react';

import {getFreeServices} from './free-services.api';

import {FreeService} from './free-services.types';

export const useFreeServices = () => {
  const [data, setData] = useState<FreeService[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<any>(null);

  const fetchFreeServices = async () => {
    try {
      setLoading(true);

      setError(null);

      const res = await getFreeServices();

      setData(res?.data || []);
    } catch (err: any) {
      console.log('FREE SERVICES HOOK ERROR:', err);

      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreeServices();
  }, []);

  return {
    data,

    loading,

    error,

    refresh: fetchFreeServices,
  };
};
