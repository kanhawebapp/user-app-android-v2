import React, { useState } from 'react';
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
import { useAstrologerList } from '../../../services/api/healingServices/astrologerList/useAstrologerList';
import { Astrologer } from '../../../services/api/healingServices/astrologerList/astrologer-list.types';
import { useCreateHealingOrder } from '../../../services/api/healingServices/healingOrder/useHealingOrder';
import RazorpayCheckout from 'react-native-razorpay';
import { RAZORPAY_KEY } from '../../../constants/api.constants';

const BASE_IMAGE_URL = API_BASE_URL.DEVELOPMENT;

interface SelectAstrologerScreenProps {
  bookingResponse: any;
  onBack: () => void;
  onComplete: () => void;
}

const SelectAstrologerScreen: React.FC<SelectAstrologerScreenProps> = ({
  bookingResponse,
  onBack,
  onComplete,
}) => {
  const [selectedAstrologer, setSelectedAstrologer] = useState<Astrologer | null>(null);
  const {astrologers, loading: astrologersLoading} = useAstrologerList({page: 1, limit: 20});
  const {createOrder, loading: paymentLoading} = useCreateHealingOrder();

  const handleContinue = async () => {
    if (!selectedAstrologer) {
      Alert.alert('Selection Required', 'Please select an astrologer to continue');
      return;
    }

    try {
      const bookingId = bookingResponse?.createServiceBooking?.id;
      const order = await createOrder(bookingId);

      const options = {
        key: RAZORPAY_KEY.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Number(order?.payableAmount) * 100,
        currency: order?.currency || 'INR',
        name: 'Dhwani Astro LLP',
        description: 'Healing Service Payment',
        order_id: order?.orderId,
        prefill: {},
        notes: {
          bookingId: order?.bookingId,
          astrologerId: selectedAstrologer?.id,
          serviceType: 'SERVICE',
        },
        theme: {
          color: '#5B2CA5',
        },
      };

      await RazorpayCheckout.open(options);
      onComplete();
    } catch (error: any) {
      console.log('PAYMENT ERROR', error);
    }
  };

  const renderAstrologer = ({ item }: { item: Astrologer }) => {
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
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>
                ⭐ {item.rating || 0}
              </Text>
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backIcon}>
          <Text style={styles.backIconText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} weight="semibold">
          Select Astrologer
        </Text>
      </View>

      <FlatList
        data={astrologers}
        keyExtractor={item => item.id}
        renderItem={renderAstrologer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          astrologersLoading ? (
            <View style={styles.emptyContainer}>
              <ActivityIndicator color={colors.primary.main} />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No astrologers available</Text>
            </View>
          )
        )}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!selectedAstrologer || paymentLoading) && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={!selectedAstrologer || paymentLoading}
        >
          {paymentLoading ? (
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