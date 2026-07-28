import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { Text } from '../../components/Text';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { LoginRequiredModal } from '../../components/Modal';
import { useAuthStore } from '../../stores';

interface LiveScreenProps {
  onNavigateToLogin?: () => void;
  onNavigateToSignup?: () => void;
}

const liveSessions = [
  { id: 1, title: 'Daily Horoscope Live', astrologer: 'Astrologer Rahul', viewers: 1250, status: 'live', thumbnail: null },
  { id: 2, title: 'Tarot Reading Special', astrologer: 'Astrologer Priya', viewers: 890, status: 'live', thumbnail: null },
  { id: 3, title: 'Vastu Shastra Q&A', astrologer: 'Astrologer Sharma', viewers: 650, status: 'upcoming', thumbnail: null },
  { id: 4, title: 'Career Guidance', astrologer: 'Astrologer Verma', viewers: 0, status: 'upcoming', thumbnail: null },
];

const LiveScreen: React.FC<LiveScreenProps> = ({ 
  onNavigateToLogin,
  onNavigateToSignup 
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<'all' | 'live' | 'upcoming'>('all');

  // Get auth state
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Modal state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('Please login to perform this action');

  // Check if user can perform action
  const handleRestrictedAction = useCallback((actionMessage: string, callback?: () => void) => {
    if (isAuthenticated) {
      callback?.();
      return;
    }
    setModalMessage(actionMessage);
    setShowLoginModal(true);
  }, [isAuthenticated]);

  // Action handlers
  const handleJoinOrReminderPress = useCallback((sessionStatus: string) => {
    if (sessionStatus === 'live') {
      handleRestrictedAction('Please login to join live sessions');
    } else {
      handleRestrictedAction('Please login to set reminders for upcoming sessions');
    }
  }, [handleRestrictedAction]);

  // Modal handlers
  const handleCloseModal = useCallback(() => {
    setShowLoginModal(false);
  }, []);

  const handleLoginPress = useCallback(() => {
    setShowLoginModal(false);
    onNavigateToLogin?.();
  }, [onNavigateToLogin]);

  const handleSignupPress = useCallback(() => {
    setShowLoginModal(false);
    onNavigateToSignup?.();
  }, [onNavigateToSignup]);

  const filteredSessions = liveSessions.filter(session => {
    if (activeFilter === 'all') return true;
    return session.status === activeFilter;
  });

  const renderFilterButton = (filter: 'all' | 'live' | 'upcoming', label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        activeFilter === filter && { backgroundColor: colors.primary.main },
      ]}
      onPress={() => setActiveFilter(filter)}
    >
      <Text
        variant="label"
        weight="medium"
        style={{
          color: activeFilter === filter ? colors.primary.contrastText : colors.text.secondary,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderLiveCard = (session: typeof liveSessions[0]) => (
    <Card key={session.id} style={styles.liveCard}>
      <View style={[styles.thumbnail, { backgroundColor: colors.background.secondary }]}>
        {session.status === 'live' && (
          <View style={[styles.liveBadge, { backgroundColor: colors.error.main }]}>
            <View style={styles.liveDot} />
            <Text variant="captionSmall" weight="bold" style={{ color: colors.common.white }}>LIVE</Text>
          </View>
        )}
        {session.status === 'upcoming' && (
          <View style={[styles.upcomingBadge, { backgroundColor: colors.primary.main }]}>
            <Text variant="captionSmall" weight="bold" style={{ color: colors.common.white }}>UPCOMING</Text>
          </View>
        )}
        <View style={styles.viewerCount}>
          <Icon name="visibility" size={14} color={colors.common.white} library="MaterialIcons" />
          <Text variant="captionSmall" style={{ color: colors.common.white, marginLeft: 4 }}>
            {session.status === 'live' ? `${session.viewers}+` : 'Not started'}
          </Text>
        </View>
      </View>
      <View style={styles.sessionInfo}>
        <Text variant="subtitle" weight="semibold" numberOfLines={1}>{session.title}</Text>
        <Text variant="caption" style={{ color: colors.text.secondary, marginTop: 4 }}>
          {session.astrologer}
        </Text>
        <Button
          title={session.status === 'live' ? 'Join Now' : 'Set Reminder'}
          variant={session.status === 'live' ? 'primary' : 'outline'}
          size="small"
          style={{ marginTop: 12 }}
          onPress={() => handleJoinOrReminderPress(session.status)}
        />
      </View>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background.primary}
      />
      
      {/* <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text variant="h5" weight="bold">Live Sessions</Text>
        <Text variant="bodySmall" style={{ color: colors.text.secondary, marginTop: 4 }}>
          Watch live astrology sessions
        </Text>
      </View> */}

      {/* Filters */}
      <View style={styles.filterContainer}>
        {renderFilterButton('all', 'All')}
        {renderFilterButton('live', '🔴 Live Now')}
        {renderFilterButton('upcoming', 'Upcoming')}
      </View>

      {/* Live Sessions Grid */}
      <FlatList
        data={filteredSessions}
        renderItem={({ item }) => renderLiveCard(item)}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={[styles.listContent, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="live-tv" size={64} color={colors.icon.tertiary} library="MaterialIcons" />
            <Text variant="body" style={{ color: colors.text.secondary, marginTop: 16 }}>
              No live sessions available
            </Text>
          </View>
        }
      />

      {/* Login Required Modal */}
      <LoginRequiredModal
        visible={showLoginModal}
        onClose={handleCloseModal}
        onLoginPress={handleLoginPress}
        onSignupPress={handleSignupPress}
        message={modalMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop:10
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: 'transparent',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  liveCard: {
    width: '48%',
    padding: 12,
    marginBottom: 12,
  },
  thumbnail: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  liveBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginRight: 4,
  },
  upcomingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  viewerCount: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionInfo: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
});

export default LiveScreen;

