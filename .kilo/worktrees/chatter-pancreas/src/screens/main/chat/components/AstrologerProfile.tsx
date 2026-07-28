import React from 'react';
import {View, Text, Image, StyleSheet, Animated} from 'react-native';
import {useTheme} from '../../../../theme';
import {Icon} from '../../../../components/Icon';

interface AstrologerProfileProps {
  astrologerName: string;
  astrologerImage?: string;
  astrologerRating?: number;
  astrologerExperience?: string;
  astrologerSkills?: string[];
  heightInterpolate: Animated.AnimatedInterpolation<number>;
}

export const AstrologerProfile: React.FC<AstrologerProfileProps> = ({
  astrologerName,
  astrologerImage,
  astrologerRating = 4.8,
  astrologerExperience = '10+ years',
  astrologerSkills = ['Vedic Astrology', 'Palmistry', 'Numerology'],
  heightInterpolate,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <Animated.View
      style={[styles.expandedProfile, {height: heightInterpolate}]}>
      <View
        style={[
          styles.profileContent,
          {backgroundColor: colors.card.background},
        ]}>
        <View style={styles.profileHeader}>
          {astrologerImage ? (
            <Image
              source={{uri: astrologerImage}}
              style={styles.profileAvatar}
            />
          ) : (
            <View
              style={[
                styles.profileAvatarPlaceholder,
                {backgroundColor: colors.primary.light},
              ]}>
              <Text
                style={[
                  styles.profileAvatarInitial,
                  {color: colors.primary.main},
                ]}>
                {astrologerName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, {color: colors.text.primary}]}>
              {astrologerName}
            </Text>
            <View style={styles.profileStats}>
              <View style={styles.statItem}>
                <Icon name="star" size={14} color={colors.common.yellow[500]} />
                <Text style={[styles.statText, {color: colors.text.secondary}]}>
                  {astrologerRating} Rating
                </Text>
              </View>
              <View
                style={[
                  styles.statDivider,
                  {backgroundColor: colors.border.light},
                ]}
              />
              <View style={styles.statItem}>
                <Icon name="schedule" size={14} color={colors.primary.main} />
                <Text style={[styles.statText, {color: colors.text.secondary}]}>
                  {astrologerExperience}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.skillsContainer}>
          {astrologerSkills.map((skill, index) => (
            <View
              key={index}
              style={[
                styles.skillTag,
                {backgroundColor: colors.primary.light},
              ]}>
              <Text style={[styles.skillText, {color: colors.primary.main}]}>
                {skill}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  expandedProfile: {
    overflow: 'hidden',
  },
  profileContent: {
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileAvatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarInitial: {
    fontSize: 24,
    fontWeight: '600',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    marginLeft: 4,
  },
  statDivider: {
    width: 1,
    height: 12,
    marginHorizontal: 12,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  skillTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  skillText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
