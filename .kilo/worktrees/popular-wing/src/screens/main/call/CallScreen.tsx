import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  AppState,
  AppStateStatus,
  Platform,
  StatusBar,
} from 'react-native';
import {RTCView} from 'react-native-webrtc';
import {SafeAreaView} from 'react-native-safe-area-context';

const PermissionsAndroid: typeof import('react-native').PermissionsAndroid =
  Platform.OS === 'android'
    ? require('react-native').PermissionsAndroid
    : (null as any);

import {useCall} from '../../../services/call/call.hooks';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useCallStore} from '../../../services/call/call.store';
import {webRTCService} from '../../../services/call/webrtc.service';
import Icon from 'react-native-vector-icons/MaterialIcons';

type CallScreenRouteParams = {
  callId: string;
  participant: {
    id: string;
    name: string;
    image?: string;
  };
  isIncoming?: boolean;
};

export const CallScreen = () => {
  const navigation = useNavigation();
  // const roomId = useCallStore(state => ({roomId: state.roomId}));

  const route = useRoute();
  const {
    callId,
    participant,
    isIncoming = false,
  } = route.params as CallScreenRouteParams;

  const {
    status,
    isMuted,
    endCall,
    toggleMute,
    startCall,
    remoteStream,
    autoCallReject,
    cancelCallRequest,
  } = useCall();

  // Speaker state from store
  const isSpeakerOn = useCallStore(state => state.isSpeakerOn);
  const setSpeakerOn = useCallStore(state => state.setSpeakerOn);
  const callDurationRemaining = useCallStore(
    state => state.callDurationRemaining,
  );
  const [appState, setAppState] = useState(AppState.currentState);
  const callStartedRef = useRef(false);
  // const { cancelCallRequest, autoCallReject } = useChatActions();

  const requestAudioPermission = async () => {
    if (Platform.OS !== 'android' || !PermissionsAndroid) {
      return true;
    }
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    );
    console.log('[PERMISSION] RECORD_AUDIO:', granted);
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  // For outgoing calls: trigger startCall when screen mounts
  useEffect(() => {
    if (!isIncoming && !callStartedRef.current) {
      callStartedRef.current = true;
      console.log('[CallScreen] Outgoing call - starting call flow');

      // Request audio permission before starting call
      (async () => {
        const hasPermission = await requestAudioPermission();
        if (!hasPermission) {
          console.log('[PERMISSION] Audio permission denied');
          return;
        }

        startCall({
          callId: callId,
          callerId: useCallStore.getState().callerId || '',
          calleeId: participant.id,
          room_id: useCallStore.getState().roomId || callId,
          callerName: 'You',
          callerImage: '',
        });
      })();
    }
  }, [callId, isIncoming, participant.id, startCall]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const appStateHandler = useCallback(
    (nextAppState: AppStateStatus) => {
      if (appState.match(/active/) && nextAppState === 'background') {
        console.log('[CallScreen] App went to background');
      }
      setAppState(nextAppState);
    },
    [appState],
  );
  // console.log("user data", participant);
  // console.log("room id", roomId?.roomId);
  // console.log("useCallStore.getState().roomId", useCallStore.getState().roomId);

  // console.log("room idddddd", roomId?.roomId);
  // console.log("astro id", participant.id);
  // console.log("user id", useCallStore.getState().callerId);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', appStateHandler);
    return () => subscription.remove();
  }, [appStateHandler]);

  const handleEndCall = useCallback(() => {
    Alert.alert('End Call', 'Are you sure you want to end this call?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'End',
        style: 'destructive',
        onPress: () => {
          // autoCallReject(participant.id, callId);
          endCall({
            roomId: useCallStore.getState().roomId,
            astroId: participant.id,
          });
        },
      },
    ]);
  }, [endCall, participant.id]);

  const handleToggleMute = useCallback(() => {
    toggleMute();
  }, [toggleMute]);

  const handleToggleSpeaker = useCallback(() => {
    const newState = !isSpeakerOn;
    webRTCService.toggleSpeaker(newState);
    setSpeakerOn(newState);
  }, [isSpeakerOn, setSpeakerOn]);

  const getStatusText = () => {
    switch (status) {
      case 'calling':
        return 'Calling...';
      case 'ringing':
        return 'Incoming call...';
      case 'connecting':
      case 'connecting_webrtc':
      case 'creating_offer':
      case 'sending_offer':
      case 'waiting_answer':
        return 'Connecting...';
      case 'connected':
        return callDurationRemaining > 0
          ? formatDuration(callDurationRemaining)
          : 'Connected';
      case 'ended':
        return 'Call ended';
      case 'rejected':
        return 'Call rejected';
      default:
        return 'Connecting...';
    }
  };

  const unansweredCallTimerRef = useRef<NodeJS.Timeout | null>(null);
  const didClearOnConnectedRef = useRef(false);

  useEffect(() => {
    // Reset guard when entering a fresh call flow
    if (status === 'ended' || status === 'rejected') {
      didClearOnConnectedRef.current = false;
    }

    // only for outgoing calls
    if (!isIncoming && status === 'calling') {
      console.log('[CallScreen] Starting unanswered call timer (60s)');

      unansweredCallTimerRef.current = setTimeout(() => {
        console.log('[CallScreen] Call not answered within 60s, ending call');

        endCall({
          roomId: useCallStore.getState().roomId,
          astroId: participant.id,
        });
      }, 60000);
    }

    // if call connected before 60 sec then stop timer - only run ONCE
    if (status === 'connected' && !didClearOnConnectedRef.current) {
      console.log('[CallScreen] Call connected, clearing unanswered timer');
      didClearOnConnectedRef.current = true;

      if (unansweredCallTimerRef.current) {
        clearTimeout(unansweredCallTimerRef.current);
        unansweredCallTimerRef.current = null;
      }
    }

    // cleanup on unmount or status change
    return () => {
      if (unansweredCallTimerRef.current) {
        clearTimeout(unansweredCallTimerRef.current);
        unansweredCallTimerRef.current = null;
      }
    };
  }, [status, isIncoming, participant.id, callId, autoCallReject, endCall]);

  const isCallConnected = status === 'connected';

  useEffect(() => {
    if (status === 'connected' && callDurationRemaining <= 0) {
      console.log('[CallScreen] Timer reached 0 — ending call');

      endCall({
        roomId: useCallStore.getState().roomId,
        astroId: participant.id,
      });
    }
  }, [callDurationRemaining, status, participant.id, endCall]);

  // Navigate back when call ends or is rejected

  useEffect(() => {
    console.log('i am here for navigate back', status);
    if (status === 'ended' || status === 'rejected') {
      if (navigation.canGoBack()) {
        console.log('[CallScreen] Call', status, '— navigating back');
        navigation.goBack();
      }
    }
  }, [status]);

  // return (
  //   <View style={styles.container}>
  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <StatusBar
        translucent={false}
        backgroundColor="#09090B"
        barStyle="light-content"
      />

      <View style={styles.container}>
        {/* Background */}
        <View style={styles.topGlow} />
        <View style={styles.bottomGlow} />

        {/* Hidden RTCView */}
        {remoteStream && (
          <RTCView
            streamURL={remoteStream.toURL()}
            style={styles.hiddenAudio}
            objectFit="contain"
          />
        )}

        {/* Main Content */}
        <View style={styles.content}>
          <View style={styles.avatarPlaceholder}>
            {/* Premium layered circle */}
            <View style={styles.avatarOuterGlow} />
            <View style={styles.avatarInnerCircle}>
              <Text style={styles.avatarText}>
                {(participant?.name?.trim()?.[0] || '?').toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Name */}
          <Text numberOfLines={1} style={styles.participantName}>
            {participant?.name || 'Astrologer'}
          </Text>

          {/* Status */}
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                status === 'connected' && styles.connectedDot,
              ]}
            />

            <Text style={styles.callStatus}>{getStatusText()}</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controlsOuter}>
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.controlButton,
                isMuted && styles.controlButtonActive,
              ]}
              onPress={handleToggleMute}>
              <Icon name={isMuted ? 'mic-off' : 'mic'} size={26} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.controlButton,
                isSpeakerOn && styles.controlButtonActive,
              ]}
              onPress={handleToggleSpeaker}>
              <Icon
                name={isSpeakerOn ? 'volume-up' : 'volume-down'}
                size={26}
                color="#fff"
              />
            </TouchableOpacity>

            {/* <TouchableOpacity
            activeOpacity={0.85}
            style={styles.endCallButton}
            onPress={handleEndCall}>
            <Icon name="call-end" size={30} color="#fff" />
          </TouchableOpacity> */}

            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.endCallButton,
                isCallConnected
                  ? styles.endCallButtonConnected
                  : styles.endCallButtonWaiting,
              ]}
              onPress={() => {
                if (isCallConnected) {
                  console.log('ending call from UI');
                  handleEndCall();
                } else {
                  console.log('cancelling call from UI');
                  cancelCallRequest({
                    roomId: useCallStore.getState().roomId,
                    astroId: participant.id,
                    userId: useCallStore.getState().callerId,
                  });
                }
              }}>
              <Icon
                name={isCallConnected ? 'call-end' : 'close'}
                size={30}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

