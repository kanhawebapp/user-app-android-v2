/**
 * LiveScreenShimmer Component
 * Layout-based shimmer loader for LiveScreen
 * Matches: Shared Ongoing + Upcoming card dimensions
 */

import React from 'react';
import {View, StyleSheet, Dimensions, ScrollView} from 'react-native';
import {useTheme} from '../../../theme';
import {SkeletonLoader} from '../../SkeletonLoader';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.6, 228);
const THUMBNAIL_HEIGHT = 118;
const CARD_CONTENT_HEIGHT = 72;
const CARD_HEIGHT = THUMBNAIL_HEIGHT + CARD_CONTENT_HEIGHT;

export const LiveScreenShimmer: React.FC = () => {
  const theme = useTheme();
  const colors = theme.colors;

  const renderCardSkeleton = (key: string) => (
    <View key={key} style={styles.sessionCard}>
      <SkeletonLoader
        width="100%"
        height={THUMBNAIL_HEIGHT}
        borderRadius={0}
        backgroundColor={colors.skeleton.base}
        shimmerColor={colors.skeleton.highlight}
      />
      <View style={styles.cardInfo}>
        <SkeletonLoader
          width="75%"
          height={12}
          borderRadius={4}
          backgroundColor={colors.skeleton.base}
          shimmerColor={colors.skeleton.highlight}
        />
        <View style={styles.cardInfoSpacer} />
        <SkeletonLoader
          width="50%"
          height={10}
          borderRadius={4}
          backgroundColor={colors.skeleton.base}
          shimmerColor={colors.skeleton.highlight}
        />
      </View>
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: colors.background.primary}]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      <View style={styles.sectionHeader}>
        <SkeletonLoader
          width={180}
          height={20}
          borderRadius={4}
          backgroundColor={colors.skeleton.base}
          shimmerColor={colors.skeleton.highlight}
        />
      </View>

      <View style={styles.horizontalScroll}>
        {renderCardSkeleton('ongoing-1')}
        {renderCardSkeleton('ongoing-2')}
      </View>

      <View style={[styles.sectionHeader, styles.sectionHeaderSpacing]}>
        <SkeletonLoader
          width={200}
          height={20}
          borderRadius={4}
          backgroundColor={colors.skeleton.base}
          shimmerColor={colors.skeleton.highlight}
        />
      </View>

      <View style={styles.horizontalScroll}>
        {renderCardSkeleton('upcoming-1')}
        {renderCardSkeleton('upcoming-2')}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 14,
    paddingBottom: 24,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionHeaderSpacing: {
    marginTop: 14,
  },
  horizontalScroll: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  sessionCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardInfo: {
    height: CARD_CONTENT_HEIGHT,
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  cardInfoSpacer: {
    height: 8,
  },
});

export default LiveScreenShimmer;
