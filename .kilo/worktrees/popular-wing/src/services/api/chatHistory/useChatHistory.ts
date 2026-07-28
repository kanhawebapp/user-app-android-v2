// import {useEffect, useState} from 'react';

// import {getUserChatHistory} from './chat-history.api';

// import {
//   ChatHistory,
//   ChatHistoryPagination,
//   UserChatHistoryFilterInput,
// } from './chat-history.types';

// export const useChatHistory = (
//   filters?: UserChatHistoryFilterInput,
// ) => {
//   const [data, setData] = useState<any[]>([]);

//   const [loading, setLoading] = useState(false);

//   const [page, setPage] = useState(1);

//   const [totalPages, setTotalPages] = useState(1);

//   const fetchChatHistory = async (
//     pageNumber = 1,
//   ) => {
//     try {
//       setLoading(true);

//       const res = await getUserChatHistory({
//         limit: 10,
//         page: pageNumber,

//         ...filters,
//       });
//        console.log("res of chatHistory",res)
//       if (pageNumber === 1) {
//         setData(res.data || []);
//       } else {
//         setData(prev => [...prev, ...(res.data || [])]);
//       }

//       setPage(res.currentPage || 1);

//       setTotalPages(res.totalPages || 1);
//     } catch (error) {
//       console.log('CHAT HISTORY HOOK ERROR:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchChatHistory(1);
//   }, []);

//   const loadMore = () => {
//     if (!loading && page < totalPages) {
//       fetchChatHistory(page + 1);
//     }
//   };

//   return {
//     data,
//     loading,

//     page,
//     totalPages,

//     loadMore,

//     refresh: () => fetchChatHistory(1),
//   };
// };

// export interface GetUserChatHistoryResponse {
//   getUserChatHistory: ChatHistoryPagination;
// }

import {useEffect, useState} from 'react';

import {getUserChatHistory} from './chat-history.api';

import {
  ChatHistory,
  ChatHistorySummary,
  UserChatHistoryFilterInput,
} from './chat-history.types';

export const useChatHistory = (filters?: UserChatHistoryFilterInput) => {
  const [data, setData] = useState<ChatHistory[]>([]);

  const [summary, setSummary] = useState<ChatHistorySummary | null>(null);

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [totalCount, setTotalCount] = useState(0);

  const fetchChatHistory = async (
    pageNumber = 1,
    extraFilters?: UserChatHistoryFilterInput,
  ) => {
    try {
      if (pageNumber > totalPages) {
        return;
      }

      setLoading(true);

      const res = await getUserChatHistory({
        limit: 10,
        page: pageNumber,

        ...filters,
        ...extraFilters,
      });

      console.log(
        'CHAT HISTORY PAGE:',
        res.currentPage,
        'TOTAL:',
        res.totalPages,
      );

      if (pageNumber === 1) {
        setData(res.data || []);
      } else {
        setData(prev => [...prev, ...(res.data || [])]);
      }

      setSummary(res.summary || null);

      setTotalCount(res.totalCount || 0);

      setPage(res.currentPage || 1);

      setTotalPages(res.totalPages || 1);
    } catch (error) {
      console.log('CHAT HISTORY HOOK ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatHistory(1);
  }, []);

  const loadMore = () => {
    if (!loading && page < totalPages) {
      fetchChatHistory(page + 1);
    }
  };

  const refresh = () => {
    fetchChatHistory(1);
  };

  return {
    data,

    summary,

    loading,

    page,

    totalPages,

    totalCount,

    loadMore,

    refresh,

    fetchChatHistory,
  };
};
