import {useCallback, useEffect, useState} from 'react';

import {getBlogBySlug} from './blog.api';
import {BlogDetail} from './blog.types';

export const useBlogDetail = (slug: string | null) => {
  const [blog, setBlog] = useState<BlogDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchBlog = useCallback(async () => {
    if (!slug) {
      setBlog(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getBlogBySlug(slug);
      setBlog(response);
    } catch (err: any) {
      console.log('BLOG DETAIL HOOK ERROR:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  return {blog, loading, error, refresh: fetchBlog};
};
