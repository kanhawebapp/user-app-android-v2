// import React from 'react';
// import {
//   View,
//   StyleSheet,
//   FlatList,
//   ActivityIndicator,
//   RefreshControl,
// } from 'react-native';
// import {Text} from '../../components';
// import {colors} from '../../theme';
// import {useMyServiceBookings} from '../../services/api/healingServices/myBooking/useMyServiceBookings';

// const MyBookingScreen: React.FC = () => {
//   const {bookings, loading, error, refresh} = useMyServiceBookings();

//   const data = (bookings as any)?.data ?? [];

//   console.log("my booking",bookings)

//   const renderItem = ({item}: any) => {
//     return (
//       <View style={styles.card}>
//         <Text style={styles.title}>
//           {item?.service?.name ?? item?.serviceName ?? 'Healing Booking'}
//         </Text>
//         <Text style={styles.subTitle}>
//           {item?.status ?? item?.bookingStatus ?? '—'}
//         </Text>
//         <Text style={styles.meta}>
//           {item?.id ? `Booking #${item.id}` : ''}
//         </Text>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>
//           My Bookings ({data?.length ?? 0})
//         </Text>
//       </View>

//       {loading && (
//         <View style={styles.loadingWrap}>
//           <ActivityIndicator size="large" color={colors.primary.main} />
//         </View>
//       )}

//       {!loading && error && (
//         <View style={styles.errorWrap}>
//           <Text style={styles.errorText}>Failed to load bookings</Text>
//         </View>
//       )}

//       {!loading && !error && (
//         <FlatList
//           data={data}
//           keyExtractor={(item, idx) => item?.id?.toString?.() ?? String(idx)}
//           renderItem={renderItem}
//           contentContainerStyle={styles.listContent}
//           refreshControl={
//             <RefreshControl
//               refreshing={loading}
//               onRefresh={refresh}
//               tintColor={colors.primary.main}
//             />
//           }
//           ListEmptyComponent={
//             <View style={styles.emptyWrap}>
//               <Text style={styles.emptyText}>No bookings found</Text>
//             </View>
//           }
//         />
//       )}
//     </View>
//   );
// };

