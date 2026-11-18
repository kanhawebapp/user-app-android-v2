import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  RenderModeType,
  RtcSurfaceView,
  VideoSourceType,
} from 'react-native-agora';
import {useTheme} from '../../theme';
import {API_BASE_URL} from '../../constants/api.constants';
import {Text} from '../../components/Text';
import {Icon} from '../../components/Icon';
import {Button} from '../../components/Button';
import {AvatarImage} from '../../components/Image';
import {
  getLiveJoinChatError,
  getLiveStatus,
  leaveLiveStream,
} from '../../services/api/liveSessions/live-sessions.api';
import type {
  LiveJoinResponse,
  UpcomingLive,
} from '../../services/api/liveSessions/live-sessions.types';
import {
  followAstrologer,
  getFollowStatus,
  unfollowAstrologer,
} from '../../services/api/followAstrologer/follow-astrologer.api';
import {getAstrologerFollowersCount} from '../../services/api/followersCount/followers-count.api';
import {useLiveAudienceRtc} from '../../modules/live/hooks/useLiveAudienceRtc';
import {useLiveViewerPresence} from '../../modules/live/hooks/useLiveViewerPresence';
import {
  LiveChatMessage,
  useLiveRoomChat,
} from '../../modules/live/hooks/useLiveRoomChat';
import {useLiveInteractionSession} from '../../modules/live/hooks/useLiveInteractionSession';
import {useLivePublicCohost} from '../../modules/live/hooks/useLivePublicCohost';
import {
  requestMediaPermissions,
  requestVideoCallPermissions,
} from '../../modules/call/utils/mediaPermissions';
import {useToast} from '../../context/ToastContext';
import {useSendLiveGift} from '../../services/api/liveGifts/useSendLiveGift';
import type {LiveGift} from '../../services/api/liveGifts/live-gifts.types';
import type {LiveInteractionType} from '../../services/api/liveInteractions/live-interactions.types';
import {applyWalletBalanceCoins} from '../../services/api/wallet/wallet.hooks';
import {useAuthStore} from '../../stores/auth.store';
import loggingService from '../../services/logging';
import {LiveGiftPanel} from './liveStream/LiveGiftPanel';
import {CallNowPanel} from './liveStream/CallNowPanel';
import {LiveInteractionWaitingPanel} from './liveStream/LiveInteractionWaitingPanel';
import {LiveCohostControls} from './liveStream/LiveCohostControls';
import {LiveInteractionSummarySheet} from './liveStream/LiveInteractionSummarySheet';

const HOST_OFFLINE_STATUS_DELAY_MS = 5000;

interface LiveStreamScreenProps {
  joinData: LiveJoinResponse;
  session: UpcomingLive;
  onBack: () => void;
}

const OVERLAY_BACKGROUND = 'rgba(0, 0, 0, 0.45)';
const VIDEO_BACKGROUND = '#000';