/* ===================== REPLACE COMPLETE STYLES ===================== */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  container: {
    flex: 1,
    backgroundColor: '#09090B',
    justifyContent: 'space-between',
  },

  hiddenAudio: {
    width: 0,
    height: 0,
    opacity: 0,
  },

  /* ================= Background ================= */

  topGlow: {
    position: 'absolute',
    top: -120,
    alignSelf: 'center',
    width: 320,
    height: 320,
    borderRadius: 320,
    backgroundColor: 'rgba(99,102,241,0.16)',
  },

  bottomGlow: {
    position: 'absolute',
    bottom: -180,
    alignSelf: 'center',
    width: 420,
    height: 420,
    borderRadius: 420,
    backgroundColor: 'rgba(239,68,68,0.10)',
  },

  /* ================= Content ================= */

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  avatarWrapper: {
    marginBottom: 26,
  },

  participantName: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 14,
    letterSpacing: 0.3,
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
    marginRight: 8,
  },

  connectedDot: {
    backgroundColor: '#22C55E',
  },

  callStatus: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.2,
  },

  /* ================= Controls ================= */

  controlsOuter: {
    paddingBottom: 42,
    paddingTop: 20,
  },

  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 26,
  },

  controlButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },

  controlButtonActive: {
    backgroundColor: '#27272A',
    borderColor: 'rgba(255,255,255,0.12)',
  },

  endCallButton: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#EF4444',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 12,
  },
  /////
  avatar: {
    width: 145,
    height: 145,
    borderRadius: 72.5,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  avatarPlaceholder: {
    width: 145,
    height: 145,
    borderRadius: 72.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },

  avatarOuterGlow: {
    position: 'absolute',
    width: 145,
    height: 145,
    borderRadius: 72.5,
    backgroundColor: 'rgba(212,175,55,0.18)',

    shadowColor: '#D4AF37',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 12,
  },

  avatarInnerCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#1c1c27',

    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  avatarText: {
    color: '#D4AF37',
    fontSize: 56,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,

    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 6,
  },
  ///
  endCallButtonWaiting: {
    backgroundColor: '#27272A',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },

  endCallButtonConnected: {
    backgroundColor: '#EF4444',

    shadowColor: '#EF4444',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 12,

    transform: [{scale: 1.05}],
  },
});

export default CallScreen;
