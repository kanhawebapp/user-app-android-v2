import {useEffect, useState} from 'react';
import {getRechargePacks} from './recharge.api';
import {RechargePack} from './recharge.types';

export const useRechargePacks = () => {
  const [data, setData] = useState<RechargePack[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRechargePacks = async () => {
    try {
      setLoading(true);

      const res = await getRechargePacks();

      setData(res.data);
    } catch (error) {
      console.log('RECHARGE HOOK ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRechargePacks();
  }, []);

  return {
    data,
    loading,
    refresh: fetchRechargePacks,
  };
};
