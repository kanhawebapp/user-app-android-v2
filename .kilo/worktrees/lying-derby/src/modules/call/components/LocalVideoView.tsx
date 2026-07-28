import React, {useRef, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {MediaStream, RTCView} from 'react-native-webrtc';

interface LocalVideoViewProps {
  stream: MediaStream | null;
  isVideoEnabled?: boolean;
  style?: object;
}

export const LocalVideoView: React.FC<LocalVideoViewProps> = ({
  stream,
  isVideoEnabled = true,
  style,
}) => {
  const videoRef = useRef<any>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.stream = stream;
    }
  }, [stream]);

  if (!stream || !isVideoEnabled) {
    return (
      <View style={[styles.container, styles.placeholder, style]}>
        <Text style={styles.placeholderText}>Camera Off</Text>
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
        mirror={true}
        zOrder={1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  video: {
    flex: 1,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
  },
  placeholderText: {
    color: '#888',
    fontSize: 12,
  },
});

export default LocalVideoView;
