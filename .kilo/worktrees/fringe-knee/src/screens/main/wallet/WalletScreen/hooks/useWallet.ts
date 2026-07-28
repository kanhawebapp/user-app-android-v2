/**
 * useWallet Hook
 * Business logic for wallet operations
 */

import { useState, useCallback, useEffect } from 'react';
import { useWalletStore } from '../../../../../stores/wallet.store';
import type { 
  UseWalletProps, 
  UseWalletReturn, 
  WalletTransaction
} from '../walletType';
// Import PaymentMethod from global types (the correct one)
import type { PaymentMethod as GlobalPaymentMethod } from '../../../../../types/global.types';
import { WALLET_LABELS, CHAT_CALL_LABELS } from '../../../../../constants/app.constants';

export const useWallet = ({
  user,
  isAuthenticated,
  onNavigateToLogin,
  onRechargeSuccess,
  onWithdrawSuccess,
}: UseWalletProps): UseWalletReturn => {
  // Modal states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalMessage, setModalMessage] = useState<any>(CHAT_CALL_LABELS.LOGIN_REQUIRED_MESSAGE);
  const [showRechargeSheet, setShowRechargeSheet] = useState(false);
  
  // Recharge states
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  
  // Get wallet store state
  const { 
    wallet, 
    transactions: storeTransactions, 
    isLoading: storeIsLoading, 
    isProcessingPayment, 
    error,
    addTransaction,
    setTransactions
  } = useWalletStore();

  // Loading state - only use store loading, don't derive from transaction count
  // This prevents false loading states that can cause UI issues
  const isLoading = storeIsLoading;

  // Default mock transactions for demo
  const DEFAULT_MOCK_TRANSACTIONS: WalletTransaction[] = [
    {
      id: '1',
      walletId: 'wallet_1',
      type: 'credit',
      amount: 500,
      currency: 'INR',
      status: 'completed',
      description: WALLET_LABELS.WALLET_RECHARGE,
      createdAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      walletId: 'wallet_1',
      type: 'debit',
      amount: 150,
      currency: 'INR',
      status: 'completed',
      description: 'Chat Session with Astrologer',
      createdAt: '2024-01-14T14:20:00Z',
    },
    {
      id: '3',
      walletId: 'wallet_1',
      type: 'credit',
      amount: 200,
      currency: 'INR',
      status: 'completed',
      description: 'Refund - Cancelled Call',
      createdAt: '2024-01-13T09:15:00Z',
    },
    {
      id: '4',
      walletId: 'wallet_1',
      type: 'debit',
      amount: 300,
      currency: 'INR',
      status: 'completed',
      description: 'Call Session',
      createdAt: '2024-01-12T16:45:00Z',
    },
    {
      id: '5',
      walletId: 'wallet_1',
      type: 'credit',
      amount: 1000,
      currency: 'INR',
      status: 'completed',
      description: WALLET_LABELS.WALLET_RECHARGE,
      createdAt: '2024-01-11T11:00:00Z',
    },
  ];

  // Initialize with mock transactions if store is empty
  useEffect(() => {
    if (storeTransactions.length === 0) {
      setTransactions(DEFAULT_MOCK_TRANSACTIONS);
    }
  }, [storeTransactions.length, setTransactions]);

  // Check if user can perform action
  const handleRestrictedAction = useCallback(
    (actionMessage: string, callback?: () => void) => {
      if (isAuthenticated) {
        callback?.();
        return;
      }
      setModalMessage(actionMessage);
      setShowLoginModal(true);
    },
    [isAuthenticated]
  );

  // Handle recharge button press
  const handleRecharge = useCallback(() => {
    if (!isAuthenticated) {
      setModalMessage(CHAT_CALL_LABELS.LOGIN_REQUIRED_MESSAGE);
      setShowLoginModal(true);
      return;
    }
    setShowRechargeSheet(true);
  }, [isAuthenticated]);

  // Handle withdraw button press
  const handleWithdraw = useCallback(() => {
    handleRestrictedAction(CHAT_CALL_LABELS.LOGIN_REQUIRED_MESSAGE);
  }, [handleRestrictedAction]);

  // Handle amount selection from preset buttons
  const handleSelectAmount = useCallback((amount: number) => {
    setSelectedAmount(amount);
  }, []);

  // Handle custom amount input
  const handleCustomAmountChange = useCallback((amount: string) => {
    const numericAmount = parseInt(amount, 10) || 0;
    setSelectedAmount(numericAmount);
  }, []);

  // Handle proceed to payment - accepts parameters from RechargeBottomSheet
  const handleProceedToPayment = useCallback((amount: number, paymentMethod: string) => {
    if (amount > 0 && paymentMethod) {
      // In a real app, this would initiate payment gateway
      console.log('Processing payment:', {
        amount,
        method: paymentMethod
      });
      
      // Map payment method string to Global PaymentMethod object
      const paymentMethodMap: Record<string, GlobalPaymentMethod> = {
        upi: { type: 'upi' },
        card: { type: 'card' },
        netbanking: { type: 'net_banking' },
        wallet: { type: 'wallet' },
      };
      
      // Simulate successful payment
      const newTransaction: WalletTransaction = {
        id: `txn_${Date.now()}`,
        walletId: user?.id || 'wallet_1',
        amount,
        currency: 'INR',
        type: 'credit',
        description: WALLET_LABELS.WALLET_RECHARGE,
        status: 'completed',
        paymentMethod: paymentMethodMap[paymentMethod] || { type: 'wallet' },
        createdAt: new Date().toISOString(),
      };
      
      addTransaction(newTransaction);
      onRechargeSuccess?.(amount);
      setShowRechargeSheet(false);
      setSelectedAmount(0);
      setSelectedPaymentMethod('');
    }
  }, [user, addTransaction, onRechargeSuccess]);

  // Close recharge bottom sheet
  const handleCloseRechargeSheet = useCallback(() => {
    setShowRechargeSheet(false);
    setSelectedAmount(0);
    setSelectedPaymentMethod('');
  }, []);

  // Close login modal
  const handleCloseLoginModal = useCallback(() => {
    setShowLoginModal(false);
  }, []);

  // Handle login button in modal
  const handleLoginPress = useCallback(() => {
    setShowLoginModal(false);
    onNavigateToLogin?.();
  }, [onNavigateToLogin]);

  // Handle signup button in modal
  const handleSignupPress = useCallback(() => {
    setShowLoginModal(false);
    // Assuming signup navigation is similar to login
    onNavigateToLogin?.();
  }, [onNavigateToLogin]);

  // Clear error
  const clearError = useCallback(() => {
    // Clear wallet store error if needed
  }, []);

  // Get transactions - use store or default mock
  const transactions = storeTransactions.length > 0 ? storeTransactions : DEFAULT_MOCK_TRANSACTIONS;

  // Get balance from wallet store or user
  const balance = wallet?.balance ?? user?.walletBalance ?? 2500.00;

  return {
    // State
    balance,
    transactions,
    isLoading,
    isProcessingPayment,
    error,
    
    // Modal State
    showLoginModal,
    modalMessage,
    showRechargeSheet,
    selectedAmount,
    selectedPaymentMethod,
    
    // Actions
    handleRecharge,
    handleWithdraw,
    handleSelectAmount,
    handleCustomAmountChange,
    handleProceedToPayment,
    handleCloseRechargeSheet,
    handleCloseLoginModal,
    handleLoginPress,
    handleSignupPress,
    clearError,
  };
};

export default useWallet;

