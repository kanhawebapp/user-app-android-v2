import {useState} from 'react';
import {createIntake} from './intake.api';
import {IntakeInput, CreateIntakeResponse} from './intake.types';

export const useCreateIntake = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CreateIntakeResponse | null>(null);
  const [error, setError] = useState<any>(null);

  const createNewIntake = async (input: IntakeInput) => {
    try {
      setLoading(true);
      setError(null);

      const res = await createIntake(input);

      setData(res);

      // 🔥 IMPORTANT: store in storage if needed
      // AsyncStorage.setItem('roomId', res.roomId);

      return res;
    } catch (err) {
      console.log('HOOK ERROR:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createNewIntake,
    loading,
    data,
    error,
  };
};
