import {useCallback, useEffect, useState} from 'react';

import {getBlogs} from './blog.api';

import {Blog} from './blog.types';

export const useBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<any>(null);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);

      setError(null);

      const response = await getBlogs();

      setBlogs(response || []);
    } catch (err: any) {
      console.log('BLOGS HOOK ERROR:', err);

      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return {
    blogs,

    loading,

    error,

    refresh: fetchBlogs,
  };
};
