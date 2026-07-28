import {useEffect, useState} from 'react';

import {getGifts} from './gift.api';

import {Gift} from './gift.types';

export const useGifts = () => {
  const [data, setData] = useState<
    Gift[]
  >([]);

  const [loading, setLoading] =
    useState(false);

  const [totalCount, setTotalCount] =
    useState(0);

  const [error, setError] =
    useState<any>(null);

  const fetchGifts = async () => {
    try {
      setLoading(true);

      setError(null);

      const res = await getGifts();

      setData(res.data || []);

      setTotalCount(res.totalCount || 0);
    } catch (err: any) {
      console.log(
        'GIFTS HOOK ERROR:',
        err,
      );

      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGifts();
  }, []);

  return {
    data,

    totalCount,

    loading,

    error,

    refresh: fetchGifts,
  };
};