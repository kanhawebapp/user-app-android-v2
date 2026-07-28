/**
 * WalletScreen Types
 * Type definitions for WalletScreen components
 */

import type {User, WalletTransaction} from '../../../../types/global.types';
import {WALLET_LABELS, DEFAULTS} from '../../../../constants/app.constants';

// Re-export WalletTransaction for convenience
export type {WalletTransaction} from '../../../../types/global.types';

// ============================================
// Component Props Types
// ============================================

export interface WalletScreenProps {
  onNavigateBack?: () => void;
  onNavigateToLogin?: () => void;
  onNavigateToSignup?: () => void;
  onNavigateToRechargePack?: () => void;
}

// ============================================
// Recharge Bottom Sheet Types
// ============================================

export interface RechargeBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelectAmount: (amount: number) => void;
  onProceedToPayment: (amount: number, paymentMethod: string) => void;
  currentBalance: number;
  minRechargeAmount?: number;
  maxRechargeAmount?: number;
}

export interface AmountOption {
  value: number;
  label: string;
  bonus?: number;
  isPopular?: boolean;
}

// ============================================
// Balance Card Types
// ============================================

export interface BalanceCardProps {
  // balance: number;
  onRechargePress?: () => void;
  onWithdrawPress?: () => void;
  isAuthenticated: boolean;
}

// ============================================
// Transaction List Types
// ============================================

export interface TransactionListProps {
  transactions: WalletTransaction[];
  activeTab: 'all' | 'credit' | 'debit';
  onTabChange: (tab: 'all' | 'credit' | 'debit') => void;
  isLoading?: boolean;
  onRefresh?: () => void;
  onRechargePress?: () => void;
  onWithdrawPress?: () => void;
  isAuthenticated?: boolean;
  balance?: number;
}

// ============================================
// UseWallet Hook Types
// ============================================

export interface UseWalletProps {
  user: User | null;
  isAuthenticated: boolean;
  onNavigateToLogin?: () => void;
  onRechargeSuccess?: (amount: number) => void;
  onWithdrawSuccess?: (amount: number) => void;
}

export interface UseWalletReturn {
  // State
  balance: number;
  transactions: WalletTransaction[];
  isLoading: boolean;
  isProcessingPayment: boolean;
  error: string | null;

  // Modal State
  showLoginModal: boolean;
  modalMessage: string;
  showRechargeSheet: boolean;
  selectedAmount: number;
  selectedPaymentMethod: string;

  // Actions
  handleRecharge: () => void;
  handleWithdraw: () => void;
  handleSelectAmount: (amount: number) => void;
  handleCustomAmountChange: (amount: string) => void;
  handleProceedToPayment: (amount: number, paymentMethod: string) => void;
  handleCloseRechargeSheet: () => void;
  handleCloseLoginModal: () => void;
  handleLoginPress: () => void;
  handleSignupPress: () => void;
  clearError: () => void;
}

// ============================================
// Payment Method Types
// ============================================

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  type: 'upi' | 'card' | 'netbanking' | 'wallet';
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'upi',
    name: WALLET_LABELS.PAYMENT_UPI,
    icon: 'phone-android',
    type: 'upi',
  },
  {
    id: 'card',
    name: WALLET_LABELS.PAYMENT_DEBIT_CARD,
    icon: 'credit-card',
    type: 'card',
  },
  {
    id: 'netbanking',
    name: WALLET_LABELS.PAYMENT_NET_BANKING,
    icon: 'bank',
    type: 'netbanking',
  },
  {
    id: 'wallet',
    name: WALLET_LABELS.PAYMENT_WALLET,
    icon: 'wallet',
    type: 'wallet',
  },
];

// ============================================
// Recharge Amount Options
// ============================================

export const RECHARGE_AMOUNTS: AmountOption[] = [
  {value: 50, label: `${DEFAULTS.CURRENCY}50`, bonus: 0},
  {value: 100, label: `${DEFAULTS.CURRENCY}100`, bonus: 0},
  {value: 200, label: `${DEFAULTS.CURRENCY}200`, bonus: 10, isPopular: true},
  {value: 500, label: `${DEFAULTS.CURRENCY}500`, bonus: 35},
  {value: 1000, label: `${DEFAULTS.CURRENCY}1000`, bonus: 75},
  {value: 2000, label: `${DEFAULTS.CURRENCY}2000`, bonus: 200},
];

export const MIN_RECHARGE_AMOUNT = WALLET_LABELS.MIN_RECHARGE;
export const MAX_RECHARGE_AMOUNT = WALLET_LABELS.MAX_RECHARGE;
