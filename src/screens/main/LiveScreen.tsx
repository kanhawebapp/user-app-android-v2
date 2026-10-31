import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Dimensions,
  RefreshControl,
  Image,
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { Text } from '../../components/Text';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { LoginRequiredModal } from '../../components/Modal';
import { LiveScreenShimmer } from '../../components/Shimmer';
import { useAuthStore } from '../../stores';
import { useToast } from '../../context/ToastContext';
import { API_BASE_URL } from '../../constants/api.constants';
import { DATE_FORMATS } from '../../constants/app.constants';
import { formatDate } from '../../utils/helpers';
import { useUpcomingLives } from '../../services/api/liveSessions/useUpcomingLives';
import {
  getLiveJoinRtcError,
  joinLive,
} from '../../services/api/liveSessions/live-sessions.api';
import type {
  LiveJoinResponse,
  UpcomingLive,
  UpcomingLiveStatus,
} from '../../services/api/liveSessions/live-sessions.types';

export interface FilterOption {
  key: 'all' | 'live' | 'upcoming';
  label: string;
  icon?: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;
const LOAD_MORE_THRESHOLD = 200;

const FILTER_OPTIONS: FilterOption[] = [
  { key: 'all', label: 'All' },
  { key: 'live', label: 'Live', icon: 'radio-button-checked' },
  { key: 'upcoming', label: 'Upcoming', icon: 'schedule' },
];

const FILTER_STATUS: Record<
  Exclude<FilterOption['key'], 'all'>,
  UpcomingLiveStatus
> = {
  live: 'LIVE',
  upcoming: 'SCHEDULED',
};

const getProfilePicUrl = (profilePic?: string | null): string | null => {
  if (!profilePic) {
    return null;
  }
  if (profilePic.startsWith('http')) {
    return profilePic;
  }
  return `${API_BASE_URL.DEVELOPMENT}${profilePic.replace(/^\/+/, '')}`;
};

const formatScheduledAt = (scheduledAt?: string | null): string => {
  if (!scheduledAt) {
    return '';
  }
  const timestamp = Number(scheduledAt);
  const date = Number.isFinite(timestamp)
    ? new Date(timestamp)
    : new Date(scheduledAt);
  return isNaN(date.getTime())
    ? ''
    : formatDate(date, DATE_FORMATS.DISPLAY_DATE_TIME);
};

const getAstrologerName = (session: UpcomingLive): string =>
  session.astrologer?.displayName?.trim() ||
  session.astrologer?.name?.trim() ||
  '';

interface LiveScreenProps {
  onNavigateToLogin?: () => void;
  onNavigateToSignup?: () => void;
  onJoinLive?: (joinData: LiveJoinResponse, session: UpcomingLive) => void;
}

const LiveScreen: React.FC<LiveScreenProps> = ({
  onNavigateToLogin,
  onNavigateToSignup,
  onJoinLive,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<'all' | 'live' | 'upcoming'>(
    'all',
  );
  const {
    data: liveSessions,
    loading,
    refreshing,
    loadingMore,
    error,
    refresh,
    retry,
    loadMore,
  } = useUpcomingLives();
  const [failedAvatarIds, setFailedAvatarIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [joiningSessionId, setJoiningSessionId] = useState<string | null>(null);
  const joiningRef = useRef(false);
  const { showError } = useToast();

  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalMessage, setModalMessage] = useState(
    'Please login to perform this action',
  );

  const liveSessionsOnly = useMemo(
    () => liveSessions.filter(s => s.status === 'LIVE'),
    [liveSessions],
  );

  const scheduledSessionsCount = useMemo(
    () => liveSessions.filter(s => s.status === 'SCHEDULED').length,
    [liveSessions],
  );

  const filteredSessions = useMemo(() => {
    if (activeFilter === 'all') {
      return liveSessions;
    }
    return liveSessions.filter(s => s.status === FILTER_STATUS[activeFilter]);
  }, [liveSessions, activeFilter]);

  const onRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  const handleScroll = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
      if (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - LOAD_MORE_THRESHOLD
      ) {
        loadMore();
      }
    },
    [loadMore],
  );

