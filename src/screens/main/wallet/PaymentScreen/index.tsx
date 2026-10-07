import React, {useEffect, useRef, useState} from 'react';
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

// Healing / service APIs (existing)
import { ServiceAstrologer } from '../../../../services/api/healingServices/getServices/services.types';
import { useCreateHealingOrder } from '../../../../services/api/healingServices/healingOrder/useHealingOrder';
import { getIPLocation } from '../../../../services/location/location.service';

// Coupon API (GetCoupons + VerifyRechargeCoupon / VerifyServiceCoupon)
import { useCoupons } from '../../../../services/api/coupon/useCoupons';
import {useVerifyRechargeCoupon} from '../../../../services/api/coupon/useVerifyRechargeCoupon';
import {verifyServiceCoupon} from '../../../../services/api/coupon/coupon.api';
import {
  Coupon,
  CouponPaymentFlow,
  VerifyRechargeCouponResult,
  VerifyServiceCouponResult,
} from '../../../../services/api/coupon/coupon.types';
import {
  findCouponByCode,
  getApplicableCoupons,
  getCouponDiscountLabel,
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
  /**
   * Id of the booking created on `ServiceDetailsScreen`'s "Confirm
   * Booking". Required for the service flow: coupon verification and the
   * payment order reference it.
   */
  serviceBookingId?: string | null;
  onBack: () => void;
  /** Recharge flow: invoked after a successful Razorpay payment. */
  onPaymentSuccess?: (data: PaymentSuccessData) => void;
  /** Service flow: invoked after a successful Razorpay payment. */
  onComplete?: () => void;
}

/**
 * Shared payment screen for both checkout flows. The order APIs and the
 * Razorpay gateway are only triggered from the final "Pay" button below -
 * never while navigating to this screen. The service booking itself is
 * created earlier, on `ServiceDetailsScreen`'s "Confirm Booking".
 */
