import React, {useCallback, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  RenderModeType,
  RtcSurfaceView,
  VideoSourceType,
} from 'react-native-agora';
import {Text} from '../../../components/Text';
import {Icon} from '../../../components/Icon';
import {endLiveInteraction} from '../../../services/api/liveInteractions/live-interactions.api';
import type {LiveInteractionType} from '../../../services/api/liveInteractions/live-interactions.types';
import type {LiveCohostStatus} from '../../../modules/live/hooks/useLivePublicCohost';
import loggingService from '../../../services/logging';

interface LiveCohostControlsProps {
  /** Local active guest/co-host only — never for normal viewers. */
  visible: boolean;
  requestId: string | null | undefined;
  interactionType: LiveInteractionType | null;
  status: LiveCohostStatus;
  displayName: string;
  isMuted: boolean;
  isCameraOff: boolean;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onLeave: () => void;
}

/**
 * RTC guest/co-host card (matches host ActiveLiveInteractionOverlay layout).
 * Renders inside the public guest/co-host RTC section — not a full-screen bar.
 */
export const LiveCohostControls: React.FC<LiveCohostControlsProps> = ({
  visible,
  requestId,
  interactionType,
  status,
  displayName,
  isMuted,
  isCameraOff,
  onToggleMute,
  onToggleCamera,
  onLeave,
}) => {
  const endInFlightRef = useRef(false);
  const endedRequestIdRef = useRef<string | null>(null);

  useEffect(() => {
    const id = typeof requestId === 'string' ? requestId.trim() : '';
    if (!id) {
      endedRequestIdRef.current = null;
      endInFlightRef.current = false;
    }
  }, [requestId]);

  const fireEndLiveInteraction = useCallback((id: string) => {
    if (!id) {
      return;
    }
    if (endedRequestIdRef.current === id || endInFlightRef.current) {
      loggingService.info(
        '[LiveCohostControls] EndLiveInteraction skipped — duplicate',
        {requestId: id},
      );
      return;
    }

    endInFlightRef.current = true;
    loggingService.info('[LiveCohostControls] EndLiveInteraction invoke', {
      requestId: id,
    });

    void endLiveInteraction(id)
      .then(result => {
        endedRequestIdRef.current = result?.id || id;
        loggingService.info(
          '[LiveCohostControls] EndLiveInteraction success',
          {
            requestId: result?.id,
            status: result?.status,
            durationSeconds: result?.durationSeconds,
            billableMinutes: result?.billableMinutes,
            chargedCoins: result?.chargedCoins,
          },
        );
      })
      .catch((err: any) => {
        loggingService.error(
          '[LiveCohostControls] EndLiveInteraction failed',
          {requestId: id, error: err?.message || err},
        );
      })
      .finally(() => {
        endInFlightRef.current = false;
      });
  }, []);

  const handleEndPress = useCallback(() => {
    const id = typeof requestId === 'string' ? requestId.trim() : '';
    // Existing demote / leave immediately — never await API.
    onLeave();
    if (!id) {
      loggingService.info(
        '[LiveCohostControls] EndLiveInteraction skipped — no requestId',
      );
      return;
    }
    fireEndLiveInteraction(id);
  }, [onLeave, requestId, fireEndLiveInteraction]);

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
        </View>
      )}

      <View style={styles.meta}>
        <Text variant="captionSmall" style={styles.typeLabel}>
          {isVideo ? 'Video interaction' : 'Audio interaction'}
        </Text>
        <Text
          variant="bodySmall"
          weight="semibold"
          style={styles.name}
          numberOfLines={1}>
          {displayName || 'You'}
        </Text>
      </View>

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
  audioFallback: {
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 8,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#262667',
  },
  connectionText: {
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
  },
  meta: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 4,
  },
  typeLabel: {
    color: 'rgba(255,255,255,0.7)',
  },
  name: {
    color: '#fff',
    marginTop: 2,
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