  const handleAvatarError = useCallback((sessionId: string) => {
    setFailedAvatarIds(prev => new Set(prev).add(sessionId));
  }, []);

  const handleRestrictedAction = useCallback(
    (actionMessage: string, callback?: () => void) => {
      if (isAuthenticated) {
        callback?.();
        return;
      }
      setModalMessage(actionMessage);
      setShowLoginModal(true);
    },
    [isAuthenticated],
  );

  const handleJoinLive = useCallback(
    async (session: UpcomingLive) => {
      if (joiningRef.current) {
        return;
      }
      if (!session.channelName) {
        showError('This live session is not available right now.');
        return;
      }

      joiningRef.current = true;
      setJoiningSessionId(session.id);
      try {
        const joinData = await joinLive(session.channelName);
        const rtcError = getLiveJoinRtcError(joinData, session.channelName);
        if (rtcError) {
          showError(rtcError);
          return;
        }
        onJoinLive?.(joinData, session);
      } catch (err: any) {
        showError(
          err?.message || 'Unable to join the live session. Please try again.',
        );
      } finally {
        joiningRef.current = false;
        setJoiningSessionId(null);
      }
    },
    [onJoinLive, showError],
  );

  const handleJoinOrReminderPress = useCallback(
    (session: UpcomingLive) => {
      if (session.status === 'LIVE') {
        handleRestrictedAction('Please login to join live sessions', () =>
          handleJoinLive(session),
        );
      } else {
        handleRestrictedAction(
          'Please login to set reminders for upcoming sessions',
        );
      }
    },
    [handleRestrictedAction, handleJoinLive],
  );

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

