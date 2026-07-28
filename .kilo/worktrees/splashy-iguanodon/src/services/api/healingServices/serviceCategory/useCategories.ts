import {useEffect, useState} from 'react';

import {getCategories} from './categories.api';

import {Category} from './categories.types';

export const useCategories = () => {
  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<any>(null);

  const fetchCategories =
    async () => {
      try {
        setLoading(true);

        setError(null);

        const response =
          await getCategories();

        setCategories(response || []);
      } catch (err: any) {
        console.log(
          'CATEGORIES HOOK ERROR:',
          err,
        );

        setError(err);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,

    loading,

    error,

    refresh: fetchCategories,
  };
};