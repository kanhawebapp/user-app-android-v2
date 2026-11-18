import {MutableRefObject, useCallback, useEffect, useRef, useState} from 'react';
import {
  AudienceLatencyLevelType,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
} from 'react-native-agora';
import loggingService from '../../../services/logging';
import type {LiveInteractionType} from '../../../services/api/liveInteractions/live-interactions.types';

export type LiveCohostStatus =
  | 'idle'
  | 'promoting'
  | 'publishing'
  | 'demoting'
  | 'failed';

interface AudienceCredentials {
  appId: string;
  channelName: string;
  rtcToken: string;
  uid: number;
}

interface UseLivePublicCohostOptions {
  /** Promote to broadcaster on the existing public channel. */
  enabled: boolean;
  sessionKey: string | null;
  engineRef: MutableRefObject<IRtcEngine | null>;
  engineReady: boolean;
  /** Must match the public live channel the viewer already joined. */
  publicChannelName: string;
  audienceCredentials: AudienceCredentials;
  /** Publisher credentials from getMyLiveInteraction (same public channel). */
  publisherAppId: string | null;
  publisherChannelName: string | null;
  publisherRtcToken: string | null;
  publisherUid: number | null;
  interactionType: LiveInteractionType | null;
  onPromoted?: () => void;
  onFailed?: (message: string) => void;
  setLocalCohostActive?: (active: boolean, publishingUid?: number | null) => void;
}

/**
 * Promotes the current audience member to a broadcaster/co-host on the SAME
 * public live Agora channel. Never creates a second channel (no joinChannelEx).
 */
