import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import RazorpayCheckout from 'react-native-razorpay';

import {useTheme} from '../../../../theme';
import {Text} from '../../../../components/Text';
import {Button} from '../../../../components/Button';
import {Card} from '../../../../components/Card';
import {GoBack} from '../../../../components';
import {useToast} from '../../../../context/ToastContext';
import {useProfile} from '../../../../services/api/profile/profile.hooks';
import {useAuthStore} from '../../../../stores/auth.store';
import {RAZORPAY_KEY} from '../../../../constants/api.constants';

// Recharge APIs (existing)
import {useRechargeOrder} from '../../../../services/api/recharge/recharge.order.hooks';
import {openRazorpayCheckout} from '../../../../services/api/recharge/razorpay.service';
import {RechargePack} from '../../../../services/api/recharge/recharge.types';

// Healing / service booking APIs (existing)
import {ServiceAstrologer} from '../../../../services/api/healingServices/getServices/services.types';
import {useCreateServiceBooking} from '../../../../services/api/healingServices/serviceBooking/useServiceBooking';
import {CreateServiceBookingInput} from '../../../../services/api/healingServices/serviceBooking/serviceBooking.types';
import {useBookingAstrologer} from '../../../../services/api/healingServices/bookingAstrologer/useBookingAstrologer';
import {useCreateHealingOrder} from '../../../../services/api/healingServices/healingOrder/useHealingOrder';
import {getIPLocation} from '../../../../services/location/location.service';

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
 * the Razorpay gateway are only triggered from the final "Payment" button
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

  const {showSuccess, showError} = useToast();

  const {profile} = useProfile();
  const user = useAuthStore(state => state.user);

  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  // Existing API hooks - reused as-is, only the trigger point moved here.
  const {createOrder: createRechargeOrder} = useRechargeOrder();
  const {submitBooking} = useCreateServiceBooking();
  const {assignAstrologer} = useBookingAstrologer();
  const {createOrder: createHealingOrder} = useCreateHealingOrder();

  const isRecharge = paymentType === 'recharge';

  const title = isRecharge ? 'Payment' : 'Dhwani Services Payment';

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

  const handleApplyCoupon = () => {
    const code = couponCode.trim();

    if (!code) {
      showError('Please enter a coupon code.');

      return;
    }

    setCouponApplied(true);
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
        weight={isTotal ? 'bold' : 'medium'}
        style={{
          color: isTotal ? colors.primary.main : colors.text.primary,
        }}>
        {value}
      </Text>
    </View>
  );

  return (
    <View
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      <GoBack onBack={onBack} title={title} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 120,
        }}>
        <Card style={styles.summaryCard}>
          {!isRecharge && (
            <Text
              variant="h6"
              weight="semibold"
              style={[styles.sectionTitle, {color: colors.text.primary}]}>
              Dhwani Services Payment
            </Text>
          )}

          {isRecharge
            ? renderSummaryRow('Selected Pack', packName ?? '')
            : renderSummaryRow('Services', serviceName ?? '')}

          {!isRecharge && renderSummaryRow('Astrologer', astrologerName ?? '')}

          {renderSummaryRow('Amount', `₹${(amount ?? 0).toFixed(2)}`)}

          {renderSummaryRow(
            `GST @${GST_PERCENTAGE}%`,
            `₹${(gstAmount ?? 0).toFixed(2)}`,
          )}

          {/* Apply Coupon */}
          <View style={styles.couponRow}>
            <Text
              variant="body"
              weight="medium"
              style={{color: colors.text.secondary}}>
              Apply Coupon
            </Text>

            {couponApplied ? (
              <Text
                variant="body"
                weight="semibold"
                style={{color: colors.primary.main}}>
                {couponCode.trim()}
              </Text>
            ) : (
              <View style={styles.couponInputRow}>
                <TextInput
                  style={[
                    styles.couponInput,
                    {
                      color: colors.text.primary,
                      borderColor: colors.border.light,
                    },
                  ]}
                  value={couponCode}
                  onChangeText={setCouponCode}
                  placeholder="Enter coupon code"
                  placeholderTextColor={colors.text.tertiary}
                  autoCapitalize="characters"
                  maxLength={32}
                />

                <TouchableOpacity
                  style={[
                    styles.couponApplyButton,
                    {backgroundColor: colors.primary.main},
                  ]}
                  onPress={handleApplyCoupon}
                  activeOpacity={0.7}>
                  <Text
                    variant="bodySmall"
                    weight="semibold"
                    style={{color: colors.primary.contrastText}}>
                    Apply
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View
            style={[styles.divider, {backgroundColor: colors.border.light}]}
          />

          {renderSummaryRow(
            'Total Payable',
            `₹${(totalAmount ?? 0).toFixed(2)}`,
            true,
          )}
        </Card>
      </ScrollView>

      {/* Final Payment Button */}
      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + 16,
            backgroundColor: colors.background.primary,
          },
        ]}>
        <Button
          title="Payment"
          variant="primary"
          size="large"
          onPress={handlePayment}
          loading={isProcessing}
          disabled={isProcessing}
          style={styles.payButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summaryCard: {
    paddingVertical: 8,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  couponRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  couponInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    marginLeft: 12,
  },
  couponInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 130,
    fontSize: 13,
  },
  couponApplyButton: {
    marginLeft: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  payButton: {
    width: '100%',
  },
});

export default PaymentScreen;
