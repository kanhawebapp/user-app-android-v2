import React, {useRef} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {RTCView} from 'react-native-webrtc';
import {MediaStream} from 'react-native-webrtc';

type CallParticipantInfoProps = {
  name: string;
};

export const AvatarCircle: React.FC<CallParticipantInfoProps> = ({name}) => (
  <View style={styles.avatarPlaceholder}>
    {/* Outer gold glow layer */}
    <View style={styles.avatarOuterGlow} />
    <View style={styles.avatarInnerCircle}>
      <Text style={styles.avatarText}>
        {(name?.trim()?.[0] || '?').toUpperCase()}
      </Text>
    </View>
  </View>
);

export const CallParticipantInfo: React.FC<CallParticipantInfoProps> = ({
  name,
}) => (
  <View style={styles.content}>
    <AvatarCircle name={name} />
    <Text numberOfLines={1} style={styles.participantName}>
      {name || 'Astrologer'}
    </Text>
  </View>
);

/**
 * CallParticipants
 *
 * Renders the participant name with a styled status dot and label beneath the
 * avatar.  Connects to the store to read `status` and `callDurationRemaining`
 * so it does not need to be passed as a Prop (avoids prop drilling).
 */
export const CallStatusBadge: React.FC<{
  status: 'ringing' | 'connecting' | 'connected';
  callDurationRemaining: number;
  isIncoming?: boolean;
}> = ({status, callDurationRemaining, isIncoming}) => {
  const getStatusText = () => {
    switch (status) {
      case 'ringing':
        return isIncoming ? 'Incoming call...' : 'Calling...';
      case 'connecting':
        return 'Connecting...';
      case 'connected':
        return callDurationRemaining > 0
          ? formatDuration(callDurationRemaining)
          : 'Connected';
      default:
        return 'Connecting...';
    }
  };

  const isConnected = status === 'connected';

  return (
    <View style={styles.statusContainer}>
      <View style={[styles.statusDot, isConnected && styles.connectedDot]} />
      <Text style={styles.callStatus}>{getStatusText()}</Text>
    </View>
  );
};

/**
 * Renders a hidden RTCView used solely to mount the remote media stream
 * (audio playback).  The view is invisible and zero-sized.
 */
export const HiddenRTCView: React.FC<{remoteStream: MediaStream}> = ({
  remoteStream,
}) => (
  <RTCView
    streamURL={remoteStream.toURL()}
    style={styles.hiddenAudio}
    objectFit="contain"
  />
);

/**
 * CallBackground
 *
 * Two absolute-positioned radial gradients that replicate the ambient neon
 * glow in the original call screen.
 */
export const CallBackground: React.FC = () => (
  <>
    <View style={styles.topGlow} />
    <View style={styles.bottomGlow} />
  </>
);

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  /* ================= Content ================= */
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
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

  participantName: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 14,
    letterSpacing: 0.3,
  },

  /* ================= Status ================= */

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
});
