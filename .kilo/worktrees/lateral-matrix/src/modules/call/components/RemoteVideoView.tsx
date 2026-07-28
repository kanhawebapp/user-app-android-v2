import React, {useRef, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {MediaStream, RTCView} from 'react-native-webrtc';

interface RemoteVideoViewProps {
  stream: MediaStream | null;
  participantName?: string;
  style?: object;
}

export const RemoteVideoView: React.FC<RemoteVideoViewProps> = ({
  stream,
  participantName = 'Remote',
  style,
}) => {
  const videoRef = useRef<any>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.stream = stream;
    }
  }, [stream]);

  if (!stream) {
    return (
      <View style={[styles.container, styles.placeholder, style]}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {participantName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.nameText}>{participantName}</Text>
        <Text style={styles.waitingText}>Waiting for video...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <RTCView
        ref={videoRef}
        streamURL={stream.toURL()}
        style={styles.video}
        objectFit="cover"
        zOrder={0}
      />
      <View style={styles.nameOverlay}>
        <Text style={styles.overlayNameText}>{participantName}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  video: {
    flex: 1,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4a4a4a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  nameText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  waitingText: {
    color: '#888',
    fontSize: 14,
  },
  nameOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  overlayNameText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default RemoteVideoView;
