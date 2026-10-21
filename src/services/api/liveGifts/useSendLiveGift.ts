import {useCallback, useState} from 'react';
import {sendLiveGift} from './live-gifts.api';
import {SendLiveGiftResult, SendLiveGiftVariables} from './live-gifts.types';

export const useSendLiveGift = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitLiveGift = useCallback(
    async (variables: SendLiveGiftVariables): Promise<SendLiveGiftResult> => {
      try {
        setLoading(true);
        setError(null);
        const result = await sendLiveGift(variables);
        return result;
      } catch (err: any) {
        const message =
          err?.message || 'Failed to send gift. Please try again.';
        setError(message);
        console.log('SEND LIVE GIFT HOOK ERROR:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    submitLiveGift,
    loading,
    error,
  };
};
