/**
 * ProfileScreenShimmer Component
 * Layout-based shimmer loader for ProfileScreen
 * Matches: Avatar + Name + Info Cards
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../../theme';
import { SkeletonLoader } from '../../SkeletonLoader';

const AVATAR_SIZE = 100;
const INFO_CARD_HEIGHT = 80;

export const ProfileScreenShimmer: React.FC = () => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header Section */}
      <View style={styles.headerSection}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <SkeletonLoader
            width={AVATAR_SIZE}
            height={AVATAR_SIZE}
            borderRadius={AVATAR_SIZE / 2}
            backgroundColor={colors.skeleton.base}
            shimmerColor={colors.skeleton.highlight}
          />
        </View>

        {/* Name */}
        <View style={styles.nameContainer}>
          <SkeletonLoader
            width={160}
            height={24}
            borderRadius={4}
            backgroundColor={colors.skeleton.base}
            shimmerColor={colors.skeleton.highlight}
          />
        </View>

        {/* Email */}
        <View style={styles.emailContainer}>
          <SkeletonLoader
            width={200}
            height={16}
            borderRadius={4}
            backgroundColor={colors.skeleton.base}
            shimmerColor={colors.skeleton.highlight}
          />
        </View>

        {/* Edit Profile Button */}
        <View style={styles.editButtonContainer}>
          <SkeletonLoader
            width={120}
            height={36}
            borderRadius={18}
            backgroundColor={colors.skeleton.base}
            shimmerColor={colors.skeleton.highlight}
          />
        </View>
      </View>

      {/* Stats Cards Row */}
      <View style={styles.statsRow}>
        {[1, 2, 3, 4].map(index => (
          <View key={`stat-${index}`} style={styles.statCard}>
            <SkeletonLoader
              width={50}
              height={24}
              borderRadius={4}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />
            <View style={styles.statLabelSpacer} />
            <SkeletonLoader
              width={40}
              height={12}
              borderRadius={4}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />
          </View>
        ))}
      </View>

      {/* Info Cards Section */}
      <View style={styles.sectionHeader}>
        <SkeletonLoader
          width={140}
          height={20}
          borderRadius={4}
          backgroundColor={colors.skeleton.base}
          shimmerColor={colors.skeleton.highlight}
        />
      </View>

      {/* Info Cards List */}
      {[1, 2, 3, 4, 5, 6].map(index => (
        <View key={`info-card-${index}`} style={styles.infoCardContainer}>
          <View style={styles.infoCardRow}>
            {/* Icon Placeholder */}
            <SkeletonLoader
              width={40}
              height={40}
              borderRadius={8}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />

            {/* Content */}
            <View style={styles.infoCardContent}>
              <SkeletonLoader
                width="60%"
                height={14}
                borderRadius={4}
                backgroundColor={colors.skeleton.base}
                shimmerColor={colors.skeleton.highlight}
              />
              <View style={styles.infoCardSpacer} />
              <SkeletonLoader
                width="40%"
                height={12}
                borderRadius={4}
                backgroundColor={colors.skeleton.base}
                shimmerColor={colors.skeleton.highlight}
              />
            </View>

            {/* Arrow */}
            <SkeletonLoader
              width={24}
              height={24}
              borderRadius={12}
              backgroundColor={colors.skeleton.base}
              shimmerColor={colors.skeleton.highlight}
            />
          </View>
        </View>
      ))}

      {/* Logout Button */}
      <View style={styles.logoutButtonContainer}>
        <SkeletonLoader
          width="100%"
          height={48}
          borderRadius={24}
          backgroundColor={colors.skeleton.base}
          shimmerColor={colors.skeleton.highlight}
        />
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
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  nameContainer: {
    marginBottom: 8,
  },
  emailContainer: {
    marginBottom: 16,
  },
  editButtonContainer: {},
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  statLabelSpacer: {
    height: 6,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  infoCardContainer: {
    marginBottom: 8,
  },
  infoCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
  },
  infoCardContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoCardSpacer: {
    height: 4,
  },
  logoutButtonContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  bottomPadding: {
    height: 20,
  },
});

export default ProfileScreenShimmer;

