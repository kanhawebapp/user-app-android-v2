import {useEffect} from 'react';
import {create} from 'zustand';
import {getUserWallet} from './wallet.api';
import {UserWallet} from './wallet.types';

/**
 * Shared wallet cache so all useWallet() consumers stay in sync
 * after mutations (gift send, recharge, etc.).
 */
interface WalletApiState {
  wallet: UserWallet | null;
  loading: boolean;
  fetchWallet: () => Promise<void>;
  applyBalanceCoins: (balanceCoins: number) => void;
}

const useWalletApiStore = create<WalletApiState>((set, get) => ({
  wallet: null,
  loading: false,

  fetchWallet: async () => {
    const hasWallet = get().wallet != null;
    try {
      // Avoid skeleton flash when refreshing an already-loaded balance
      if (!hasWallet) {
        set({loading: true});
      }
      const res = await getUserWallet();
      set({wallet: res});
    } catch (error) {
      console.log('WALLET HOOK ERROR:', error);
    } finally {
      if (!hasWallet) {
        set({loading: false});
      }
    }
  },

  applyBalanceCoins: (balanceCoins: number) => {
    const current = get().wallet;
    set({
      wallet: current
        ? {...current, balanceCoins}
        : {balanceCoins, lockedCoins: 0},
    });
  },
}));

/** Apply balance from a mutation response (e.g. sendGift.userBalance). */
export const applyWalletBalanceCoins = (balanceCoins: number) => {
  useWalletApiStore.getState().applyBalanceCoins(balanceCoins);
};

/** Re-fetch wallet from the API into the shared cache. */
export const refreshWalletBalance = () => {
  return useWalletApiStore.getState().fetchWallet();
};

export const useWallet = () => {
  const wallet = useWalletApiStore(state => state.wallet);
  const loading = useWalletApiStore(state => state.loading);
  const fetchWallet = useWalletApiStore(state => state.fetchWallet);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  return {
    wallet,
    loading,
    refresh: fetchWallet,
  };
};
