/**
 * RemediesScreenShimmer Component
 * Layout-based shimmer loader for RemediesScreen
 * Matches: Category cards + Remedy list
 */

import React from 'react';
import {View, StyleSheet, ScrollView, Dimensions} from 'react-native';
import {useTheme} from '../../../theme';
import {SkeletonLoader} from '../../SkeletonLoader';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const GRID_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - 32 - GRID_GAP) / 2;
const REMEDY_CARD_HEIGHT = 100;

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
          width={140}
          height={24}
          borderRadius={4}
          backgroundColor={colors.skeleton.base}
          shimmerColor={colors.skeleton.highlight}
        />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SkeletonLoader
          width="100%"
          height={44}
          borderRadius={22}
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

      {/* Category Cards - Horizontal */}
      <View style={styles.categoriesContainer}>
        {[1, 2, 3, 4, 5].map(index => (
          <View key={`category-${index}`} style={styles.categoryCard}>
            <SkeletonLoader
              width={60}
              height={60}
              borderRadius={12}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />
            <View style={styles.categorySpacer} />
            <SkeletonLoader
              width={50}
              height={10}
              borderRadius={4}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />
          </View>
        ))}
      </View>

      {/* Popular Remedies Section */}
      <View style={styles.sectionHeader}>
        <SkeletonLoader
          width={160}
          height={20}
          borderRadius={4}
          backgroundColor={colors.skeleton.base}
          shimmerColor={colors.skeleton.highlight}
        />
      </View>

      {/* Remedies List */}
      {[1, 2, 3, 4, 5, 6].map(index => (
        <View key={`remedy-${index}`} style={styles.remedyCardContainer}>
          <View style={styles.remedyCardRow}>
            {/* Icon */}
            <SkeletonLoader
              width={70}
              height={70}
              borderRadius={12}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />

            {/* Content */}
            <View style={styles.remedyCardContent}>
              <SkeletonLoader
                width="80%"
                height={16}
                borderRadius={4}
                backgroundColor={colors.skeleton.base}
                shimmerColor={colors.skeleton.highlight}
              />
              <View style={styles.remedyCardSpacer} />
              <SkeletonLoader
                width="60%"
                height={12}
                borderRadius={4}
                backgroundColor={colors.skeleton.base}
                shimmerColor={colors.skeleton.highlight}
              />
              <View style={styles.remedyCardSpacer} />
              <SkeletonLoader
                width="40%"
                height={12}
                borderRadius={4}
                backgroundColor={colors.skeleton.base}
                shimmerColor={colors.skeleton.highlight}
              />
            </View>
          </View>
        </View>
      ))}

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
  headerContainer: {
    marginBottom: 16,
  },
  searchContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 16,
    width: 70,
  },
  categorySpacer: {
    height: 8,
  },
  remedyCardContainer: {
    marginBottom: 12,
  },
  remedyCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  remedyCardContent: {
    flex: 1,
    marginLeft: 12,
  },
  remedyCardSpacer: {
    height: 6,
  },
  bottomPadding: {
    height: 20,
  },
});

export default RemediesScreenShimmer;
