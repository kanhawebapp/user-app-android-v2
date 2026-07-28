import {useState} from 'react';

import {sendGift} from './send-gift.api';

import {
  SendGiftInput,
  SendGiftResponse,
} from './send-gift.types';

export const useSendGift = () => {
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<any>(null);

  const submitGift = async (
    input: any,
  ): Promise<SendGiftResponse> => {
    try {
      setLoading(true);

      setError(null);

      const res =
        await sendGift(input);

      return res;
    } catch (err: any) {
      console.log(
        'SEND GIFT HOOK ERROR:',
        err,
      );

      setError(err);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitGift,

    loading,

    error,
  };
};