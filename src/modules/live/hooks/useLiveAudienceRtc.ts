import {useCallback, useEffect, useRef, useState} from 'react';
import {
  AudienceLatencyLevelType,
  ChannelProfileType,
  ClientRoleType,
  ConnectionChangedReasonType,
  ConnectionStateType,
  createAgoraRtcEngine,
  IRtcEngineEventHandler,
  RemoteVideoState,
  UserOfflineReasonType,
} from 'react-native-agora';
import loggingService from '../../../services/logging';

export type LiveRtcStatus =
  | 'joining'
  | 'connected'
  | 'reconnecting'
  | 'failed'
  | 'left';

interface UseLiveAudienceRtcOptions {
  appId: string;
  channelName: string;
  rtcToken: string;
  uid: number;
  /** Fired once the tracked host leaves the channel (Agora onUserOffline). */
  onHostOffline?: () => void;
}

const getConnectionFailureMessage = (
  reason: ConnectionChangedReasonType,
): string => {
  switch (reason) {
    case ConnectionChangedReasonType.ConnectionChangedInvalidToken:
    case ConnectionChangedReasonType.ConnectionChangedTokenExpired:
      return 'Your access to this live session has expired. Please join again.';
    case ConnectionChangedReasonType.ConnectionChangedBannedByServer:
    case ConnectionChangedReasonType.ConnectionChangedRejectedByServer:
      return 'You are not allowed to join this live session.';
    default:
      return 'Unable to connect to the live stream.';
  }
};

/**
 * Joins an Agora live-broadcasting channel as an audience member (never publishes)
 * and tracks the host's video. Leaves the channel and releases the engine on unmount.
 */
export const useLiveAudienceRtc = ({
  appId,
  channelName,
  rtcToken,
  uid,
  onHostOffline,
}: UseLiveAudienceRtcOptions) => {
  const [status, setStatus] = useState<LiveRtcStatus>('joining');
  const [error, setError] = useState<string | null>(null);
  const [hostUid, setHostUid] = useState<number | null>(null);
  const [isHostVideoOn, setIsHostVideoOn] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const localUidRef = useRef(uid);
  const hostUidRef = useRef<number | null>(null);
  const onHostOfflineRef = useRef(onHostOffline);
  onHostOfflineRef.current = onHostOffline;

  useEffect(() => {
    const engine = createAgoraRtcEngine();
    let active = true;

    setStatus('joining');
    setError(null);
    setHostUid(null);
    setIsHostVideoOn(false);
    hostUidRef.current = null;
    localUidRef.current = uid;

    const fail = (message: string) => {
      if (!active) {
        return;
      }
      setStatus('failed');
      setError(message);
    };

    const eventHandler: IRtcEngineEventHandler = {
      onJoinChannelSuccess: () => {
        if (active) {
          setStatus('connected');
        }
      },
      onUserJoined: (_connection, remoteUid) => {
        if (!active) {
          return;
        }
        if (remoteUid !== localUidRef.current) {
          setHostUid(prev => {
            const next = prev ?? remoteUid;
            hostUidRef.current = next;
            return next;
          });
        }
      },
      onUserOffline: (_connection, remoteUid, reason) => {
        loggingService.info('[LiveRTC] onUserOffline', {
          remoteUid,
          reason,
          reasonName: Object.keys(UserOfflineReasonType).find(
            key =>
              UserOfflineReasonType[
                key as keyof typeof UserOfflineReasonType
              ] === reason,
          ),
          localUid: localUidRef.current,
          hostUid: hostUidRef.current,
          channelName,
        });

        if (!active) {
          return;
        }

        const wasHost =
          hostUidRef.current === remoteUid ||
          // Host left before we locked a uid — treat the first remote leave as host.
          (hostUidRef.current === null && remoteUid !== localUidRef.current);

        if (wasHost) {
          hostUidRef.current = null;
          setHostUid(null);
          setIsHostVideoOn(false);
          onHostOfflineRef.current?.();
        }
      },
      onRemoteVideoStateChanged: (_connection, remoteUid, state) => {
        if (!active) {
          return;
        }
        setHostUid(prev => {
          const next = prev ?? remoteUid;
          hostUidRef.current = next;
          return next;
        });
        setIsHostVideoOn(
          state === RemoteVideoState.RemoteVideoStateStarting ||
            state === RemoteVideoState.RemoteVideoStateDecoding,
        );
      },
      onConnectionStateChanged: (_connection, state, reason) => {
        if (!active) {
          return;
        }
        if (state === ConnectionStateType.ConnectionStateConnected) {
          setStatus('connected');
          setError(null);
        } else if (state === ConnectionStateType.ConnectionStateReconnecting) {
          setStatus('reconnecting');
        } else if (state === ConnectionStateType.ConnectionStateDisconnected) {
          setStatus('left');
        } else if (state === ConnectionStateType.ConnectionStateFailed) {
          fail(getConnectionFailureMessage(reason));
        }
      },
      onRequestToken: () => {
        fail(
          'Your access to this live session has expired. Please join again.',
        );
      },
      onError: err => {
        loggingService.error('[LiveRTC] Engine error', {code: err});
      },
    };

    try {
      const initResult = engine.initialize({
        appId,
        channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
      });
      if (initResult < 0) {
        throw new Error(`initialize failed (${initResult})`);
      }

      engine.registerEventHandler(eventHandler);
      engine.enableVideo();

      const joinResult = engine.joinChannel(rtcToken, channelName, uid, {
        channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
        clientRoleType: ClientRoleType.ClientRoleAudience,
        audienceLatencyLevel:
          AudienceLatencyLevelType.AudienceLatencyLevelLowLatency,
        publishCameraTrack: false,
        publishMicrophoneTrack: false,
        autoSubscribeAudio: true,
        autoSubscribeVideo: true,
      });
      if (joinResult < 0) {
        throw new Error(`joinChannel failed (${joinResult})`);
      }
    } catch (err: any) {
      loggingService.error('[LiveRTC] Failed to join channel', {
        error: err?.message,
      });
      fail('Unable to connect to the live stream.');
    }

    return () => {
      active = false;
      try {
        engine.unregisterEventHandler(eventHandler);
        engine.leaveChannel();
        engine.release();
      } catch (err: any) {
        loggingService.error('[LiveRTC] Cleanup failed', {
          error: err?.message,
        });
      }
    };
  }, [appId, channelName, rtcToken, uid, attempt]);

  const retry = useCallback(() => setAttempt(prev => prev + 1), []);

  return {
    status,
    error,
    hostUid,
    isHostVideoOn,
    retry,
  };
};