// export default MyBookingScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F7F8FC',
//   },
//   header: {
//     paddingHorizontal: 16,
//     paddingTop: 16,
//     paddingBottom: 12,
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//   },
//   loadingWrap: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorWrap: {
//     paddingHorizontal: 16,
//     paddingTop: 20,
//   },
//   errorText: {
//     color: '#b00020',
//     fontWeight: '600',
//   },
//   listContent: {
//     paddingHorizontal: 16,
//     paddingBottom: 30,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 14,
//     marginTop: 12,
//     borderWidth: 1,
//     borderColor: '#EEF0F5',
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   subTitle: {
//     marginTop: 6,
//     color: '#666',
//     fontWeight: '600',
//   },
//   meta: {
//     marginTop: 8,
//     color: '#888',
//   },
//   emptyWrap: {
//     paddingTop: 60,
//     alignItems: 'center',
//   },
//   emptyText: {
//     color: '#777',
//     fontWeight: '600',
//   },
// });


import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { GoBack, Text } from '../../components';
import { colors } from '../../theme';
import { useMyServiceBookings } from '../../services/api/healingServices/myBooking/useMyServiceBookings';
import { API_BASE_URL } from '../../constants/api.constants';
import { useNavigation } from '@react-navigation/native';

const MyBookingScreen: React.FC = () => {
  const { bookings, loading, error, refresh } = useMyServiceBookings();

  const data = bookings

  const navigation = useNavigation()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
      case 'ASSIGNED':
      case 'COMPLETED':
        return '#16A34A';

      case 'PENDING':
        return '#F59E0B';

      case 'FAILED':
      case 'CANCELLED':
        return '#DC2626';

      default:
        return '#64748B';
    }
  };

  const renderItem = ({ item }: any) => {
    const imageUrl = item?.service?.image
      ? `${API_BASE_URL.DEVELOPMENT}${item.service.image}`
      : undefined;

    const formattedDate = new Date(
      Number(item.createdAt),
    ).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.serviceImage}
            />
          ) : (
            <View style={styles.imagePlaceholder} />
          )}

          <View style={styles.headerInfo}>
            <Text style={styles.serviceName}>
              {item?.service?.name}
            </Text>

            <Text style={styles.bookingId}>
              Booking #{item?.id?.slice(-8)}
            </Text>
          </View>
        </View>

        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusChip,
              {
                backgroundColor:
                  getStatusColor(
                    item.bookingStatus,
                  ) + '20',
              },
            ]}>
            <Text
              style={[
                styles.statusText,
                {
                  color: getStatusColor(
                    item.bookingStatus,
                  ),
                },
              ]}>
              {item.bookingStatus}
            </Text>
          </View>

          <View
            style={[
              styles.statusChip,
              {
                backgroundColor:
                  getStatusColor(
                    item.paymentStatus,
                  ) + '20',
              },
            ]}>
            <Text
              style={[
                styles.statusText,
                {
                  color: getStatusColor(
                    item.paymentStatus,
                  ),
                },
              ]}>
              {item.paymentStatus}
            </Text>
          </View>
        </View>

        <View style={styles.bottomRow}>
          <View>
            <Text style={styles.amountLabel}>
              Amount
            </Text>

            <Text style={styles.amount}>
              ₹{item.amount}
            </Text>
          </View>

          <View>
            <Text style={styles.dateLabel}>
              Date
            </Text>

            <Text style={styles.date}>
              {formattedDate}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <GoBack onBack={navigation.goBack} />
        <Text style={styles.headerTitle}>
          My Bookings
        </Text>

        <Text style={styles.headerSubTitle}>
          {data.length} Total Bookings
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {data.length}
            </Text>
            <Text style={styles.statLabel}>
              Total
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {
                data.filter(
                  (i: any) =>
                    i.paymentStatus ===
                    'SUCCESS',
                ).length
              }
            </Text>
            <Text style={styles.statLabel}>
              Paid
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {
                data.filter(
                  (i: any) =>
                    i.paymentStatus ===
                    'PENDING',
                ).length
              }
            </Text>
            <Text style={styles.statLabel}>
              Pending
            </Text>
          </View>
        </View>
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
              <Text style={styles.emptyTitle}>
                No Bookings Yet
              </Text>

              <Text style={styles.emptySubTitle}>
                Your healing bookings will
                appear here.
              </Text>
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
  // card: {
  //   backgroundColor: '#fff',
  //   borderRadius: 16,
  //   padding: 14,
  //   marginTop: 12,
  //   borderWidth: 1,
  //   borderColor: '#EEF0F5',
  // },
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


  //
  headerSubTitle: {
    color: '#64748B',
    marginTop: 4,
  },

  statsRow: {
    flexDirection: 'row',
    marginTop: 16,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 4,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 2,
  },

  statValue: {
    fontSize: 22,
    fontWeight: '700',
  },

  statLabel: {
    color: '#64748B',
    marginTop: 4,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 16,
    marginTop: 14,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 3,
  },

  cardHeader: {
    flexDirection: 'row',
  },

  serviceImage: {
    width: 70,
    height: 70,
    borderRadius: 16,
  },

  imagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
  },

  headerInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },

  serviceName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },

  bookingId: {
    marginTop: 6,
    color: '#64748B',
    fontSize: 12,
  },

  statusRow: {
    flexDirection: 'row',
    marginTop: 14,
  },

  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 10,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },

  amountLabel: {
    color: '#64748B',
    fontSize: 12,
  },

  amount: {
    marginTop: 4,
    fontSize: 24,
    fontWeight: '700',
    color: '#16A34A',
  },

  dateLabel: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'right',
  },

  date: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '600',
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },

  emptySubTitle: {
    marginTop: 8,
    color: '#64748B',
    textAlign: 'center',
  },
});

