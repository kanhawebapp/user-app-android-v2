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
import {getLiveJoinChatError, leaveLiveStream} from '../../services/api/liveSessions/live-sessions.api';
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
import {useToast} from '../../context/ToastContext';
import {useSendLiveGift} from '../../services/api/liveGifts/useSendLiveGift';
import type {LiveGift} from '../../services/api/liveGifts/live-gifts.types';
import {applyWalletBalanceCoins} from '../../services/api/wallet/wallet.hooks';
import {useAuthStore} from '../../stores/auth.store';
import {LiveGiftPanel} from './liveStream/LiveGiftPanel';

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
  const [isLeaving, setIsLeaving] = useState(false);

  /** Prefer join response stream id; fall back to the listed session id. */
  const streamId = joinData.id || session.id;

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

  const rtc = useLiveAudienceRtc({
    appId: joinData.appId,
    channelName: joinData.channelName,
    rtcToken: joinData.rtcToken,
    uid: joinData.uid,
  });

  const chatCredentialError = useMemo(
    () => getLiveJoinChatError(joinData),
    [joinData],
  );

  const chat = useLiveRoomChat({
    enabled: chatCredentialError === null,
    chatAppKey: joinData.chatAppKey,
    chatUserId: joinData.chatUserId,
    chatToken: joinData.chatToken,
    chatRoomId: joinData.chatRoomId,
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
    if (leaveInFlightRef.current) {
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
      const response = await leaveLiveStream(channelName);
      if (response?.success) {
        onBack();
      } else {
        showError(response?.message || 'Failed to leave live session.');
      }
    } catch (err: any) {
      showError(err?.message || 'Failed to leave live session. Please try again.');
    } finally {
      leaveInFlightRef.current = false;
      setIsLeaving(false);
    }
  }, [joinData?.channelName, onBack, showError]);

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
    chatRoomId: joinData.chatRoomId,
    chatUserId: joinData.chatUserId,
  });
  const viewerCount = chatPresence.viewerCount;
  const showVideo =
    rtc.status !== 'failed' && rtc.hostUid !== null && rtc.isHostVideoOn;

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
                  onPress={onBack}
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
