// ==========================================
// recentIntakes.hook.ts
// ==========================================

import {useEffect, useState} from 'react';
import {getRecentIntakes} from './recentIntakes.api';
import { Intake } from './recentIntakes.types';

export const useRecentIntakes = () => {
  const [intakes, setIntakes] = useState<Intake[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecentIntakes = async () => {
    try {
      setLoading(true);

      const res = await getRecentIntakes();

      setIntakes(res.data || []);
    } catch (error) {
      console.log('RECENT INTAKES FETCH ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentIntakes();
  }, []);

  return {
    intakes,
    loading,
    refresh: fetchRecentIntakes,
  };
};