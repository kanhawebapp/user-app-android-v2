import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  AppState,
  AppStateStatus,
  Image,
} from 'react-native';
import {RTCView} from 'react-native-webrtc';

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
  const route = useRoute();
  const {
    callId,
    participant,
    isIncoming = false,
  } = route.params as CallScreenRouteParams;

  const {status, isMuted, endCall, toggleMute, startCall, remoteStream} =
    useCall();


  // Speaker state from store
  const isSpeakerOn = useCallStore(state => state.isSpeakerOn);
  const setSpeakerOn = useCallStore(state => state.setSpeakerOn);

  const [callDuration, setCallDuration] = useState(0);
  const [appState, setAppState] = useState(AppState.currentState);
  const callStartedRef = useRef(false);

  const requestAudioPermission = async () => {
    const {PermissionsAndroid, Platform} = require('react-native');
    if (Platform.OS !== 'android') {
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

  useEffect(() => {
    if (status === 'connected') {
      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [status]);

  useEffect(() => {
    const handler = (nextAppState: AppStateStatus) => {
      if (appState.match(/active/) && nextAppState === 'background') {
        console.log('[CallScreen] App went to background');
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handler);
    return () => subscription.remove();
  }, [appState]);

  useEffect(() => {
    if (status === 'ended' || status === 'rejected') {
      const timer = setTimeout(() => {
        navigation.goBack();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [status, navigation]);

  // Reset call store on unmount
  const resetCallStore = useCallStore(state => state.reset);
  useEffect(() => {
    return () => {
      console.log('[CallScreen] Unmounting, resetting call store');
      resetCallStore();
    };
  }, [resetCallStore]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const handleEndCall = useCallback(() => {
    Alert.alert('End Call', 'Are you sure you want to end this call?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'End',
        style: 'destructive',
        onPress: () => endCall(),
      },
    ]);
  }, [endCall]);

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
        return formatDuration(callDuration);
      case 'ended':
        return 'Call ended';
      case 'rejected':
        return 'Call rejected';
      default:
        return 'Connecting...';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.callContainer}>
        {/* Hidden RTCView for audio attachment (required for Android audio playback) */}
        {remoteStream && (
          <RTCView
            streamURL={remoteStream.toURL()}
            style={styles.hiddenAudio}
            objectFit="contain"
          />
        )}

        {/* Participant Avatar/Info */}
        <View style={styles.participantContainer}>
          {participant?.image ? (
            <Image source={{uri: participant.image}} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {participant?.name?.charAt(0).toUpperCase() || '?'}
              </Text>
            </View>
          )}
          <Text style={styles.participantName}>{participant?.name}</Text>
          <Text style={styles.callStatus}>{getStatusText()}</Text>
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, isMuted && styles.controlButtonActive]}
          onPress={handleToggleMute}>
          <Icon name={isMuted ? 'mic-off' : 'mic'} size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.controlButton,
            isSpeakerOn && styles.controlButtonActive,
          ]}
          onPress={handleToggleSpeaker}>
          <Icon
            name={isSpeakerOn ? 'volume-up' : 'volume-off'}
            size={28}
            color="#fff"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
          <Icon name="call-end" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  callContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hiddenAudio: {
    width: 0,
    height: 0,
    opacity: 0,
  },
  participantContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4a4a4a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 'bold',
  },
  participantName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  callStatus: {
    fontSize: 16,
    color: '#ccc',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    gap: 40,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: '#ff4444',
  },
  endCallButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CallScreen;
