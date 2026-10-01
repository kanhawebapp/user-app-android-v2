import {useCallback, useEffect, useRef, useState} from 'react';

import {getCategory} from './category.api';

import {
  CategoryService,
  CategoryWithServices,
} from './category.types';

export const useCategoryServices = (slug?: string | null) => {
  const [category, setCategory] =
    useState<CategoryWithServices | null>(null);

  const [services, setServices] =
    useState<CategoryService[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<any>(null);

  // Guards against a slow response for a previous slug overwriting the
  // current one, and against a late setState after unmount.
  const requestIdRef = useRef(0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchCategoryServices =
    useCallback(
      async (nextSlug?: string | null) => {
        const requestId = ++requestIdRef.current;

        if (!nextSlug) {
          setCategory(null);
          setServices([]);
          setError(null);
          setLoading(false);

          return;
        }

        try {
          setLoading(true);

          setError(null);

          const response =
            await getCategory(nextSlug);

          if (
            requestId !== requestIdRef.current ||
            !isMountedRef.current
          ) {
            return;
          }

          setCategory(response);
          setServices(response?.services || []);
        } catch (err: any) {
          if (
            requestId !== requestIdRef.current ||
            !isMountedRef.current
          ) {
            return;
          }

          console.log(
            'CATEGORY SERVICES HOOK ERROR:',
            err,
          );

          setCategory(null);
          setServices([]);
          setError(err);
        } finally {
          if (
            requestId === requestIdRef.current &&
            isMountedRef.current
          ) {
            setLoading(false);
          }
        }
      },
      [],
    );

  useEffect(() => {
    fetchCategoryServices(slug);
  }, [fetchCategoryServices, slug]);

  return {
    category,

    services,

    loading,

    error,

    refresh: () => fetchCategoryServices(slug),
  };
};
