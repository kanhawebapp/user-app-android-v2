import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  AppState,
  AppStateStatus,
} from 'react-native';
import {
  RenderModeType,
  RtcSurfaceView,
  VideoSourceType,
} from 'react-native-agora';
import {Text} from '../../../components/Text';
import {Icon} from '../../../components/Icon';
import type {LiveInteractionType} from '../../../services/api/liveInteractions/live-interactions.types';
import type {LiveCohostStatus} from '../../../modules/live/hooks/useLivePublicCohost';
import {
  formatCallCountdown,
  getRemainingSecondsFromEndTime,
} from '../../../services/api/liveInteractions/live-interaction-billing';

interface LiveCohostControlsProps {
  /** Local active guest/co-host only — never for normal viewers. */
  visible: boolean;
  requestId: string | null | undefined;
  interactionType: LiveInteractionType | null;
  status: LiveCohostStatus;
  displayName: string;
  isMuted: boolean;
  isCameraOff: boolean;
  /** Absolute end timestamp (ms). When set, countdown shows in this card. */
  endsAt?: number | null;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  /** Parent owns EndLiveInteraction + timer cleanup (manual / auto). */
  onLeave: () => void;
  onCountdownExpired?: () => void;
}

/**
 * RTC guest/co-host card with in-card wallet countdown.
 */
export const LiveCohostControls: React.FC<LiveCohostControlsProps> = ({
  visible,
  interactionType,
  status,
  isMuted,
  isCameraOff,
  endsAt = null,
  onToggleMute,
  onToggleCamera,
  onLeave,
  onCountdownExpired,
}) => {
  const expiredRef = useRef(false);
  const onExpiredRef = useRef(onCountdownExpired);
  onExpiredRef.current = onCountdownExpired;

  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(
    () => (endsAt != null ? getRemainingSecondsFromEndTime(endsAt) : null),
  );

  useEffect(() => {
    if (endsAt == null) {
      setRemainingSeconds(null);
      expiredRef.current = false;
      return;
    }

    // New absolute deadline (e.g. wallet shrink after gifts) — allow one
    // expiry for this endsAt value; do not restart from a full duration.
    expiredRef.current = false;
    const tick = () => {
      const remaining = getRemainingSecondsFromEndTime(endsAt);
      setRemainingSeconds(remaining);
      if (remaining <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        onExpiredRef.current?.();
      }
    };

    tick();

    const intervalId = setInterval(tick, 1000);
    const onAppState = (next: AppStateStatus) => {
      if (next === 'active') {
        tick();
      }
    };
    const sub = AppState.addEventListener('change', onAppState);

    return () => {
      clearInterval(intervalId);
      sub.remove();
    };
  }, [endsAt]);

  const handleEndPress = useCallback(() => {
    onLeave();
  }, [onLeave]);

  if (!visible) {
    return null;
  }

  const isVideo = interactionType === 'VIDEO';
  const isAudio = interactionType === 'AUDIO';
  if (!isVideo && !isAudio) {
    return null;
  }

  const isConnected = status === 'publishing';
  const showLocalVideo = isVideo && !isCameraOff && isConnected;

  const connectionLabel = !isConnected
    ? status === 'promoting'
      ? 'Joining…'
      : status === 'demoting'
      ? 'Leaving…'
      : status === 'failed'
      ? 'Connection failed'
      : 'Connecting…'
    : isVideo
    ? isCameraOff
      ? 'Camera off'
      : 'Video connected'
    : 'Audio connected';

  return (
    <View style={styles.panel}>
      {showLocalVideo ? (
        <View style={styles.videoSlot}>
          <RtcSurfaceView
            style={StyleSheet.absoluteFill}
            canvas={{
              uid: 0,
              sourceType: VideoSourceType.VideoSourceCamera,
              renderMode: RenderModeType.RenderModeHidden,
            }}
          />
          {remainingSeconds != null && (
            <View style={styles.videoTimerOverlay} pointerEvents="none">
              <Text variant="caption" weight="semibold" style={styles.timerValue}>
                {formatCallCountdown(remainingSeconds)}
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.audioFallback}>
          <View style={styles.avatar}>
            <Icon
              name={isVideo && isCameraOff ? 'videocam-off' : 'person'}
              size={28}
              color="#fff"
              library="MaterialIcons"
            />
          </View>
          <Text variant="captionSmall" style={styles.connectionText}>
            {connectionLabel}
          </Text>
          {remainingSeconds != null ? (
            <Text variant="caption" weight="semibold" style={styles.timerValue}>
              {formatCallCountdown(remainingSeconds)}
            </Text>
          ) : null}
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={onToggleMute}
          accessibilityLabel={isMuted ? 'Unmute' : 'Mute'}>
          <Icon
            name={isMuted ? 'mic-off' : 'mic'}
            size={18}
            color="#fff"
            library="MaterialIcons"
          />
        </TouchableOpacity>

        {isVideo && (
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onToggleCamera}
            accessibilityLabel={isCameraOff ? 'Camera on' : 'Camera off'}>
            <Icon
              name={isCameraOff ? 'videocam-off' : 'videocam'}
              size={18}
              color="#fff"
              library="MaterialIcons"
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.endButton}
          onPress={handleEndPress}
          accessibilityLabel="End co-host interaction">
          <Text variant="caption" weight="semibold" style={styles.endLabel}>
            End
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    width: 140,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(10,10,30,0.9)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  videoSlot: {
    width: 140,
    height: 180,
    backgroundColor: '#000',
  },
  videoTimerOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 6,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  audioFallback: {
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#262667',
  },
  connectionText: {
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
  },
  timerValue: {
    color: '#fff',
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.5,
    opacity: 0.95,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 8,
    paddingTop: 4,
    gap: 6,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  endButton: {
    flex: 1,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E53935',
  },
  endLabel: {
    color: '#fff',
  },
});

export default LiveCohostControls;
