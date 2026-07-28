import {useEffect, useState} from 'react';

import {getFAQs} from './faq.api';

import {FAQ} from './faq.types';

export const useFAQs = () => {
  const [data, setData] = useState<
    FAQ[]
  >([]);

  const [loading, setLoading] =
    useState(false);

  const [totalCount, setTotalCount] =
    useState(0);

  const [error, setError] =
    useState<any>(null);

  const fetchFAQs = async () => {
    try {
      setLoading(true);

      setError(null);

      const res = await getFAQs();

      setData(res.data || []);

      setTotalCount(res.totalCount || 0);
    } catch (err: any) {
      console.log(
        'FAQ HOOK ERROR:',
        err,
      );

      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  return {
    data,

    totalCount,

    loading,

    error,

    refresh: fetchFAQs,
  };
};