  const renderFilterButton = (filter: FilterOption) => {
    const isActive = activeFilter === filter.key;
    return (
      <TouchableOpacity
        key={filter.key}
        style={[
          styles.filterButton,
          {
            backgroundColor: isActive
              ? colors.primary.main
              : colors.background.secondary,
          },
        ]}
        onPress={() => setActiveFilter(filter.key)}>
        {filter.icon && (
          <Icon
            name={filter.icon}
            size={16}
            color={
              isActive ? colors.primary.contrastText : colors.text.secondary
            }
            library="MaterialIcons"
          />
        )}
        <Text
          variant="label"
          weight="medium"
          style={{
            color: isActive
              ? colors.primary.contrastText
              : colors.text.secondary,
            marginLeft: filter.icon ? 6 : 0,
          }}>
          {filter.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderLiveBadge = () => (
    <View
      style={[styles.liveBadgeContainer, { backgroundColor: colors.error.main }]}>
      <View style={styles.liveDot} />
      <Text
        variant="captionSmall"
        weight="bold"
        style={{ color: colors.common.white }}>
        LIVE
      </Text>
    </View>
  );

  const renderUpcomingBadge = () => (
    <View
      style={[
        styles.liveBadgeContainer,
        { backgroundColor: colors.primary.main },
      ]}>
      <Icon
        name="schedule"
        size={12}
        color={colors.common.white}
        library="MaterialIcons"
      />
      <Text
        variant="captionSmall"
        weight="bold"
        style={{ color: colors.common.white, marginLeft: 4 }}>
        UPCOMING
      </Text>
    </View>
  );

  const renderRating = (rating?: number | null) => (
    <View style={styles.ratingContainer}>
      <Icon
        name="star"
        size={12}
        color={colors.warning.main}
        library="MaterialIcons"
      />
      <Text
        variant="captionSmall"
        weight="medium"
        style={{ color: colors.text.secondary }}>
        {(rating ?? 0).toFixed(1)}
      </Text>
    </View>
  );

  const renderSessionCard = (session: UpcomingLive) => {
    const isLive = session.status === 'LIVE';
    const profilePicUrl = failedAvatarIds.has(session.id)
      ? null
      : getProfilePicUrl(session.astrologer?.profilePic);

    return (
      <Card key={session.id} style={styles.sessionCard} variant="elevated">
        <View
          style={[
            styles.thumbnail,
            { backgroundColor: colors.background.tertiary },
          ]}>
          {profilePicUrl ? (
            <Image
              source={{ uri: profilePicUrl }}
              style={styles.thumbnailImage}
              resizeMode="cover"
              onError={() => handleAvatarError(session.id)}
            />
          ) : (
            <Icon
              name="person"
              size={40}
              color={colors.text.secondary}
              library="MaterialIcons"
            />
          )}
          {isLive && renderLiveBadge()}
          {session.status === 'SCHEDULED' && renderUpcomingBadge()}
        </View>
        <View style={styles.sessionInfo}>
          <Text variant="subtitle" weight="semibold" numberOfLines={2}>
            {session.title}
          </Text>
          <View style={styles.astrologerRow}>
            <View
              style={[
                styles.smallAvatar,
                { backgroundColor: colors.background.secondary },
              ]}>
              {profilePicUrl ? (
                <Image
                  source={{ uri: profilePicUrl }}
                  style={styles.smallAvatarImage}
                  onError={() => handleAvatarError(session.id)}
                />
              ) : (
                <Icon
                  name="person"
                  size={12}
                  color={colors.text.secondary}
                  library="MaterialIcons"
                />
              )}
            </View>
            <Text
              variant="captionSmall"
              style={{ color: colors.text.secondary, flex: 1, marginLeft: 4 }}
              numberOfLines={1}>
              {getAstrologerName(session)}
            </Text>
            {renderRating(session.astrologer?.rating)}
          </View>
          <View style={styles.sessionMeta}>
            <View style={[styles.metaItem, styles.shrink]}>
              <Icon
                name="schedule"
                size={12}
                color={colors.text.tertiary}
                library="MaterialIcons"
              />
              <Text
                variant="captionSmall"
                style={[
                  styles.shrink,
                  { color: colors.text.tertiary, marginLeft: 4 },
                ]}
                numberOfLines={1}>
                {formatScheduledAt(session.scheduledAt)}
              </Text>
            </View>
          </View>
          {isLive && (
            <Button
              title="Join Now"
              variant="primary"
              size="small"
              style={{ marginTop: 8 }}
              loading={joiningSessionId === session.id}
              disabled={joiningSessionId === session.id}
              onPress={() => handleJoinOrReminderPress(session)}
            />
          )}
        </View>
      </Card>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTextContainer}>
        <Text variant="h5" weight="bold">
          Live Sessions
        </Text>
        <Text
          variant="bodySmall"
          style={{ color: colors.text.secondary, marginTop: 4 }}>
          Watch expert astrologers live
        </Text>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text variant="h6" weight="bold" style={{ color: colors.primary.main }}>
            {liveSessionsOnly.length}
          </Text>
          <Text variant="caption" style={{ color: colors.text.secondary }}>
            Live Now
          </Text>
        </View>
        <View
          style={[styles.statDivider, { backgroundColor: colors.border.light }]}
        />
        <View style={styles.statItem}>
          <Text variant="h6" weight="bold" style={{ color: colors.primary.main }}>
            {scheduledSessionsCount}
          </Text>
          <Text variant="caption" style={{ color: colors.text.secondary }}>
            Upcoming
          </Text>
        </View>
      </View>
    </View>
  );

  const renderFilterSection = () => (
    <View style={styles.filterSection}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}>
        {FILTER_OPTIONS.map(renderFilterButton)}
      </ScrollView>
    </View>
  );

  const renderEmptyState = () =>
    error && liveSessions.length === 0 ? (
      <View style={styles.emptyContainer}>
        <Icon
          name="error-outline"
          size={64}
          color={colors.icon.tertiary}
          library="MaterialIcons"
        />
        <Text
          variant="body"
          style={{ color: colors.text.secondary, marginTop: 16 }}>
          Unable to load sessions
        </Text>
        <Text
          variant="caption"
          style={{ color: colors.text.tertiary, marginTop: 4 }}>
          Please check your connection and try again
        </Text>
        <Button
          title="Retry"
          variant="outline"
          size="small"
          style={{ marginTop: 16 }}
          onPress={retry}
        />
      </View>
    ) : (
      <View style={styles.emptyContainer}>
        <Icon
          name="live-tv"
          size={64}
          color={colors.icon.tertiary}
          library="MaterialIcons"
        />
        <Text
          variant="body"
          style={{ color: colors.text.secondary, marginTop: 16 }}>
          No sessions available
        </Text>
        <Text
          variant="caption"
          style={{ color: colors.text.tertiary, marginTop: 4 }}>
          Check back later for new sessions
        </Text>
      </View>
    );

  const renderSessionsList = () => (
    <FlatList
      data={filteredSessions}
      renderItem={({ item }) => renderSessionCard(item)}
      keyExtractor={item => item.id}
      numColumns={2}
      contentContainerStyle={[
        styles.listContent,
        { paddingBottom: insets.bottom + 100 },
      ]}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={styles.row}
      ListHeaderComponent={
        filteredSessions.length > 0 ? (
          <Text variant="label" weight="medium" style={styles.listHeader}>
            {activeFilter === 'all'
              ? 'All Sessions'
              : activeFilter === 'live'
                ? 'Live Now'
                : 'Upcoming Sessions'}
          </Text>
        ) : null
      }
      ListEmptyComponent={renderEmptyState()}
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator
            style={styles.footerLoader}
            color={colors.primary.main}
          />
        ) : null
      }
    />
  );

