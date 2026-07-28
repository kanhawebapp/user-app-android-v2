import {useCallback, useRef} from 'react';
import {Alert, Platform, View} from 'react-native';
import {useRoute} from '@react-navigation/native';

import {useCall} from '../../../services/call/call.hooks';
import {useCallStore} from '../../../services/call/call.store';
import {webRTCService} from '../../../services/call/webrtc.service';

// ── Local hooks ─────────────────────────────────────────────────────────────
import {useCallTimer} from './hooks/useCallTimer';
import {useUnansweredCallTimer} from './hooks/useUnansweredCallTimer';
import {useCallPermissions} from './hooks/useCallPermissions';
import {useCallLifecycle} from './hooks/useCallLifecycle';
import {useCallActions} from './hooks/useCallActions';
import {useCallStatus} from './hooks/useCallStatus';

// ── UI components ────────────────────────────────────────────────────────────
import {
  CallParticipantInfo,
  CallStatusBadge,
  HiddenRTCView,
  CallBackground,
} from './components/StaticCallUI';
import {CallControlsBar} from './components/CallControls/CallControlsBar';
import React from 'react';

// ── Types ────────────────────────────────────────────────────────────────────
type CallScreenRouteParams = {
  callId: string;
  participant: {
    id: string;
    name: string;
    image?: string;
  };
  isIncoming?: boolean;
};

type CallActions = ReturnType<typeof useCall>;

const PermissionsAndroid: typeof import('react-native').PermissionsAndroid =
  Platform.OS === 'android'
    ? require('react-native').PermissionsAndroid
    : (null as any);

export const CallScreen = () => {
  // ── Route ──────────────────────────────────────────────────────────────────
  const route = useRoute();
  const {
    callId,
    participant,
    isIncoming = false,
  } = route.params as CallScreenRouteParams;

  // ── Store reads ────────────────────────────────────────────────────────────
  const isMuted = useCallStore(state => state.isMuted);
  const isSpeakerOn = useCallStore(state => state.isSpeakerOn);
  const callDurationRemaining = useCallStore(
    state => state.callDurationRemaining,
  );

  // ── Derived call status (single source of truth for UI) ───────────────────
  const {status, connectionState, isConnected, isConnecting, rawStatus} =
    useCallStatus();

  // ── Core call hook — all RTC + socket actions from a single source ──────────
  const callActions = useCall() as CallActions;
  const {startCall, remoteStream} = callActions;

  // Cancel-call payload extracted up-front (avoids Rules-of-Hooks violation)
  const {cancelCallRequest} = callActions;
  const cancelReqPayload = {
    roomId: useCallStore.getState().roomId,
    astroId: participant.id,
    userId: useCallStore.getState().callerId,
  };

  // ── Custom hooks ──────────────────────────────────────────────────────────
  const callStartedRef = useRef(false);
  const unansweredCallTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const {checkAndRequestAudioPermission} = useCallPermissions();

  useCallTimer();
  useUnansweredCallTimer(
    isIncoming,
    rawStatus,
    participant.id,
    callId,
    unansweredCallTimerRef,
  );

  // Navigation lifecycle: navigate back when call ends/rejected.
  // The lifecycle hook owns `useNavigation` internally; no prop drilling here.
  useCallLifecycle(
    rawStatus,
    participant.id,

    () => {
      // Inline no-arg cleanup that switches on endCall/cancelCall
      if (isConnected) {
        callActions.endCall({
          roomId: useCallStore.getState().roomId,
          astroId: participant.id,
        });
      } else {
        cancelCallRequest(cancelReqPayload);
      }
    },
  );

  // ── Action callbacks ───────────────────────────────────────────────────────
  const {toggleMute, endCall, confirmEndCall} = useCallActions();

  const toggleSpeaker = useCallback(() => {
    const next = !useCallStore.getState().isSpeakerOn;
    webRTCService.toggleSpeaker(next);
    useCallStore.getState().setSpeakerOn(next);
  }, []);

  // End/cancel primary button — connected = endCall, otherwise = cancelCallRequest
  const handlePrimaryAction = useCallback(() => {
    if (rawStatus === 'connected') {
      console.log('ending call from UI');
      endCall({
        roomId: useCallStore.getState().roomId,
        astroId: participant.id,
      });
    } else {
      console.log('cancelling call from UI');
      cancelCallRequest(cancelReqPayload);
    }
  }, [rawStatus, endCall, cancelCallRequest, cancelReqPayload, participant.id]);

  // ── Outgoing call: trigger startCall when screen mounts ────────────────────
  const handleMount = useCallback(async () => {
    if (isIncoming || callStartedRef.current) {
      return;
    }

    callStartedRef.current = true;
    console.log('[CallScreen] Outgoing call - starting call flow');

    const hasPermission = await checkAndRequestAudioPermission();
    if (!hasPermission) {
      console.log('[PERMISSION] Audio permission denied');
      return;
    }

    startCall({
      callId,
      callerId: useCallStore.getState().callerId || '',
      calleeId: participant.id,
      room_id: useCallStore.getState().roomId || callId,
      callerName: 'You',
      callerImage: '',
    });
  }, [
    isIncoming,
    checkAndRequestAudioPermission,
    startCall,
    callId,
    participant,
  ]);

  // ── Perf: stable ref so useEffect deps don't bounce ─────────────────────
  const handleMountRef = useRef(handleMount);
  handleMountRef.current = handleMount;

  React.useEffect(() => {
    void handleMountRef.current();
  }, []); // ← empty deps: stable ref, no double-invoke

  // ── Call state ─────────────────────────────────────────────────────────────
  const isCallConnected = isConnected;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#09090B',
        justifyContent: 'space-between',
      }}>
      <CallBackground />

      {/* Hidden RTCView for remote audio playback — zero-sized */}
      {remoteStream && <HiddenRTCView remoteStream={remoteStream} />}

      {/* ── Participant UI ── */}
      <CallParticipantInfo name={participant?.name || 'Astrologer'} />
      <CallStatusBadge
        status={status}
        callDurationRemaining={callDurationRemaining}
        isIncoming={isIncoming}
      />

      {/* ── Controls ── */}
      <CallControlsBar
        isMuted={isMuted}
        isSpeakerOn={isSpeakerOn}
        isCallConnected={isCallConnected}
        onToggleMute={toggleMute}
        onToggleSpeaker={toggleSpeaker}
        onPrimaryAction={handlePrimaryAction}
      />
    </View>
  );
};

export default CallScreen;
