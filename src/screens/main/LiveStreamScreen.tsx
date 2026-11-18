import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ActivityIndicator,
  Alert,
  BackHandler,
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
import {endLiveInteraction} from '../../services/api/liveInteractions/live-interactions.api';
import {
  getAvailableCallSeconds,
  getLiveInteractionPricePerMinute,
  getRemainingSecondsFromEndTime,
  hasMinimumCallBalance,
  MIN_LIVE_INTERACTION_MINUTES,
  getMinimumRequiredBalance,
  reconcileCallEndsAtWithWallet,
} from '../../services/api/liveInteractions/live-interaction-billing';
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
  // Android 15+ edge-to-edge disables adjustResize. Lift the absolute
  // composer in JS (same approach as ChatScreen). Android 14 keeps
  // windowSoftInputMode=adjustResize from the manifest — do not pad there.
  const isAndroid15Plus =
    Platform.OS === 'android' && Platform.Version >= 35;
  const [androidKeyboardHeight, setAndroidKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const chatInputRef = useRef<TextInput>(null);
  const sendInFlightRef = useRef(false);
  const leaveInFlightRef = useRef(false);
  const leaveConfirmVisibleRef = useRef(false);
  const hostOfflineTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const liveStatusCheckInFlightRef = useRef(false);
  const hasNavigatedBackRef = useRef(false);
  const [isLeaving, setIsLeaving] = useState(false);
  /** Absolute end timestamp for active call countdown (ms). Null when inactive. */
  const [callEndsAt, setCallEndsAt] = useState<number | null>(null);
  const callEndsAtRef = useRef<number | null>(null);
  const callTimerStartedForRequestRef = useRef<string | null>(null);
  /** Price/min captured when the call request is sent (coins). */
  const activeCallPriceRef = useRef<number | null>(null);
  /** Last wallet balance applied to the active call countdown (coins). */
  const lastSyncedWalletForCallRef = useRef<number | null>(null);
  /** requestId captured for EndLiveInteraction when timer starts / call connects. */
  const activeRequestIdRef = useRef<string | null>(null);
  const activeInteractionTypeRef = useRef<LiveInteractionType | null>(null);
  const endCohostInFlightRef = useRef(false);
  const endedApiRequestIdRef = useRef<string | null>(null);

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

  // Lift absolute composer above IME on Android 15+; track visibility on both
  // platforms so bottom safe-area padding is not double-applied over the keyboard.
  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = Keyboard.addListener(showEvent, event => {
      setIsKeyboardVisible(true);
      if (isAndroid15Plus) {
        setAndroidKeyboardHeight(event.endCoordinates.height);
      }
    });
    const onHide = Keyboard.addListener(hideEvent, () => {
      setIsKeyboardVisible(false);
      setAndroidKeyboardHeight(0);
    });

    return () => {
      onShow.remove();
      onHide.remove();
      setAndroidKeyboardHeight(0);
      setIsKeyboardVisible(false);
    };
  }, [isAndroid15Plus]);

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

  const markConnectingRef = useRef(liveInteraction.markConnecting);  const markInCallRef = useRef(liveInteraction.markInCall);
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

  const walletBalanceCoins =
    useAuthStore(s => s.user?.walletBalance) ??
    liveInteraction.pricing?.walletBalance ??
    0;

  const clearCallTimer = useCallback(() => {
    callEndsAtRef.current = null;
    setCallEndsAt(null);
    callTimerStartedForRequestRef.current = null;
    lastSyncedWalletForCallRef.current = null;
  }, []);

  const fireEndLiveInteractionOnce = useCallback((requestId: string) => {
    const id = requestId.trim();
    if (!id || endedApiRequestIdRef.current === id) {
      loggingService.info(
        '[LiveStream] EndLiveInteraction skipped — duplicate',
        {requestId: id},
      );
      return;
    }
    endedApiRequestIdRef.current = id;
    loggingService.info('[LiveStream] EndLiveInteraction invoke', {
      requestId: id,
    });
    void endLiveInteraction(id)
      .then(result => {
        loggingService.info('[LiveStream] EndLiveInteraction success', {
          requestId: result?.id,
          status: result?.status,
          chargedCoins: result?.chargedCoins,
        });
      })
      .catch((err: any) => {
        loggingService.error('[LiveStream] EndLiveInteraction failed', {
          requestId: id,
          error: err?.message || err,
        });
      });
  }, []);

  const endCohostSession = useCallback(
    (reason: 'manual' | 'exhausted' | 'gift_exhausted') => {
      if (endCohostInFlightRef.current) {
        loggingService.info('[LiveStream] endCohostSession skipped — in flight', {
          reason,
        });
        return;
      }
      endCohostInFlightRef.current = true;

      // Prefer live state, fall back to ids captured when the timer started.
      const requestId =
        liveInteraction.interaction.requestId || activeRequestIdRef.current;
      const interactionType =
        liveInteraction.interaction.interactionType ||
        activeInteractionTypeRef.current;

      loggingService.info('[LiveStream] endCohostSession', {
        reason,
        requestId,
        interactionType,
      });

      clearCallTimer();

      // Local RTC demote immediately — never wait on billing API.
      void cohost.leaveCohost();
      cohost.clearAttemptedSessions();

      // Always end the billed interaction when timer/manual end fires.
      if (requestId) {
        fireEndLiveInteractionOnce(requestId);
      } else {
        loggingService.error(
          '[LiveStream] EndLiveInteraction skipped — missing requestId',
          {reason},
        );
      }

      liveInteraction.dismissTerminal();
      activeRequestIdRef.current = null;
      activeInteractionTypeRef.current = null;
      activeCallPriceRef.current = null;

      if (reason === 'gift_exhausted') {
        showError(
          'Your call has ended because your wallet balance was used for gifts. Please recharge to continue.',
        );
      } else if (reason === 'exhausted') {
        showError(
          interactionType === 'VIDEO'
            ? 'Your video call has ended because your wallet balance is exhausted.'
            : 'Your audio call has ended because your wallet balance is exhausted.',
        );
      }
    },
    [
      clearCallTimer,
      cohost.leaveCohost,
      cohost.clearAttemptedSessions,
      fireEndLiveInteractionOnce,
      liveInteraction.dismissTerminal,
      liveInteraction.interaction.requestId,
      liveInteraction.interaction.interactionType,
      showError,
    ],
  );

  const handleCountdownExpired = useCallback(() => {
    endCohostSession('exhausted');
  }, [endCohostSession]);

  // Wallet-based call countdown — starts only after public co-host publish.
  // Absolute endsAt is set once; LiveCohostControls ticks the UI from endsAt.
  useEffect(() => {
    const requestId = liveInteraction.interaction.requestId;
    const interactionType = liveInteraction.interaction.interactionType;
    const shouldRunTimer =
      (liveInteraction.phase === 'IN_CALL' ||
        liveInteraction.phase === 'CONNECTING') &&
      cohost.isPublishing &&
      !!requestId &&
      (interactionType === 'AUDIO' || interactionType === 'VIDEO');

    if (!shouldRunTimer) {
      if (
        liveInteraction.phase === 'IDLE' ||
        liveInteraction.phase === 'COMPLETED' ||
        liveInteraction.phase === 'CANCELLED' ||
        liveInteraction.phase === 'REJECTED' ||
        liveInteraction.phase === 'FAILED'
      ) {
        clearCallTimer();
        activeCallPriceRef.current = null;
        if (liveInteraction.phase === 'IDLE') {
          endCohostInFlightRef.current = false;
        }
      }
      return;
    }

    if (callTimerStartedForRequestRef.current === requestId) {
      return;
    }

    const price =
      activeCallPriceRef.current ??
      getLiveInteractionPricePerMinute(
        liveInteraction.pricing,
        interactionType,
      );
    if (price == null) {
      loggingService.info('[LiveStream] Call timer waiting for price', {
        requestId,
        interactionType,
      });
      return;
    }

    const balance =
      useAuthStore.getState().user?.walletBalance ??
      liveInteraction.pricing?.walletBalance ??
      0;
    const availableSeconds = getAvailableCallSeconds(balance, price);
    if (availableSeconds <= 0) {
      endCohostSession('exhausted');
      return;
    }

    const endsAt = Date.now() + availableSeconds * 1000;
    callTimerStartedForRequestRef.current = requestId;
    endCohostInFlightRef.current = false;
    endedApiRequestIdRef.current = null;
    activeCallPriceRef.current = price;
    activeRequestIdRef.current = requestId;
    activeInteractionTypeRef.current = interactionType;
    lastSyncedWalletForCallRef.current = balance;
    callEndsAtRef.current = endsAt;
    setCallEndsAt(endsAt);

    loggingService.info('[LiveStream] Call timer started', {
      requestId,
      interactionType,
      availableSeconds,
      endsAt,
      balance,
      pricePerMinute: price,
    });
  }, [
    liveInteraction.phase,
    liveInteraction.interaction.requestId,
    liveInteraction.interaction.interactionType,
    liveInteraction.pricing,
    cohost.isPublishing,
    clearCallTimer,
    endCohostSession,
  ]);

  // Keep the absolute endsAt in sync with live wallet balance (gifts / recharge).
  // Gift sends update auth walletBalance; shrink (never extend) the countdown.
  useEffect(() => {
    if (
      callEndsAt == null ||
      callTimerStartedForRequestRef.current == null ||
      endCohostInFlightRef.current
    ) {
      return;
    }

    const price = activeCallPriceRef.current;
    const currentEndsAt = callEndsAtRef.current;
    if (price == null || currentEndsAt == null) {
      return;
    }

    if (lastSyncedWalletForCallRef.current === walletBalanceCoins) {
      return;
    }

    lastSyncedWalletForCallRef.current = walletBalanceCoins;

    const result = reconcileCallEndsAtWithWallet(
      currentEndsAt,
      walletBalanceCoins,
      price,
    );

    loggingService.info('[LiveStream] Call timer wallet sync', {
      balance: walletBalanceCoins,
      pricePerMinute: price,
      currentEndsAt,
      shouldEnd: result.shouldEnd,
      nextEndsAt: result.endsAt,
      didShrink: result.shouldEnd ? false : result.didShrink,
    });

    if (result.shouldEnd) {
      endCohostSession('gift_exhausted');
      return;
    }

    if (result.didShrink && result.endsAt !== currentEndsAt) {
      callEndsAtRef.current = result.endsAt;
      setCallEndsAt(result.endsAt);
    }
  }, [walletBalanceCoins, callEndsAt, endCohostSession]);

  // Backup expiry watcher — ensures EndLiveInteraction fires even if the
  // card unmounts; uses absolute endsAt (background-safe).
  useEffect(() => {
    if (callEndsAt == null) {
      return;
    }
    const intervalId = setInterval(() => {
      const remaining = getRemainingSecondsFromEndTime(callEndsAt);
      if (remaining <= 0) {
        endCohostSession('exhausted');
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [callEndsAt, endCohostSession]);

  useEffect(() => {
    return () => {
      clearCallTimer();
    };
  }, [clearCallTimer]);

  const handleSelectCallType = useCallback(
    async (type: LiveInteractionType) => {
      const price = getLiveInteractionPricePerMinute(
        liveInteraction.pricing,
        type,
      );
      const balance =
        useAuthStore.getState().user?.walletBalance ??
        liveInteraction.pricing?.walletBalance ??
        0;

      if (price == null) {
        showError('Call pricing is unavailable. Please try again.');
        return;
      }
      if (!hasMinimumCallBalance(balance, price)) {
        const required = getMinimumRequiredBalance(price);
        showError(
          `A minimum ${MIN_LIVE_INTERACTION_MINUTES}-minute wallet balance is required (${required} coins).`,
        );
        return;
      }

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

      // Revalidate immediately before creating the interaction request.
      const balanceNow =
        useAuthStore.getState().user?.walletBalance ??
        liveInteraction.pricing?.walletBalance ??
        0;
      if (!hasMinimumCallBalance(balanceNow, price)) {
        const required = getMinimumRequiredBalance(price);
        showError(
          `A minimum ${MIN_LIVE_INTERACTION_MINUTES}-minute wallet balance is required (${required} coins).`,
        );
        return;
      }

      activeCallPriceRef.current = price;
      activeInteractionTypeRef.current = type;
      const result = await liveInteraction.requestCall(type);
      if (!result.success) {
        activeCallPriceRef.current = null;
        activeInteractionTypeRef.current = null;
        if (result.error) {
          showError(result.error);
        }
      }
    },
    [liveInteraction.pricing, liveInteraction.requestCall, showError],
  );

  const handleLeaveCohost = useCallback(() => {
    endCohostSession('manual');
  }, [endCohostSession]);

  endInteractionRef.current = async () => {
    endCohostSession('manual');
  };

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

  const handleRetryEndCall = useCallback(() => {
    endCohostInFlightRef.current = false;
    endedApiRequestIdRef.current = null;
    endCohostSession('manual');
  }, [endCohostSession]);

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
        requestAnimationFrame(() => {
          chatInputRef.current?.focus();
        });
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
            endCohostSession('manual');
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
    endCohostSession,
  ]);

  const handleBackPress = useCallback(() => {
    if (
      isLeaving ||
      leaveInFlightRef.current ||
      hasNavigatedBackRef.current ||
      leaveConfirmVisibleRef.current
    ) {
      return true;
    }

    leaveConfirmVisibleRef.current = true;
    Alert.alert(
      'Leave Live Session?',
      'Are you sure you want to leave this live session?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            leaveConfirmVisibleRef.current = false;
          },
        },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: () => {
            leaveConfirmVisibleRef.current = false;
            void handleLeaveSession();
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {
          leaveConfirmVisibleRef.current = false;
        },
      },
    );
    return true;
  }, [handleLeaveSession, isLeaving]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );
    return () => {
      subscription.remove();
    };
  }, [handleBackPress]);

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

  // RN keyboard height on Android edge-to-edge is typically IME minus
  // system bars. Clear insets.bottom on the input row while the keyboard is
  // open, and add it back here so the composer sits flush above the IME.
  const androidKeyboardOffset =
    isAndroid15Plus && androidKeyboardHeight > 0
      ? androidKeyboardHeight + insets.bottom
      : 0;
  const inputRowPaddingBottom = isKeyboardVisible
    ? 6
    : insets.bottom + 8;

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
            endsAt={callEndsAt}
            onToggleMute={cohost.toggleMute}
            onToggleCamera={cohost.toggleCamera}
            onLeave={handleLeaveCohost}
            onCountdownExpired={handleCountdownExpired}
          />
        </View>
      )}

      <View style={[styles.topBar, {paddingTop: insets.top + 8}]}>
        <TouchableOpacity
          onPress={handleBackPress}
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

      {/*
        Keep the composer mounted under the gift overlay so the TextInput is
        not remounted (which drops focus/keyboard). Android 15+ needs an
        explicit bottom pad because edge-to-edge disables adjustResize.
        Android 14: rely on manifest adjustResize only (offset stays 0).
        iOS: KeyboardAvoidingView padding — do not also apply Android offset.
      */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[
          styles.chatContainer,
          androidKeyboardOffset > 0
            ? {paddingBottom: androidKeyboardOffset}
            : null,
        ]}
        pointerEvents={isGiftPanelVisible ? 'none' : 'auto'}>
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

        <View style={styles.chatContentRow}>
          <FlatList
            data={reversedMessages}
            keyExtractor={item => item.id}
            renderItem={renderMessage}
            inverted
            style={styles.messageList}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
          <View style={styles.actionButtonsColumn}>
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
          </View>
        </View>

        <View style={[styles.inputRow, {paddingBottom: inputRowPaddingBottom}]}>
          <View style={styles.inputContainer}>
            <TextInput
              ref={chatInputRef}
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
        </View>
      </KeyboardAvoidingView>

      {isGiftPanelVisible && (
        <View style={styles.giftPanelAnchor} pointerEvents="box-none">
          <LiveGiftPanel
            onClose={() => {
              setIsGiftPanelVisible(false);
              // Gift overlay no longer unmounts the composer; restore focus
              // after the overlay closes so the keyboard can reopen.
              requestAnimationFrame(() => {
                chatInputRef.current?.focus();
              });
            }}
            onSend={handleSendLiveGift}
            sending={sendingGift}
          />
        </View>
      )}

      <CallNowPanel
        visible={liveInteraction.isCallNowVisible}
        pricing={liveInteraction.pricing}
        loading={liveInteraction.phase === 'FETCHING_PRICING'}
        error={liveInteraction.pricingError || liveInteraction.error}
        requesting={liveInteraction.phase === 'REQUESTING'}
        walletBalance={walletBalanceCoins}
        onClose={liveInteraction.closeCallNow}
        onRetry={liveInteraction.refreshPricing}
        onSelect={handleSelectCallType}
        activeCall={null}
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
  chatContentRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxHeight: 260,
    paddingHorizontal: 12,
  },
  messageList: {
    flex: 1,
    maxHeight: 260,
    minWidth: 0,
    paddingRight: 8,
  },
  actionButtonsColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    paddingBottom: 4,
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
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 8,
  },
  giftButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callNowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    minWidth: 0,
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: OVERLAY_BACKGROUND,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LiveStreamScreen;