  if (loading && liveSessions.length === 0) {
    return <LiveScreenShimmer />;
  }

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background.primary}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary.main}
            colors={[colors.primary.main]}
          />
        }>
        {renderHeader()}
        {renderFilterSection()}
        {renderSessionsList()}
      </ScrollView>
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
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTextContainer: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(98, 0, 238, 0.05)',
    borderRadius: 12,
    padding: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    marginVertical: 4,
  },
  filterSection: {
    marginVertical: 8,
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  liveBadgeContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginRight: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  listHeader: {
    marginBottom: 12,
  },
  row: {
    justifyContent: 'space-between',
  },
  sessionCard: {
    width: CARD_WIDTH,
    padding: 12,
    marginBottom: 12,
  },
  thumbnail: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
    thumbnailImage: {
      width: '100%',
      height: '100%',
      borderRadius: 8,
    },
    sessionInfo: {
    flex: 1,
  },
  astrologerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  smallAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallAvatarImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  sessionMeta: {
    flexDirection: 'row',
    marginTop: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  shrink: {
    flexShrink: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    paddingBottom: 40,
  },
  footerLoader: {
    paddingVertical: 16,
  },
});

export default LiveScreen;




// import React from 'react';
// import {View, StyleSheet, StatusBar} from 'react-native';
// import {useTheme} from '../../theme';
// import {Text} from '../../components/Text';

// interface LiveScreenProps {
//   onNavigateToLogin?: () => void;
//   onNavigateToSignup?: () => void;
// }

// const LiveScreen: React.FC<LiveScreenProps> = () => {
//   const theme = useTheme();
//   const colors = theme.colors;

//   return (
//     <View
//       style={[
//         styles.container,
//         {backgroundColor: colors.background.primary},
//       ]}>
//       <StatusBar
//         barStyle={theme.isDark ? 'light-content' : 'dark-content'}
//         backgroundColor={colors.background.primary}
//       />

//       <View style={styles.content}>
//         <Text variant="h4" weight="bold" style={styles.title}>
//           Coming Soon
//         </Text>

//         <Text
//           variant="body"
//           style={[
//             styles.subtitle,
//             {color: colors.text.secondary},
//           ]}>
//           Live Sessions are coming soon.
//         </Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   content: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 24,
//   },
//   title: {
//     textAlign: 'center',
//   },
//   subtitle: {
//     marginTop: 8,
//     textAlign: 'center',
//   },
// });

// export default LiveScreen;