const PaymentScreen: React.FC<PaymentScreenProps> = ({
  paymentType,
  recharge,
  servicePayment,
  serviceBookingId,
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

  /**
   * Pricing returned by the last successful `VerifyRechargeCoupon` call.
   * Only ever set for the recharge flow - while it is present the summary
   * shows the backend's numbers instead of the pack's base pricing.
   */
  const [verifiedRechargePricing, setVerifiedRechargePricing] =
    useState<VerifyRechargeCouponResult | null>(null);

  /**
   * Pricing returned by the last successful `VerifyServiceCoupon` call, run
   * on "Apply" with the booking id created on `ServiceDetailsScreen`. Once
   * set the summary shows the backend's numbers instead of the screen's base
   * pricing.
   */
  const [verifiedServicePricing, setVerifiedServicePricing] =
    useState<VerifyServiceCouponResult | null>(null);
  const [isVerifyingServiceCoupon, setIsVerifyingServiceCoupon] =
    useState(false);
  const isServiceCouponInFlightRef = useRef(false);

  // Existing API hooks - reused as-is, only the trigger point moved here.
  const { createOrder: createRechargeOrder } = useRechargeOrder();
  const {createOrder: createHealingOrder} = useCreateHealingOrder();
  const {loading: isVerifyingCoupon, verify: verifyRechargeCoupon} =
    useVerifyRechargeCoupon();

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

  /**
   * Verified pricing of the applied coupon. Which snapshot drives the
   * summary is decided by the coupon's own `applicable` value
   * (`"recharge"` / `"services"`) - never by `isRecharge`, which only keeps
   * selecting the payment/API flow. Both flows verify on "Apply" - recharge
   * through `VerifyRechargeCoupon`, service through `VerifyServiceCoupon`
   * with the booking created on `ServiceDetailsScreen`. The backend
   * response is the single source of truth - values are only adopted after
   * `success === true`, `payableAmount` becomes the Total Payable and
   * nothing is ever recalculated here (no `originalAmount - discount`, no
   * `amount - discount + gst`). Removing the coupon resets the snapshots,
   * which restores the original amounts automatically.
   */
  const applicable = (
    verifiedRechargePricing?.coupon ?? verifiedServicePricing?.coupon
  )?.applicable?.toLowerCase();

  let verifiedPricing: VerifyRechargeCouponResult | null = null;

  if (applicable === 'recharge') {
    verifiedPricing = verifiedRechargePricing;
  } else if (applicable === 'services') {
    verifiedPricing = verifiedServicePricing;
  } else {
    // A verified result whose backend response omitted the `coupon` object
    // must still be shown - both snapshots are only ever set after
    // `success === true`, and at most one of them exists per screen session.
    verifiedPricing = verifiedRechargePricing ?? verifiedServicePricing;
  }

  const amount =
    verifiedPricing?.originalAmount ??
    (isRecharge ? recharge?.amount : servicePayment?.amount);
  const gstAmount =
    verifiedPricing?.gstAmount ??
    (isRecharge ? recharge?.gstAmount : servicePayment?.gstAmount);
  const totalAmount =
    verifiedPricing?.payableAmount ??
    (isRecharge ? recharge?.totalAmount : servicePayment?.totalAmount);

  /**
   * Cashback is informational only: it is displayed as its own row and is
   * never subtracted from `payableAmount` unless the backend already did so.
   */
  const discountAmount = verifiedPricing?.discount ?? 0;
  const cashbackAmount = verifiedPricing?.cashback ?? 0;

  const selectedRechargePackId = recharge?.pack?.id;
  const previousRechargePackIdRef = useRef(selectedRechargePackId);

  /**
   * A verified coupon is bound to the pack it was checked against. When the
   * selected pack changes, drop the applied coupon and its pricing so stale
   * amounts can never be carried over to the new pack.
   */
  useEffect(() => {
    if (previousRechargePackIdRef.current === selectedRechargePackId) {
      return;
    }

    previousRechargePackIdRef.current = selectedRechargePackId;

    setCouponApplied(false);
    setCouponCode('');
    setSelectedCoupon(null);
    setVerifiedRechargePricing(null);
  }, [selectedRechargePackId]);

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
   * Recharge flow: verifies the entered code through `VerifyRechargeCoupon`
   * using the selected pack's id. On success the backend's pricing snapshot
   * (original amount, discount, cashback, GST, payable amount) replaces the
   * pack's base pricing in the summary; on failure the API `message` is
   * surfaced and nothing is applied.
   */
  const applyRechargeCoupon = async (normalizedCode: string) => {
    if (!selectedRechargePackId) {
      showError('Please select a recharge pack.');

      return;
    }

    // Blocks duplicate API requests while a verification is in flight; the
    // hook additionally guards rapid taps with an in-flight ref.
    if (isVerifyingCoupon) {
      return;
    }

    try {
      console.log('CALLING verifyRechargeCoupon');

      const result = await verifyRechargeCoupon({
        rechargePackId: selectedRechargePackId,
        couponCode: normalizedCode,
      });

      // Ignored duplicate request - another verification was already running.
      if (!result) {
        return;
      }

      console.log(
        'COUPON VERIFICATION RESULT:',
        JSON.stringify(result, null, 2),
      );

      if (result.success !== true) {
        showError(result.message || 'This coupon cannot be applied.');

        return;
      }

      // Replace (never merge) the previous pricing so repeated applications
      // cannot double-count discounts, cashback or GST.
      setVerifiedRechargePricing(result);
      setSelectedCoupon(
        result.coupon ??
          findCouponByCode(coupons, normalizedCode, couponFlow) ??
          null,
      );
      setCouponCode(result.coupon?.code?.trim() || normalizedCode);
      setCouponApplied(true);
      setIsCouponModalVisible(false);

      showSuccess(result.message || 'Coupon applied successfully.');
    } catch (error: any) {
      showError(
        error?.message || 'Unable to verify the coupon. Please try again.',
      );
    }
  };

  /**
   * Service flow: verifies the entered code through `VerifyServiceCoupon`
   * against the booking created on `ServiceDetailsScreen`. On success the
   * backend's pricing snapshot replaces the service's base pricing in the
   * summary; on failure the API `message` is surfaced and nothing is applied.
   */
  const applyServiceCoupon = async (normalizedCode: string) => {
    const bookingId = serviceBookingId;

    console.log('SERVICE COUPON PAYLOAD:', {
      bookingId,
      couponCode: normalizedCode,
    });

    if (!bookingId) {
      showError('Booking was not created. Please try again.');

      return;
    }

    if (isServiceCouponInFlightRef.current) {
      return;
    }

    isServiceCouponInFlightRef.current = true;
    setIsVerifyingServiceCoupon(true);

    try {
      console.log('CALLING verifyServiceCoupon', {
        bookingId,
        couponCode: normalizedCode,
      });

      const result = await verifyServiceCoupon({
        bookingId,
        couponCode: normalizedCode,
      });

      console.log(
        'COUPON VERIFICATION RESULT:',
        JSON.stringify(result, null, 2),
      );

      if (result.success !== true) {
        showError(result.message || 'This coupon cannot be applied.');

        return;
      }

      // Replace (never merge) the previous pricing so repeated applications
      // cannot double-count discounts, cashback or GST.
      setVerifiedServicePricing(result);
      setSelectedCoupon(
        result.coupon ??
          findCouponByCode(coupons, normalizedCode, couponFlow) ??
          null,
      );
      setCouponCode(result.coupon?.code?.trim() || normalizedCode);
      setCouponApplied(true);
      setIsCouponModalVisible(false);

      showSuccess(result.message || 'Coupon applied successfully.');
    } catch (error: any) {
      showError(
        error?.message || 'Unable to verify the coupon. Please try again.',
      );
    } finally {
      isServiceCouponInFlightRef.current = false;
      setIsVerifyingServiceCoupon(false);
    }
  };

  /**
   * Single entry point for every "Apply" tap (manual code or list item).
   * Coupon verification APIs are only ever triggered from here.
   */
  const handleApplyCoupon = async (enteredCode: string) => {
    const normalizedCode = (enteredCode || '').trim();

    console.log('APPLY COUPON CLICKED', {
      isRecharge,
      couponCode: normalizedCode,
      bookingId: serviceBookingId,
    });

    if (!normalizedCode) {
      showError('Please enter a coupon code.');

      return;
    }

    if (isRecharge) {
      await applyRechargeCoupon(normalizedCode);

      return;
    }

    await applyServiceCoupon(normalizedCode);
  };

  /** Applies a coupon picked from the list. */
  const handleSelectCoupon = (coupon: Coupon) => {
    handleApplyCoupon(coupon?.code);
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setCouponCode('');
    setSelectedCoupon(null);
    // Restores the original pack / service pricing in the summary.
    setVerifiedRechargePricing(null);
    setVerifiedServicePricing(null);
  };

  /**
   * Final payment trigger. Runs the existing order APIs with the amount
   * already shown in the summary and opens the Razorpay gateway exactly
   * once per tap. Coupons are never verified here - that only happens on
   * "Apply". `isProcessing` disables the button so rapid taps cannot
   * create duplicate orders.
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

      // `totalAmount` equals the pack's total when no coupon is applied and
      // the backend's `payableAmount` when a verified coupon is applied, so
      // the amount shown in the summary is always the amount handed to
      // Razorpay. The backend order itself stays untouched.
      const payableTotal = totalAmount ?? data.totalAmount;

      try {
        // Step 1: Create Order (existing CreateOrder mutation)
        const order = await createRechargeOrder(data.pack.id);

        // Step 2: Open Razorpay (existing checkout helper)
        const paymentResult = await openRazorpayCheckout({
          order,
          user: profile,
          selectedPack: data.pack,
          amount: payableTotal,
        });

        onPaymentSuccess?.({
          ...paymentResult,
          amount: payableTotal,
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

    // The booking itself was created on `ServiceDetailsScreen` when the
    // user tapped "Confirm Booking"; only its id is needed here - the
    // payment order references it.
    const bookingId = serviceBookingId;

    if (!bookingId) {
      showError('Booking was not created. Please try again.');

      return;
    }

    setIsProcessing(true);

    try {
      // Create the payment order (existing CreateHealingOrder mutation).
      // The astrologer was already assigned on SelectAstrologerScreen.
      // Without a coupon the amount stays the service price configured for
      // this astrologer plus GST, exactly as before; with a coupon verified
      // on "Apply" it is the backend's `payableAmount` (`totalAmount`). The
      // coupon code is only sent when the user applied one.
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
            {renderSummaryRow(
              'Original Amount',
              `₹${(amount ?? 0).toFixed(2)}`,
            )}

            {verifiedPricing &&
              renderSummaryRow(
                'Discount',
                `${discountAmount > 0 ? '-' : ''}₹${discountAmount.toFixed(2)}`,
              )}

            {renderSummaryRow(
              `GST @${GST_PERCENTAGE}%`,
              `₹${(gstAmount ?? 0).toFixed(2)}`,
            )}

            {verifiedPricing &&
              renderSummaryRow('Cashback', `₹${cashbackAmount.toFixed(2)}`)}

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
          {couponApplied ? (
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
                    {selectedCoupon
                      ? getCouponDiscountLabel(selectedCoupon)
                      : 'Coupon verified'}
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
        applying={isVerifyingCoupon || isVerifyingServiceCoupon}
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
