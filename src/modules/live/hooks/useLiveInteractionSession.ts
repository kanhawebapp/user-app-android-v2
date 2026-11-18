import {useCallback, useEffect, useRef, useState} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {
  createLiveInteractionRequest,
  endLiveInteraction,
  getLiveInteractionPricing,
  getMyLiveInteraction,
  startLiveInteraction,
  LIVE_INTERACTION_CANCEL_API_AVAILABLE,
} from '../../../services/api/liveInteractions/live-interactions.api';
import type {
  EndLiveInteractionResult,
  LiveInteractionPricing,
  LiveInteractionRequest,
  LiveInteractionRequestStatus,
  LiveInteractionType,
  MyLiveInteraction,
} from '../../../services/api/liveInteractions/live-interactions.types';
import {
  getLiveInteractionPricePerMinute,
  getMinimumRequiredBalance,
  hasMinimumCallBalance,
  MIN_LIVE_INTERACTION_MINUTES,
} from '../../../services/api/liveInteractions/live-interaction-billing';
import {
  applyWalletBalanceCoins,
  refreshWalletBalance,
} from '../../../services/api/wallet/wallet.hooks';
import {useAuthStore} from '../../../stores/auth.store';
import loggingService from '../../../services/logging';

export type LiveInteractionPhase =
  | 'IDLE'
  | 'FETCHING_PRICING'
  | 'READY'
  | 'REQUESTING'
  | 'PENDING'
  | 'ACCEPTED'
  | 'CONNECTING'
  | 'IN_CALL'
  | 'ENDING'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'FAILED';

export interface LiveInteractionCredentials {
  appId: string;
  channelName: string;
  uid: number;
  rtcToken: string;
}

interface UseLiveInteractionSessionOptions {
  liveStreamId: string | null | undefined;
  astrologerId: string | null | undefined;
  /** When false, all polling and pricing fetches stop. */
  isScreenActive?: boolean;
}

const POLL_INTERVAL_MS = 4000;
const PENDING_TIMEOUT_MS = 90_000;

const TERMINAL_REQUEST_STATUSES = new Set<string>([
  'REJECTED',
  'CANCELLED',
  'ENDED',
  'FAILED',
]);

const normalizeStatus = (
  status: LiveInteractionRequestStatus | null | undefined,
): string => (status ?? '').toUpperCase();

const isAccepted = (status: string) => status === 'ACCEPTED';
const isPending = (status: string) => status === 'PENDING';

const initialInteraction = () => ({
  requestId: null as string | null,
  liveStreamId: null as string | null,
  interactionType: null as LiveInteractionType | null,
  status: null as LiveInteractionRequestStatus | null,
  agoraUid: null as number | null,
  appId: null as string | null,
  channelName: null as string | null,
  uid: null as number | null,
  rtcToken: null as string | null,
  startedAt: null as string | null,
});

