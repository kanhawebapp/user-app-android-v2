import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {Text} from '../../components';
import {colors} from '../../theme';
import {useMyServiceBookings} from '../../services/api/healingServices/myBooking/useMyServiceBookings';

const MyBookingScreen: React.FC = () => {
  const {bookings, loading, error, refresh} = useMyServiceBookings();

  const data = (bookings as any)?.data ?? [];

  const renderItem = ({item}: any) => {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>
          {item?.service?.name ?? item?.serviceName ?? 'Healing Booking'}
        </Text>
        <Text style={styles.subTitle}>
          {item?.status ?? item?.bookingStatus ?? '—'}
        </Text>
        <Text style={styles.meta}>
          {item?.id ? `Booking #${item.id}` : ''}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          My Bookings ({data?.length ?? 0})
        </Text>
      </View>

      {loading && (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      )}

      {!loading && error && (
        <View style={styles.errorWrap}>
          <Text style={styles.errorText}>Failed to load bookings</Text>
        </View>
      )}

      {!loading && !error && (
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
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>No bookings found</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default MyBookingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorWrap: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  errorText: {
    color: '#b00020',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#EEF0F5',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  subTitle: {
    marginTop: 6,
    color: '#666',
    fontWeight: '600',
  },
  meta: {
    marginTop: 8,
    color: '#888',
  },
  emptyWrap: {
    paddingTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    color: '#777',
    fontWeight: '600',
  },
});

