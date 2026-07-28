import {useEffect, useState} from 'react';

import {getFollowedAstrologers} from './followed-astrologers.api';

import {
  FollowedAstrologer,
} from './followed-astrologers.types';

export const useFollowedAstrologers =
  () => {
    const [data, setData] =
      useState<FollowedAstrologer[]>(
        [],
      );

    const [loading, setLoading] =
      useState(false);

    const [refreshing, setRefreshing] =
      useState(false);

    const [page, setPage] =
      useState(1);

    const [totalPages, setTotalPages] =
      useState(1);

    const [hasMore, setHasMore] =
      useState(true);

    const fetchAstrologers =
      async (
        pageNumber: number = 1,
        isLoadMore: boolean = false,
      ) => {
        try {
          setLoading(
            !isLoadMore,
          );

          const response =
            await getFollowedAstrologers(
              pageNumber,
              10,
            );

          const astrologers =
            response?.astrologers || [];

          if (isLoadMore) {
            setData(prev => [
              ...prev,
              ...astrologers,
            ]);
          } else {
            setData(astrologers);
          }

          setPage(
            response?.page || 1,
          );

          setTotalPages(
            response?.totalPages || 1,
          );

          setHasMore(
            pageNumber <
              (response?.totalPages ||
                1),
          );
        } catch (error) {
          console.log(
            'FOLLOWED ASTROLOGERS HOOK ERROR:',
            error,
          );
        } finally {
          setLoading(false);

          setRefreshing(false);
        }
      };

    const loadMore =
      async () => {
        if (
          loading ||
          !hasMore
        ) {
          return;
        }

        await fetchAstrologers(
          page + 1,
          true,
        );
      };

    const refresh =
      async () => {
        setRefreshing(true);

        await fetchAstrologers(
          1,
          false,
        );
      };

    useEffect(() => {
      fetchAstrologers();
    }, []);

    return {
      data,

      loading,

      refreshing,

      page,

      totalPages,

      hasMore,

      loadMore,

      refresh,
    };
  };