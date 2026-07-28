import {useEffect, useState} from 'react';

import {getAboutPage} from './about-page.api';

import {AboutPage} from './about-page.types';

export const useAboutPage = () => {
  const [data, setData] =
    useState<AboutPage | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<any>(null);

  const fetchAboutPage = async () => {
    try {
      setLoading(true);

      setError(null);

      const res =
        await getAboutPage();

      setData(res || null);
    } catch (err: any) {
      console.log(
        'ABOUT PAGE HOOK ERROR:',
        err,
      );

      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutPage();
  }, []);

  return {
    data,

    loading,

    error,

    refresh: fetchAboutPage,
  };
};