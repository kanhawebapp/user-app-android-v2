import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import type { AstrologerProfileScreenProps } from '../types';
import { colors, useTheme } from '../../../../theme';

type ProfileSectionProps = {
  astrologerData: NonNullable<AstrologerProfileScreenProps['astrologer']>;
  imageUrl: string | null;
  indicatorColor: any;
  status: any;
  isFollowing: boolean;
  onFollowPress: () => void;
};

const formatReviewCount = (count: number): string => {
  if (count >= 1000) {
    const value = count / 1000;
    const formatted =
      value >= 10 ? `${Math.round(value)}k` : `${value.toFixed(1).replace(/\.0$/, '')}k`;
    return formatted;
  }
  return String(count);
};

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  astrologerData,
  imageUrl,
  indicatorColor,
  isFollowing,
  onFollowPress,
}) => {
  const theme = useTheme();
  const themeColors = theme.colors;
  const reviewCount = astrologerData.reviews?.length ?? 0;

  return (
    <View style={styles.profileSection}>
      <View style={styles.avatarContainer}>
        <View
          style={[
            styles.avatar,
            {
              borderColor: themeColors.primary.main,
              shadowColor: themeColors.primary.main,
              elevation: 8,
            },
          ]}>
          {imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          )}
        </View>

        <View
          style={[
            styles.availabilityDot,
            {
              backgroundColor: indicatorColor,
              borderColor: themeColors.common.white,
            },
          ]}
        />
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onFollowPress}
        style={[
          styles.followButton,
          {
            backgroundColor: isFollowing
              ? themeColors.primary.main
              : colors.common.white,
            borderColor: themeColors.primary.main,
          },
        ]}>
        <Text
          style={[
            styles.followButtonText,
            {
              color: isFollowing
                ? themeColors.primary.contrastText
                : themeColors.primary.main,
            },
          ]}>
          {isFollowing ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>

      <Text style={[styles.name, { color: themeColors.text.primary }]}>
        {astrologerData.displayName || astrologerData.name || 'Astrologer'}
      </Text>

      <View style={styles.ratingRow}>
        <Text style={styles.starIcon}>★</Text>
        <Text style={[styles.ratingText, { color: themeColors.text.primary }]}>
          {Number(astrologerData.rating || 0).toFixed(1)}
        </Text>
        <Text style={[styles.reviewText, { color: themeColors.text.secondary }]}>
          ({formatReviewCount(reviewCount)}{' '}
          {reviewCount === 1 ? 'review' : 'reviews'})
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileSection: {
    alignItems: 'center',
    paddingBottom: 12,
    paddingHorizontal: 16,
    marginTop: -10,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    borderWidth: 3,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  availabilityDot: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
  },
  followButton: {
    paddingHorizontal: 20,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    marginBottom: 10,
  },
  followButtonText: {
    fontWeight: '700',
    fontSize: 14,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  starIcon: {
    fontSize: 18,
    marginRight: 4,
    color: '#F59E0B',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
  reviewText: {
    marginLeft: 2,
    fontSize: 13,
  },
});

export default ProfileSection;
