import React from 'react';
import {View, StyleSheet, FlatList, RefreshControl, Image} from 'react-native';
import {Text} from '../../components';
import {colors} from '../../theme';
import {useMyServiceBookings} from '../../services/api/healingServices/myBooking/useMyServiceBookings';
import {API_BASE_URL} from '../../constants/api.constants';

const BASE_IMAGE_URL = API_BASE_URL.DEVELOPMENT;

const formatDate = (dateString: string | undefined) => {
  if (!dateString) {
    return '—';
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return '—';
  }
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', {month: 'short'});
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const getBookingStatusColor = (status: string | undefined) => {
  switch (status?.toUpperCase()) {
    case 'PENDING':
      return {background: '#FFF3E0', text: '#FF9800'};
    case 'ASSIGNED':
      return {background: '#E3F2FD', text: '#2196F3'};
    case 'COMPLETED':
      return {background: '#E8F5E9', text: '#4CAF50'};
    case 'CANCELLED':
      return {background: '#FFEBEE', text: '#F44336'};
    default:
      return {background: '#F5F5F5', text: '#666'};
  }
};

const getPaymentStatusColor = (status: string | undefined) => {
  switch (status?.toUpperCase()) {
    case 'SUCCESS':
      return {background: '#E8F5E9', text: '#4CAF50'};
    case 'PENDING':
      return {background: '#FFF3E0', text: '#FF9800'};
    case 'FAILED':
      return {background: '#FFEBEE', text: '#F44336'};
    default:
      return {background: '#F5F5F5', text: '#666'};
  }
};

const StatusChip: React.FC<{label: string; type: 'booking' | 'payment'}> = ({
  label,
  type,
}) => {
  const status = label?.toUpperCase();
  const colorSet =
    type === 'booking'
      ? getBookingStatusColor(status)
      : getPaymentStatusColor(status);

  return (
    <View style={[styles.chip, {backgroundColor: colorSet.background}]}>
      <Text style={[styles.chipText, {color: colorSet.text}]}>{label}</Text>
    </View>
  );
};

const BookingCard: React.FC<{item: any}> = ({item}) => {
  const serviceImage = item?.service?.image
    ? `${BASE_IMAGE_URL}${item.service.image}`
    : null;

  return (
    <View style={styles.card}>
      <View style={styles.topSection}>
        {serviceImage ? (
          <Image
            source={{uri: serviceImage}}
            style={styles.serviceImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>🔮</Text>
          </View>
        )}
        <View style={styles.topContent}>
          <Text style={styles.serviceName} numberOfLines={2}>
            {item?.service?.name ?? 'Healing Service'}
          </Text>
          <Text style={styles.bookingId}>#{item?.id ?? '—'}</Text>
        </View>
      </View>

      <View style={styles.middleSection}>
        <StatusChip label={item?.bookingStatus ?? 'PENDING'} type="booking" />
        <StatusChip label={item?.paymentStatus ?? 'PENDING'} type="payment" />
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.amount}>₹{item?.amount ?? 0}</Text>
        <Text style={styles.date}>{formatDate(item?.createdAt)}</Text>
      </View>
    </View>
  );
};

const SkeletonCard: React.FC = () => (
  <View style={[styles.card, styles.skeletonCard]}>
    <View style={styles.skeletonTopSection}>
      <View style={styles.skeletonImage} />
      <View style={styles.skeletonTopContent}>
        <View style={styles.skeletonText} />
        <View style={styles.skeletonSubText} />
      </View>
    </View>
    <View style={styles.skeletonMiddleSection}>
      <View style={styles.skeletonChip} />
      <View style={styles.skeletonChip} />
    </View>
    <View style={styles.skeletonBottomSection}>
      <View style={styles.skeletonAmount} />
      <View style={styles.skeletonDate} />
    </View>
  </View>
);

const MyBookingScreen: React.FC = () => {
  const {bookings, loading, refresh} = useMyServiceBookings();

  const data = (bookings as any)?.data ?? [];

  const totalBookings = data.length;
  const successfulPayments = data.filter(
    (b: any) => b?.paymentStatus?.toUpperCase() === 'SUCCESS',
  ).length;
  const pendingPayments = data.filter(
    (b: any) => b?.paymentStatus?.toUpperCase() === 'PENDING',
  ).length;

  const renderItem = ({item}: any) => <BookingCard item={item} />;

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>My Bookings</Text>
      <Text style={styles.headerCount}>Total Bookings: {totalBookings}</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalBookings}</Text>
          <Text style={styles.statLabel}>Total Bookings</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{successfulPayments}</Text>
          <Text style={styles.statLabel}>Successful Payments</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{pendingPayments}</Text>
          <Text style={styles.statLabel}>Pending Payments</Text>
        </View>
      </View>
    </View>
  );

  if (loading && data.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingHeader}>
          <View style={styles.skeletonHeaderText} />
          <View style={styles.skeletonHeaderSubText} />
        </View>
        <FlatList
          data={[1, 2, 3]}
          keyExtractor={(_, idx) => String(idx)}
          renderItem={({item}) => <SkeletonCard key={item} />}
          contentContainerStyle={styles.listContent}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item, idx) => item?.id?.toString?.() ?? String(idx)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            tintColor={colors.primary.main}
          />
        }
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyTitle}>No Bookings Yet</Text>
            <Text style={styles.emptySubtitle}>
              Your booking history will appear here once you make a booking
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default MyBookingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F1F2E',
    letterSpacing: -0.5,
  },
  headerCount: {
    fontSize: 14,
    color: '#6B6B80',
    marginTop: 4,
    fontWeight: '500',
  },
  loadingHeader: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  skeletonHeaderText: {
    height: 28,
    width: 150,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
  },
  skeletonHeaderSubText: {
    height: 14,
    width: 100,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    marginTop: 8,
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary.main,
  },
  statLabel: {
    fontSize: 11,
    color: '#6B6B80',
    marginTop: 4,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#EEF0F5',
    marginHorizontal: 8,
  },

  // Card
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 20,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  skeletonCard: {
    backgroundColor: '#F5F5F5',
  },
  topSection: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  topContent: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  serviceImage: {
    width: 70,
    height: 70,
    borderRadius: 14,
    backgroundColor: '#F3F0FF',
  },
  placeholderImage: {
    width: 70,
    height: 70,
    borderRadius: 14,
    backgroundColor: '#F3F0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 28,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F1F2E',
    lineHeight: 22,
  },
  bookingId: {
    fontSize: 12,
    color: '#6B6B80',
    marginTop: 4,
    fontWeight: '500',
  },

  // Middle Section
  middleSection: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Bottom Section
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F5',
  },
  amount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#22A45D',
    letterSpacing: -0.3,
  },
  date: {
    fontSize: 13,
    color: '#6B6B80',
    fontWeight: '500',
  },

  // Loading Skeleton
  skeletonTopSection: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  skeletonImage: {
    width: 70,
    height: 70,
    borderRadius: 14,
    backgroundColor: '#E0E0E0',
  },
  skeletonTopContent: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  skeletonText: {
    height: 16,
    width: '80%',
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
  },
  skeletonSubText: {
    height: 12,
    width: '50%',
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    marginTop: 6,
  },
  skeletonMiddleSection: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  skeletonChip: {
    height: 22,
    width: 90,
    backgroundColor: '#E0E0E0',
    borderRadius: 16,
  },
  skeletonBottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  skeletonAmount: {
    height: 22,
    width: 80,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
  },
  skeletonDate: {
    height: 12,
    width: 90,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
  },

  // Empty State
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F1F2E',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B6B80',
    textAlign: 'center',
    lineHeight: 20,
  },

  // List
  listContent: {
    paddingBottom: 30,
  },
});
