import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  StatusBar,
  RefreshControl,
  TouchableOpacity,
  ListRenderItem,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../../theme';
import { Text } from '../../../../components/Text';
import { Icon } from '../../../../components/Icon';
import { LoginRequiredModal } from '../../../../components/Modal';
import { useAuthStore } from '../../../../stores';
import { BalanceCard, TransactionList, RechargeBottomSheet } from './components';
import { WalletScreenProps } from './walletType';
import type { WalletTransaction } from '../../../../types/global.types';
import { useWallet } from './hooks';
import { WALLET_LABELS } from '../../../../constants/app.constants';

const WalletScreen: React.FC<WalletScreenProps> = ({ 
  onNavigateBack,
  onNavigateToLogin,
  onNavigateToSignup
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  
  const { user, isAuthenticated } = useAuthStore();
  
  const {
    balance,
    transactions,
    isLoading,
    showLoginModal,
    modalMessage,
    showRechargeSheet,
    selectedAmount,
    handleRecharge,
    handleWithdraw,
    handleSelectAmount,
    handleProceedToPayment,
    handleCloseRechargeSheet,
    handleCloseLoginModal,
    handleLoginPress,
    handleSignupPress,
  } = useWallet({
    user,
    isAuthenticated,
    onNavigateToLogin,
    onRechargeSuccess: (amount) => {
      console.log('Recharge successful:', amount);
    },
    onWithdrawSuccess: (amount) => {
      console.log('Withdraw successful:', amount);
    },
  });

  // Active tab state - managed by hook
  const [activeTab, setLocalActiveTab] = React.useState<'all' | 'credit' | 'debit'>('all');
  
  // Handle tab change
  const handleTabChange = useCallback((tab: 'all' | 'credit' | 'debit') => {
    setLocalActiveTab(tab);
  }, []);

  // Refresh state
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  }, []);

  // Handle proceed to payment with proper parameters for RechargeBottomSheet
  const handlePayment = useCallback((amount: number, paymentMethod: string) => {
    handleProceedToPayment(amount, paymentMethod);
  }, [handleProceedToPayment]);

  // Render transaction list component
  const renderTransactionList = useCallback(() => (
    <TransactionList
      transactions={transactions}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      isLoading={isRefreshing}
      onRefresh={handleRefresh}
    />
  ), [transactions, activeTab, handleTabChange, isRefreshing, handleRefresh]);

  // Render item for FlatList
  const renderItem: ListRenderItem<WalletTransaction> = useCallback(() => (
 
    null as any
  ), []);

  const keyExtractor = useCallback((item: WalletTransaction) => item.id, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background.primary}
      />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background.primary, paddingTop: insets.top }]}>
        <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.icon.primary} library="MaterialIcons" />
        </TouchableOpacity>
        <Text variant="h6" weight="semibold" style={{ color: colors.text.primary }}>
          {WALLET_LABELS.PAYMENT_WALLET}
        </Text>
        <View style={styles.placeholder} />
      </View>
       <BalanceCard
        balance={balance}
        onRechargePress={handleRecharge}
        onWithdrawPress={handleWithdraw}
        isAuthenticated={isAuthenticated}
      />
     

      <FlatList
        data={[]}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderTransactionList}
        contentContainerStyle={[
          styles.listContent,
          { paddingHorizontal: 16, paddingBottom: insets.bottom + 100 }
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary.main}
          />
        }
        // Ensure the list can scroll properly
        nestedScrollEnabled={false}
      />

      <RechargeBottomSheet
        visible={showRechargeSheet}
        onClose={handleCloseRechargeSheet}
        onSelectAmount={handleSelectAmount}
        onProceedToPayment={handlePayment}
        currentBalance={balance}
      />

      {/* Login Required Modal */}
      <LoginRequiredModal
        visible={showLoginModal}
        onClose={handleCloseLoginModal}
        onLoginPress={handleLoginPress}
        onSignupPress={handleSignupPress}
        message={modalMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  placeholder: {
    width: 40,
  },
  listContent: {
    flexGrow: 1,
  },
});

export default WalletScreen;

