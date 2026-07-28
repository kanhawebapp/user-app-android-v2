import React from 'react';
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

interface MyFollowingScreenProps {
  onNavigateBack?: () => void;
}

const MyFollowingScreen: React.FC<MyFollowingScreenProps> = ({ onNavigateBack }) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  const followedAstrologers = [
    { 
      id: '1', 
      name: 'Astrologer Rahul Sharma', 
      expertise: 'Vedic Astrology, Numerology',
      experience: 15,
      rating: 4.8,
      languages: ['Hindi', 'English'],
      isOnline: true,
      hourlyRate: 500,
    },
    { 
      id: '2', 
      name: 'Astrologer Priya Singh', 
      expertise: 'Career Astrology, Tarot',
      experience: 10,
      rating: 4.9,
      languages: ['Hindi', 'English', 'Bengali'],
      isOnline: false,
      hourlyRate: 400,
    },
    { 
      id: '3', 
      name: 'Astrologer Amit Kumar', 
      expertise: 'Palmistry, Vastu',
      experience: 20,
      rating: 4.7,
      languages: ['Hindi', 'English'],
      isOnline: true,
      hourlyRate: 600,
    },
    { 
      id: '4', 
      name: 'Astrologer Sneha Verma', 
      expertise: 'Love Astrology, KP Astrology',
      experience: 8,
      rating: 4.6,
      languages: ['Hindi', 'English', 'Marathi'],
      isOnline: true,
      hourlyRate: 350,
    },
    { 
      id: '5', 
      name: 'Astrologer Vikram Patel', 
      expertise: 'Transit Astrology, Horoscope',
      experience: 12,
      rating: 4.5,
      languages: ['Hindi', 'English', 'Gujarati'],
      isOnline: false,
      hourlyRate: 450,
    },
  ];

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
          My Following
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Following Count */}
        <View style={styles.countContainer}>
          <Text variant="body" style={{ color: colors.text.secondary }}>
            You are following <Text variant="body" weight="bold" style={{ color: colors.primary.main }}>{followedAstrologers.length}</Text> astrologers
          </Text>
        </View>

        {/* Astrologer List */}
        {followedAstrologers.map((astrologer) => (
          <Card key={astrologer.id} style={styles.astrologerCard}>
            <View style={styles.astrologerHeader}>
              <View style={styles.avatarContainer}>
                <View style={[styles.avatar, { backgroundColor: colors.primary.light + '30' }]}>
                  <Icon name="person" size={32} color={colors.primary.main} library="MaterialIcons" />
                </View>
                <View style={[
                  styles.onlineIndicator, 
                  { backgroundColor: astrologer.isOnline ? colors.success.main : colors.text.disabled }
                ]} />
              </View>
              
              <View style={styles.astrologerInfo}>
                <Text variant="body" weight="semibold" style={{ color: colors.text.primary }}>
                  {astrologer.name}
                </Text>
                <Text variant="captionSmall" style={{ color: colors.text.secondary, marginTop: 2 }}>
                  {astrologer.expertise}
                </Text>
                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Icon name="star" size={14} color={colors.common.yellow[500]} library="MaterialIcons" />
                    <Text variant="captionSmall" style={{ color: colors.text.secondary, marginLeft: 2 }}>{astrologer.rating}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Icon name="work-outline" size={14} color={colors.text.secondary} library="MaterialIcons" />
                    <Text variant="captionSmall" style={{ color: colors.text.secondary, marginLeft: 2 }}>{astrologer.experience} yrs</Text>
                  </View>
                </View>
              </View>
              
              <TouchableOpacity style={styles.moreButton}>
                <Icon name="more-vert" size={22} color={colors.icon.secondary} library="MaterialIcons" />
              </TouchableOpacity>
            </View>
            
            <View style={[styles.actionRow, { borderTopColor: colors.border.light }]}>
              <View style={styles.languageContainer}>
                <Icon name="language" size={14} color={colors.text.tertiary} library="MaterialIcons" />
                <Text variant="captionSmall" style={{ color: colors.text.tertiary, marginLeft: 4 }}>
                  {astrologer.languages.join(', ')}
                </Text>
              </View>
              <View style={styles.actionButtons}>
                <Button
                  title="Chat"
                  variant="primary"
                  size="small"
                  onPress={() => {}}
                  style={{ marginRight: 8 }}
                />
                <Button
                  title="Call"
                  variant="outline"
                  size="small"
                  onPress={() => {}}
                />
              </View>
            </View>
          </Card>
        ))}
        
        {followedAstrologers.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="favorite-border" size={64} color={colors.icon.tertiary} library="MaterialIcons" />
            <Text variant="h6" weight="semibold" style={{ color: colors.text.secondary, marginTop: 16 }}>
              No Following Yet
            </Text>
            <Text variant="body" style={{ color: colors.text.tertiary, marginTop: 8, textAlign: 'center' }}>
              Start following astrologers to see them here
            </Text>
            <Button
              title="Explore Astrologers"
              variant="primary"
              size="medium"
              onPress={() => {}}
              style={{ marginTop: 20 }}
            />
          </View>
        )}
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
  countContainer: {
    marginBottom: 16,
  },
  astrologerCard: {
    padding: 16,
    marginBottom: 12,
  },
  astrologerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: 'white',
  },
  astrologerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  moreButton: {
    padding: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
});

export default MyFollowingScreen;

