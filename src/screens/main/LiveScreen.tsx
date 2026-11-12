import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Image,
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { Text } from '../../components/Text';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { LoginRequiredModal } from '../../components/Modal';
import { LiveScreenShimmer } from '../../components/Shimmer';
import { useAuthStore } from '../../stores';
import { useToast } from '../../context/ToastContext';
import { API_BASE_URL } from '../../constants/api.constants';
import { useUpcomingLives } from '../../services/api/liveSessions/useUpcomingLives';
import {
  getLiveJoinRtcError,
  joinLive,
} from '../../services/api/liveSessions/live-sessions.api';
import type {
  LiveJoinResponse,
  UpcomingLive,
} from '../../services/api/liveSessions/live-sessions.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
/** Shared dimensions so LIVE and UPCOMING cards stay identical */
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.6, 228);
const THUMBNAIL_HEIGHT = 118;
const CARD_CONTENT_HEIGHT = 72;
const CARD_HEIGHT = THUMBNAIL_HEIGHT + CARD_CONTENT_HEIGHT;
const LOAD_MORE_THRESHOLD = 200;

const getProfilePicUrl = (profilePic?: string | null): string | null => {
  if (!profilePic) {
    return null;
  }
  if (profilePic.startsWith('http')) {
    return profilePic;
  }
  return `${API_BASE_URL.DEVELOPMENT}${profilePic.replace(/^\/+/, '')}`;
};

const parseScheduledDate = (scheduledAt?: string | null): Date | null => {
  if (!scheduledAt) {
    return null;
  }
  const timestamp = Number(scheduledAt);
  const date = Number.isFinite(timestamp)
    ? new Date(timestamp)
    : new Date(scheduledAt);
  return isNaN(date.getTime()) ? null : date;
};

