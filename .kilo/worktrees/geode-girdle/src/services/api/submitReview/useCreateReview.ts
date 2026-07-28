import {useState} from 'react';

import {createReview} from './review.api';

import {CreateReviewData, CreateReviewInput} from './review.types';

export const useCreateReview = () => {
  const [data, setData] = useState<CreateReviewData | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<any>(null);

  const submitReview = async (input: CreateReviewInput) => {
    try {
      setLoading(true);

      setError(null);

      const res = await createReview(input);

      setData(res || null);

      return res;
    } catch (err: any) {
      console.log('CREATE REVIEW HOOK ERROR:', err);

      setError(err);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,

    loading,

    error,

    submitReview,
  };
};
