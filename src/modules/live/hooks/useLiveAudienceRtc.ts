import {useCallback, useEffect, useRef, useState} from 'react';
import {
  AudienceLatencyLevelType,
  ChannelProfileType,
  ClientRoleType,
  ConnectionChangedReasonType,
  ConnectionStateType,
  createAgoraRtcEngine,
  IRtcEngine,
  IRtcEngineEventHandler,
  RemoteVideoState,
  RtcConnection,
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
  /** Fired when a non-host remote (guest/co-host) leaves. */
  onGuestOffline?: (uid: number) => void;
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

const isSameChannel = (
  connection: RtcConnection | undefined,
  channelName: string,
): boolean => {
  if (!connection?.channelId) {
    return true;
  }
  return connection.channelId === channelName;
};

/**
 * Joins the public Agora live channel as an audience member.
 * Tracks host + optional guest/co-host remotes on the SAME channel.
 * Exposes engineRef so the viewer can temporarily publish as a co-host
 * without creating a second channel or RTC engine.
 */
export const useLiveAudienceRtc = ({
  appId,
  channelName,
  rtcToken,
  uid,
  onHostOffline,
  onGuestOffline,
}: UseLiveAudienceRtcOptions) => {
  const [status, setStatus] = useState<LiveRtcStatus>('joining');
  const [error, setError] = useState<string | null>(null);
  const [hostUid, setHostUid] = useState<number | null>(null);
  const [guestUid, setGuestUid] = useState<number | null>(null);
  const [isHostVideoOn, setIsHostVideoOn] = useState(false);
  const [isGuestVideoOn, setIsGuestVideoOn] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [engineReady, setEngineReady] = useState(false);

  const localUidRef = useRef(uid);
  const hostUidRef = useRef<number | null>(null);
  const guestUidRef = useRef<number | null>(null);
  const onHostOfflineRef = useRef(onHostOffline);
  const onGuestOfflineRef = useRef(onGuestOffline);
  const engineRef = useRef<IRtcEngine | null>(null);
  /** When true, local user is publishing as co-host — ignore self in remotes. */
  const isLocalCohostRef = useRef(false);

  onHostOfflineRef.current = onHostOffline;
  onGuestOfflineRef.current = onGuestOffline;

  useEffect(() => {
    const engine = createAgoraRtcEngine();
    let active = true;
    engineRef.current = engine;
    setEngineReady(false);

    setStatus('joining');
    setError(null);
    setHostUid(null);
    setGuestUid(null);
    setIsHostVideoOn(false);
    setIsGuestVideoOn(false);
    hostUidRef.current = null;
    guestUidRef.current = null;
    localUidRef.current = uid;
    isLocalCohostRef.current = false;

    const fail = (message: string) => {
      if (!active) {
        return;
      }
      setStatus('failed');
      setError(message);
    };

    const assignRemote = (remoteUid: number) => {
      if (remoteUid === localUidRef.current) {
        return;
      }
      if (hostUidRef.current == null) {
        hostUidRef.current = remoteUid;
        setHostUid(remoteUid);
        return;
      }
      if (remoteUid === hostUidRef.current) {
        return;
      }
      // Additional remote = public guest/co-host (single guest expected).
      guestUidRef.current = remoteUid;
      setGuestUid(remoteUid);
    };

    const eventHandler: IRtcEngineEventHandler = {
      onJoinChannelSuccess: connection => {
        if (!active || !isSameChannel(connection, channelName)) {
          return;
        }
        setStatus('connected');
      },
      onUserJoined: (connection, remoteUid) => {
        if (!active || !isSameChannel(connection, channelName)) {
          return;
        }
        assignRemote(remoteUid);
      },
      onUserOffline: (connection, remoteUid, reason) => {
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
          guestUid: guestUidRef.current,
          channelName,
          eventChannel: connection?.channelId,
        });

        if (!active || !isSameChannel(connection, channelName)) {
          return;
        }

        if (guestUidRef.current === remoteUid) {
          guestUidRef.current = null;
          setGuestUid(null);
          setIsGuestVideoOn(false);
          onGuestOfflineRef.current?.(remoteUid);
          return;
        }

        const wasHost =
          hostUidRef.current === remoteUid ||
          (hostUidRef.current === null && remoteUid !== localUidRef.current);

        if (wasHost) {
          hostUidRef.current = null;
          setHostUid(null);
          setIsHostVideoOn(false);
          onHostOfflineRef.current?.();
        }
      },
      onRemoteVideoStateChanged: (connection, remoteUid, state) => {
        if (!active || !isSameChannel(connection, channelName)) {
          return;
        }
        assignRemote(remoteUid);
        const decoding =
          state === RemoteVideoState.RemoteVideoStateStarting ||
          state === RemoteVideoState.RemoteVideoStateDecoding;
        if (remoteUid === hostUidRef.current) {
          setIsHostVideoOn(decoding);
        } else if (remoteUid === guestUidRef.current) {
          setIsGuestVideoOn(decoding);
        }
      },
      onConnectionStateChanged: (connection, state, reason) => {
        if (!active || !isSameChannel(connection, channelName)) {
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
      onRequestToken: connection => {
        if (!isSameChannel(connection, channelName)) {
          return;
        }
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
      if (active) {
        setEngineReady(true);
      }
    } catch (err: any) {
      loggingService.error('[LiveRTC] Failed to join channel', {
        error: err?.message,
      });
      fail('Unable to connect to the live stream.');
    }

    return () => {
      active = false;
      setEngineReady(false);
      engineRef.current = null;
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

  const setLocalCohostActive = useCallback(
    (active: boolean, publishingUid?: number | null) => {
      isLocalCohostRef.current = active;
      if (active && publishingUid != null) {
        localUidRef.current = publishingUid;
      } else if (!active) {
        localUidRef.current = uid;
      }
    },
    [uid],
  );

  return {
    status,
    error,
    hostUid,
    guestUid,
    isHostVideoOn,
    isGuestVideoOn,
    retry,
    engineRef,
    engineReady,
    setLocalCohostActive,
    /** Original audience join credentials for demoting back from co-host. */
    audienceCredentials: {appId, channelName, rtcToken, uid},
  };
};