const formatSessionTiming = (scheduledAt?: string | null): string => {
  const date = parseScheduledDate(scheduledAt);
  if (!date) {
    return '';
  }

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfTarget = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const dayDiff = Math.round(
    (startOfTarget.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24),
  );

  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  const timeLabel = `${String(hour12).padStart(2, '0')}:${minutes} ${ampm}`;

  if (dayDiff === 0) {
    return `Today, ${timeLabel}`;
  }
  if (dayDiff === 1) {
    return `Tomorrow, ${timeLabel}`;
  }

  const month = date.toLocaleString('en-US', { month: 'short' });
  return `${date.getDate()} ${month}, ${timeLabel}`;
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

  const upcomingSessionsOnly = useMemo(
    () => liveSessions.filter(s => s.status === 'SCHEDULED'),
    [liveSessions],
  );

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

  const handleJoinPress = useCallback(
    (session: UpcomingLive) => {
      handleRestrictedAction('Please login to join live sessions', () =>
        handleJoinLive(session),
      );
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

  const renderRating = (rating?: number | null) => (
    <View style={styles.ratingRow}>
      <Icon
        name="star"
        size={11}
        color={colors.warning.main}
        library="MaterialIcons"
      />
      <Text
        variant="captionSmall"
        weight="medium"
        style={{ color: colors.text.secondary, marginLeft: 2 }}>
        {(rating ?? 0).toFixed(1)}
      </Text>
    </View>
  );

  const renderThumbnail = (
    session: UpcomingLive,
    profilePicUrl: string | null,
    overlay?: React.ReactNode,
  ) => (
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
        <View style={styles.thumbnailPlaceholder}>
          <Icon
            name="person"
            size={36}
            color={colors.text.secondary}
            library="MaterialIcons"
          />
        </View>
      )}
      {overlay}
    </View>
  );

  const renderOngoingCard = (session: UpcomingLive) => {
    const profilePicUrl = failedAvatarIds.has(session.id)
      ? null
      : getProfilePicUrl(session.astrologer?.profilePic);
    const isJoining = joiningSessionId === session.id;

    return (
      <View
        key={session.id}
        style={[
          styles.sessionCard,
          {
            backgroundColor: colors.card.background,
            shadowColor: colors.common.black,
          },
        ]}>
        {renderThumbnail(
          session,
          profilePicUrl,
          <>
            <View style={styles.liveBadge}>
              <Text
                variant="captionSmall"
                weight="bold"
                style={styles.liveBadgeText}>
                LIVE
              </Text>
            </View>
            {/* <View style={styles.viewerBadge}>
              <Icon name="users" size={11} color="#FFF" library="Feather" />
              <Text variant="captionSmall" style={styles.viewerCount}>
                0
              </Text>
            </View> */}
          </>,
        )}

        <View style={styles.cardContent}>
          <Text
            variant="label"
            weight="semibold"
            style={{ color: colors.text.primary }}
            numberOfLines={1}>
            {session.title}
          </Text>

          <View style={styles.contentFooter}>
            <View style={styles.metaBlock}>
              <Text
                variant="caption"
                style={[styles.astrologerName, { color: colors.text.secondary }]}
                numberOfLines={1}>
                {getAstrologerName(session)}
              </Text>
              {renderRating(session.astrologer?.rating)}
            </View>

            <TouchableOpacity
              style={[
                styles.joinButton,
                { borderColor: colors.primary.main },
                isJoining && styles.joinButtonDisabled,
              ]}
              onPress={() => handleJoinPress(session)}
              disabled={isJoining}
              activeOpacity={0.7}>
              {isJoining ? (
                <ActivityIndicator size="small" color={colors.primary.main} />
              ) : (
                <Text
                  variant="caption"
                  weight="medium"
                  style={{ color: colors.primary.main }}>
                  Join
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderUpcomingCard = (session: UpcomingLive) => {
    const profilePicUrl = failedAvatarIds.has(session.id)
      ? null
      : getProfilePicUrl(session.astrologer?.profilePic);
    const timing = formatSessionTiming(session.scheduledAt);

    return (
      <View
        key={session.id}
        style={[
          styles.sessionCard,
          {
            backgroundColor: colors.card.background,
            shadowColor: colors.common.black,
          },
        ]}>
        {renderThumbnail(
          session,
          profilePicUrl,
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.titleOverlay}>
            <Text
              variant="label"
              weight="bold"
              style={styles.overlayTitle}
              numberOfLines={1}>
              {session.title}
            </Text>
          </LinearGradient>,
        )}

        <View style={styles.cardContent}>
          <View style={styles.timingRow}>
            <Icon
              name="schedule"
              size={13}
              color={colors.text.tertiary}
              library="MaterialIcons"
            />
            <Text
              variant="caption"
              style={{ color: colors.text.tertiary, marginLeft: 5, flex: 1 }}
              numberOfLines={1}>
              {timing || '—'}
            </Text>
          </View>

          <View style={styles.contentFooter}>
            <View style={styles.metaBlock}>
              <View style={styles.hostRow}>
                <Text variant="caption" style={{ color: colors.text.secondary }}>
                  Host:{' '}
                </Text>
                <Text
                  variant="caption"
                  weight="semibold"
                  style={{ color: colors.primary.main, flexShrink: 1 }}
                  numberOfLines={1}>
                  {getAstrologerName(session)}
                </Text>
              </View>
              {renderRating(session.astrologer?.rating)}
            </View>
          </View>
        </View>
      </View>
    );
  };

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

  if (loading && liveSessions.length === 0) {
    return <LiveScreenShimmer />;
  }

  const hasAnySessions =
    liveSessionsOnly.length > 0 || upcomingSessionsOnly.length > 0;

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
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary.main}
            colors={[colors.primary.main]}
          />
        }>
        {!hasAnySessions ? (
          renderEmptyState()
        ) : (
          <>
            {liveSessionsOnly.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text variant="h6" weight="bold">
                    Ongoing Live Sessions
                  </Text>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalContent}>
                  {liveSessionsOnly.map(renderOngoingCard)}
                </ScrollView>
              </View>
            )}

            {upcomingSessionsOnly.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text variant="h6" weight="bold">
                    Upcoming Live Sessions
                  </Text>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalContent}>
                  {upcomingSessionsOnly.map(renderUpcomingCard)}
                </ScrollView>
              </View>
            )}
          </>
        )}

        {loadingMore ? (
          <ActivityIndicator
            style={styles.footerLoader}
            color={colors.primary.main}
          />
        ) : null}
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
  section: {
    marginTop: 14,
    marginBottom: 4,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  horizontalContent: {
    paddingHorizontal: 16,
    paddingRight: 16,
    paddingTop: 4,
    paddingBottom: 10,
  },
  sessionCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 12,
    marginRight: 10,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 2,
  },
  thumbnail: {
    width: '100%',
    height: THUMBNAIL_HEIGHT,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  liveBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    letterSpacing: 0.3,
  },
  viewerBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  viewerCount: {
    color: '#FFFFFF',
    marginLeft: 3,
  },
  titleOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 10,
    paddingTop: 18,
    paddingBottom: 8,
    justifyContent: 'flex-end',
  },
  overlayTitle: {
    color: '#FFFFFF',
  },
  cardContent: {
    height: CARD_CONTENT_HEIGHT,
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: 'space-between',
  },
  contentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 28,
  },
  metaBlock: {
    flex: 1,
    marginRight: 6,
    justifyContent: 'center',
  },
  astrologerName: {
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  joinButton: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    minWidth: 52,
    minHeight: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinButtonDisabled: {
    opacity: 0.7,
  },
  timingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 18,
  },
  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  footerLoader: {
    paddingVertical: 16,
  },
});

export default LiveScreen;
