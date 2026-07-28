/**
 * Wallet Store - Zustand
 * Manages wallet balance, transactions, and payment operations
 */

import { create } from 'zustand';
import type { Wallet, WalletTransaction, PaymentOrder } from '../types/global.types';

interface WalletState {
  // State
  wallet: Wallet | null;
  transactions: WalletTransaction[];
  paymentOrders: PaymentOrder[];
  isLoading: boolean;
  isProcessingPayment: boolean;
  error: string | null;
  
  // Actions
  setWallet: (wallet: Wallet | null) => void;
  setTransactions: (transactions: WalletTransaction[]) => void;
  addTransaction: (transaction: WalletTransaction) => void;
  setPaymentOrders: (orders: PaymentOrder[]) => void;
  addPaymentOrder: (order: PaymentOrder) => void;
  updatePaymentOrder: (orderId: string, updates: Partial<PaymentOrder>) => void;
  
  setLoading: (loading: boolean) => void;
  setProcessingPayment: (processing: boolean) => void;
  setError: (error: string | null) => void;
  
  // Helpers
  getBalance: () => number;
  getTransactionsByType: (type: string) => WalletTransaction[];
  getRecentTransactions: (limit?: number) => WalletTransaction[];
  
  clearWallet: () => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  // Initial state
  wallet: null,
  transactions: [],
  paymentOrders: [],
  isLoading: false,
  isProcessingPayment: false,
  error: null,

  setWallet: (wallet) => set({ wallet }),

  setTransactions: (transactions) => set({ transactions }),

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
      wallet: state.wallet
        ? {
            ...state.wallet,
            balance:
              transaction.type === 'credit' || transaction.type === 'refund'
                ? state.wallet.balance + transaction.amount
                : state.wallet.balance - transaction.amount,
            lastUpdated: new Date().toISOString(),
          }
        : null,
    })),

  setPaymentOrders: (paymentOrders) => set({ paymentOrders }),

  addPaymentOrder: (order) =>
    set((state) => ({
      paymentOrders: [order, ...state.paymentOrders],
    })),

  updatePaymentOrder: (orderId, updates) =>
    set((state) => ({
      paymentOrders: state.paymentOrders.map((order) =>
        order.id === orderId ? { ...order, ...updates } : order
      ),
    })),

  setLoading: (isLoading) => set({ isLoading }),
  setProcessingPayment: (isProcessingPayment) => set({ isProcessingPayment }),
  setError: (error) => set({ error }),

  getBalance: () => get().wallet?.balance ?? 0,

  getTransactionsByType: (type) =>
    get().transactions.filter((t) => t.type === type),

  getRecentTransactions: (limit = 10) =>
    get().transactions.slice(0, limit),

  clearWallet: () =>
    set({
      wallet: null,
      transactions: [],
      paymentOrders: [],
      isLoading: false,
      isProcessingPayment: false,
      error: null,
    }),
}));

export default useWalletStore;

