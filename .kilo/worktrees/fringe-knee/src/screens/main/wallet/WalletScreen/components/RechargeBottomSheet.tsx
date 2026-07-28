import React, {useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {useTheme} from '../../../../../theme';
import {Text} from '../../../../../components/Text';
import {Icon} from '../../../../../components/Icon';
import {Button} from '../../../../../components/Button';
import {BottomSheet} from '../../../../../components/BottomSheet';
import {
  RechargeBottomSheetProps,
  RECHARGE_AMOUNTS,
  PAYMENT_METHODS,
  MIN_RECHARGE_AMOUNT,
  MAX_RECHARGE_AMOUNT,
} from '../walletType';
import {WALLET_LABELS, DEFAULTS} from '../../../../../constants/app.constants';

export const RechargeBottomSheet: React.FC<RechargeBottomSheetProps> = ({
  visible,
  onClose,
  onSelectAmount,
  onProceedToPayment,
  currentBalance,
  minRechargeAmount = MIN_RECHARGE_AMOUNT,
  maxRechargeAmount = MAX_RECHARGE_AMOUNT,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  // Local state
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>('');
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);

  // Handle preset amount selection
  const handleAmountSelect = useCallback((amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  }, []);

  // Handle custom amount input
  const handleCustomAmountChange = useCallback((text: string) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, '');
    setCustomAmount(numericText);
    setSelectedAmount(parseInt(numericText, 10) || 0);
  }, []);

  // Handle payment method selection
  const handlePaymentMethodSelect = useCallback((methodId: string) => {
    setSelectedPaymentMethod(methodId);
    setShowPaymentMethods(false);
  }, []);

  // Get effective amount (selected or custom)
  const effectiveAmount = customAmount
    ? parseInt(customAmount, 10) || 0
    : selectedAmount;

  // Calculate bonus for selected amount
  const selectedOption = RECHARGE_AMOUNTS.find(
    opt => opt.value === effectiveAmount,
  );
  const bonusAmount = selectedOption?.bonus || 0;
  const totalValue = effectiveAmount + bonusAmount;

  // Validation
  const isValidAmount =
    effectiveAmount >= minRechargeAmount &&
    effectiveAmount <= maxRechargeAmount;
  const canProceed = isValidAmount && selectedPaymentMethod;

  // Handle proceed to payment
  const handleProceed = useCallback(() => {
    if (canProceed) {
      onProceedToPayment(effectiveAmount, selectedPaymentMethod);
    }
  }, [canProceed, effectiveAmount, selectedPaymentMethod, onProceedToPayment]);

  // Handle close
  const handleClose = useCallback(() => {
    setSelectedAmount(0);
    setCustomAmount('');
    setSelectedPaymentMethod('');
    setShowPaymentMethods(false);
    onClose();
  }, [onClose]);

  // Render amount options
  const renderAmountOptions = () => (
    <View style={styles.amountGrid}>
      {RECHARGE_AMOUNTS.map(option => {
        const isSelected = selectedAmount === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.amountOption,
              {
                backgroundColor: isSelected
                  ? colors.primary.main
                  : colors.background.secondary,
                borderColor: isSelected
                  ? colors.primary.main
                  : colors.border.light,
              },
            ]}
            onPress={() => handleAmountSelect(option.value)}>
            <Text
              variant="h6"
              weight="bold"
              style={{
                color: isSelected ? colors.common.white : colors.text.primary,
              }}>
              {option.label}
            </Text>
            {option.bonus ? (
              <View
                style={[
                  styles.bonusBadge,
                  {
                    backgroundColor: isSelected
                      ? colors.common.white + '30'
                      : colors.success.light + '30',
                  },
                ]}>
                <Text
                  variant="captionSmall"
                  weight="semibold"
                  style={{
                    color: isSelected
                      ? colors.common.white
                      : colors.success.main,
                  }}>
                  {WALLET_LABELS.BONUS(option.bonus)}
                </Text>
              </View>
            ) : option.isPopular ? (
              <View
                style={[
                  styles.popularBadge,
                  {
                    backgroundColor: isSelected
                      ? colors.common.white + '30'
                      : colors.primary.light + '30',
                  },
                ]}>
                <Text
                  variant="captionSmall"
                  weight="semibold"
                  style={{
                    color: isSelected
                      ? colors.common.white
                      : colors.primary.main,
                  }}>
                  {WALLET_LABELS.POPULAR}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  // Render custom amount input
  const renderCustomAmount = () => (
    <View style={styles.customAmountContainer}>
      <Text
        variant="body"
        weight="medium"
        style={{color: colors.text.primary, marginBottom: 8}}>
        {WALLET_LABELS.OR_ENTER_CUSTOM_AMOUNT}
      </Text>
      <View
        style={[
          styles.customAmountInput,
          {
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.main,
          },
        ]}>
        <Text
          variant="h5"
          weight="semibold"
          style={{color: colors.text.tertiary}}>
          {DEFAULTS.CURRENCY}
        </Text>
        <TextInput
          style={[styles.customAmountTextInput, {color: colors.text.primary}]}
          value={customAmount}
          onChangeText={handleCustomAmountChange}
          placeholder={WALLET_LABELS.ENTER_AMOUNT}
          placeholderTextColor={colors.text.tertiary}
          keyboardType="number-pad"
          maxLength={5}
        />
      </View>
      <Text
        variant="captionSmall"
        style={{color: colors.text.tertiary, marginTop: 4}}>
        {WALLET_LABELS.MIN_AMOUNT_LABEL}: {DEFAULTS.CURRENCY}
        {minRechargeAmount} - {WALLET_LABELS.MAX_AMOUNT_LABEL}:{' '}
        {DEFAULTS.CURRENCY}
        {maxRechargeAmount}
      </Text>
    </View>
  );

  // Render payment method selection
  const renderPaymentMethods = () => (
    <View style={styles.paymentMethodsContainer}>
      <Text
        variant="body"
        weight="medium"
        style={{color: colors.text.primary, marginBottom: 12}}>
        {WALLET_LABELS.PAYMENT_METHOD}
      </Text>
      <View style={styles.paymentMethodsGrid}>
        {PAYMENT_METHODS.map(method => {
          const isSelected = selectedPaymentMethod === method.id;
          return (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethodOption,
                {
                  backgroundColor: isSelected
                    ? colors.primary.main + '15'
                    : colors.background.secondary,
                  borderColor: isSelected
                    ? colors.primary.main
                    : colors.border.light,
                },
              ]}
              onPress={() => handlePaymentMethodSelect(method.id)}>
              <View
                style={[
                  styles.paymentIconContainer,
                  {
                    backgroundColor: isSelected
                      ? colors.primary.main + '20'
                      : colors.background.tertiary,
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
              <Text
                variant="bodySmall"
                weight="medium"
                style={{
                  color: isSelected ? colors.primary.main : colors.text.primary,
                  marginTop: 6,
                }}>
                {method.name}
              </Text>
              {isSelected && (
                <View
                  style={[
                    styles.checkmark,
                    {backgroundColor: colors.primary.main},
                  ]}>
                  <Icon
                    name="check"
                    size={12}
                    color={colors.common.white}
                    library="MaterialIcons"
                  />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  // Render summary
  const renderSummary = () => {
    if (!effectiveAmount || !canProceed) return null;

    return (
      <View
        style={[
          styles.summaryCard,
          {backgroundColor: colors.success.light + '15'},
        ]}>
        <View style={styles.summaryRow}>
          <Text variant="body" style={{color: colors.text.secondary}}>
            {WALLET_LABELS.RECHARGE_AMOUNT}
          </Text>
          <Text
            variant="body"
            weight="semibold"
            style={{color: colors.text.primary}}>
            {DEFAULTS.CURRENCY}
            {effectiveAmount}
          </Text>
        </View>
        {bonusAmount > 0 && (
          <View style={styles.summaryRow}>
            <Text variant="body" style={{color: colors.success.main}}>
              {WALLET_LABELS.BONUS_AMOUNT}
            </Text>
            <Text
              variant="body"
              weight="semibold"
              style={{color: colors.success.main}}>
              +{DEFAULTS.CURRENCY}
              {bonusAmount}
            </Text>
          </View>
        )}
        <View
          style={[styles.divider, {backgroundColor: colors.border.light}]}
        />
        <View style={styles.summaryRow}>
          <Text
            variant="h6"
            weight="semibold"
            style={{color: colors.text.primary}}>
            {WALLET_LABELS.TOTAL_VALUE}
          </Text>
          <Text variant="h6" weight="bold" style={{color: colors.success.main}}>
            {DEFAULTS.CURRENCY}
            {totalValue}
          </Text>
        </View>
        {bonusAmount > 0 && (
          <Text
            variant="captionSmall"
            style={{color: colors.success.main, marginTop: 8}}>
            {WALLET_LABELS.YOU_SAVE(bonusAmount)}
          </Text>
        )}
      </View>
    );
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      height="85%"
      title={WALLET_LABELS.RECHARGE_WALLET}
      showHandle>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Current Balance */}
        <View
          style={[
            styles.balanceInfo,
            {backgroundColor: colors.background.secondary},
          ]}>
          <Text variant="captionSmall" style={{color: colors.text.tertiary}}>
            {WALLET_LABELS.CURRENT_BALANCE}
          </Text>
          <Text variant="h6" weight="bold" style={{color: colors.text.primary}}>
            {DEFAULTS.CURRENCY}
            {currentBalance?.toFixed(2) || '0.00'}
          </Text>
        </View>

        {/* Select Amount Section */}
        <Text
          variant="body"
          weight="semibold"
          style={{color: colors.text.primary, marginBottom: 12, marginTop: 8}}>
          {WALLET_LABELS.SELECT_AMOUNT}
        </Text>
        {renderAmountOptions()}
        {renderCustomAmount()}

        {/* Payment Method Section */}
        <TouchableOpacity
          onPress={() => setShowPaymentMethods(!showPaymentMethods)}
          style={[
            styles.paymentSectionHeader,
            {borderBottomColor: colors.border.light},
          ]}>
          <Text
            variant="body"
            weight="semibold"
            style={{color: colors.text.primary}}>
            {WALLET_LABELS.PAYMENT_METHOD}
          </Text>
          <Icon
            name={showPaymentMethods ? 'expand-less' : 'expand-more'}
            size={24}
            color={colors.icon.secondary}
            library="MaterialIcons"
          />
        </TouchableOpacity>

        {showPaymentMethods && renderPaymentMethods()}

        {/* Selected Payment Method Display */}
        {!showPaymentMethods && selectedPaymentMethod && (
          <View
            style={[
              styles.selectedPaymentDisplay,
              {backgroundColor: colors.primary.main + '10'},
            ]}>
            <Icon
              name="check-circle"
              size={20}
              color={colors.primary.main}
              library="MaterialIcons"
            />
            <Text
              variant="body"
              style={{color: colors.primary.main, marginLeft: 8}}>
              {PAYMENT_METHODS.find(p => p.id === selectedPaymentMethod)?.name}{' '}
              {WALLET_LABELS.SELECTED_SUFFIX}
            </Text>
          </View>
        )}

        {/* Summary */}
        {renderSummary()}

        {/* Business Tip */}
        <View
          style={[
            styles.businessTip,
            {backgroundColor: colors.info.light + '15'},
          ]}>
          <Icon
            name="lightbulb-outline"
            size={18}
            color={colors.info.main}
            library="MaterialIcons"
          />
          <Text
            variant="captionSmall"
            style={{color: colors.info.main, marginLeft: 8, flex: 1}}>
            {WALLET_LABELS.BUSINESS_TIP}
          </Text>
        </View>
      </ScrollView>

      {/* Proceed Button */}
      <View style={styles.footer}>
        <Button
          title={
            canProceed
              ? WALLET_LABELS.PAY_BUTTON(effectiveAmount)
              : WALLET_LABELS.SELECT_AMOUNT_AND_PAYMENT
          }
          variant="primary"
          size="large"
          onPress={handleProceed}
          disabled={!canProceed}
          style={styles.proceedButton}
        />
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingHorizontal: 16,
  },
  balanceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  amountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  amountOption: {
    width: '31%',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
  },
  bonusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  popularBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  customAmountContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  customAmountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  customAmountTextInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8,
    padding: 0,
  },
  paymentSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  paymentMethodsContainer: {
    marginTop: 16,
  },
  paymentMethodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  paymentMethodOption: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    position: 'relative',
  },
  paymentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedPaymentDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  summaryCard: {
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  businessTip: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 16,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  proceedButton: {
    width: '100%',
  },
});

export default RechargeBottomSheet;
