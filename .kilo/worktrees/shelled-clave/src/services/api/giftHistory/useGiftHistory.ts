import {useEffect, useState} from 'react';

import {getGiftHistory} from './gift-history.api';

import {GiftHistory} from './gift-history.types';

export const useGiftHistory = () => {
  const [data, setData] = useState<
    GiftHistory[]
  >([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<any>(null);

  const fetchGiftHistory =
    async () => {
      try {
        setLoading(true);

        setError(null);

        const res =
          await getGiftHistory();

        setData(res || []);
      } catch (err: any) {
        console.log(
          'GIFT HISTORY HOOK ERROR:',
          err,
        );

        setError(err);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchGiftHistory();
  }, []);

  return {
    data,

    loading,

    error,

    refresh: fetchGiftHistory,
  };
};