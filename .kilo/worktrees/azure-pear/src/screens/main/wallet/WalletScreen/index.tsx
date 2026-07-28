import React, {useCallback, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  StatusBar,
  RefreshControl,
  TouchableOpacity,
  ListRenderItem,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../../../theme';
import {Text} from '../../../../components/Text';
import {Icon} from '../../../../components/Icon';
import {LoginRequiredModal} from '../../../../components/Modal';
import {useAuthStore} from '../../../../stores';
import {BalanceCard, TransactionList, RechargeBottomSheet} from './components';
import {WalletScreenProps} from './walletType';
import type {WalletTransaction} from '../../../../types/global.types';
import {useWallet} from './hooks';
import {WALLET_LABELS} from '../../../../constants/app.constants';
import RechargePackScreen from '../RechargePackScreen';
import PaymentSuccessScreen from '../PaymentSuccessScreen';
import {useProfile} from '../../../../services/api/profile/profile.hooks';
import { GoBack } from '../../../../components';

const WalletScreen: React.FC<WalletScreenProps> = ({
  onNavigateBack,
  onNavigateToLogin,
  onNavigateToSignup,
  onNavigateToRechargePack,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  const {user, isAuthenticated} = useAuthStore();

  const {profile} = useProfile();

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
    onRechargeSuccess: amount => {
      console.log('Recharge successful:', amount);
    },
    onWithdrawSuccess: amount => {
      console.log('Withdraw successful:', amount);
    },
  });

  // Active tab state - managed by hook
  const [activeTab, setLocalActiveTab] = React.useState<
    'all' | 'credit' | 'debit'
  >('all');

  // Handle tab change
  const handleTabChange = useCallback((tab: 'all' | 'credit' | 'debit') => {
    setLocalActiveTab(tab);
  }, []);

  // Refresh state
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [showRechargePack, setShowRechargePack] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState<any>(null);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  }, []);

  // Handle navigate to recharge pack screen
  const handleNavigateToRechargePack = useCallback(() => {
    setShowRechargePack(true);
  }, []);

  // Handle go back from recharge pack screen
  const handleRechargePackBack = useCallback(() => {
    setShowRechargePack(false);
  }, []);

  // Handle payment success from recharge pack screen
  const handlePaymentSuccess = useCallback((data: any) => {
    setShowRechargePack(false);
    setPaymentSuccessData(data);
  }, []);

  // Handle go back from payment success screen to wallet
  const handlePaymentSuccessToWallet = useCallback(() => {
    setPaymentSuccessData(null);
  }, []);

  // Handle go to home from payment success screen
  const handlePaymentSuccessToHome = useCallback(() => {
    setPaymentSuccessData(null);
    onNavigateBack?.();
  }, [onNavigateBack]);

  // Handle proceed to payment with proper parameters for RechargeBottomSheet
  const handlePayment = useCallback(
    (amount: number, paymentMethod: string) => {
      handleProceedToPayment(amount, paymentMethod);
    },
    [handleProceedToPayment],
  );

  // Render transaction list component
  const renderTransactionList = useCallback(
    () => (
      <TransactionList
        transactions={transactions}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isLoading={isRefreshing}
        onRefresh={handleRefresh}
        onRechargePress={handleNavigateToRechargePack}
        onWithdrawPress={handleWithdraw}
        isAuthenticated={isAuthenticated}
        balance={balance}
      />
    ),
    [transactions, activeTab, handleTabChange, isRefreshing, handleRefresh],
  );

  // Render item for FlatList
  const renderItem: ListRenderItem<WalletTransaction> = useCallback(
    () => null as any,
    [],
  );

  const keyExtractor = useCallback((item: WalletTransaction) => item.id, []);

  // If showing payment success screen, render it instead
  if (paymentSuccessData) {
    return (
      <PaymentSuccessScreen
        paymentData={paymentSuccessData}
        onGoToWallet={handlePaymentSuccessToWallet}
        onGoToHome={handlePaymentSuccessToHome}
      />
    );
  }

  // If showing recharge pack screen, render it instead
  if (showRechargePack) {
    return (
      <RechargePackScreen
        onNavigateBack={handleRechargePackBack}
        currentBalance={balance}
        onPaymentSuccess={handlePaymentSuccess}
      />
    );
  }

  return (
    <View
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background.primary}
      />

      {/* Header */}
      {/* <View
        style={[
          styles.header,
          {backgroundColor: colors.background.primary, paddingTop: insets.top},
        ]}>
        <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
          <Icon
            name="arrow-back"
            size={24}
            color={colors.icon.primary}
            library="MaterialIcons"
          />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text
            variant="h6"
            weight="semibold"
            style={{color: colors.text.primary}}>
            {WALLET_LABELS.PAYMENT_WALLET}
          </Text>
        </View>
        <View style={styles.placeholder} />
      </View> */}
      <GoBack onBack={onNavigateBack} title={WALLET_LABELS.PAYMENT_WALLET}  />

      <BalanceCard
        balance={balance}
        // onRechargePress={handleNavigateToRechargePack}
        // onRechargePress={onNavigateToRechargePack ? onNavigateToRechargePack : handleNavigateToRechargePack}
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
          {paddingHorizontal: 16, paddingBottom: insets.bottom + 100},
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
    // paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    alignItems: 'center',
  },
  placeholder: {
    width: 40,
  },
  listContent: {
    flexGrow: 1,
  },
});

export default WalletScreen;
