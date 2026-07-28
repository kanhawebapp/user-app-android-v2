/**
 * HomeScreenShimmer Component
 * Layout-based shimmer loader for HomeScreen
 * Matches: Banner + Horizontal Cards + Vertical List
 */

import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useTheme } from '../../../theme';
import { SkeletonLoader } from '../../SkeletonLoader';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CARD_WIDTH = SCREEN_WIDTH - 32;
const HORIZONTAL_CARD_WIDTH = 160;
const HORIZONTAL_CARD_HEIGHT = 200;
const LIST_ITEM_HEIGHT = 80;
const BANNER_HEIGHT = 180;

export const HomeScreenShimmer: React.FC = () => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Banner Section */}
      <View style={styles.bannerContainer}>
        <SkeletonLoader
          width="100%"
          height={BANNER_HEIGHT}
          borderRadius={12}
          backgroundColor={colors.skeleton.base}
          shimmerColor={colors.skeleton.highlight}
        />
      </View>

      {/* Section Title - Quick Actions */}
      <View style={styles.sectionHeader}>
        <SkeletonLoader
          width={140}
          height={20}
          borderRadius={4}
          backgroundColor={colors.skeleton.base}
          shimmerColor={colors.skeleton.highlight}
        />
      </View>

      {/* Horizontal Scroll Cards */}
      <View style={styles.horizontalCardsContainer}>
        {[1, 2, 3].map(index => (
          <View
            key={`horizontal-card-${index}`}
            style={styles.horizontalCardWrapper}
          >
            <SkeletonLoader
              width={HORIZONTAL_CARD_WIDTH}
              height={HORIZONTAL_CARD_HEIGHT}
              borderRadius={12}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />
          </View>
        ))}
      </View>

      {/* Section Title - Astrologers */}
      <View style={styles.sectionHeader}>
        <SkeletonLoader
          width={180}
          height={20}
          borderRadius={4}
          backgroundColor={colors.skeleton.base}
          shimmerColor={colors.skeleton.highlight}
        />
      </View>

      {/* Vertical List Items */}
      {[1, 2, 3, 4, 5].map(index => (
        <View key={`list-item-${index}`} style={styles.listItemContainer}>
          <View style={styles.listItemRow}>
            {/* Avatar */}
            <SkeletonLoader
              width={60}
              height={60}
              borderRadius={30}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />
            
            {/* Content */}
            <View style={styles.listItemContent}>
              <SkeletonLoader
                width="70%"
                height={16}
                borderRadius={4}
                backgroundColor={colors.skeleton.base}
                shimmerColor={colors.skeleton.highlight}
              />
              <View style={styles.listItemSpacer} />
              <SkeletonLoader
                width="50%"
                height={12}
                borderRadius={4}
                backgroundColor={colors.skeleton.base}
                shimmerColor={colors.skeleton.highlight}
              />
              <View style={styles.listItemSpacer} />
              <SkeletonLoader
                width="30%"
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
  bannerContainer: {
    marginBottom: 16,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  horizontalCardsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  horizontalCardWrapper: {
    marginRight: 12,
  },
  listItemContainer: {
    marginBottom: 12,
  },
  listItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemContent: {
    flex: 1,
    marginLeft: 12,
  },
  listItemSpacer: {
    height: 6,
  },
  bottomPadding: {
    height: 20,
  },
});

export default HomeScreenShimmer;

