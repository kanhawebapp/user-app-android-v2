import {useState} from 'react';

import {
  followAstrologer,
  unfollowAstrologer,
  getFollowStatus,
} from './follow-astrologer.api';

export const useFollowAstrologer = () => {
  const [isFollowing, setIsFollowing] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const follow = async (
    astrologerId: string,
  ) => {
    try {
      setLoading(true);

      const res =
        await followAstrologer(
          astrologerId,
        );

      if (res?.success) {
        setIsFollowing(true);
      }

      return res;
    } catch (error) {
      console.log(
        'FOLLOW HOOK ERROR:',
        error,
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const unfollow = async (
    astrologerId: string,
  ) => {
    try {
      setLoading(true);

      const res =
        await unfollowAstrologer(
          astrologerId,
        );

      if (res?.success) {
        setIsFollowing(false);
      }

      return res;
    } catch (error) {
      console.log(
        'UNFOLLOW HOOK ERROR:',
        error,
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const checkFollowStatus =
    async (astrologerId: string) => {
      try {
        const status =
          await getFollowStatus(
            astrologerId,
          );

        setIsFollowing(status);

        return status;
      } catch (error) {
        console.log(
          'FOLLOW STATUS HOOK ERROR:',
          error,
        );
      }
    };

  return {
    isFollowing,
    loading,
    follow,
    unfollow,
    checkFollowStatus,
  };
};