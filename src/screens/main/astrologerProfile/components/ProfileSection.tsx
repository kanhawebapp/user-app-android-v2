import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import type { AstrologerProfileScreenProps } from '../types';
import images from '../../../../assets/images';
import { useTheme } from '../../../../theme';

type ProfileSectionProps = {
  astrologerData: NonNullable<AstrologerProfileScreenProps['astrologer']>;
  imageUrl: string | null;
  followersCount: any;
  indicatorColor: any;
  status: any

};

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  astrologerData,
  imageUrl,
  followersCount,
  indicatorColor,
  status
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
              // backgroundColor: getAvailabilityColor(),
              borderColor: colors.common.white,
            },
          ]}
        />
      </View>

      <View style={styles.tagsContainer}>
        {!!astrologerData.tags && (
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>✨ {astrologerData.tags}</Text>
          </View>
        )}

        {!!astrologerData.vtags && (
          <View style={[styles.tagBadge, styles.verifiedBadge]}>
            <Text style={[styles.tagText, styles.verifiedText]}>
              ✔ {astrologerData.vtags}
            </Text>
          </View>
        )}
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
          ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
        </Text>
      </View>
      <Text style={[styles.reviewText, { color: colors.text.secondary }]}>Total folowers:- {followersCount}</Text>

      <Text style={[styles.experienceText, { color: colors.text.secondary }]}>
        {astrologerData.experience || 0}+ Years Experience
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  profileSection: {
    alignItems: 'center',
    paddingBottom: 16,
    paddingHorizontal: 16,
    marginTop: -10,
  },
  avatarContainer: {
    position: 'relative',
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
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    // marginBottom: 12,
  },
  tagBadge: {
    backgroundColor: '#FDE68A20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  verifiedBadge: {
    backgroundColor: '#D1FAE520',
  },
  tagText: {
    fontWeight: '700',
    fontSize: 12,
  },
  verifiedText: {
    color: '#10B981',
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    // marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
    marginLeft: 6,
    fontSize: 13,
  },
  experienceText: {
    fontSize: 14,
  },
  statusText: {
    marginTop: 4,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default ProfileSection;
