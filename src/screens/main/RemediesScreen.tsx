import React, { useMemo } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl, 
} from 'react-native';
import { Text } from '../../components/Text';
import { colors } from '../../theme';

import { useMyServiceBookings } from '../../services/api/healingServices/myBooking/useMyServiceBookings';
import { useServices } from '../../services/api/healingServices/getServices/useServices';
import { useCategories } from '../../services/api/healingServices/serviceCategory/useCategories';

import ServiceCard from '../../components/cards/ServiceCard';
import CategoryChip from '../../components/cards/CategoryChip';

interface RemediesScreenProps {
  onNavigateToLogin?: () => void;
  onNavigateToSignup?: () => void; 
  onNavigateToMyBookings?: () => void;
  onNavigateToServiceDetails?: (service: any) => void;
}

const RemediesScreen: React.FC<RemediesScreenProps> = ({
  onNavigateToMyBookings,
  onNavigateToServiceDetails,
}) => {
  const {
    bookings,
    loading: bookingLoading,
    refresh,
  } = useMyServiceBookings();

  const {
    services,
    loading: servicesLoading,
  } = useServices();

  const {
    categories,
    loading: categoryLoading,
  } = useCategories();

  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const filteredServices = useMemo(() => {
    if (!selectedCategory) {
      return services;
    }
    return services.filter(
      item => item?.category?.id === selectedCategory,
    );
  }, [services, selectedCategory]);
  console.log("all category",categories)

  const handleServicePress = (service: any) => {
    onNavigateToServiceDetails?.(service);
  };

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(prev => prev === categoryId ? null : categoryId);
  };

  const renderCategoryItem = ({ item }: { item: any }) => (
    <CategoryChip
      category={item}
      isSelected={selectedCategory === item.id}
      onPress={handleCategoryPress}
    />
  );

  const renderServiceItem = ({ item }: { item: any }) => (
    <ServiceCard
      service={item}
      onPress={() => handleServicePress(item)}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle} weight="semibold">
          Healing & Remedies
        </Text>

        <TouchableOpacity
          style={styles.bookingButton}
          onPress={onNavigateToMyBookings}
        >
          <Text style={styles.bookingButtonText} weight="medium">
            My Bookings ({bookings?.length || 0})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredServices}
        keyExtractor={(item: any) => item.id}
        renderItem={renderServiceItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={bookingLoading}
            onRefresh={refresh}
          />
        }
        ListHeaderComponent={
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle} weight="semibold">
                Categories
              </Text>
            </View>

            <FlatList
              horizontal
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={(item: any) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesList}
            />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle} weight="semibold">
                Services
              </Text>

              <Text style={styles.countText}>
                {filteredServices.length} Found
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No Services Found</Text>
          </View>
        }
      />
    </View>
  );
};

export default RemediesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  screenTitle: {
    fontSize: 22,
    color: '#1F1F2E',
  },
  bookingButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  bookingButtonText: {
    color: '#fff',
    fontSize: 13,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#1F1F2E',
  },
  countText: {
    fontSize: 13,
    color: '#6B6B80',
  },
  categoriesList: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  listContainer: {
    paddingBottom: 30,
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