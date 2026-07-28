/**
 * RemediesScreenShimmer Component
 * Layout-based shimmer loader for RemediesScreen
 * Matches: Horizontal Category chips + Service cards
 */

import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {useTheme} from '../../../theme';
import {SkeletonLoader} from '../../SkeletonLoader';

export const RemediesScreenShimmer: React.FC = () => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: colors.background.primary}]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <SkeletonLoader
          width={180}
          height={24}
          borderRadius={4}
          backgroundColor={colors.skeleton.base}
          shimmerColor={colors.skeleton.highlight}
        />
      </View>

      {/* Categories Section Title */}
      <View style={styles.sectionHeader}>
        <SkeletonLoader
          width={120}
          height={20}
          borderRadius={4}
          backgroundColor={colors.skeleton.base}
          shimmerColor={colors.skeleton.highlight}
        />
      </View>

      {/* Category Chips - Horizontal */}
      <View style={styles.categoriesList}>
        {[1, 2, 3, 4, 5].map(index => (
          <View key={`category-${index}`} style={styles.categoryChipShimmer}>
            <SkeletonLoader
              width={40}
              height={40}
              borderRadius={20}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />
            <View style={styles.categoryChipSpacer} />
            <SkeletonLoader
              width={60}
              height={10}
              borderRadius={4}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />
          </View>
        ))}
      </View>

      {/* Services Section Title */}
      <View style={styles.sectionHeader}>
        <SkeletonLoader
          width={160}
          height={20}
          borderRadius={4}
          backgroundColor={colors.skeleton.base}
          shimmerColor={colors.skeleton.highlight}
        />
      </View>

      {/* Service Cards */}
      {[1, 2, 3, 4, 5].map(index => (
        <View key={`service-${index}`} style={styles.serviceCardShimmer}>
          <SkeletonLoader
            width="100%"
            height={160}
            borderRadius={16}
            backgroundColor={colors.skeleton.base}
            shimmerColor={colors.skeleton.highlight}
          />

          <View style={styles.serviceCardContent}>
            <SkeletonLoader
              width="70%"
              height={18}
              borderRadius={4}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />

            <View style={styles.serviceCardSpacer} />

            <SkeletonLoader
              width="40%"
              height={12}
              borderRadius={4}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />

            <View style={styles.serviceCardSpacer} />

            <SkeletonLoader
              width="90%"
              height={12}
              borderRadius={4}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />

            <View style={styles.serviceCardSpacer} />

            <View style={styles.serviceCardBottom}>
              <SkeletonLoader
                width={60}
                height={20}
                borderRadius={4}
                backgroundColor={colors.skeleton.base}
                shimmerColor={colors.skeleton.highlight}
              />

              <SkeletonLoader
                width={80}
                height={32}
                borderRadius={12}
                backgroundColor={colors.skeleton.base}
                shimmerColor={colors.skeleton.highlight}
              />
            </View>
          </View>
        </View>
      ))}
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
  headerContainer: {
    marginBottom: 16,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  categoriesList: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  categoryChipShimmer: {
    alignItems: 'center',
    marginRight: 12,
  },
  categoryChipSpacer: {
    height: 8,
  },
  serviceCardShimmer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  serviceCardContent: {
    padding: 14,
  },
  serviceCardSpacer: {
    height: 8,
  },
  serviceCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
});

export default RemediesScreenShimmer;