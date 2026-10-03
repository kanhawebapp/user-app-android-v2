import React, { useMemo, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Text } from '../../../components/Text';
import { colors } from '../../../theme';
import { API_BASE_URL } from '../../../constants/api.constants';
import { useGetService } from '../../../services/api/healingServices/getService/useGetService';
import { ServiceAstrologer } from '../../../services/api/healingServices/getServices/services.types';
import { useCreateHealingOrder } from '../../../services/api/healingServices/healingOrder/useHealingOrder';
import { useCreateServiceBooking } from '../../../services/api/healingServices/serviceBooking/useServiceBooking';
import { CreateServiceBookingInput } from '../../../services/api/healingServices/serviceBooking/serviceBooking.types';
import { useBookingAstrologer } from '../../../services/api/healingServices/bookingAstrologer/useBookingAstrologer';
import { useAuthStore } from '../../../stores/auth.store';
import { useToast } from '../../../context/ToastContext';
import type { User } from '../../../types/global.types';
import RazorpayCheckout from 'react-native-razorpay';
import { RAZORPAY_KEY } from '../../../constants/api.constants';
import { GoBack } from '../../../components';

const BASE_IMAGE_URL = API_BASE_URL.DEVELOPMENT;

interface SelectAstrologerScreenProps {
  service: {
    id: string;
    name: string;
    price: number;
    /** Slug of the selected service; used for the `GetService(slug)` call. */
    slug?: string;
    category?: {
      name: string;
    };
  } | null;
  onBack: () => void;
  onComplete: () => void;
}

/**
 * An astrologer the user can pick for the selected service. It carries the
 * service-specific `ServiceAstrologer` join row alongside the astrologer
 * itself, so `id` stays the real astrologer id while the mapping id and the
 * service price remain available for the booking flow.
 */
type SelectableAstrologer = ServiceAstrologer & {
  serviceAstrologerMappingId: string;
  servicePrice: number;
};

/**
 * `BookingFormScreen` is no longer part of this flow, so the booking payload
 * is derived from the signed-in user's profile instead of a manual form.
 */
const buildBookingInput = (
  service: SelectAstrologerScreenProps['service'],
  user: User | null,
): CreateServiceBookingInput => ({
  serviceId: service?.id ?? '',

  name: user?.name ?? '',

  email: user?.email ?? '',

  phone: user?.mobile || user?.phone || '',

  dob: user?.dateOfBirth ?? '',

  tob: user?.birthTime ?? '',

  pob: user?.birthPlace || user?.placeOfBirth || '',

  gender: user?.gender ?? '',

  concern: '',
});

const SelectAstrologerScreen: React.FC<
  SelectAstrologerScreenProps
