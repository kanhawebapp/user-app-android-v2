import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../../theme';
import { Icon } from '../../../../components/Icon';
import { Button } from '../../../../components/Button';
import { useRechargePacks } from '../../../../services/api/recharge/recharge.hooks';
import { RechargePack } from '../../../../services/api/recharge/recharge.types';
import { RechargeAmountGrid } from './components';
import { BalanceCard } from '../WalletScreen';
import { GoBack } from '../../../../components';
import type { RechargePaymentData } from '../PaymentScreen';

interface PaymentSuccessData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  amount?: number;
  packName?: string;
}

interface RechargePackScreenProps {
  onNavigateBack?: () => void;
  currentBalance?: number;
  isAuthenticated?: boolean;
  onWithdrawPress?: () => void;
  onRechargePress?: () => void;
  onPaymentSuccess?: (data: PaymentSuccessData) => void;
  /** Hands the selected pack + calculated amounts to the Payment Screen. */
  onProceedToPayment?: (data: RechargePaymentData) => void;
}

const RechargePackScreen: React.FC<RechargePackScreenProps> = ({
  onNavigateBack,
  currentBalance,
  isAuthenticated = false,
  onWithdrawPress,
  onRechargePress,
  onPaymentSuccess,
  onProceedToPayment,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  const [selectedPack, setSelectedPack] = useState<RechargePack | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');

  const [isCustomAmount, setIsCustomAmount] = useState<boolean>(false);
  const { data: rechargePacks, loading } = useRechargePacks();

  const handlePackSelect = useCallback((pack: RechargePack) => {
    setSelectedPack(pack);
    setIsCustomAmount(false);
    setCustomAmount('');
  }, []);

  const finalAmount = isCustomAmount
    ? parseInt(customAmount, 10) || 0
    : selectedPack?.price || 0;

  const gstAmount = finalAmount * 0.18;
  const totalAmount = finalAmount + gstAmount;

  // "Proceed to Pay" only validates the selection and hands the
  // required data to the Payment Screen. The CreateOrder API and
  // the Razorpay gateway are triggered from the Payment Screen's
  // final "Payment" button.
  const handleProceedToPay = useCallback(() => {
    if (!selectedPack) {
      console.log('No pack selected');
      return;
    }

    onProceedToPayment?.({
      pack: selectedPack,
      amount: finalAmount,
      gstAmount,
      totalAmount,
    });
  }, [selectedPack, finalAmount, gstAmount, totalAmount, onProceedToPayment]);
  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Header */}

      <GoBack onBack={onNavigateBack} title='Recharge Wallet' />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}>
        {/* Current Balance Card - Premium Gradient */}
        <BalanceCard
          onRechargePress={onRechargePress}
          onWithdrawPress={onWithdrawPress}
          isAuthenticated={isAuthenticated}
        />

        <View style={{ marginHorizontal: 10 }}>
          <RechargeAmountGrid
            packs={rechargePacks}
            selectedPack={selectedPack}
            onSelectPack={handlePackSelect}
          />
        </View>

        {/* Amount to Pay Summary */}

      </ScrollView>

      {/* Proceed to Pay Button */}
      <View
        style={[
          styles.buttonContainer,
          {
            paddingBottom: insets.bottom + 16,
            backgroundColor: colors.background.primary,
          },
        ]}>
        <Button
          title={`Proceed to Pay ₹${totalAmount}`}
          variant="primary"
          size="large"
          onPress={handleProceedToPay}
          disabled={!selectedPack}
          style={styles.payButton}
        // leftIcon={
        //   <Icon
        //     name="lock"
        //     size={20}
        //     color={colors.primary.contrastText}
        //     library="MaterialIcons"
        //   />
        // }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingHorizontal: 16,
    // paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    // paddingHorizontal: 16,
    // paddingTop: 16,
  },
  balanceGradientCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  balanceContent: {
    flex: 1,
  },
  walletIconWrapper: {
    opacity: 0.5,
  },
  amountCard: {
    // marginBottom: 16,
    // padding: 16,
    marginTop: 20,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  sectionTitle: {
    marginBottom: 16,
  },
  customAmountSection: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 16,
  },
  customAmountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  paymentCard: {
    marginBottom: 16,
    padding: 16,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  paymentNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  offerTag: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  summaryCard: {
    marginBottom: 16,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  payButton: {
    width: '100%',
  },
});

export default RechargePackScreen;
