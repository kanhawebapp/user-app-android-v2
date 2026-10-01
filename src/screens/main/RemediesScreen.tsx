import React, { useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Text } from '../../components/Text';
import { colors } from '../../theme';

import { useMyServiceBookings } from '../../services/api/healingServices/myBooking/useMyServiceBookings';
import { useCategories } from '../../services/api/healingServices/serviceCategory/useCategories';
import { useCategoryServices } from '../../services/api/healingServices/getCategory/useCategoryServices';
import { Category } from '../../services/api/healingServices/serviceCategory/categories.types';

import ServiceCard from '../../components/cards/ServiceCard';
import CategoryCard from '../../components/cards/CategoryCard';

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
  } = useMyServiceBookings();

  const {
    categories,
    loading: categoryLoading,
    refresh: refreshCategories,
  } = useCategories();

  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);

  const {
    services,
    loading: servicesLoading,
    refresh: refreshServices,
  } = useCategoryServices(selectedCategory?.slug);

  const isCategoryView = !selectedCategory;

  const handleServicePress = (service: any) => {
    onNavigateToServiceDetails?.({
      ...service,
      category: selectedCategory
        ? {
            id: selectedCategory.id,
            name: selectedCategory.name,
            slug: selectedCategory.slug,
          }
        : service?.category,
    });
  };

  const handleCategoryPress = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <View style={styles.gridItem}>
      <CategoryCard
        category={item}
        onPress={() => handleCategoryPress(item)}
      />
    </View>
  );

  const renderServiceItem = ({ item }: { item: any }) => (
    <ServiceCard
      service={item}
      onPress={() => handleServicePress(item)}
    />
  );

  const renderLoader = () => (
    <View style={styles.loaderContainer}>
      <ActivityIndicator color={colors.primary.main} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {isCategoryView ? (
          <Text style={styles.screenTitle} weight="semibold">
            Healing & Remedies
          </Text>
        ) : (
          <View style={styles.categoryHeaderLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackToCategories}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.backButtonText}>{'←'}</Text>
            </TouchableOpacity>

            <Text
              style={styles.categoryHeaderTitle}
              weight="semibold"
              numberOfLines={1}>
              {selectedCategory?.name}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.bookingButton}
          onPress={onNavigateToMyBookings}
        >
          <Text style={styles.bookingButtonText} weight="medium">
            My Bookings ({bookings?.length || 0})
          </Text>
        </TouchableOpacity>
      </View>

      {isCategoryView ? (
        <FlatList
          // Distinct key per view: FlatList cannot change `numColumns`
          // in place, so the categories grid (2 columns) and the services
          // list (1 column) must not share a mounted instance.
          key="remedies-categories"
          data={categories}
          keyExtractor={(item: Category) => item.id}
          numColumns={2}
          renderItem={renderCategoryItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
          columnWrapperStyle={styles.columnWrapper}
          refreshControl={
            <RefreshControl
              refreshing={categoryLoading}
              onRefresh={refreshCategories}
            />
          }
          ListHeaderComponent={
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle} weight="semibold">
                Categories
              </Text>

              <Text style={styles.countText}>
                {categories.length} Found
              </Text>
            </View>
          }
          ListEmptyComponent={
            categoryLoading ? renderLoader() : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No Categories Found
                </Text>
              </View>
            )
          }
        />
      ) : (
        <FlatList
          key="remedies-services"
          data={services}
          keyExtractor={(item: any) => item.id}
          renderItem={renderServiceItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.servicesContainer}
          refreshControl={
            <RefreshControl
              refreshing={servicesLoading}
              onRefresh={refreshServices}
            />
          }
          ListHeaderComponent={
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle} weight="semibold">
                Services
              </Text>

              <Text style={styles.countText}>
                {services.length} Found
              </Text>
            </View>
          }
          ListEmptyComponent={
            servicesLoading ? renderLoader() : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No Services Found
                </Text>
              </View>
            )
          }
        />
      )}
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
  categoryHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  backButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 22,
    color: colors.primary.main,
  },
  categoryHeaderTitle: {
    flex: 1,
    fontSize: 20,
    color: '#1F1F2E',
    marginLeft: 8,
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
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  gridItem: {
    width: '47.5%',
  },
  servicesContainer: {
    paddingTop: 4,
    paddingBottom: 30,
  },
  loaderContainer: {
    alignItems: 'center',
    marginTop: 60,
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