const LiveStreamScreen: React.FC<LiveStreamScreenProps> = ({
  joinData,
  session,
  onBack,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const {showSuccess, showError} = useToast();
  const {submitLiveGift, loading: sendingGift} = useSendLiveGift();
  const [draft, setDraft] = useState('');
  const [isGiftPanelVisible, setIsGiftPanelVisible] = useState(false);
  const sendInFlightRef = useRef(false);
  const leaveInFlightRef = useRef(false);
  const hostOfflineTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const liveStatusCheckInFlightRef = useRef(false);
  const hasNavigatedBackRef = useRef(false);
  const [isLeaving, setIsLeaving] = useState(false);

  /** Prefer join response stream id; fall back to the listed session id. */
  const streamId = joinData.id || session.id;
  const chatRoomId = joinData.chatRoomId;

  const astrologer = session.astrologer;
  const astrologerId = astrologer?.id;
  const astrologerName =
    astrologer?.displayName?.trim() || astrologer?.name?.trim() || '';
  const profilePicUrl = astrologer?.profilePic
    ? astrologer.profilePic.startsWith('http')
      ? astrologer.profilePic
      : `${API_BASE_URL.DEVELOPMENT}${astrologer.profilePic.replace(
          /^\/+/,
          '',
        )}`
    : null;

  const navigateBackOnce = useCallback(() => {
    if (hasNavigatedBackRef.current) {
      return;
    }
    hasNavigatedBackRef.current = true;
    onBack();
  }, [onBack]);

  const handleHostOffline = useCallback(() => {
    if (
      hasNavigatedBackRef.current ||
      liveStatusCheckInFlightRef.current ||
      hostOfflineTimeoutRef.current != null
    ) {
      loggingService.info(
        '[LiveStream] Ignoring duplicate host offline while status check pending',
        {chatRoomId},
      );
      return;
    }

    if (!chatRoomId) {
      loggingService.error(
        '[LiveStream] Host offline but chatRoomId is missing; cannot call GetLiveStatus',
      );
      return;
    }

    loggingService.info(
      '[LiveStream] Host offline — scheduling GetLiveStatus after delay',
      {
        chatRoomId,
        delayMs: HOST_OFFLINE_STATUS_DELAY_MS,
      },
    );

    hostOfflineTimeoutRef.current = setTimeout(async () => {
      hostOfflineTimeoutRef.current = null;

      if (hasNavigatedBackRef.current) {
        return;
      }

      liveStatusCheckInFlightRef.current = true;
      loggingService.info('[LiveStream] Calling GetLiveStatus', {chatRoomId});

      try {
        const result = await getLiveStatus(chatRoomId);
        loggingService.info('[LiveStream] GetLiveStatus response', {
          chatRoomId,
          success: result?.success,
          message: result?.message,
          status: result?.data?.status,
        });

        if (
          result?.success === true &&
          result?.data?.status === 'ENDED' &&
          !hasNavigatedBackRef.current
        ) {
          loggingService.info(
            '[LiveStream] Live session ended — navigating back',
            {chatRoomId},
          );
          navigateBackOnce();
        }
      } catch (err: any) {
        loggingService.error('[LiveStream] GetLiveStatus failed', {
          chatRoomId,
          error: err?.message || err,
        });
      } finally {
        liveStatusCheckInFlightRef.current = false;
      }
    }, HOST_OFFLINE_STATUS_DELAY_MS);
  }, [chatRoomId, navigateBackOnce]);

  useEffect(() => {
    return () => {
      if (hostOfflineTimeoutRef.current != null) {
        clearTimeout(hostOfflineTimeoutRef.current);
        hostOfflineTimeoutRef.current = null;
      }
    };
  }, []);

  const endInteractionRef = useRef<() => Promise<unknown>>(async () => null);

  const rtc = useLiveAudienceRtc({
    appId: joinData.appId,
    channelName: joinData.channelName,
    rtcToken: joinData.rtcToken,
    uid: joinData.uid,
    onHostOffline: handleHostOffline,
    onGuestOffline: () => {
      // Another viewer's co-host session ended — no local action required.
    },
  });

  const liveInteraction = useLiveInteractionSession({
    liveStreamId: streamId,
    astrologerId,
    isScreenActive: true,
  });

  endInteractionRef.current = liveInteraction.endCall;
  const markConnectingRef = useRef(liveInteraction.markConnecting);
  const markInCallRef = useRef(liveInteraction.markInCall);
  markConnectingRef.current = liveInteraction.markConnecting;
  markInCallRef.current = liveInteraction.markInCall;

  const cohostEnabled =
    liveInteraction.isInCallPhase &&
    liveInteraction.credentials != null &&
    liveInteraction.phase !== 'ENDING';

  const cohostSessionKey = liveInteraction.interaction.requestId;

  const cohost = useLivePublicCohost({
    enabled: cohostEnabled,
    sessionKey: cohostSessionKey,
    engineRef: rtc.engineRef,
    engineReady: rtc.engineReady,
    publicChannelName: joinData.channelName,
    audienceCredentials: rtc.audienceCredentials,
    publisherAppId: liveInteraction.credentials?.appId ?? null,
    publisherChannelName: liveInteraction.credentials?.channelName ?? null,
    publisherRtcToken: liveInteraction.credentials?.rtcToken ?? null,
    publisherUid: liveInteraction.credentials?.uid ?? null,
    interactionType: liveInteraction.interaction.interactionType,
    setLocalCohostActive: rtc.setLocalCohostActive,
    onFailed: message => {
      showError(message);
    },
    onPromoted: () => {
      markInCallRef.current();
    },
  });

  useEffect(() => {
    if (liveInteraction.phase === 'ACCEPTED' && cohostEnabled) {
      markConnectingRef.current();
    }
  }, [liveInteraction.phase, cohostEnabled]);

  const handleSelectCallType = useCallback(
    async (type: LiveInteractionType) => {
      const permissions =
        type === 'VIDEO'
          ? await requestVideoCallPermissions()
          : await requestMediaPermissions();

      if (!permissions.microphone) {
        showError('Microphone permission is required to join live.');
        return;
      }
      if (type === 'VIDEO' && !permissions.camera) {
        showError('Camera permission is required for video co-host.');
        return;
      }

      await liveInteraction.requestCall(type);
    },
    [liveInteraction.requestCall, showError],
  );

  const handleLeaveCohost = useCallback(() => {
    // Demote immediately. EndLiveInteraction is fire-and-forget inside
    // LiveCohostControls so leave never blocks RTC.
    void cohost.leaveCohost();
    cohost.clearAttemptedSessions();
    liveInteraction.dismissTerminal();
  }, [
    cohost.leaveCohost,
    cohost.clearAttemptedSessions,
    liveInteraction.dismissTerminal,
  ]);

  const handleCancelInteractionRequest = useCallback(async () => {
    await liveInteraction.cancelRequest();
    if (!liveInteraction.cancelApiAvailable) {
      showError(
        'Request cancelled. Backend cancel API is not available yet, so the astrologer may still see a pending request.',
      );
    }
  }, [
    liveInteraction.cancelRequest,
    liveInteraction.cancelApiAvailable,
    showError,
  ]);

  const handleRetryEndCall = useCallback(async () => {
    await cohost.leaveCohost();
    cohost.clearAttemptedSessions();
    await liveInteraction.endCall();
  }, [cohost.leaveCohost, cohost.clearAttemptedSessions, liveInteraction.endCall]);

  const waitingPricePerMinute = useMemo(() => {
    if (!liveInteraction.pricing || !liveInteraction.interaction.interactionType) {
      return null;
    }
    return liveInteraction.interaction.interactionType === 'VIDEO'
      ? liveInteraction.pricing.videoPrice
      : liveInteraction.pricing.audioPrice;
  }, [
    liveInteraction.pricing,
    liveInteraction.interaction.interactionType,
  ]);

  useEffect(() => {
    if (liveInteraction.phase === 'REJECTED' && liveInteraction.error) {
      showError(liveInteraction.error);
      liveInteraction.dismissTerminal();
    } else if (liveInteraction.phase === 'CANCELLED') {
      liveInteraction.dismissTerminal();
    }
  }, [
    liveInteraction.phase,
    liveInteraction.error,
    liveInteraction.dismissTerminal,
    showError,
  ]);

  const showInteractionSummary =
    liveInteraction.phase === 'COMPLETED' ||
    (liveInteraction.phase === 'FAILED' &&
      !!liveInteraction.error &&
      !!liveInteraction.interaction.requestId &&
      !liveInteraction.isWaiting &&
      !liveInteraction.isCallNowVisible);

  const chatCredentialError = useMemo(
    () => getLiveJoinChatError(joinData),
    [joinData],
  );

  const chat = useLiveRoomChat({
    enabled: chatCredentialError === null,
    chatAppKey: joinData.chatAppKey,
    chatUserId: joinData.chatUserId,
    chatToken: joinData.chatToken,
    chatRoomId,
  });

  const reversedMessages = useMemo(
    () => [...chat.messages].reverse(),
    [chat.messages],
  );

  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [followersCount, setFollowersCount] = useState<number | null>(null);
  const [initialLoading, setInitialLoading] = useState(!!astrologerId);
  const [isFollowMutating, setIsFollowMutating] = useState(false);
  const [followError, setFollowError] = useState<string | null>(null);
  const currentAstrologerIdRef = useRef(astrologerId);

  useEffect(() => {
    const id = astrologerId;
    currentAstrologerIdRef.current = id;

    if (!id) {
      setIsFollowing(null);
      setFollowersCount(null);
      setInitialLoading(false);
      return;
    }

    setInitialLoading(true);

    let cancelled = false;

    const init = async () => {
      try {
        const status = await getFollowStatus(id);
        if (cancelled || currentAstrologerIdRef.current !== id) {
          return;
        }
        setIsFollowing(status ?? false);
      } catch {
        if (cancelled || currentAstrologerIdRef.current !== id) {
          return;
        }
        setIsFollowing(null);
      }

      try {
        const count = await getAstrologerFollowersCount(id);
        if (cancelled || currentAstrologerIdRef.current !== id) {
          return;
        }
        setFollowersCount(count?.totalFollowers ?? 0);
      } catch {
        if (!cancelled && currentAstrologerIdRef.current === id) {
          setFollowersCount(null);
        }
      } finally {
        if (!cancelled && currentAstrologerIdRef.current === id) {
          setInitialLoading(false);
        }
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, [astrologerId]);

  const handleFollow = useCallback(async () => {
    if (
      !astrologerId ||
      isFollowMutating ||
      initialLoading ||
      isFollowing === null
    ) {
      return;
    }

    setIsFollowMutating(true);
    setFollowError(null);

    try {
      if (isFollowing) {
        const res = await unfollowAstrologer(astrologerId);
        if (res?.success) {
          setIsFollowing(false);
          setFollowersCount(prev =>
            prev == null ? prev : Math.max(0, prev - 1),
          );
        }
      } else {
        const res = await followAstrologer(astrologerId);
        if (res?.success) {
          setIsFollowing(true);
          setFollowersCount(prev => (prev == null ? prev : prev + 1));
        }
      }
    } catch (err: any) {
      setFollowError(
        err?.message || 'Failed to update follow status. Please try again.',
      );
      console.log('FOLLOW MUTATION ERROR:', err);
    } finally {
      setIsFollowMutating(false);
    }
  }, [astrologerId, isFollowMutating, isFollowing, initialLoading]);

  const retryFollow = useCallback(() => {
    setFollowError(null);
    handleFollow();
  }, [handleFollow]);

  const isChatReady = chat.status === 'connected';
  const chatNotice = chatCredentialError ?? chat.error;

  const handleSend = useCallback(async () => {
    const text = draft.trim();
    if (!text) {
      return;
    }
    setDraft('');
    const sent = await chat.sendMessage(text);
    if (!sent) {
      setDraft(text);
    }
  }, [chat, draft]);

  const handleSendLiveGift = useCallback(
    async (gift: LiveGift, quantity: number) => {
      if (!streamId) {
        showError('Live stream is unavailable. Please rejoin and try again.');
        return;
      }
      if (sendInFlightRef.current || sendingGift) {
        return;
      }

      sendInFlightRef.current = true;
      try {
        const response = await submitLiveGift({
          streamId,
          giftId: gift.id,
          quantity,
        });

        if (!response?.success) {
          showError(response?.message || 'Failed to send gift');
          return;
        }

        if (typeof response.userBalance === 'number') {
          applyWalletBalanceCoins(response.userBalance);
          useAuthStore.getState().updateWalletBalance(response.userBalance);
        }

        showSuccess(
          response.message || `${response.giftName || gift.name} sent`,
        );
        setIsGiftPanelVisible(false);
      } catch (err: any) {
        showError(err?.message || 'Failed to send gift. Please try again.');
      } finally {
        sendInFlightRef.current = false;
      }
    },
    [streamId, sendingGift, submitLiveGift, showError, showSuccess],
  );


  const handleLeaveSession = useCallback(async () => {
    if (leaveInFlightRef.current || hasNavigatedBackRef.current) {
      return;
    }
    const channelName = joinData?.channelName;
    if (!channelName) {
      showError('Unable to leave live session. Missing channel.');
      return;
    }
    leaveInFlightRef.current = true;
    setIsLeaving(true);
    try {
      // Demote co-host / cancel request before leaving public live.
      liveInteraction.stopPolling();
      try {
        await cohost.leaveCohost();
        cohost.clearAttemptedSessions();
      } catch {
        // Continue leaving live even if demote fails.
      }
      if (
        liveInteraction.interaction.requestId &&
        (liveInteraction.isInCallPhase || liveInteraction.phase === 'PENDING')
      ) {
        try {
          if (liveInteraction.isInCallPhase) {
            await endInteractionRef.current();
          } else {
            await liveInteraction.cancelRequest();
          }
        } catch {
          // Leave live even if interaction cleanup fails.
        }
      }

      const response = await leaveLiveStream(channelName);
      if (response?.success) {
        navigateBackOnce();
      } else {
        showError(response?.message || 'Failed to leave live session.');
      }
    } catch (err: any) {
      showError(err?.message || 'Failed to leave live session. Please try again.');
    } finally {
      leaveInFlightRef.current = false;
      setIsLeaving(false);
    }
  }, [
    joinData?.channelName,
    navigateBackOnce,
    showError,
    liveInteraction.stopPolling,
    liveInteraction.interaction.requestId,
    liveInteraction.isInCallPhase,
    liveInteraction.phase,
    liveInteraction.cancelRequest,
    cohost.leaveCohost,
    cohost.clearAttemptedSessions,
  ]);

  const getRtcStatusText = (): string | null => {
    switch (rtc.status) {
      case 'joining':
        return 'Joining live...';
      case 'reconnecting':
        return 'Reconnecting...';
      case 'failed':
        return rtc.error;
      case 'connected':
        if (rtc.hostUid === null) {
          return 'Waiting for the astrologer to start the stream...';
        }
        return rtc.isHostVideoOn ? null : 'Astrologer video is paused';
      default:
        return null;
    }
  };

  const rtcStatusText = getRtcStatusText();
  // Presence must wait until ChatClient is fully connected. Enabling during
  // "connecting" calls room APIs before native init and crashes Android
  // (EMChatRoomManager NPE / ExceptionInInitializerError).
  const chatPresence = useLiveViewerPresence({
    enabled: chat.status === 'connected',
    chatRoomId,
    chatUserId: joinData.chatUserId,
  });
  const viewerCount = chatPresence.viewerCount;
  const showVideo =
    rtc.status !== 'failed' && rtc.hostUid !== null && rtc.isHostVideoOn;

  // Remote guest VIDEO tile for audience (same public channel).
  const showRemoteGuestVideo =
    rtc.guestUid != null &&
    rtc.isGuestVideoOn &&
    !cohost.isPublishing;

  // Local guest/co-host management card (AUDIO or VIDEO).
  const showLocalCohostControls =
    !!liveInteraction.interaction.requestId &&
    (liveInteraction.interaction.interactionType === 'AUDIO' ||
      liveInteraction.interaction.interactionType === 'VIDEO') &&
    liveInteraction.isInCallPhase;

  const showPublicCohostSection =
    showRemoteGuestVideo || showLocalCohostControls;

  const localCohostDisplayName =
    useAuthStore(s => s.user?.name?.trim()) || 'You';

  const formatMessageTime = (timestamp?: number | string) => {
    if (timestamp == null) {
      return '';
    }

    const date = new Date(Number(timestamp));

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const renderMessage = ({item}: {item: LiveChatMessage}) => {
    console.log('[LiveChat] Message rendered:', item);

    const senderName = item.isOwn
      ? 'You'
      : (() => {
          const name = item.senderId?.split('_')[0] || item.senderName || '';

          return name.charAt(0).toUpperCase() + name.slice(1);
        })();

    const messageTime = formatMessageTime(item.timestamp);

    return (
      <View style={styles.messageRow}>
        <View style={styles.messageHeader}>
          <Text
            variant="captionSmall"
            weight="bold"
            style={{
              color: item.isOwn ? colors.primary.light : colors.common.white,
            }}
            numberOfLines={1}>
            {senderName}
          </Text>

          {!!messageTime && (
            <Text variant="captionSmall" style={styles.messageTime}>
              {messageTime}
            </Text>
          )}
        </View>

        <Text variant="caption" style={{color: colors.common.white}}>
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={VIDEO_BACKGROUND} />

      <View style={StyleSheet.absoluteFill}>
        {showVideo && rtc.hostUid !== null ? (
          <RtcSurfaceView
            style={StyleSheet.absoluteFill}
            canvas={{
              uid: rtc.hostUid,
              sourceType: VideoSourceType.VideoSourceRemote,
              renderMode: RenderModeType.RenderModeHidden,
            }}
          />
        ) : (
          <View style={styles.placeholder}>
            <Icon
              name="live-tv"
              size={64}
              color={colors.common.white}
              library="MaterialIcons"
            />
          </View>
        )}
      </View>

      {/*
        Public guest/co-host RTC section — card layout matches reference.
        Positioned as a high-zIndex overlay so End/mute stay tappable.
      */}
      {showPublicCohostSection && (
        <View
          style={[styles.publicCohostContainer, {top: insets.top + 72}]}
          pointerEvents="box-none">
          {/* Audience: remote guest VIDEO on the same public channel */}
          {showRemoteGuestVideo && rtc.guestUid != null && (
            <View style={styles.guestVideo} pointerEvents="none">
              <RtcSurfaceView
                style={StyleSheet.absoluteFill}
                canvas={{
                  uid: rtc.guestUid,
                  sourceType: VideoSourceType.VideoSourceRemote,
                  renderMode: RenderModeType.RenderModeHidden,
                }}
              />
            </View>
          )}

          {/* Local AUDIO/VIDEO co-host controls inside the same RTC section */}
          <LiveCohostControls
            visible={showLocalCohostControls}
            requestId={liveInteraction.interaction.requestId}
            interactionType={liveInteraction.interaction.interactionType}
            status={cohost.status}
            displayName={localCohostDisplayName}
            isMuted={cohost.isMuted}
            isCameraOff={cohost.isCameraOff}
            onToggleMute={cohost.toggleMute}
            onToggleCamera={cohost.toggleCamera}
            onLeave={handleLeaveCohost}
          />
        </View>
      )}

      <View style={[styles.topBar, {paddingTop: insets.top + 8}]}>
        <TouchableOpacity
          onPress={handleLeaveSession}
          disabled={isLeaving}
          style={styles.iconButton}
          accessibilityLabel="Leave live session">
          {isLeaving ? (
            <ActivityIndicator size="small" color={colors.common.white} />
          ) : (
            <Icon
              name="arrow-back"
              size={24}
              color={colors.common.white}
              library="MaterialIcons"
            />
          )}
        </TouchableOpacity>
        {!!profilePicUrl && (
          <AvatarImage
            source={{uri: profilePicUrl}}
            size={32}
            name={astrologerName}
            style={styles.avatar}
          />
        )}
        <View style={styles.topBarText}>
          <Text
            variant="subtitle"
            weight="semibold"
            style={{color: colors.common.white}}
            numberOfLines={1}>
            {session.title}
          </Text>
          {!!astrologerName && (
            <Text
              variant="caption"
              style={{color: colors.common.white}}
              numberOfLines={1}>
              {astrologerName}
            </Text>
          )}
          {followersCount != null && (
            <Text
              variant="captionSmall"
              style={{color: colors.common.white}}
              numberOfLines={1}
              testID="followers-count">
              {followersCount} {followersCount === 1 ? 'follower' : 'followers'}
            </Text>
          )}
        </View>
        {astrologerId != null && !initialLoading && (
          <>
            {isFollowing === null ? (
              <ActivityIndicator
                size="small"
                color={colors.common.white}
                style={styles.loadingIndicator}
              />
            ) : (
              <Button
                title={isFollowing ? 'Following' : 'Follow'}
                variant={isFollowing ? 'secondary' : 'primary'}
                size="small"
                loading={isFollowMutating}
                disabled={isFollowMutating}
                onPress={handleFollow}
                accessibilityLabel={
                  isFollowing ? 'Unfollow astrologer' : 'Follow astrologer'
                }
                testID="follow-button"
              />
            )}
          </>
        )}
        <View style={[styles.liveBadge, {backgroundColor: colors.error.main}]}>
          <View style={styles.liveDot} />
          <Text
            variant="captionSmall"
            weight="bold"
            style={{color: colors.common.white}}>
            LIVE
          </Text>
          <Text
            variant="captionSmall"
            style={[styles.viewerCountSeparator, {color: colors.common.white}]}>
            · 👁 {viewerCount}
          </Text>
        </View>
      </View>

      {!!followError && (
        <View
          style={[
            styles.followErrorRow,
            {backgroundColor: colors.error.background},
          ]}>
          <Text
            variant="captionSmall"
            style={{color: colors.error.light}}
            numberOfLines={2}>
            {followError}
          </Text>
          <TouchableOpacity onPress={retryFollow}>
            <Text
              variant="captionSmall"
              weight="bold"
              style={{color: colors.primary.main}}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {!!rtcStatusText && (
        <View style={styles.statusOverlay} pointerEvents="box-none">
          <View style={styles.statusCard}>
            {(rtc.status === 'joining' || rtc.status === 'reconnecting') && (
              <ActivityIndicator color={colors.common.white} />
            )}
            <Text
              variant="body"
              style={[styles.statusText, {color: colors.common.white}]}>
              {rtcStatusText}
            </Text>
            {rtc.status === 'failed' && (
              <View style={styles.statusActions}>
                <Button
                  title="Retry"
                  variant="primary"
                  size="small"
                  onPress={rtc.retry}
                />
                <Button
                  title="Leave"
                  variant="outline"
                  size="small"
                  style={styles.leaveButton}
                  onPress={navigateBackOnce}
                />
              </View>
            )}
          </View>
        </View>
      )}

      {isGiftPanelVisible ? (
        <View style={styles.giftPanelAnchor} pointerEvents="box-none">
          <LiveGiftPanel
            onClose={() => setIsGiftPanelVisible(false)}
            onSend={handleSendLiveGift}
            sending={sendingGift}
          />
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.chatContainer}>
          <FlatList
            data={reversedMessages}
            keyExtractor={item => item.id}
            renderItem={renderMessage}
            inverted
            style={styles.messageList}
            showsVerticalScrollIndicator={false}
          />

          {!!chatNotice && (
            <View style={styles.chatNotice}>
              <Text
                variant="captionSmall"
                style={[styles.chatNoticeText, {color: colors.common.white}]}>
                {chatNotice}
              </Text>
              {!chatCredentialError && chat.status === 'failed' && (
                <TouchableOpacity onPress={chat.retry}>
                  <Text
                    variant="captionSmall"
                    weight="bold"
                    style={{color: colors.primary.light}}>
                    Retry
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <View style={[styles.inputRow, {paddingBottom: insets.bottom + 8}]}>
            <TouchableOpacity
              onPress={() => setIsGiftPanelVisible(true)}
              style={[
                styles.giftButton,
                {backgroundColor: colors.primary.main},
              ]}
              accessibilityLabel="Open gifts"
              testID="live-gift-button">
              <Icon
                name="card-giftcard"
                size={20}
                color={colors.primary.contrastText}
                library="MaterialIcons"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={liveInteraction.openCallNow}
              disabled={
                liveInteraction.isWaiting || liveInteraction.isInCallPhase
              }
              style={[
                styles.callNowButton,
                {
                  backgroundColor: colors.primary.main,
                  opacity:
                    liveInteraction.isWaiting || liveInteraction.isInCallPhase
                      ? 0.5
                      : 1,
                },
              ]}
              accessibilityLabel="Join live as co-host"
              testID="live-call-now-button">
              <Icon
                name="call"
                size={18}
                color={colors.common.white}
                library="MaterialIcons"
              />
            </TouchableOpacity>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder={
                isChatReady
                  ? 'Say something...'
                  : chat.status === 'connecting'
                  ? 'Connecting to chat...'
                  : 'Chat unavailable'
              }
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              editable={isChatReady}
              style={[styles.input, {color: colors.common.white}]}
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={!isChatReady || !draft.trim()}
              style={[
                styles.sendButton,
                {
                  backgroundColor: colors.primary.main,
                  opacity: isChatReady && draft.trim() ? 1 : 0.5,
                },
              ]}
              accessibilityLabel="Send message">
              <Icon
                name="send"
                size={18}
                color={colors.primary.contrastText}
                library="MaterialIcons"
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}

      <CallNowPanel
        visible={liveInteraction.isCallNowVisible}
        pricing={liveInteraction.pricing}
        loading={liveInteraction.phase === 'FETCHING_PRICING'}
        error={liveInteraction.pricingError || liveInteraction.error}
        requesting={liveInteraction.phase === 'REQUESTING'}
        onClose={liveInteraction.closeCallNow}
        onRetry={liveInteraction.refreshPricing}
        onSelect={handleSelectCallType}
      />

      <LiveInteractionWaitingPanel
        visible={liveInteraction.isWaiting}
        astrologerName={astrologerName}
        profilePicUrl={profilePicUrl}
        interactionType={liveInteraction.interaction.interactionType}
        pricePerMinute={waitingPricePerMinute}
        onCancel={handleCancelInteractionRequest}
      />

      <LiveInteractionSummarySheet
        visible={showInteractionSummary}
        summary={liveInteraction.summary}
        error={
          liveInteraction.phase === 'FAILED' ? liveInteraction.error : null
        }
        onClose={liveInteraction.dismissTerminal}
        onRetryEnd={
          liveInteraction.phase === 'FAILED' ? handleRetryEndCall : undefined
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: VIDEO_BACKGROUND,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.4,
  },
  publicCohostContainer: {
    position: 'absolute',
    right: 12,
    zIndex: 45,
    elevation: 45,
  },
  guestVideo: {
    width: 140,
    height: 180,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: '#000',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 8,
    backgroundColor: OVERLAY_BACKGROUND,
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
  avatar: {
    marginRight: 4,
  },
  topBarText: {
    flex: 1,
    minWidth: 0,
    marginHorizontal: 8,
  },
  loadingIndicator: {
    marginHorizontal: 6,
  },
  followErrorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 4,
  },
  liveBadge: {
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
  viewerCountSeparator: {
    marginLeft: 6,
  },
  statusOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  statusCard: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: OVERLAY_BACKGROUND,
  },
  statusText: {
    marginTop: 8,
    textAlign: 'center',
  },
  statusActions: {
    flexDirection: 'row',
    marginTop: 12,
  },
  leaveButton: {
    marginLeft: 8,
  },
  chatContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  giftPanelAnchor: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 20,
    elevation: 20,
  },
  messageList: {
    maxHeight: 260,
    paddingHorizontal: 12,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 2,
  },

  messageTime: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 10,
  },
  messageRow: {
    alignSelf: 'flex-start',
    maxWidth: '85%',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginVertical: 3,
    borderRadius: 10,
    backgroundColor: OVERLAY_BACKGROUND,
  },
  chatNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  chatNoticeText: {
    flex: 1,
    marginRight: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  giftButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callNowButton: {
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: OVERLAY_BACKGROUND,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LiveStreamScreen;