> = ({
  service,
  onBack,
  onComplete,
}) => {
  const [selectedAstrologer, setSelectedAstrologer] =
    useState<SelectableAstrologer | null>(null);
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const {showError} = useToast();

  const user = useAuthStore(state => state.user);

  // Single source of service details: `GetService(slug)` via the shared
  // GraphQL client. The slug comes from the service handed over by the
  // healing flow (a service list/card), so the `astrologerMappings` and
  // their service-specific prices always come from one centralized call.
  const {
    service: selectedService,
    loading: serviceLoading,
    refresh: refreshService,
  } = useGetService(service?.slug);

  const astrologers = useMemo<SelectableAstrologer[]>(
    () =>
      selectedService?.astrologerMappings
        ?.filter(mapping => mapping?.astrologer)
        ?.map(mapping => ({
          ...mapping.astrologer,
          serviceAstrologerMappingId: mapping.id,
          servicePrice: mapping.price,
        })) ?? [],
    [selectedService],
  );

  const {submitBooking} = useCreateServiceBooking();
  const {assignAstrologer} = useBookingAstrologer();
  const {
    createOrder,
    loading: paymentLoading,
  } = useCreateHealingOrder();

  const handleContinue = async () => {
    if (!selectedAstrologer) {
      Alert.alert(
        'Selection Required',
        'Please select an astrologer to continue',
      );

      return;
    }

    if (!service?.id) {
      showError('Unable to continue. Please select a service again.');

      return;
    }

    if (isSubmitting || paymentLoading) {
      return;
    }

    setIsSubmitting(true);

    try {
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
});

      const bookingId = booking?.id;

      if (!bookingId) {
        throw new Error(
          'Booking was not created. Please try again.',
        );
      }

      // Persist the selected astrologer on the booking before checkout.
      await assignAstrologer({
        bookingId,
        astrologerId: selectedAstrologer.id,
      });

      // The order amount is the price configured for this astrologer on the
      // selected service (`astrologerMappings[].price`); no coupon is applied
      // at this step.
      const order = await createOrder({
        bookingId,
        couponCode: '',
        amount: selectedAstrologer.servicePrice,
      });

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
          astrologerId: selectedAstrologer.id,
          serviceAstrologerMappingId:
            selectedAstrologer.serviceAstrologerMappingId,
          serviceId: service?.id,
          serviceName: service?.name,
          servicePrice: String(
            selectedAstrologer.servicePrice ??
              service?.price ??
              '',
          ),
          serviceType: 'SERVICE',
        },
        theme: {
          color: '#5B2CA5',
        },
      };

      try {
        await RazorpayCheckout.open(options);
        onComplete();
      } catch (razorpayError: any) {
        // A dismissed checkout rejects as well — treat it as a silent cancel.
        console.log('PAYMENT ERROR', razorpayError);

        if (razorpayError?.code === 'Payment Cancelled') {
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
        error?.message ||
          'Unable to start the payment. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderAstrologer = ({
    item,
  }: {
    item: SelectableAstrologer;
  }) => {
    const selected = selectedAstrologer?.id === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.card,
          selected && styles.selectedCard,
        ]}
        onPress={() => setSelectedAstrologer(item)}
      >
        <Image
          source={{
            uri: `${BASE_IMAGE_URL}${item.profilePic}`,
          }}
          style={styles.avatar}
        />

        <View style={styles.infoContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.name} weight="semibold">
              {item.displayName || item.name || 'Astrologer'}
            </Text>
            <View style={styles.metaRow}>
              <Text style={styles.cardPrice} weight="semibold">
                ₹{item.servicePrice}
              </Text>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>
                  ⭐ {item.rating || 0}
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.experience}>
            {item.experience} years experience
          </Text>

          <Text style={styles.detailLabel}>Skills:</Text>
          <Text style={styles.detailText} numberOfLines={1}>
            {item.skills?.join(', ') || 'Not specified'}
          </Text>

          <Text style={styles.detailLabel}>Languages:</Text>
          <Text style={styles.detailText} numberOfLines={1}>
            {item.languages?.join(', ') || 'Not specified'}
          </Text>
        </View>

        {selected && (
          <View style={styles.checkmark}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const isBusy = isSubmitting || paymentLoading;

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backIcon}>
          <Text style={styles.backIconText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} weight="semibold">
          Select Astrologer
        </Text>
      </View> */}

         <View style={styles.backButtonWrapper}>
                    <GoBack onBack={onBack} title='Select Astrologer' />
                  </View>

      {!!service && (
        <View style={styles.serviceSummary}>
          <View style={styles.serviceSummaryLeft}>
            <Text style={styles.serviceSummaryLabel} weight="medium">
              {service.category?.name || 'Service'}
            </Text>

            <Text
              style={styles.serviceSummaryName}
              weight="semibold"
              numberOfLines={1}>
              {service.name}
            </Text>
          </View>

          <Text style={styles.serviceSummaryPrice} weight="semibold">
            ₹{service.price}
          </Text>
        </View>
      )}

      <FlatList
        data={astrologers}
        keyExtractor={item => item.id}
        renderItem={renderAstrologer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          serviceLoading ? (
            <View style={styles.emptyContainer}>
              <ActivityIndicator color={colors.primary.main} />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No astrologers available
              </Text>
            </View>
          )
        )}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!selectedAstrologer || isBusy) &&
              styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={!selectedAstrologer || isBusy}
        >
          {isBusy ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.continueText} weight="semibold">
              Continue to Payment
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },
   backButtonWrapper: {
    position: 'absolute',
    // top: 10,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  backIcon: {
    marginRight: 16,
  },
  backIconText: {
    fontSize: 22,
    color: colors.primary.main,
  },
  headerTitle: {
    fontSize: 20,
    color: '#1F1F2E',
  },
  serviceSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  serviceSummaryLeft: {
    flex: 1,
    marginRight: 12,
  },
  serviceSummaryLabel: {
    fontSize: 12,
    color: colors.primary.main,
  },
  serviceSummaryName: {
    fontSize: 16,
    color: '#1F1F2E',
    marginTop: 2,
  },
  serviceSummaryPrice: {
    fontSize: 18,
    color: colors.primary.main,
  },
  listContent: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  selectedCard: {
    borderColor: colors.primary.main,
    borderWidth: 2,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 14,
    backgroundColor: '#F0F0F0',
  },
  infoContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    color: '#1F1F2E',
    flex: 1,
  },
  ratingBadge: {
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  cardPrice: {
    fontSize: 14,
    color: colors.primary.main,
    marginRight: 8,
  },
  ratingText: {
    fontSize: 12,
    color: '#FFA000',
  },
  experience: {
    fontSize: 12,
    color: '#6B6B80',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#444',
    marginTop: 2,
  },
  checkmark: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.primary.main,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  continueButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 15,
    color: '#777',
  },
});

export default SelectAstrologerScreen;
