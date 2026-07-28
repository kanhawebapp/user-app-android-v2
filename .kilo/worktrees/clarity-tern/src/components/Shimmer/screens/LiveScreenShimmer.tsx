/**
 * LiveScreenShimmer Component
 * Layout-based shimmer loader for LiveScreen
 * Matches: Live streaming grid layout
 */

import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useTheme } from '../../../theme';
import { SkeletonLoader } from '../../SkeletonLoader';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - 32 - GRID_GAP) / 2;
const LIVE_CARD_HEIGHT = 220;

export const LiveScreenShimmer: React.FC = () => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.headerContainer}>
        <SkeletonLoader
          width={100}
          height={24}
          borderRadius={4}
          backgroundColor={colors.skeleton.base}
          shimmerColor={colors.skeleton.highlight}
        />
      </View>

      {/* Featured Live Card */}
      <View style={styles.featuredContainer}>
        <SkeletonLoader
          width="100%"
          height={180}
          borderRadius={12}
          backgroundColor={colors.skeleton.base}
          shimmerColor={colors.skeleton.highlight}
        />
      </View>

      {/* Section Title - Top Astrologers */}
      <View style={styles.sectionHeader}>
        <SkeletonLoader
          width={140}
          height={20}
          borderRadius={4}
          backgroundColor={colors.skeleton.base}
          shimmerColor={colors.skeleton.highlight}
        />
      </View>

      {/* Horizontal Scroll - Top Astrologers */}
      <View style={styles.horizontalScroll}>
        {[1, 2, 3, 4].map(index => (
          <View key={`top-astro-${index}`} style={styles.topAstroCard}>
            <SkeletonLoader
              width={80}
              height={80}
              borderRadius={40}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />
            <View style={styles.topAstroSpacer} />
            <SkeletonLoader
              width={60}
              height={12}
              borderRadius={4}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />
          </View>
        ))}
      </View>

      {/* Section Title - Live Now */}
      <View style={styles.sectionHeader}>
        <SkeletonLoader
          width={100}
          height={20}
          borderRadius={4}
          backgroundColor={colors.skeleton.base}
          shimmerColor={colors.skeleton.highlight}
        />
      </View>

      {/* Live Grid */}
      <View style={styles.gridContainer}>
        {/* Left Column */}
        <View style={styles.column}>
          {[1, 2].map(index => (
            <View key={`live-card-left-${index}`} style={styles.liveCard}>
              <SkeletonLoader
                width="100%"
                height={LIVE_CARD_HEIGHT}
                borderRadius={12}
                backgroundColor={colors.skeleton.base}
                shimmerColor={colors.skeleton.highlight}
              />
              <View style={styles.liveCardOverlay}>
                <SkeletonLoader
                  width={50}
                  height={20}
                  borderRadius={10}
                  backgroundColor={colors.skeleton.base}
                  shimmerColor={colors.skeleton.highlight}
                />
              </View>
              <View style={styles.liveCardInfo}>
                <SkeletonLoader
                  width={60}
                  height={12}
                  borderRadius={4}
                  backgroundColor={colors.skeleton.base}
                  shimmerColor={colors.skeleton.highlight}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Right Column */}
        <View style={styles.column}>
          {[1, 2].map(index => (
            <View key={`live-card-right-${index}`} style={styles.liveCard}>
              <SkeletonLoader
                width="100%"
                height={LIVE_CARD_HEIGHT}
                borderRadius={12}
                backgroundColor={colors.skeleton.base}
                shimmerColor={colors.skeleton.highlight}
              />
              <View style={styles.liveCardOverlay}>
                <SkeletonLoader
                  width={50}
                  height={20}
                  borderRadius={10}
                  backgroundColor={colors.skeleton.base}
                  shimmerColor={colors.skeleton.highlight}
                />
              </View>
              <View style={styles.liveCardInfo}>
                <SkeletonLoader
                  width={60}
                  height={12}
                  borderRadius={4}
                  backgroundColor={colors.skeleton.base}
                  shimmerColor={colors.skeleton.highlight}
                />
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
  headerContainer: {
    marginBottom: 16,
  },
  featuredContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  horizontalScroll: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  topAstroCard: {
    alignItems: 'center',
    marginRight: 16,
  },
  topAstroSpacer: {
    height: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    maxWidth: CARD_WIDTH,
  },
  liveCard: {
    marginBottom: GRID_GAP,
    position: 'relative',
  },
  liveCardOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  liveCardInfo: {
    position: 'absolute',
    bottom: 8,
    left: 8,
  },
  bottomPadding: {
    height: 20,
  },
});

export default LiveScreenShimmer;

