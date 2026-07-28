import {useEffect, useState} from 'react';

import {getFreeServiceById} from './free-service-details.api';

import {FreeServiceDetail} from './free-service-details.types';

export const useFreeServiceDetails = (id: string) => {
  const [data, setData] = useState<FreeServiceDetail | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<any>(null);

  const fetchDetails = async () => {
    if (!id) {
      return;
    }

    try {
      setLoading(true);

      setError(null);

      const res = await getFreeServiceById(id);

      setData(res || null);
    } catch (err: any) {
      console.log('FREE SERVICE DETAILS HOOK ERROR:', err);

      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  return {
    data,

    loading,

    error,

    refresh: fetchDetails,
  };
};