export const useLiveInteractionSession = ({
  liveStreamId,
  astrologerId,
  isScreenActive = true,
}: UseLiveInteractionSessionOptions) => {
  const [phase, setPhase] = useState<LiveInteractionPhase>('IDLE');
  const [pricing, setPricing] = useState<LiveInteractionPricing | null>(null);
  const [pricingError, setPricingError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [interaction, setInteraction] = useState(initialInteraction);
  const [summary, setSummary] = useState<EndLiveInteractionResult | null>(null);
  const [isCallNowVisible, setIsCallNowVisible] = useState(false);

  const phaseRef = useRef(phase);
  const interactionRef = useRef(interaction);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollInFlightRef = useRef(false);
  const pollGenerationRef = useRef(0);
  const requestInFlightRef = useRef(false);
  const endInFlightRef = useRef(false);
  const startInFlightRef = useRef(false);
  /** Shared promise so EndCall can await an in-flight StartLiveInteraction. */
  const startPromiseRef = useRef<Promise<boolean> | null>(null);
  /** True after StartLiveInteraction persisted startedAt (or server already had it). */
  const serverStartedRef = useRef(false);
  /** True after guest published into the public live channel. */
  const agoraJoinedRef = useRef(false);
  const pricingInFlightRef = useRef(false);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const isScreenActiveRef = useRef(isScreenActive);

  phaseRef.current = phase;
  interactionRef.current = interaction;
  isScreenActiveRef.current = isScreenActive;

  const clearPollTimer = useCallback(() => {
    if (pollTimerRef.current != null) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  const clearPendingTimeout = useCallback(() => {
    if (pendingTimeoutRef.current != null) {
      clearTimeout(pendingTimeoutRef.current);
      pendingTimeoutRef.current = null;
    }
  }, []);

  const stopPolling = useCallback(() => {
    pollGenerationRef.current += 1;
    clearPollTimer();
    clearPendingTimeout();
    pollInFlightRef.current = false;
  }, [clearPollTimer, clearPendingTimeout]);

  const resetInteractionData = useCallback(() => {
    serverStartedRef.current = false;
    agoraJoinedRef.current = false;
    startInFlightRef.current = false;
    startPromiseRef.current = null;
    setInteraction(initialInteraction());
  }, []);

  const closeCallNow = useCallback(() => {
    setIsCallNowVisible(false);
    if (
      phaseRef.current === 'FETCHING_PRICING' ||
      phaseRef.current === 'READY' ||
      phaseRef.current === 'FAILED'
    ) {
      setPhase('IDLE');
      setPricingError(null);
      setError(null);
    }
  }, []);

  const fetchPricing = useCallback(async () => {
    if (!astrologerId || pricingInFlightRef.current) {
      return;
    }
    pricingInFlightRef.current = true;
    setPhase('FETCHING_PRICING');
    setPricingError(null);
    try {
      const result = await getLiveInteractionPricing(astrologerId);
      setPricing(result);
      applyWalletBalanceCoins(result.walletBalance);
      useAuthStore.getState().updateWalletBalance(result.walletBalance);
      setPhase('READY');
    } catch (err: any) {
      const message =
        err?.message || 'Unable to load call pricing. Please try again.';
      setPricingError(message);
      setPhase('FAILED');
      loggingService.error('[LiveInteraction] Pricing fetch failed', {
        error: message,
      });
    } finally {
      pricingInFlightRef.current = false;
    }
  }, [astrologerId]);

  const openCallNow = useCallback(() => {
    if (!astrologerId) {
      setError('Astrologer is unavailable for calls right now.');
      return;
    }
    if (
      phaseRef.current === 'PENDING' ||
      phaseRef.current === 'REQUESTING' ||
      phaseRef.current === 'ACCEPTED' ||
      phaseRef.current === 'CONNECTING' ||
      phaseRef.current === 'IN_CALL' ||
      phaseRef.current === 'ENDING'
    ) {
      setError('You already have an active call request.');
      return;
    }
    setError(null);
    setSummary(null);
    setIsCallNowVisible(true);
    fetchPricing();
  }, [astrologerId, fetchPricing]);

  const applyAcceptedCredentials = useCallback(
    (payload: MyLiveInteraction) => {
      const request = payload.request;
      if (!request) {
        return;
      }
      if (!payload.appId || !payload.channelName || !payload.rtcToken || payload.uid == null) {
        setPhase('FAILED');
        setError('Call was accepted but Agora credentials are missing.');
        stopPolling();
        return;
      }

      // Do NOT invent startedAt — only the server StartLiveInteraction may set it.
      if (request.startedAt) {
        serverStartedRef.current = true;
      }

      setInteraction(prev => ({
        ...prev,
        requestId: request.id,
        liveStreamId: request.liveStreamId,
        interactionType: request.interactionType,
        status: request.status,
        agoraUid: request.agoraUid,
        appId: payload.appId,
        channelName: payload.channelName,
        uid: payload.uid,
        rtcToken: payload.rtcToken,
        startedAt: request.startedAt ?? null,
      }));
      setIsCallNowVisible(false);
      setPhase('ACCEPTED');
      stopPolling();
      loggingService.info('[LiveInteraction] Accepted — credentials ready', {
        requestId: request.id,
        status: request.status,
        requestedAt: request.requestedAt,
        acceptedAt: request.acceptedAt,
        startedAt: request.startedAt,
      });
    },
    [stopPolling],
  );

  const handleTerminalStatus = useCallback(
    (status: string, request: LiveInteractionRequest | null) => {
      stopPolling();
      // Allow demote + next request; do not treat a prior publish as still live.
      agoraJoinedRef.current = false;
      setInteraction(prev => ({
        ...prev,
        status: request?.status ?? status,
        requestId: request?.id ?? prev.requestId,
        interactionType: request?.interactionType ?? prev.interactionType,
      }));

      if (status === 'REJECTED') {
        setPhase('REJECTED');
        setError('Astrologer declined your co-host request.');
        setIsCallNowVisible(false);
        return;
      }
      if (status === 'CANCELLED') {
        setPhase('CANCELLED');
        setError(null);
        setIsCallNowVisible(false);
        return;
      }
      if (status === 'ENDED') {
        setPhase('COMPLETED');
        setIsCallNowVisible(false);
        return;
      }
      setPhase('FAILED');
      setError('Your co-host request ended unexpectedly.');
      setIsCallNowVisible(false);
    },
    [stopPolling],
  );

  const pollOnce = useCallback(async (generation: number) => {
    const streamId = interactionRef.current.liveStreamId || liveStreamId;
    if (!streamId) {
      return;
    }
    if (pollInFlightRef.current) {
      return;
    }
    if (appStateRef.current !== 'active' || !isScreenActiveRef.current) {
      return;
    }
    if (phaseRef.current !== 'PENDING') {
      return;
    }

    pollInFlightRef.current = true;
    try {
      const payload = await getMyLiveInteraction(streamId);
      if (generation !== pollGenerationRef.current) {
        return;
      }
      if (phaseRef.current !== 'PENDING') {
        return;
      }

      const request = payload?.request ?? null;
      const status = normalizeStatus(request?.status);

      if (!request || !status) {
        return;
      }

      setInteraction(prev => ({
        ...prev,
        requestId: request.id,
        liveStreamId: request.liveStreamId,
        interactionType: request.interactionType,
        status: request.status,
        agoraUid: request.agoraUid,
      }));

      if (isAccepted(status)) {
        applyAcceptedCredentials(payload as MyLiveInteraction);
        return;
      }

      if (TERMINAL_REQUEST_STATUSES.has(status)) {
        handleTerminalStatus(status, request);
      }
    } catch (err: any) {
      loggingService.error('[LiveInteraction] Poll failed', {
        error: err?.message || err,
      });
    } finally {
      pollInFlightRef.current = false;
    }
  }, [liveStreamId, applyAcceptedCredentials, handleTerminalStatus]);

  const startPolling = useCallback(() => {
    stopPolling();
    const generation = pollGenerationRef.current;
    void pollOnce(generation);
    pollTimerRef.current = setInterval(() => {
      void pollOnce(generation);
    }, POLL_INTERVAL_MS);

    pendingTimeoutRef.current = setTimeout(() => {
      if (phaseRef.current === 'PENDING') {
        stopPolling();
        setPhase('FAILED');
        setError(
          'Astrologer did not respond to your call request. Please try again.',
        );
        setIsCallNowVisible(false);
      }
    }, PENDING_TIMEOUT_MS);
  }, [pollOnce, stopPolling]);

  /**
   * While co-hosting, poll so a host-side EndLiveInteraction demotes the guest
   * back to audience without requiring a private channel leave event.
   */
  const pollActiveOnce = useCallback(
    async (generation: number) => {
      const streamId = interactionRef.current.liveStreamId || liveStreamId;
      if (!streamId || pollInFlightRef.current) {
        return;
      }
      if (appStateRef.current !== 'active' || !isScreenActiveRef.current) {
        return;
      }
      const phaseNow = phaseRef.current;
      if (
        phaseNow !== 'ACCEPTED' &&
        phaseNow !== 'CONNECTING' &&
        phaseNow !== 'IN_CALL'
      ) {
        return;
      }

      pollInFlightRef.current = true;
      try {
        const payload = await getMyLiveInteraction(streamId);
        if (generation !== pollGenerationRef.current) {
          return;
        }
        const status = normalizeStatus(payload?.request?.status);
        if (!status) {
          return;
        }
        if (TERMINAL_REQUEST_STATUSES.has(status)) {
          handleTerminalStatus(status, payload?.request ?? null);
        }
      } catch (err: any) {
        loggingService.error('[LiveInteraction] Active poll failed', {
          error: err?.message || err,
        });
      } finally {
        pollInFlightRef.current = false;
      }
    },
    [liveStreamId, handleTerminalStatus],
  );

  const startActivePolling = useCallback(() => {
    clearPollTimer();
    clearPendingTimeout();
    const generation = pollGenerationRef.current;
    void pollActiveOnce(generation);
    pollTimerRef.current = setInterval(() => {
      void pollActiveOnce(generation);
    }, POLL_INTERVAL_MS);
  }, [clearPollTimer, clearPendingTimeout, pollActiveOnce]);

  const requestCall = useCallback(
    async (
      interactionType: LiveInteractionType,
    ): Promise<{success: boolean; error?: string}> => {
      if (!liveStreamId) {
        const message =
          'Live stream is unavailable. Please rejoin and try again.';
        setError(message);
        return {success: false, error: message};
      }
      if (requestInFlightRef.current) {
        return {success: false};
      }
      if (
        phaseRef.current === 'PENDING' ||
        phaseRef.current === 'ACCEPTED' ||
        phaseRef.current === 'CONNECTING' ||
        phaseRef.current === 'IN_CALL' ||
        phaseRef.current === 'ENDING'
      ) {
        const message = 'You already have an active call request.';
        setError(message);
        return {success: false, error: message};
      }

      if (pricing) {
        const available =
          interactionType === 'AUDIO'
            ? pricing.audioAvailable
            : pricing.videoAvailable;
        const price = getLiveInteractionPricePerMinute(
          pricing,
          interactionType,
        );
        if (!available) {
          const message = `${interactionType === 'AUDIO' ? 'Audio' : 'Video'} call is not available right now.`;
          setError(message);
          return {success: false, error: message};
        }
        if (price == null) {
          const message = 'Call pricing is unavailable. Please try again.';
          setError(message);
          return {success: false, error: message};
        }
        // Prefer live auth wallet; fall back to pricing payload (same coin unit).
        const walletBalance =
          useAuthStore.getState().user?.walletBalance ??
          pricing.walletBalance ??
          0;
        if (!hasMinimumCallBalance(walletBalance, price)) {
          const required = getMinimumRequiredBalance(price);
          const message = `A minimum ${MIN_LIVE_INTERACTION_MINUTES}-minute wallet balance is required (${required} coins). Please recharge to start this call.`;
          setError(message);
          return {success: false, error: message};
        }
      }

      requestInFlightRef.current = true;
      setPhase('REQUESTING');
      setError(null);
      setSummary(null);
      serverStartedRef.current = false;
      agoraJoinedRef.current = false;
      startInFlightRef.current = false;
      startPromiseRef.current = null;

      try {
        const request = await createLiveInteractionRequest({
          liveStreamId,
          interactionType,
        });

        setInteraction({
          ...initialInteraction(),
          requestId: request.id,
          liveStreamId: request.liveStreamId || liveStreamId,
          interactionType: request.interactionType || interactionType,
          status: request.status || 'PENDING',
          agoraUid: request.agoraUid,
        });

        const status = normalizeStatus(request.status);
        if (isAccepted(status)) {
          // Rare fast-path: backend may accept immediately.
          setPhase('PENDING');
          startPolling();
          return {success: true};
        }
        if (TERMINAL_REQUEST_STATUSES.has(status)) {
          handleTerminalStatus(status, request);
          return {success: false, error: 'Call request was not accepted.'};
        }

        setPhase('PENDING');
        setIsCallNowVisible(false);
        startPolling();
        return {success: true};
      } catch (err: any) {
        const message =
          err?.message || 'Unable to send call request. Please try again.';
        setPhase('FAILED');
        setError(message);
        loggingService.error('[LiveInteraction] Create request failed', {
          error: message,
        });
        return {success: false, error: message};
      } finally {
        requestInFlightRef.current = false;
      }
    },
    [liveStreamId, pricing, startPolling, handleTerminalStatus],
  );

  const cancelRequest = useCallback(async () => {
    stopPolling();
    setIsCallNowVisible(false);
    setPhase('CANCELLED');
    setError(
      LIVE_INTERACTION_CANCEL_API_AVAILABLE
        ? null
        : 'Request cancelled locally. Backend cancel API is not available in this app yet.',
    );
    resetInteractionData();

    // Soft-refresh status so a late ACCEPTED poll cannot reopen UI after cancel.
    if (liveStreamId) {
      try {
        await getMyLiveInteraction(liveStreamId);
      } catch {
        // Ignore — local cancel already applied.
      }
    }
  }, [liveStreamId, resetInteractionData, stopPolling]);

  const markConnecting = useCallback(() => {
    if (
      phaseRef.current === 'ACCEPTED' ||
      phaseRef.current === 'CONNECTING'
    ) {
      setPhase('CONNECTING');
    }
  }, []);

  /**
   * Persist billable startedAt on the server after public co-host publish succeeds.
   * Idempotent for a given requestId (guarded by refs / shared promise).
   */
  const ensureServerStarted = useCallback(async (): Promise<boolean> => {
    const current = interactionRef.current;
    const requestId = current.requestId;
    if (!requestId) {
      return false;
    }
    if (serverStartedRef.current && current.startedAt) {
      return true;
    }
    if (startPromiseRef.current) {
      return startPromiseRef.current;
    }

    startInFlightRef.current = true;
    loggingService.info('[LiveInteraction] StartLiveInteraction invoke', {
      requestId,
      status: current.status,
      startedAt: current.startedAt,
      agoraJoined: agoraJoinedRef.current,
    });

    const startPromise = (async (): Promise<boolean> => {
      try {
        const result = await startLiveInteraction(requestId);
        setInteraction(prev => ({
          ...prev,
          requestId: result.id || prev.requestId,
          status: result.status ?? prev.status,
          startedAt: result.startedAt ?? prev.startedAt,
        }));
        loggingService.info('[LiveInteraction] StartLiveInteraction success', {
          requestId: result.id,
          status: result.status,
          requestedAt: result.requestedAt,
          acceptedAt: result.acceptedAt,
          startedAt: result.startedAt,
        });
        if (!result.startedAt) {
          serverStartedRef.current = false;
          loggingService.error(
            '[LiveInteraction] StartLiveInteraction returned without startedAt',
            {requestId: result.id},
          );
          return false;
        }
        serverStartedRef.current = true;
        return true;
      } catch (err: any) {
        loggingService.error('[LiveInteraction] StartLiveInteraction failed', {
          requestId,
          error: err?.message || err,
        });
        return false;
      } finally {
        startInFlightRef.current = false;
        startPromiseRef.current = null;
      }
    })();

    startPromiseRef.current = startPromise;
    return startPromise;
  }, []);

  /**
   * Called when the viewer successfully publishes as co-host on the public channel.
   * Marks IN_CALL and invokes StartLiveInteraction so billing has startedAt.
   */
  const markInCall = useCallback(() => {
    agoraJoinedRef.current = true;
    if (
      phaseRef.current === 'ACCEPTED' ||
      phaseRef.current === 'CONNECTING' ||
      phaseRef.current === 'IN_CALL'
    ) {
      setPhase('IN_CALL');
    }
    loggingService.info('[LiveInteraction] Public co-host publish success', {
      requestId: interactionRef.current.requestId,
      status: interactionRef.current.status,
      startedAt: interactionRef.current.startedAt,
    });
    void ensureServerStarted();
  }, [ensureServerStarted]);

  const dismissTerminal = useCallback(() => {
    stopPolling();
    setPhase('IDLE');
    setError(null);
    setSummary(null);
    setPricingError(null);
    resetInteractionData();
    setIsCallNowVisible(false);
  }, [resetInteractionData, stopPolling]);

  const endCall = useCallback(async (): Promise<EndLiveInteractionResult | null> => {
    const snapshot = interactionRef.current;
    const requestId = snapshot.requestId;
    if (!requestId) {
      setPhase('FAILED');
      setError('Missing active call request.');
      return null;
    }
    if (endInFlightRef.current) {
      loggingService.info('[LiveInteraction] EndLiveInteraction skipped — already in flight', {
        requestId,
      });
      return null;
    }

    // Do not bill/end before the guest actually published on the public channel.
    if (!agoraJoinedRef.current) {
      loggingService.info(
        '[LiveInteraction] End skipped — co-host never published; clearing locally',
        {
          requestId,
          status: snapshot.status,
          startedAt: snapshot.startedAt,
        },
      );
      setPhase('CANCELLED');
      setError('Interaction ended before co-host publishing was established.');
      resetInteractionData();
      return null;
    }

    endInFlightRef.current = true;
    setPhase('ENDING');
    setError(null);

    try {
      // Ensure server startedAt exists before billing end.
      const started = await ensureServerStarted();
      if (!started && !interactionRef.current.startedAt) {
        const message =
          'Call connected, but billing start time was not recorded. Please retry ending the call.';
        setPhase('FAILED');
        setError(message);
        loggingService.error('[LiveInteraction] End blocked — missing startedAt', {
          requestId,
          status: interactionRef.current.status,
          startedAt: interactionRef.current.startedAt,
          agoraJoined: agoraJoinedRef.current,
          serverStarted: serverStartedRef.current,
        });
        // Keep requestId so the user can retry EndLiveInteraction.
        return null;
      }

      loggingService.info('[LiveInteraction] EndLiveInteraction invoke', {
        requestId,
        status: interactionRef.current.status,
        startedAt: interactionRef.current.startedAt,
        agoraJoined: agoraJoinedRef.current,
        serverStarted: serverStartedRef.current,
      });

      const result = await endLiveInteraction(requestId);

      loggingService.info('[LiveInteraction] EndLiveInteraction response', {
        requestId: result.id,
        status: result.status,
        startedAt: result.startedAt,
        endedAt: result.endedAt,
        durationSeconds: result.durationSeconds,
        billableMinutes: result.billableMinutes,
        chargedCoins: result.chargedCoins,
      });

      setSummary(result);
      setInteraction(prev => ({
        ...prev,
        status: result.status,
        startedAt: result.startedAt ?? prev.startedAt,
      }));
      void refreshWalletBalance();
      setPhase('COMPLETED');
      return result;
    } catch (err: any) {
      const message =
        err?.message || 'Failed to end the call. Please retry.';
      setPhase('FAILED');
      setError(message);
      // Preserve requestId / startedAt so retry can reconcile billing.
      loggingService.error('[LiveInteraction] EndLiveInteraction failed', {
        error: message,
        requestId,
        status: interactionRef.current.status,
        startedAt: interactionRef.current.startedAt,
      });
      return null;
    } finally {
      endInFlightRef.current = false;
    }
  }, [ensureServerStarted, resetInteractionData]);

  // Pause/resume polling with AppState.
  useEffect(() => {
    const onChange = (next: AppStateStatus) => {
      const wasActive = appStateRef.current === 'active';
      appStateRef.current = next;
      const phaseNow = phaseRef.current;
      const isPendingPhase = phaseNow === 'PENDING';
      const isActivePhase =
        phaseNow === 'ACCEPTED' ||
        phaseNow === 'CONNECTING' ||
        phaseNow === 'IN_CALL';
      if (!isPendingPhase && !isActivePhase) {
        return;
      }
      if (wasActive && next !== 'active') {
        clearPollTimer();
        return;
      }
      if (!wasActive && next === 'active' && isScreenActiveRef.current) {
        if (isPendingPhase) {
          startPolling();
        } else {
          startActivePolling();
        }
      }
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, [clearPollTimer, startPolling, startActivePolling]);

  // Pending accept/reject polling.
  useEffect(() => {
    if (!isScreenActive && phase === 'PENDING') {
      clearPollTimer();
    } else if (
      isScreenActive &&
      phase === 'PENDING' &&
      appStateRef.current === 'active' &&
      pollTimerRef.current == null
    ) {
      startPolling();
    }
  }, [isScreenActive, phase, clearPollTimer, startPolling]);

  // Active co-host polling (host may end the guest session remotely).
  const isActiveCohostPhase =
    phase === 'ACCEPTED' || phase === 'CONNECTING' || phase === 'IN_CALL';
  useEffect(() => {
    if (!isActiveCohostPhase) {
      return;
    }
    if (!isScreenActive || appStateRef.current !== 'active') {
      clearPollTimer();
      return;
    }
    startActivePolling();
    return () => {
      clearPollTimer();
    };
  }, [
    isScreenActive,
    isActiveCohostPhase,
    clearPollTimer,
    startActivePolling,
  ]);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  const credentials: LiveInteractionCredentials | null =
    interaction.appId &&
    interaction.channelName &&
    interaction.rtcToken &&
    interaction.uid != null
      ? {
          appId: interaction.appId,
          channelName: interaction.channelName,
          uid: interaction.uid,
          rtcToken: interaction.rtcToken,
        }
      : null;

  const isWaiting =
    phase === 'REQUESTING' || phase === 'PENDING';
  const isInCallPhase =
    phase === 'ACCEPTED' ||
    phase === 'CONNECTING' ||
    phase === 'IN_CALL' ||
    phase === 'ENDING';

  return {
    phase,
    pricing,
    pricingError,
    error,
    interaction,
    summary,
    credentials,
    isCallNowVisible,
    isWaiting,
    isInCallPhase,
    /** True once StartLiveInteraction persisted startedAt. */
    hasServerStartedAt: serverStartedRef.current || !!interaction.startedAt,
    cancelApiAvailable: LIVE_INTERACTION_CANCEL_API_AVAILABLE,
    openCallNow,
    closeCallNow,
    refreshPricing: fetchPricing,
    requestCall,
    cancelRequest,
    endCall,
    markConnecting,
    markInCall,
    dismissTerminal,
    stopPolling,
  };
};
