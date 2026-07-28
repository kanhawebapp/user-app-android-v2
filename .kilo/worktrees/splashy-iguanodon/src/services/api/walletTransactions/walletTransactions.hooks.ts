// import {useEffect, useState} from 'react';
// import {getWalletTransactions} from './walletTransactions.api';
// import {WalletTransaction} from './walletTransactions.types';

// export const useWalletTransactions = () => {
//   const [data, setData] = useState<WalletTransaction[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const fetchTransactions = async (pageNumber = 1, filters = {}) => {
//     try {
//       if (pageNumber > totalPages) return;

//       setLoading(true);

//       const res = await getWalletTransactions({
//         page: pageNumber,
//         limit: 10,
//         ...filters,
//       });

//       if (pageNumber === 1) {
//         setData(res.data);
//       } else {
//         setData(prev => [...prev, ...res.data]);
//       }

//       setPage(res.currentPage);
//       setTotalPages(res.totalPages);
//     } catch (error) {
//       console.log('HOOK ERROR:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTransactions(1);
//   }, []);

//   return {
//     data,
//     loading,
//     page,
//     totalPages,
//     fetchTransactions,
//   };
// };

import {useEffect, useState} from 'react';
import {getWalletTransactions} from './walletTransactions.api';
import {WalletTransaction, TransactionType} from './walletTransactions.types';

export const useWalletTransactions = () => {
  const [data, setData] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [type, setType] = useState<TransactionType | null>(null);

  const fetchTransactions = async (
    pageNumber = 1,
    selectedType?: TransactionType | null,
  ) => {
    try {
      if (pageNumber > totalPages && pageNumber !== 1) {
        return;
      }

      setLoading(true);

      const res = await getWalletTransactions({
        page: pageNumber,
        limit: 10,
        type: selectedType ? [selectedType] : undefined, // ✅ FIX
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

  // initial load
  useEffect(() => {
    fetchTransactions(1, type);
  }, [type]);

  // filter change handler
  const applyFilter = (newType: TransactionType | null) => {
    setType(newType);
    setPage(1);
  };

  // load more (pagination)
  const loadMore = () => {
    if (!loading && page < totalPages) {
      fetchTransactions(page + 1, type);
    }
  };

  return {
    data,
    loading,
    page,
    totalPages,
    applyFilter,
    loadMore,
  };
};
