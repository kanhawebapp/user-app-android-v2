/**
 * Skeleton placeholders used while the Kundli tab data is loading. Each one
 * mirrors the layout of its real card so the transition to data is seamless.
 */

import React from 'react';
import {StyleSheet, View} from 'react-native';

import {Card} from '../../../components/Card/Card';
import {SkeletonLoader} from '../../../components/SkeletonLoader';

/** A set of label/value rows used inside skeleton cards. */
export const InfoRowsSkeleton: React.FC<{rows?: number}> = ({rows = 4}) => (
  <View style={styles.rows}>
    {Array.from({length: rows}).map((_, index) => (
      <View key={index} style={styles.row}>
        <SkeletonLoader width="35%" height={10} />
        <SkeletonLoader width="45%" height={10} />
      </View>
    ))}
  </View>
);

/** Card skeleton for the Basic tab info cards. */
export const InfoCardSkeleton: React.FC<{rows?: number}> = ({rows = 4}) => (
  <Card variant="elevated" style={styles.skeletonCard}>
    <SkeletonLoader width="40%" height={14} style={styles.titleBar} />
    <InfoRowsSkeleton rows={rows} />
  </Card>
);

/** Card skeleton for a planet position card. */
export const PlanetCardSkeleton: React.FC = () => (
  <Card variant="elevated" style={styles.skeletonCard}>
    <View style={styles.header}>
      <SkeletonLoader width={34} height={34} borderRadius={17} />
      <SkeletonLoader width={80} height={14} style={styles.headerTitle} />
      <SkeletonLoader width={64} height={20} borderRadius={10} />
    </View>
    <InfoRowsSkeleton rows={5} />
  </Card>
);

/** Card skeleton for a Vimshottari dasha card. */
export const DashaCardSkeleton: React.FC = () => (
  <Card variant="elevated" style={styles.skeletonCard}>
    <View style={styles.header}>
      <SkeletonLoader width={34} height={34} borderRadius={17} />
      <SkeletonLoader width={110} height={14} style={styles.headerTitle} />
    </View>
    <InfoRowsSkeleton rows={3} />
  </Card>
);

/** Tall block skeleton for a chart card body. */
export const ChartSkeletonBlock: React.FC = () => (
  <SkeletonLoader height={220} borderRadius={12} />
);

/** Skeleton lines for a paragraph block (used by the report skeletons). */
export const ParagraphBlockSkeleton: React.FC<{lines?: number}> = ({
  lines = 4,
}) => (
  <View>
    {Array.from({length: lines}).map((_, index) => (
      <SkeletonLoader
        key={index}
        width={index === lines - 1 ? '70%' : '100%'}
        height={12}
        style={styles.paragraphLine}
      />
    ))}
  </View>
);

/** Card skeleton for a General Life Prediction section card. */
export const LifePredictionCardSkeleton: React.FC = () => (
  <Card variant="elevated" style={styles.skeletonCard}>
    <SkeletonLoader width="40%" height={14} style={styles.titleBar} />
    <ParagraphBlockSkeleton lines={4} />
  </Card>
);

const styles = StyleSheet.create({
  skeletonCard: {
    marginBottom: 12,
  },
  titleBar: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    flex: 1,
    marginLeft: 12,
  },
  rows: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  paragraphLine: {
    marginBottom: 10,
  },
});
