import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

interface CallControlsProps {
  isMuted: boolean;
  isSpeakerOn: boolean;
  isVideoEnabled: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleSpeaker: () => void;
  onEndCall: () => void;
  onSwitchCamera?: () => void;
}

export const CallControls: React.FC<CallControlsProps> = ({
  isMuted,
  isSpeakerOn,
  isVideoEnabled,
  onToggleMute,
  onToggleVideo,
  onToggleSpeaker,
  onEndCall,
  onSwitchCamera,
}) => {
  const ControlButton = ({
    onPress,
    isActive,
    icon,
    label,
  }: {
    onPress: () => void;
    isActive: boolean;
    icon: string;
    label: string;
  }) => (
    <TouchableOpacity
      style={[styles.controlButton, isActive && styles.controlButtonActive]}
      onPress={onPress}
      activeOpacity={0.7}>
      <Text style={[styles.icon, isActive && styles.iconActive]}>{icon}</Text>
      <Text style={[styles.label, isActive && styles.labelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.controlsRow}>
        <ControlButton
          onPress={onToggleMute}
          isActive={!isMuted}
          icon={isMuted ? '🔇' : '🎤'}
          label={isMuted ? 'Unmute' : 'Mute'}
        />

        <ControlButton
          onPress={onToggleVideo}
          isActive={isVideoEnabled}
          icon={isVideoEnabled ? '📹' : '📷'}
          label={isVideoEnabled ? 'Stop Video' : 'Start Video'}
        />

        <ControlButton
          onPress={onToggleSpeaker}
          isActive={isSpeakerOn}
          icon={isSpeakerOn ? '🔊' : '🔈'}
          label={isSpeakerOn ? 'Speaker' : 'Earpiece'}
        />

        {onSwitchCamera && (
          <ControlButton
            onPress={onSwitchCamera}
            isActive={true}
            icon="🔄"
            label="Flip"
          />
        )}

        <TouchableOpacity
          style={styles.endCallButton}
          onPress={onEndCall}
          activeOpacity={0.7}>
          <Text style={styles.endCallIcon}>📞</Text>
          <Text style={styles.endCallLabel}>End</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    minWidth: 60,
  },
  controlButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  icon: {
    fontSize: 24,
    marginBottom: 4,
  },
  iconActive: {},
  label: {
    color: '#aaa',
    fontSize: 11,
    fontWeight: '500',
  },
  labelActive: {
    color: '#fff',
  },
  endCallButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#ff4444',
    minWidth: 60,
  },
  endCallIcon: {
    fontSize: 24,
    transform: [{rotate: '135deg'}],
    marginBottom: 4,
  },
  endCallLabel: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '500',
  },
});

export default CallControls;
