import {useEffect, useState} from 'react';
import {getWalletTransactions} from './walletTransactions.api';
import {WalletTransaction} from './walletTransactions.types';

export const useWalletTransactions = () => {
  const [data, setData] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = async (pageNumber = 1, filters = {}) => {
    try {
      if (pageNumber > totalPages) return;

      setLoading(true);

      const res = await getWalletTransactions({
        page: pageNumber,
        limit: 10,
        ...filters,
      });

      if (pageNumber === 1) {
        setData(res.data);
      } else {
        setData(prev => [...prev, ...res.data]);
      }

      setPage(res.currentPage);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.log('HOOK ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(1);
  }, []);

  return {
    data,
    loading,
    page,
    totalPages,
    fetchTransactions,
  };
};