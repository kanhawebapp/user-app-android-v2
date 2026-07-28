/**
 * ShopScreenShimmer Component
 * Layout-based shimmer loader for ShopScreen
 * Matches: Grid product layout (2 columns)
 */

import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useTheme } from '../../../theme';
import { SkeletonLoader } from '../../SkeletonLoader';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - 32 - GRID_GAP) / 2;
const PRODUCT_IMAGE_HEIGHT = 140;

export const ShopScreenShimmer: React.FC = () => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Search Bar Placeholder */}
      <View style={styles.searchContainer}>
        <SkeletonLoader
          width="100%"
          height={44}
          borderRadius={22}
          backgroundColor={colors.skeleton.base}
          shimmerColor={colors.skeleton.highlight}
        />
      </View>

      {/* Filter Chips */}
      <View style={styles.filtersContainer}>
        {[1, 2, 3, 4].map(index => (
          <View key={`filter-${index}`} style={styles.filterChip}>
            <SkeletonLoader
              width={60}
              height={32}
              borderRadius={16}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />
          </View>
        ))}
      </View>

      {/* Section Title */}
      <View style={styles.sectionHeader}>
        <SkeletonLoader
          width={120}
          height={20}
          borderRadius={4}
          backgroundColor={colors.skeleton.base}
          shimmerColor={colors.skeleton.highlight}
        />
      </View>

      {/* Product Grid - 2 Columns */}
      <View style={styles.gridContainer}>
        {/* Left Column */}
        <View style={styles.column}>
          {[1, 2, 3].map(index => (
            <View key={`left-product-${index}`} style={styles.productCard}>
              {/* Product Image */}
              <SkeletonLoader
                width="100%"
                height={PRODUCT_IMAGE_HEIGHT}
                borderRadius={12}
                backgroundColor={colors.skeleton.base}
                shimmerColor={colors.skeleton.highlight}
              />
              
              {/* Product Info */}
              <View style={styles.productInfo}>
                <SkeletonLoader
                  width="100%"
                  height={14}
                  borderRadius={4}
                  backgroundColor={colors.skeleton.base}
                  shimmerColor={colors.skeleton.highlight}
                />
                <View style={styles.productInfoSpacer} />
                <SkeletonLoader
                  width="70%"
                  height={14}
                  borderRadius={4}
                  backgroundColor={colors.skeleton.base}
                  shimmerColor={colors.skeleton.highlight}
                />
                <View style={styles.productInfoSpacer} />
                <View style={styles.priceRow}>
                  <SkeletonLoader
                    width={60}
                    height={18}
                    borderRadius={4}
                    backgroundColor={colors.skeleton.base}
                    shimmerColor={colors.skeleton.highlight}
                  />
                  <SkeletonLoader
                    width={50}
                    height={28}
                    borderRadius={14}
                    backgroundColor={colors.skeleton.base}
                    shimmerColor={colors.skeleton.highlight}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Right Column */}
        <View style={styles.column}>
          {[1, 2, 3].map(index => (
            <View key={`right-product-${index}`} style={styles.productCard}>
              {/* Product Image */}
              <SkeletonLoader
                width="100%"
                height={PRODUCT_IMAGE_HEIGHT}
                borderRadius={12}
                backgroundColor={colors.skeleton.base}
                shimmerColor={colors.skeleton.highlight}
              />
              
              {/* Product Info */}
              <View style={styles.productInfo}>
                <SkeletonLoader
                  width="100%"
                  height={14}
                  borderRadius={4}
                  backgroundColor={colors.skeleton.base}
                  shimmerColor={colors.skeleton.highlight}
                />
                <View style={styles.productInfoSpacer} />
                <SkeletonLoader
                  width="70%"
                  height={14}
                  borderRadius={4}
                  backgroundColor={colors.skeleton.base}
                  shimmerColor={colors.skeleton.highlight}
                />
                <View style={styles.productInfoSpacer} />
                <View style={styles.priceRow}>
                  <SkeletonLoader
                    width={60}
                    height={18}
                    borderRadius={4}
                    backgroundColor={colors.skeleton.base}
                    shimmerColor={colors.skeleton.highlight}
                  />
                  <SkeletonLoader
                    width={50}
                    height={28}
                    borderRadius={14}
                    backgroundColor={colors.skeleton.base}
                    shimmerColor={colors.skeleton.highlight}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Bottom Padding */}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchContainer: {
    marginBottom: 16,
  },
  filtersContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    maxWidth: CARD_WIDTH,
  },
  productCard: {
    marginBottom: GRID_GAP,
  },
  productInfo: {
    marginTop: 8,
  },
  productInfoSpacer: {
    height: 6,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomPadding: {
    height: 20,
  },
});

export default ShopScreenShimmer;

