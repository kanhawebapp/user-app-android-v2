import {useCallback, useEffect, useState} from 'react';

import {getBlogBySlug} from './blog.api';

import {BlogDetail} from './blog.types';

export const useBlogBySlug = (slug: string | undefined) => {
  const [data, setData] = useState<BlogDetail | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<any>(null);

  const fetchBlogBySlug = useCallback(async () => {
    if (!slug) {
      return;
    }

    try {
      setLoading(true);

      setError(null);

      const res = await getBlogBySlug(slug);

      setData(res || null);
    } catch (err: any) {
      console.log('BLOG BY SLUG HOOK ERROR:', err);

      setError(err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchBlogBySlug();
  }, [fetchBlogBySlug]);

  return {
    data,

    loading,

    error,

    refresh: fetchBlogBySlug,
  };
};
