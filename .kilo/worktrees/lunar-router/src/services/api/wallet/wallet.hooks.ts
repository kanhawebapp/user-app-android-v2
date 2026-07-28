import {useEffect, useState} from 'react';
import {getUserWallet} from './wallet.api';
import {UserWallet} from './wallet.types';

export const useWallet = () => {
  const [wallet, setWallet] = useState<UserWallet | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchWallet = async () => {
    try {
      setLoading(true);

      const res = await getUserWallet();

      setWallet(res);
    } catch (error) {
      console.log('WALLET HOOK ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  return {
    wallet,
    loading,
    refresh: fetchWallet,
  };
};
