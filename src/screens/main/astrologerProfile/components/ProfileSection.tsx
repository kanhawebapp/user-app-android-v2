import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import type { AstrologerProfileScreenProps } from '../types';
import { useTheme } from '../../../../theme';

type ProfileSectionProps = {
  astrologerData: NonNullable<AstrologerProfileScreenProps['astrologer']>;
  imageUrl: string | null;
  indicatorColor: any;
  status: any;
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
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const reviewCount = astrologerData.reviews?.length ?? 0;

  return (
    <View style={styles.profileSection}>
      <View style={styles.avatarContainer}>
        <View
          style={[
            styles.avatar,
            {
              borderColor: colors.primary.main,
              shadowColor: colors.primary.main,
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
              borderColor: colors.common.white,
            },
          ]}
        />
      </View>

      <Text style={[styles.name, { color: colors.text.primary }]}>
        {astrologerData.displayName || astrologerData.name || 'Astrologer'}
      </Text>

      <View style={styles.ratingRow}>
        <Text style={styles.starIcon}>★</Text>
        <Text style={[styles.ratingText, { color: colors.text.primary }]}>
          {Number(astrologerData.rating || 0).toFixed(1)}
        </Text>
        <Text style={[styles.reviewText, { color: colors.text.secondary }]}>
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
