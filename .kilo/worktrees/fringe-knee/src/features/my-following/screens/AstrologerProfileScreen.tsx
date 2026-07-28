/**
 * Astrologer Profile Screen
 * Displays detailed profile of an astrologer
 */

import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { Text } from '../../components/Text';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

interface AstrologerProfileScreenProps {
  astrologerId: string | null;
  onNavigateBack?: () => void;
  onNavigateToChat?: (astrologerId: string) => void;
  onNavigateToCall?: (astrologerId: string) => void;
}

const AstrologerProfileScreen: React.FC<AstrologerProfileScreenProps> = ({
  astrologerId,
  onNavigateBack,
  onNavigateToChat,
  onNavigateToCall,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  const astrologer = useMemo(() => {
    const data = [
      {
        id: '1',
        name: 'Astrologer Rahul Sharma',
        expertise: 'Vedic Astrology, Numerology',
        experience: 15,
        rating: 4.8,
        totalReviews: 1250,
        languages: ['Hindi', 'English'],
        isOnline: true,
        hourlyRate: 500,
        description:
          'Renowned Vedic astrologer with over 15 years of experience in helping people navigate life challenges through ancient wisdom and modern interpretations.',
        specialization: ['Career', 'Marriage', 'Health', 'Finance'],
        availability: {
          weekdays: '10:00 AM - 8:00 PM',
          weekends: '11:00 AM - 6:00 PM',
        },
      },
      {
        id: '2',
        name: 'Astrologer Priya Singh',
        expertise: 'Career Astrology, Tarot',
        experience: 10,
        rating: 4.9,
        totalReviews: 980,
        languages: ['Hindi', 'English', 'Bengali'],
        isOnline: false,
        hourlyRate: 400,
        description:
          'Expert tarot reader and career astrologer specializing in professional guidance and spiritual growth through card readings.',
        specialization: ['Career', 'Love', 'Education'],
        availability: {
          weekdays: '9:00 AM - 7:00 PM',
          weekends: '10:00 AM - 5:00 PM',
        },
      },
      {
        id: '3',
        name: 'Astrologer Amit Kumar',
        expertise: 'Palmistry, Vastu',
        experience: 20,
        rating: 4.7,
        totalReviews: 2100,
        languages: ['Hindi', 'English'],
        isOnline: true,
        hourlyRate: 600,
        description:
          'Master palmist and Vastu expert with two decades of experience transforming lives through palm reading and space harmonization.',
        specialization: ['Palmistry', 'Vastu', 'Property'],
        availability: {
          weekdays: '11:00 AM - 9:00 PM',
          weekends: 'Closed',
        },
      },
      {
        id: '4',
        name: 'Astrologer Sneha Verma',
        expertise: 'Love Astrology, KP Astrology',
        experience: 8,
        rating: 4.6,
        totalReviews: 750,
        languages: ['Hindi', 'English', 'Marathi'],
        isOnline: true,
        hourlyRate: 350,
        description:
          'Young and dynamic astrologer specializing in love and relationship astrology using Krishnamurti Paddhati (KP) system.',
        specialization: ['Love', 'Marriage', 'Relationships'],
        availability: {
          weekdays: '3:00 PM - 11:00 PM',
          weekends: '4:00 PM - 10:00 PM',
        },
      },
      {
        id: '5',
        name: 'Astrologer Vikram Patel',
        expertise: 'Transit Astrology, Horoscope',
        experience: 12,
        rating: 4.5,
        totalReviews: 1100,
        languages: ['Hindi', 'English', 'Gujarati'],
        isOnline: false,
        hourlyRate: 450,
        description:
          'Experienced transit astrologer providing accurate predictions and horoscope analysis for better life planning.',
        specialization: ['Transit', 'Horoscope', 'Predictions'],
        availability: {
          weekdays: '10:00 AM - 6:00 PM',
          weekends: '10:00 AM - 4:00 PM',
        },
      },
    ];

    return data.find((a) => a.id === astrologerId) || data[0];
  }, [astrologerId]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background.primary}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background.primary, paddingTop: insets.top }]}>
        <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.icon.primary} library="MaterialIcons" />
        </TouchableOpacity>
        <Text variant="h6" weight="semibold" style={{ color: colors.text.primary }}>
          Astrologer Profile
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarRow}>
            <View style={[styles.avatar, { backgroundColor: colors.primary.light + '30' }]}>
              <Icon name="person" size={56} color={colors.primary.main} library="MaterialIcons" />
            </View>
            <View style={[styles.onlineIndicator, { backgroundColor: astrologer.isOnline ? colors.success.main : colors.text.disabled }]} />
          </View>
          <Text variant="h5" weight="bold" style={[styles.name, { color: colors.text.primary, marginTop: 12 }]}>
            {astrologer.name}
          </Text>
          <Text variant="body" style={{ color: colors.text.secondary, marginTop: 4 }}>
            {astrologer.expertise}
          </Text>

          <View style={styles.ratingRow}>
            <Icon name="star" size={18} color={colors.common.yellow[500]} library="MaterialIcons" />
            <Text variant="body" weight="semibold" style={{ color: colors.text.primary, marginLeft: 6 }}>
              {astrologer.rating}
            </Text>
            <Text variant="body" style={{ color: colors.text.secondary, marginLeft: 4 }}>
              ({astrologer.totalReviews} reviews)
            </Text>
            <Text variant="body" style={{ color: colors.text.secondary, marginLeft: 12 }}>
              {astrologer.experience} years exp.
            </Text>
          </View>
        </View>

        {/* Price Card */}
        <Card style={styles.infoCard}>
          <View style={styles.feeRow}>
            <View>
              <Text variant="captionSmall" style={{ color: colors.text.secondary }}>
                Consultation Fee
              </Text>
              <Text variant="h6" weight="bold" style={{ color: colors.primary.main, marginTop: 4 }}>
                ₹{astrologer.hourlyRate}/min
              </Text>
            </View>
            <View style={styles.languageTags}>
              {astrologer.languages.map((lang) => (
                <View
                  key={lang}
                  style={[styles.languageTag, { backgroundColor: colors.primary.light + '20' }]}>
                  <Text variant="captionSmall" style={{ color: colors.primary.main }}>
                    {lang}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Card>

        {/* About */}
        <Card style={styles.infoCard}>
          <Text variant="subtitle" weight="semibold" style={{ color: colors.text.primary }}>
            About
          </Text>
          <Text variant="body" style={{ color: colors.text.secondary, marginTop: 8, lineHeight: 22 }}>
            {astrologer.description}
          </Text>
        </Card>

        {/* Specialization */}
        <Card style={styles.infoCard}>
          <Text variant="subtitle" weight="semibold" style={{ color: colors.text.primary }}>
            Specialization
          </Text>
          <View style={styles.specializationTags}>
            {astrologer.specialization.map((spec) => (
              <View
                key={spec}
                style={[styles.specializationTag, { backgroundColor: colors.primary.light + '20', borderColor: colors.primary.light + '40' }]}>
                <Text variant="captionSmall" weight="medium" style={{ color: colors.primary.main }}>
                  {spec}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Availability */}
        <Card style={styles.infoCard}>
          <Text variant="subtitle" weight="semibold" style={{ color: colors.text.primary }}>
            Availability
          </Text>
          <View style={styles.availabilityRow}>
            <View style={styles.availabilityItem}>
              <Icon name="work" size={18} color={colors.primary.main} library="MaterialIcons" />
              <View style={styles.availabilityText}>
                <Text variant="captionSmall" style={{ color: colors.text.secondary }}>
                  Weekdays
                </Text>
                <Text variant="body" weight="medium" style={{ color: colors.text.primary, marginTop: 2 }}>
                  {astrologer.availability.weekdays}
                </Text>
              </View>
            </View>
            <View style={styles.availabilityItem}>
              <Icon name="weekend" size={18} color={colors.primary.main} library="MaterialIcons" />
              <View style={styles.availabilityText}>
                <Text variant="captionSmall" style={{ color: colors.text.secondary }}>
                  Weekends
                </Text>
                <Text variant="body" weight="medium" style={{ color: colors.text.primary, marginTop: 2 }}>
                  {astrologer.availability.weekends}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="Chat"
            variant="primary"
            size="large"
            onPress={() => onNavigateToChat?.(astrologer.id)}
            style={styles.chatButton}
          />
          <Button
            title="Call"
            variant="outline"
            size="large"
            onPress={() => onNavigateToCall?.(astrologer.id)}
            style={styles.callButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  avatarRow: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    textAlign: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  infoCard: {
    marginTop: 4,
    padding: 16,
  },
  feeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  languageTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  languageTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  specializationTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  specializationTag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  availabilityRow: {
    marginTop: 12,
  },
  availabilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  availabilityText: {
    marginLeft: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 16,
  },
  chatButton: {
    flex: 1,
  },
  callButton: {
    flex: 1,
  },
});

export default AstrologerProfileScreen;
