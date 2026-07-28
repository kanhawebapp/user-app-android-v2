import {useState} from 'react';

import {getAstrologerFollowersCount} from './followers-count.api';

export const useFollowersCount = () => {
  const [followersCount, setFollowersCount] =
    useState<number>(0);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<any>(null);

  const fetchFollowersCount =
    async (astrologerId: string) => {
      try {
        setLoading(true);

        setError(null);

        const res =
          await getAstrologerFollowersCount(
            astrologerId,
          );

        setFollowersCount(
          res?.totalFollowers || 0,
        );

        return res;
      } catch (err: any) {
        console.log(
          'FOLLOWERS COUNT HOOK ERROR:',
          err,
        );

        setError(err);
      } finally {
        setLoading(false);
      }
    };

  return {
    followersCount,
    loading,
    error,
    fetchFollowersCount,
  };
};