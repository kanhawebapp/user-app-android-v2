import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RazorpayCheckout from 'react-native-razorpay';

import { useTheme } from '../../../../theme';
import { Text } from '../../../../components/Text';
import { Button } from '../../../../components/Button';
import { Card } from '../../../../components/Card';
import { GoBack, Icon } from '../../../../components';
import { useToast } from '../../../../context/ToastContext';
import { useProfile } from '../../../../services/api/profile/profile.hooks';
import { useAuthStore } from '../../../../stores/auth.store';
import { RAZORPAY_KEY } from '../../../../constants/api.constants';

// Recharge APIs (existing)
import { useRechargeOrder } from '../../../../services/api/recharge/recharge.order.hooks';
import { openRazorpayCheckout } from '../../../../services/api/recharge/razorpay.service';
import { RechargePack } from '../../../../services/api/recharge/recharge.types';

// Healing / service booking APIs (existing)
import { ServiceAstrologer } from '../../../../services/api/healingServices/getServices/services.types';
import { useCreateServiceBooking } from '../../../../services/api/healingServices/serviceBooking/useServiceBooking';
import { CreateServiceBookingInput } from '../../../../services/api/healingServices/serviceBooking/serviceBooking.types';
import { useBookingAstrologer } from '../../../../services/api/healingServices/bookingAstrologer/useBookingAstrologer';
import { useCreateHealingOrder } from '../../../../services/api/healingServices/healingOrder/useHealingOrder';
import { getIPLocation } from '../../../../services/location/location.service';

// Coupon API (GetCoupons)
import { useCoupons } from '../../../../services/api/coupon/useCoupons';
import {
  Coupon,
  CouponPaymentFlow,
} from '../../../../services/api/coupon/coupon.types';
import {
  findCouponByCode,
  formatCurrency,
  getApplicableCoupons,
  getCouponDiscountLabel,
  meetsCouponMinOrder,
} from '../../../../services/api/coupon/coupon.utils';
import { CouponModal } from './components';

const GST_PERCENTAGE = 18;

/** Data handed over by `RechargePackScreen` when the user taps "Proceed to Pay". */
export interface RechargePaymentData {
  pack: RechargePack;
  amount: number;
  gstAmount: number;
  totalAmount: number;
}

/** Data handed over by `SelectAstrologerScreen` when the user taps "Continue to Payment". */
export interface ServicePaymentData {
  service: {
    id: string;
    name: string;
    price: number;
    slug?: string;
    category?: {
      name: string;
    };
  };
  astrologer: ServiceAstrologer & {
    serviceAstrologerMappingId: string;
    servicePrice: number;
  };
  amount: number;
  gstAmount: number;
  totalAmount: number;
}

export interface PaymentSuccessData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  amount?: number;
  packName?: string;
}

interface PaymentScreenProps {
  paymentType: 'recharge' | 'service';
  /** Payload for the wallet recharge flow. */
  recharge?: RechargePaymentData;
  /** Payload for the healing service booking flow. */
  servicePayment?: ServicePaymentData;
  onBack: () => void;
  /** Recharge flow: invoked after a successful Razorpay payment. */
  onPaymentSuccess?: (data: PaymentSuccessData) => void;
  /** Service flow: invoked after a successful Razorpay payment. */
  onComplete?: () => void;
}

/**
 * Shared payment screen for both checkout flows. The order/booking APIs and
 * the Razorpay gateway are only triggered from the final "Pay" button
 * below - never while navigating to this screen.
 */
