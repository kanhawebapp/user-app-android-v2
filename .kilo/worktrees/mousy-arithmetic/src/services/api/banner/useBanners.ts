import {useEffect, useState} from 'react';

import {getBanners} from './banner.api';

import {Banner} from './banner.types';

export const useBanners = (
  language = 'en',
) => {
  const [data, setData] = useState<
    Banner[]
  >([]);

  const [loading, setLoading] =
    useState(false);

  const [totalCount, setTotalCount] =
    useState(0);

  const [error, setError] =
    useState<any>(null);

  const fetchBanners = async () => {
    try {
      setLoading(true);

      setError(null);

      const res =
        await getBanners(language);

      setData(res.data || []);

      setTotalCount(res.totalCount || 0);
    } catch (err: any) {
      console.log(
        'BANNERS HOOK ERROR:',
        err,
      );

      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [language]);

  return {
    data,

    totalCount,

    loading,

    error,

    refresh: fetchBanners,
  };
};