import {useEffect, useState} from 'react';
import {getAstrologers} from './astrologer.api';
import {Astrologer} from './astrologer.types';

export const useAstrologers = () => {
  const [data, setData] = useState<Astrologer[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAstrologers = async (pageNumber = 1) => {
    try {
      if (pageNumber > totalPages) return;

      setLoading(true);

      const res = await getAstrologers({
        limit: 10,
        page: pageNumber,
        sortField: 'RATING',
        sortOrder: 'DESC',
      });

      console.log('API PAGE:', res.currentPage, 'TOTAL:', res.totalPages);

      if (pageNumber === 1) {
        setData(res.data);
      } else {
        setData(prev => [...prev, ...res.data]);
      }

      setPage(res.currentPage);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.log('ASTROLOGER ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAstrologers(1);
  }, []);

  const loadMore = () => {
    if (page < totalPages && !loading) {
      fetchAstrologers(page + 1);
    }
  };

  return {
    data,
    loading,
    loadMore,
    page,
    totalPages,
  };
};