const PaymentScreen: React.FC<PaymentScreenProps> = ({
  paymentType,
  recharge,
  servicePayment,
  onBack,
  onPaymentSuccess,
  onComplete,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  const { showSuccess, showError } = useToast();

  const { profile } = useProfile();
  const user = useAuthStore(state => state.user);

  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isCouponModalVisible, setIsCouponModalVisible] = useState(false);

  // Existing API hooks - reused as-is, only the trigger point moved here.
  const { createOrder: createRechargeOrder } = useRechargeOrder();
  const { submitBooking } = useCreateServiceBooking();
  const { assignAstrologer } = useBookingAstrologer();
  const { createOrder: createHealingOrder } = useCreateHealingOrder();

  // Coupon list is fetched from `GetCoupons` the first time the coupon sheet
  // is opened and reused for the rest of this screen's session.
  const {
    coupons,
    loading: couponsLoading,
    error: couponsError,
    hasFetched: hasFetchedCoupons,
    fetchCoupons,
  } = useCoupons();

  const isRecharge = paymentType === 'recharge';

  /** Only coupons the backend marks as valid for this flow reach the sheet. */
  const couponFlow: CouponPaymentFlow = isRecharge ? 'recharge' : 'service';

  const availableCoupons = getApplicableCoupons(coupons, couponFlow);

  // Header title is always "Payment"; the flow-specific heading lives in
  // the summary card ("Recharge Summary" / "Dhwani Services Payment").
  const headerTitle = 'Payment';
  const summaryTitle = isRecharge
    ? 'Recharge Summary'
    : 'Dhwani Services Payment';

  const packName = recharge?.pack?.name;
  const serviceName = servicePayment?.service?.name;
  const astrologerName =
    servicePayment?.astrologer?.displayName || servicePayment?.astrologer?.name;

  const amount = isRecharge ? recharge?.amount : servicePayment?.amount;
  const gstAmount = isRecharge
    ? recharge?.gstAmount
    : servicePayment?.gstAmount;
  const totalAmount = isRecharge
    ? recharge?.totalAmount
    : servicePayment?.totalAmount;

  /**
   * Opens the coupon sheet. `GetCoupons` is only requested the first time the
   * sheet is opened during this screen's session; afterwards the already
   * fetched coupons are reused. `useCoupons` blocks concurrent requests while
   * the query is in flight.
   */
  const handleOpenCouponList = () => {
    setIsCouponModalVisible(true);

    if (!hasFetchedCoupons) {
      fetchCoupons();
    }
  };

  const handleCloseCouponList = () => {
    setIsCouponModalVisible(false);
  };

  const handleRetryCoupons = () => {
    fetchCoupons({force: true});
  };

  /**
   * Validates a coupon against the order and, when it passes, marks it as the
   * selected one. No amount is recalculated here - the order mutation on the
   * backend stays the single source of truth for the payable amount.
   */
  const selectCoupon = (coupon: Coupon) => {
    if (!coupon?.code) {
      showError('Invalid or unavailable coupon code.');

      return;
    }

    if (!meetsCouponMinOrder(coupon, totalAmount ?? 0)) {
      const minOrder = formatCurrency(coupon?.minOrderAmount);

      showError(
        minOrder
          ? `This coupon requires a minimum order of ${minOrder}.`
          : 'This coupon does not meet the minimum order amount.',
      );

      return;
    }

    setSelectedCoupon(coupon);
    setCouponCode(coupon.code.trim());
    setCouponApplied(true);
    setIsCouponModalVisible(false);
  };

  /** Applies a coupon picked from the list. */
  const handleSelectCoupon = (coupon: Coupon) => {
    selectCoupon(coupon);
  };

  /**
   * Manual entry: trims and upper-cases the typed code, then resolves it
   * against the coupons returned by `GetCoupons`. Arbitrary codes are never
   * accepted.
   */
  const handleApplyCoupon = (enteredCode: string) => {
    const normalizedCode = (enteredCode || '').trim().toUpperCase();

    if (!normalizedCode) {
      showError('Please enter a coupon code.');

      return;
    }

    const matchedCoupon = findCouponByCode(
      coupons,
      normalizedCode,
      couponFlow,
    );

    if (!matchedCoupon) {
      showError('Invalid or unavailable coupon code.');

      return;
    }

    selectCoupon(matchedCoupon);
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setCouponCode('');
    setSelectedCoupon(null);
  };

  /**
   * Final payment trigger. Runs the existing order/booking APIs and opens
   * the Razorpay gateway exactly once per tap. `isProcessing` disables the
   * button so rapid taps cannot create duplicate orders/bookings.
   */
  const handlePayment = async () => {
    if (isProcessing) {
      return;
    }

    if (isRecharge) {
      const data = recharge;

      if (!data?.pack) {
        showError('Please select a recharge pack.');

        return;
      }

      setIsProcessing(true);

      try {
        // Step 1: Create Order (existing CreateOrder mutation)
        const order = await createRechargeOrder(data.pack.id);

        // Step 2: Open Razorpay (existing checkout helper)
        const paymentResult = await openRazorpayCheckout({
          order,
          user: profile,
          selectedPack: data.pack,
          amount: data.totalAmount,
        });

        onPaymentSuccess?.({
          ...paymentResult,
          amount: data.totalAmount,
          packName: data.pack?.name,
        });
      } catch (error: any) {
        console.log('PAYMENT FAILED', error);

        showError(
          error?.description ||
          error?.message ||
          'Unable to complete the payment. Please try again.',
        );
      } finally {
        setIsProcessing(false);
      }

      return;
    }

    // Service flow
    const service = servicePayment?.service;
    const astrologer = servicePayment?.astrologer;

    if (!service?.id || !astrologer) {
      showError('Unable to continue. Please select a service again.');

      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create the service booking (existing CreateServiceBooking mutation)
      const booking = await submitBooking({
        serviceId: service?.id ?? '',

        name: 'xxxx',

        email: 'xxxx',

        phone: '9999999999',

        dob: '999',

        tob: '9999',

        pob: '9999',

        gender: 'male',

        concern: 'male',
      } as CreateServiceBookingInput);

      const bookingId = booking?.id;

      if (!bookingId) {
        throw new Error('Booking was not created. Please try again.');
      }

      // Step 2: Persist the selected astrologer on the booking.
      await assignAstrologer({
        bookingId,
        astrologerId: astrologer.id,
      });

      // Step 3: Create the payment order (existing CreateHealingOrder mutation).
      // The order amount is the service price configured for this astrologer
      // plus GST; the coupon is only sent when the user applied one.
      const order = await createHealingOrder({
        bookingId,
        couponCode: couponApplied ? couponCode.trim() : '',
        amount: Number((totalAmount ?? 0).toFixed(2)),
      });

      // Get IP + City + State + Country
      const ipData = await getIPLocation();

      const options = {
        key: RAZORPAY_KEY.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Number(order?.payableAmount) * 100,
        currency: order?.currency || 'INR',
        name: 'Dhwani Astro LLP',
        description: service?.name
          ? `${service.name} Payment`
          : 'Healing Service Payment',
        order_id: order?.orderId,
        prefill: {
          name: user?.name || '',
          contact: user?.mobile || '',
          email: user?.email || '',
        },
        notes: {
          bookingId: order?.bookingId || bookingId,
          astrologerId: astrologer.id,
          serviceAstrologerMappingId: astrologer.serviceAstrologerMappingId,
          serviceId: service?.id,
          serviceName: service?.name,
          servicePrice: String(astrologer.servicePrice ?? service?.price ?? ''),
          serviceType: 'SERVICE',
          coins: String(astrologer.servicePrice ?? 0),

          // Location details
          ip: ipData.ip,
          city: ipData.city,
          state: ipData.state,
          country: ipData.country,
          platform: Platform.OS,
        },
        theme: {
          color: '#5B2CA5',
        },
      };

      try {
        await RazorpayCheckout.open(options);
        showSuccess('Payment successful! Your booking is confirmed.');
        onComplete?.();
      } catch (razorpayError: any) {
        if (razorpayError?.code === 'Payment Cancelled') {
          showError('Payment cancelled.');
          return;
        }

        showError(
          razorpayError?.description ||
          razorpayError?.message ||
          'Unable to complete the payment. Please try again.',
        );
      }
    } catch (error: any) {
      console.log('PAYMENT ERROR', error);

      showError(
        error?.message || 'Unable to start the payment. Please try again.',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  /** Label + value row used for the Amount / GST / Total Payable breakdown. */
  const renderSummaryRow = (label: string, value: string, isTotal = false) => (
    <View style={styles.summaryRow} key={label}>
      <Text
        variant={isTotal ? 'h6' : 'body'}
        weight={isTotal ? 'semibold' : 'medium'}
        style={{
          color: isTotal ? colors.text.primary : colors.text.secondary,
        }}>
        {label}
      </Text>
      <Text
        variant={isTotal ? 'h6' : 'body'}
        weight={isTotal ? 'bold' : 'semibold'}
        style={{
          color: isTotal ? colors.primary.main : colors.text.primary,
        }}>
        {value}
      </Text>
    </View>
  );

  /** Stacked label + value block used for the pack / service / astrologer. */
  const renderDetailBlock = (label: string, value: string) => (
    <View style={styles.detailBlock} key={label}>
      <Text
        variant="caption"
        weight="medium"
        style={[styles.detailLabel, { color: colors.text.tertiary }]}>
        {label}
      </Text>
      <Text
        variant="h6"
        weight="semibold"
        numberOfLines={1}
        style={[styles.detailValue, { color: colors.primary.main }]}>
        {value}
      </Text>
    </View>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <GoBack onBack={onBack} title={headerTitle} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 130 },
        ]}>
        {/* Payment Summary Card */}
        <Card variant="elevated" style={styles.summaryCard}>
          <Text
            variant="h6"
            weight="semibold"
            style={[styles.sectionTitle, { color: colors.text.primary }]}>
            {summaryTitle}
          </Text>

          {/* Selected pack / service / astrologer */}
          {isRecharge
            ? renderDetailBlock('Selected Pack', packName ?? '')
            : renderDetailBlock('Service', serviceName ?? '')}

          {!isRecharge && renderDetailBlock('Astrologer', astrologerName ?? '')}

          {/* Amount breakdown */}
          <View
            style={[styles.breakdown, { borderTopColor: colors.border.light }]}>
            {renderSummaryRow('Amount', `₹${(amount ?? 0).toFixed(2)}`)}

            {renderSummaryRow(
              `GST @${GST_PERCENTAGE}%`,
              `₹${(gstAmount ?? 0).toFixed(2)}`,
            )}

            <View
              style={[styles.divider, { backgroundColor: colors.border.light }]}
            />

            {renderSummaryRow(
              'Total Payable',
              `₹${(totalAmount ?? 0).toFixed(2)}`,
              true,
            )}
          </View>
        </Card>

        {/* Coupon Card */}
        <Card variant="outlined" style={styles.couponCard}>
          {couponApplied && selectedCoupon ? (
            <>
              <Text
                variant="label"
                weight="semibold"
                style={[styles.couponTitle, { color: colors.text.primary }]}>
                Coupon Applied
              </Text>

              <TouchableOpacity
                style={[
                  styles.appliedCoupon,
                  { backgroundColor: colors.success.background },
                ]}
                onPress={handleOpenCouponList}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Change applied coupon">
                <Icon
                  name="checkmark-circle"
                  library="Ionicons"
                  size={20}
                  color={colors.success.main}
                />

                <View style={styles.appliedCouponText}>
                  <Text
                    variant="body"
                    weight="semibold"
                    numberOfLines={1}
                    style={{ color: colors.success.dark }}>
                    {couponCode.trim()}
                  </Text>

                  <Text
                    variant="caption"
                    weight="medium"
                    numberOfLines={1}
                    style={{ color: colors.success.dark }}>
                    {getCouponDiscountLabel(selectedCoupon)}
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={styles.couponFooterRow}>
                <TouchableOpacity
                  onPress={handleOpenCouponList}
                  activeOpacity={0.7}
                  accessibilityRole="button">
                  <Text
                    variant="caption"
                    weight="semibold"
                    style={{ color: colors.primary.main }}>
                    Change
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleRemoveCoupon}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  testID="remove-coupon-button">
                  <Text
                    variant="caption"
                    weight="semibold"
                    style={{ color: colors.error.main }}>
                    Remove
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text
                variant="label"
                weight="semibold"
                style={[styles.couponTitle, { color: colors.text.primary }]}>
                Apply Coupon
              </Text>

              <TouchableOpacity
                style={[
                  styles.couponRow,
                  {
                    backgroundColor: colors.background.secondary,
                    borderColor: colors.border.light,
                  },
                ]}
                onPress={handleOpenCouponList}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Apply coupon"
                testID="apply-coupon-button">
                <Icon
                  name="ticket-outline"
                  library="Ionicons"
                  size={20}
                  color={colors.primary.main}
                />

                <Text
                  variant="body"
                  weight="medium"
                  style={[styles.couponRowText, { color: colors.text.secondary }]}>
                  Apply Coupon
                </Text>

                <Icon
                  name="chevron-forward"
                  library="Ionicons"
                  size={18}
                  color={colors.text.tertiary}
                />
              </TouchableOpacity>
            </>
          )}
        </Card>

        {/* Secure payment information (existing Razorpay gateway) */}
        <View style={styles.secureRow}>
          <Icon
            name="shield-checkmark"
            library="Ionicons"
            size={16}
            color={colors.success.main}
          />
          <Text
            variant="caption"
            weight="medium"
            style={{ color: colors.text.tertiary }}>
            Secure payment powered by Razorpay
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Payment CTA */}
      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + 16,
            backgroundColor: colors.background.primary,
          },
        ]}>
        <Button
          title={`Pay ₹${(totalAmount ?? 0).toFixed(2)}`}
          variant="primary"
          size="large"
          onPress={handlePayment}
          loading={isProcessing}
          disabled={isProcessing}
          leftIcon={
            <Icon
              name="lock-closed"
              library="Ionicons"
              size={18}
              color={colors.primary.contrastText}
            />
          }
          style={styles.payButton}
        />
      </View>

      {/* Coupon selection sheet - GetCoupons list + manual code entry */}
      <CouponModal
        visible={isCouponModalVisible}
        onClose={handleCloseCouponList}
        coupons={availableCoupons}
        loading={couponsLoading}
        hasError={!!couponsError}
        appliedCode={couponApplied ? couponCode : undefined}
        onSelectCoupon={handleSelectCoupon}
        onApplyManualCode={handleApplyCoupon}
        onRetry={handleRetryCoupons}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  summaryCard: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sectionTitle: {
    marginBottom: 18,
  },
  detailBlock: {
    marginBottom: 16,
    alignItems: 'center',
  },
  detailLabel: {
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 18,
  },
  breakdown: {
    borderTopWidth: 1,
    paddingTop: 14,
    marginTop: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 50, // increase/decrease this

  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  couponCard: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  couponTitle: {
    marginBottom: 12,
  },
  couponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 12,
    borderStyle: 'dashed',
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 44,
  },
  couponRowText: {
    flex: 1,
  },
  couponFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 20,
    marginTop: 12,
  },
  appliedCoupon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
  },
  appliedCouponText: {
    flex: 1,
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  payButton: {
    width: '100%',
    borderRadius: 16,
  },
});

export default PaymentScreen;
