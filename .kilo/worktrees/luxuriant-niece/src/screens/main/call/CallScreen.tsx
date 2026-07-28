import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  AppState,
} from 'react-native';
import {RTCView} from 'react-native-webrtc';
import {useCall} from '../../../services/call/call.hooks';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useCallStore} from '../../../services/call/call.store';
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

  const {
    status,
    localStream,
    remoteStream,
    isMuted,
    endCall,
    toggleMute,
    switchCamera,
    startCall,
  } = useCall();

  const [callDuration, setCallDuration] = useState(0);
  const [appState, setAppState] = useState(AppState.currentState);
  const callStartedRef = useRef(false);

  // For outgoing calls: trigger startCall when screen mounts
  useEffect(() => {
    if (!isIncoming && !callStartedRef.current) {
      callStartedRef.current = true;
      console.log('[CallScreen] Outgoing call - starting call flow');
      startCall({
        callId: callId,
        callerId: useCallStore.getState().callerId || '',
        calleeId: participant.id,
        roomId: useCallStore.getState().roomId || callId,
        callerName: 'You',
        callerImage: '',
      });
    }
  }, []);

  useEffect(() => {
    if (status === 'connected') {
      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status]);

  useEffect(() => {
    const handler = (nextAppState: string) => {
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

  const renderLocalVideo = () => {
    if (!localStream) {
      return null;
    }
    return (
      <RTCView
        streamURL={localStream.toURL()}
        style={styles.localVideo}
        objectFit="cover"
        mirror={true}
      />
    );
  };

  const renderRemoteVideo = () => {
    if (!remoteStream) {
      return (
        <View style={styles.placeholderVideo}>
          <Icon name="person" size={80} color="#ccc" />
          <Text style={styles.participantName}>
            {participant?.name || 'Connecting...'}
          </Text>
        </View>
      );
    }
    return (
      <RTCView
        streamURL={remoteStream.toURL()}
        style={styles.remoteVideo}
        objectFit="cover"
      />
    );
  };

  const getStatusText = () => {
    switch (status) {
      case 'calling':
        return 'Calling...';
      case 'ringing':
        return 'Incoming call...';
      case 'connecting':
        return 'Connecting...';
      case 'connected':
        return formatDuration(callDuration);
      case 'ended':
        return 'Call ended';
      case 'rejected':
        return 'Call rejected';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        {renderRemoteVideo()}
        {renderLocalVideo()}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.participantName}>{participant?.name}</Text>
        <Text style={styles.callStatus}>{getStatusText()}</Text>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, isMuted && styles.controlButtonActive]}
          onPress={toggleMute}>
          <Icon name={isMuted ? 'mic-off' : 'mic'} size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
          <Icon name="call-end" size={32} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
          <Icon name="videocam" size={28} color="#fff" />
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
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  remoteVideo: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  localVideo: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 100,
    height: 150,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  placeholderVideo: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    alignItems: 'center',
    paddingVertical: 20,
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