export const useLivePublicCohost = ({
  enabled,
  sessionKey,
  engineRef,
  engineReady,
  publicChannelName,
  audienceCredentials,
  publisherAppId,
  publisherChannelName,
  publisherRtcToken,
  publisherUid,
  interactionType,
  onPromoted,
  onFailed,
  setLocalCohostActive,
}: UseLivePublicCohostOptions) => {
  const [status, setStatus] = useState<LiveCohostStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const publishingRef = useRef(false);
  const promotingRef = useRef(false);
  const attemptedSessionsRef = useRef<Set<string>>(new Set());
  const activeSessionRef = useRef<string | null>(null);
  const rejoinedAsPublisherRef = useRef(false);

  const onPromotedRef = useRef(onPromoted);
  const onFailedRef = useRef(onFailed);
  const setLocalCohostActiveRef = useRef(setLocalCohostActive);
  onPromotedRef.current = onPromoted;
  onFailedRef.current = onFailed;
  setLocalCohostActiveRef.current = setLocalCohostActive;

  const stopLocalPublish = useCallback((engine: IRtcEngine) => {
    try {
      engine.muteLocalAudioStream(true);
      engine.enableLocalVideo(false);
      engine.muteLocalVideoStream(true);
      engine.stopPreview();
      engine.updateChannelMediaOptions({
        publishMicrophoneTrack: false,
        publishCameraTrack: false,
        clientRoleType: ClientRoleType.ClientRoleAudience,
        audienceLatencyLevel:
          AudienceLatencyLevelType.AudienceLatencyLevelLowLatency,
      });
      engine.setClientRole(ClientRoleType.ClientRoleAudience);
    } catch (err: any) {
      loggingService.error('[LiveCohost] stopLocalPublish failed', {
        error: err?.message,
      });
    }
  }, []);

  const demoteToAudience = useCallback(async () => {
    const engine = engineRef.current;
    if (!engine) {
      publishingRef.current = false;
      setLocalCohostActiveRef.current?.(false);
      setStatus('idle');
      return;
    }

    setStatus('demoting');
    loggingService.info('[LiveCohost] Demoting to audience', {
      sessionKey: activeSessionRef.current,
      rejoinedAsPublisher: rejoinedAsPublisherRef.current,
    });

    try {
      stopLocalPublish(engine);

      if (rejoinedAsPublisherRef.current) {
        // Publisher used a different uid — rejoin as original audience.
        engine.leaveChannel();
        const joinResult = engine.joinChannel(
          audienceCredentials.rtcToken,
          audienceCredentials.channelName,
          audienceCredentials.uid,
          {
            channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
            clientRoleType: ClientRoleType.ClientRoleAudience,
            audienceLatencyLevel:
              AudienceLatencyLevelType.AudienceLatencyLevelLowLatency,
            publishCameraTrack: false,
            publishMicrophoneTrack: false,
            autoSubscribeAudio: true,
            autoSubscribeVideo: true,
          },
        );
        if (joinResult < 0) {
          throw new Error(`rejoin as audience failed (${joinResult})`);
        }
        rejoinedAsPublisherRef.current = false;
      }
    } catch (err: any) {
      loggingService.error('[LiveCohost] Demote failed', {
        error: err?.message,
      });
    } finally {
      publishingRef.current = false;
      promotingRef.current = false;
      activeSessionRef.current = null;
      setLocalCohostActiveRef.current?.(false);
      setIsMuted(false);
      setIsCameraOff(false);
      setStatus('idle');
    }
  }, [engineRef, audienceCredentials, stopLocalPublish]);

  const demoteRef = useRef(demoteToAudience);
  demoteRef.current = demoteToAudience;

  useEffect(() => {
    if (!enabled || !sessionKey || !engineReady) {
      return;
    }

    if (attemptedSessionsRef.current.has(sessionKey)) {
      return;
    }
    if (publishingRef.current || promotingRef.current) {
      return;
    }

    const engine = engineRef.current;
    if (!engine) {
      setStatus('failed');
      setError('Live engine is not ready to publish.');
      onFailedRef.current?.('Live engine is not ready to publish.');
      return;
    }

    if (
      !publisherAppId ||
      !publisherChannelName ||
      !publisherRtcToken ||
      publisherUid == null ||
      !interactionType
    ) {
      return;
    }

    if (publisherChannelName.trim() !== publicChannelName.trim()) {
      const message =
        'Guest credentials are for a different channel. Public co-host requires the same live channel.';
      loggingService.error('[LiveCohost] Channel mismatch', {
        publicChannelName,
        publisherChannelName,
      });
      attemptedSessionsRef.current.add(sessionKey);
      setStatus('failed');
      setError(message);
      onFailedRef.current?.(message);
      return;
    }

    promotingRef.current = true;
    attemptedSessionsRef.current.add(sessionKey);
    activeSessionRef.current = sessionKey;
    setStatus('promoting');
    setError(null);
    setIsMuted(false);
    setIsCameraOff(false);

    const isVideo = interactionType === 'VIDEO';
    let cancelled = false;

    const promote = async () => {
      try {
        loggingService.info('[LiveCohost] Promoting to broadcaster', {
          sessionKey,
          publicChannelName,
          publisherUid,
          audienceUid: audienceCredentials.uid,
          interactionType,
        });

        const sameUid = Number(publisherUid) === Number(audienceCredentials.uid);

        if (sameUid) {
          const renew = engine.renewToken(publisherRtcToken);
          if (renew < 0) {
            loggingService.info('[LiveCohost] renewToken result', {renew});
          }
          const roleResult = engine.setClientRole(
            ClientRoleType.ClientRoleBroadcaster,
          );
          if (roleResult < 0) {
            throw new Error(`setClientRole failed (${roleResult})`);
          }
          const optionsResult = engine.updateChannelMediaOptions({
            publishMicrophoneTrack: true,
            publishCameraTrack: isVideo,
            clientRoleType: ClientRoleType.ClientRoleBroadcaster,
            autoSubscribeAudio: true,
            autoSubscribeVideo: true,
          });
          if (optionsResult < 0) {
            throw new Error(
              `updateChannelMediaOptions failed (${optionsResult})`,
            );
          }
        } else {
          // Different publisher uid — rejoin same public channel as broadcaster.
          engine.leaveChannel();
          const joinResult = engine.joinChannel(
            publisherRtcToken,
            publisherChannelName,
            Number(publisherUid),
            {
              channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
              clientRoleType: ClientRoleType.ClientRoleBroadcaster,
              publishMicrophoneTrack: true,
              publishCameraTrack: isVideo,
              autoSubscribeAudio: true,
              autoSubscribeVideo: true,
            },
          );
          if (joinResult < 0) {
            throw new Error(`join as broadcaster failed (${joinResult})`);
          }
          rejoinedAsPublisherRef.current = true;
        }

        engine.enableAudio();
        engine.enableLocalAudio(true);
        engine.muteLocalAudioStream(false);

        if (isVideo) {
          engine.enableVideo();
          engine.enableLocalVideo(true);
          engine.muteLocalVideoStream(false);
          engine.startPreview();
        } else {
          engine.enableLocalVideo(false);
          engine.muteLocalVideoStream(true);
          engine.stopPreview();
        }

        if (cancelled) {
          await demoteRef.current();
          return;
        }

        publishingRef.current = true;
        promotingRef.current = false;
        setLocalCohostActiveRef.current?.(true, Number(publisherUid));
        setStatus('publishing');
        onPromotedRef.current?.();
      } catch (err: any) {
        promotingRef.current = false;
        publishingRef.current = false;
        setLocalCohostActiveRef.current?.(false);
        const message =
          err?.message || 'Unable to start public live co-host publishing.';
        loggingService.error('[LiveCohost] Promote failed', {
          error: message,
          sessionKey,
        });
        if (!cancelled) {
          setStatus('failed');
          setError(message);
          onFailedRef.current?.(message);
        }
      }
    };

    void promote();

    return () => {
      cancelled = true;
    };
  }, [
    enabled,
    sessionKey,
    engineReady,
    engineRef,
    publicChannelName,
    audienceCredentials.uid,
    publisherAppId,
    publisherChannelName,
    publisherRtcToken,
    publisherUid,
    interactionType,
  ]);

  // Demote when disabled (end guest / leave interaction).
  useEffect(() => {
    if (enabled) {
      return;
    }
    if (!publishingRef.current && !promotingRef.current) {
      return;
    }
    void demoteRef.current();
  }, [enabled]);

  useEffect(() => {
    if (!enabled && status === 'idle') {
      attemptedSessionsRef.current.clear();
    }
  }, [enabled, status]);

  const clearAttemptedSessions = useCallback(() => {
    attemptedSessionsRef.current.clear();
  }, []);

  const toggleMute = useCallback(() => {
    const engine = engineRef.current;
    if (!engine || !publishingRef.current) {
      return;
    }
    const next = !isMuted;
    try {
      engine.muteLocalAudioStream(next);
      setIsMuted(next);
    } catch (err: any) {
      loggingService.error('[LiveCohost] mute failed', {error: err?.message});
    }
  }, [engineRef, isMuted]);

  const toggleCamera = useCallback(() => {
    if (interactionType !== 'VIDEO') {
      return;
    }
    const engine = engineRef.current;
    if (!engine || !publishingRef.current) {
      return;
    }
    const next = !isCameraOff;
    try {
      engine.enableLocalVideo(!next);
      engine.muteLocalVideoStream(next);
      if (next) {
        engine.stopPreview();
      } else {
        engine.startPreview();
      }
      engine.updateChannelMediaOptions({
        publishCameraTrack: !next,
        publishMicrophoneTrack: !isMuted,
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      });
      setIsCameraOff(next);
    } catch (err: any) {
      loggingService.error('[LiveCohost] camera toggle failed', {
        error: err?.message,
      });
    }
  }, [engineRef, interactionType, isCameraOff, isMuted]);

  const switchCamera = useCallback(() => {
    if (interactionType !== 'VIDEO') {
      return;
    }
    try {
      engineRef.current?.switchCamera();
    } catch (err: any) {
      loggingService.error('[LiveCohost] switchCamera failed', {
        error: err?.message,
      });
    }
  }, [engineRef, interactionType]);

  return {
    status,
    error,
    isMuted,
    isCameraOff,
    isPublishing: status === 'publishing',
    toggleMute,
    toggleCamera,
    switchCamera,
    leaveCohost: demoteToAudience,
    clearAttemptedSessions,
  };
};
