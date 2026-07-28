import React, {useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import LocalVideoView from '../components/LocalVideoView';
import RemoteVideoView from '../components/RemoteVideoView';
import CallControls from '../components/CallControls';
import CallTimer from '../components/CallTimer';
import useCallConnection from '../hooks/useCallConnection';
import {requestMediaPermissions} from '../utils/mediaPermissions';
import {useCallStore} from '../../../stores/call.store';

type CallScreenParams = {
  CallScreen: {
    roomId: string;
    userId: string;
    targetId: string;
    targetName: string;
    callType: 'voice' | 'video';
    signalingUrl?: string;
  };
};

export const CallScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<CallScreenParams, 'CallScreen'>>();
  const {roomId, userId, targetId, targetName, callType, signalingUrl} =
    route.params;

  const {
    callDuration,
    callStatus,
    isMuted,
    isSpeakerOn,
    isVideoEnabled,
    isConnecting,
    isConnected,
    localStream,
    remoteStream,
    connect,
    endCall,
    handleMute,
    handleVideo,
    handleSpeaker,
    switchCamera,
    resetCall,
  } = useCallConnection({
    roomId,
    userId,
    targetId,
    callType,
    signalingUrl,
    onCallConnected: () => {
      console.log('Call connected');
    },
    onCallEnded: () => {
      navigation.goBack();
    },
    onError: error => {
      Alert.alert('Call Error', error.message, [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    },
  });

  const initiateCall = useCallStore(state => state.initiateCall);

  const initializeCall = useCallback(async () => {
    const permissions = await requestMediaPermissions();
    if (!permissions.camera || !permissions.microphone) {
      Alert.alert(
        'Permissions Required',
        'Please grant camera and microphone permissions to make calls.',
        [{text: 'OK', onPress: () => navigation.goBack()}],
      );
      return;
    }

    initiateCall(targetId, callType);
    connect();
  }, [connect, initiateCall, targetId, callType, navigation]);

  useEffect(() => {
    initializeCall();
    return () => {
      resetCall();
    };
  }, [initializeCall, resetCall]);

  const handleEndCall = useCallback(() => {
    Alert.alert('End Call', 'Are you sure you want to end this call?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'End Call',
        style: 'destructive',
        onPress: () => {
          endCall();
          navigation.goBack();
        },
      },
    ]);
  }, [endCall, navigation]);

  const handleToggleMute = useCallback(() => {
    handleMute(!isMuted);
  }, [handleMute, isMuted]);

  const handleToggleVideo = useCallback(() => {
    handleVideo(!isVideoEnabled);
  }, [handleVideo, isVideoEnabled]);

  const handleToggleSpeaker = useCallback(() => {
    handleSpeaker(!isSpeakerOn);
  }, [handleSpeaker, isSpeakerOn]);

  const getStatusText = (): string => {
    if (isConnecting || callStatus === 'connecting') {
      return 'Connecting...';
    }
    if (callStatus === 'ringing') {
      return 'Ringing...';
    }
    if (isConnected || callStatus === 'active') {
      return 'Connected';
    }
    return 'Connecting';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      <View style={styles.videoContainer}>
        <RemoteVideoView
          stream={remoteStream}
          participantName={targetName}
          style={styles.remoteVideo}
        />

        <View style={styles.localVideoContainer}>
          <LocalVideoView
            stream={localStream}
            isVideoEnabled={isVideoEnabled}
            style={styles.localVideo}
          />
        </View>

        <View style={styles.topOverlay}>
          <View style={styles.statusContainer}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>

          {(isConnected || callStatus === 'active') && (
            <CallTimer duration={callDuration} isActive={isConnected} />
          )}
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </View>

      <CallControls
        isMuted={isMuted}
        isSpeakerOn={isSpeakerOn}
        isVideoEnabled={isVideoEnabled}
        onToggleMute={handleToggleMute}
        onToggleVideo={handleToggleVideo}
        onToggleSpeaker={handleToggleSpeaker}
        onEndCall={handleEndCall}
        onSwitchCamera={callType === 'video' ? switchCamera : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  remoteVideo: {
    flex: 1,
  },
  localVideoContainer: {
    position: 'absolute',
    top: 60,
    right: 16,
    zIndex: 10,
  },
  localVideo: {
    width: 100,
    height: 140,
    borderRadius: 8,
    overflow: 'hidden',
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4caf50',
    marginRight: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default CallScreen;
