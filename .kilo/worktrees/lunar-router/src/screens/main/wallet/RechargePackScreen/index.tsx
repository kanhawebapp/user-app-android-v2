/**
 * RechargePackScreen
 * Premium recharge screen with amount selection and payment options
 */

import React, {useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../../../theme';
import {Text} from '../../../../components/Text';
import {Icon} from '../../../../components/Icon';
import {Button} from '../../../../components/Button';
import {Card} from '../../../../components/Card';
import {useRechargePacks} from '../../../../services/api/recharge/recharge.hooks';
import {RechargePack} from '../../../../services/api/recharge/recharge.types';
import {RechargeAmountGrid} from './components';
import {BalanceCard} from '../WalletScreen';

interface RechargePackScreenProps {
  onNavigateBack?: () => void;
  currentBalance?: number;
  isAuthenticated?: boolean;
  onWithdrawPress?: () => void;
  onRechargePress?: () => void;
}

// Payment methods
const PAYMENT_METHODS = [
  {
    id: 'upi',
    name: 'UPI',
    subtext: 'PhonePe, Google Pay, etc.',
    description: 'Fast & Secure one-tap payment',
    icon: 'phone-android',
  },
  {
    id: 'card',
    name: 'Credit / Debit Card',
    subtext: 'Offer Applied!',
    description: 'All major cards accepted',
    icon: 'credit-card',
    isOffer: true,
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    subtext: '',
    description: 'Select from 50+ Indian banks',
    icon: 'account-balance',
  },
];

const RechargePackScreen: React.FC<RechargePackScreenProps> = ({
  onNavigateBack,
  currentBalance = 85,
  isAuthenticated = false,
  onWithdrawPress,
  onRechargePress,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  const [selectedPack, setSelectedPack] = useState<RechargePack | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>('upi');
  const [isCustomAmount, setIsCustomAmount] = useState<boolean>(false);

  const {data: rechargePacks, loading} = useRechargePacks();

  const handlePackSelect = useCallback((pack: RechargePack) => {
    setSelectedPack(pack);
    setIsCustomAmount(false);
    setCustomAmount('');
  }, []);

  const handleCustomAmountChange = useCallback((text: string) => {
    // Only allow numbers
    const numericValue = text.replace(/[^0-9]/g, '');
    setCustomAmount(numericValue);
    setIsCustomAmount(numericValue.length > 0);
    if (numericValue) {
      setSelectedPack(null);
    }
  }, []);

  const handlePaymentMethodSelect = useCallback((methodId: string) => {
    setSelectedPaymentMethod(methodId);
  }, []);

  const handleProceedToPay = useCallback(() => {
    const finalAmount = isCustomAmount
      ? parseInt(customAmount, 10)
      : selectedPack?.price || 0;
    console.log('Proceeding to payment:', {
      amount: finalAmount,
      paymentMethod: selectedPaymentMethod,
      pack: selectedPack,
    });
    // Add payment logic here
  }, [selectedPack, customAmount, isCustomAmount, selectedPaymentMethod]);

  const finalAmount = isCustomAmount
    ? parseInt(customAmount, 10) || 0
    : selectedPack?.price || 0;
  const gstAmount = Math.round(finalAmount * 0.18);
  const totalAmount = finalAmount + gstAmount;

  return (
    <View
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.background.primary,
            // paddingTop: insets.top + 8,
          },
        ]}>
        <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
          <Icon
            name="arrow-back"
            size={24}
            color={colors.icon.primary}
            library="MaterialIcons"
          />
        </TouchableOpacity>
        <Text
          variant="h6"
          weight="semibold"
          style={{color: colors.text.primary}}>
          Recharge Wallet
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {paddingBottom: insets.bottom + 100},
        ]}>
        {/* Current Balance Card - Premium Gradient */}
        <BalanceCard
          balance={currentBalance}
          onRechargePress={onRechargePress}
          onWithdrawPress={onWithdrawPress}
          isAuthenticated={isAuthenticated}
        />

        <View style={{marginHorizontal: 10}}>
          <RechargeAmountGrid
            packs={rechargePacks}
            selectedPack={selectedPack}
            onSelectPack={handlePackSelect}
          />
        </View>

        {/* Preferred Payment Method */}
        <Card style={styles.paymentCard}>
          <Text
            variant="body"
            weight="semibold"
            style={[styles.sectionTitle, {color: colors.text.primary}]}>
            Preferred Payment Method
          </Text>

          {PAYMENT_METHODS.map(method => {
            const isSelected = selectedPaymentMethod === method.id;
            return (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentOption,
                  {
                    borderColor: isSelected
                      ? colors.primary.main
                      : colors.border.light,
                    backgroundColor: isSelected
                      ? colors.primary.main + '10'
                      : 'transparent',
                  },
                ]}
                onPress={() => handlePaymentMethodSelect(method.id)}>
                <View
                  style={[
                    styles.paymentIcon,
                    {
                      backgroundColor: isSelected
                        ? colors.primary.main + '20'
                        : colors.background.secondary,
                    },
                  ]}>
                  <Icon
                    name={method.icon}
                    size={24}
                    color={
                      isSelected ? colors.primary.main : colors.icon.secondary
                    }
                    library="MaterialIcons"
                  />
                </View>
                <View style={styles.paymentInfo}>
                  <View style={styles.paymentNameRow}>
                    <Text
                      variant="body"
                      weight={isSelected ? 'semibold' : 'medium'}
                      style={{color: colors.text.primary}}>
                      {method.name}
                    </Text>
                    {method.isOffer && (
                      <View
                        style={[
                          styles.offerTag,
                          {backgroundColor: colors.success.main},
                        ]}>
                        <Text variant="captionSmall" style={{color: '#FFFFFF'}}>
                          Offer Applied!
                        </Text>
                      </View>
                    )}
                  </View>
                  {method.subtext ? (
                    <Text
                      variant="captionSmall"
                      style={{color: colors.success.main, marginTop: 2}}>
                      {method.subtext}
                    </Text>
                  ) : null}
                  <Text
                    variant="captionSmall"
                    style={{color: colors.text.tertiary, marginTop: 2}}>
                    {method.description}
                  </Text>
                </View>
                <View
                  style={[
                    styles.radioOuter,
                    {
                      borderColor: isSelected
                        ? colors.primary.main
                        : colors.border.light,
                    },
                  ]}>
                  {isSelected && (
                    <View
                      style={[
                        styles.radioInner,
                        {backgroundColor: colors.primary.main},
                      ]}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </Card>

        {/* Amount to Pay Summary */}
        <Card style={styles.summaryCard}>
          <Text
            variant="body"
            weight="semibold"
            style={[styles.sectionTitle, {color: colors.text.primary}]}>
            Amount to pay
          </Text>

          <View style={styles.summaryRow}>
            <Text variant="body" style={{color: colors.text.secondary}}>
              Recharge Amount
            </Text>
            <Text variant="body" style={{color: colors.text.primary}}>
              ₹{finalAmount}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text variant="body" style={{color: colors.text.secondary}}>
              GST (18%)
            </Text>
            <Text variant="body" style={{color: colors.text.primary}}>
              ₹{gstAmount}
            </Text>
          </View>
          <View
            style={[styles.divider, {backgroundColor: colors.border.light}]}
          />
          <View style={styles.summaryRow}>
            <Text
              variant="h6"
              weight="semibold"
              style={{color: colors.text.primary}}>
              Total
            </Text>
            <Text
              variant="h6"
              weight="bold"
              style={{color: colors.primary.main}}>
              ₹{totalAmount}
            </Text>
          </View>

          <Text
            variant="captionSmall"
            style={{
              color: colors.text.tertiary,
              marginTop: 8,
              textAlign: 'center',
            }}>
            Includes 18% GST
          </Text>
        </Card>
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
          style={styles.payButton}
          leftIcon={
            <Icon
              name="lock"
              size={20}
              color={colors.primary.contrastText}
              library="MaterialIcons"
            />
          }
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
    shadowOffset: {width: 0, height: 2},
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
