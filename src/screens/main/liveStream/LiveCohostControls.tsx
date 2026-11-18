import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  RenderModeType,
  RtcSurfaceView,
  VideoSourceType,
} from 'react-native-agora';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Text} from '../../../components/Text';
import {Icon} from '../../../components/Icon';
import type {LiveInteractionType} from '../../../services/api/liveInteractions/live-interactions.types';
import type {LiveCohostStatus} from '../../../modules/live/hooks/useLivePublicCohost';

interface LiveCohostControlsProps {
  visible: boolean;
  interactionType: LiveInteractionType | null;
  status: LiveCohostStatus;
  isMuted: boolean;
  isCameraOff: boolean;
  ending: boolean;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onSwitchCamera: () => void;
  onLeave: () => void;
}

/**
 * In-stream co-host controls. Keeps the public live video visible —
 * does not open a private 1:1 call screen.
 */
export const LiveCohostControls: React.FC<LiveCohostControlsProps> = ({
  visible,
  interactionType,
  status,
  isMuted,
  isCameraOff,
  ending,
  onToggleMute,
  onToggleCamera,
  onSwitchCamera,
  onLeave,
}) => {
  const insets = useSafeAreaInsets();

  if (!visible) {
    return null;
  }

  const isVideo = interactionType === 'VIDEO';
  const statusLabel =
    status === 'promoting'
      ? 'Joining live…'
      : status === 'demoting'
      ? 'Leaving…'
      : status === 'failed'
      ? 'Publish failed'
      : isVideo
      ? 'You are live on video'
      : 'You are live on audio';

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      {isVideo && !isCameraOff && status === 'publishing' && (
        <View style={[styles.localPreview, {top: insets.top + 72}]}>
          <RtcSurfaceView
            style={StyleSheet.absoluteFill}
            canvas={{
              uid: 0,
              sourceType: VideoSourceType.VideoSourceCamera,
              renderMode: RenderModeType.RenderModeHidden,
            }}
          />
        </View>
      )}

      <View style={[styles.bar, {paddingBottom: insets.bottom + 12}]}>
        <Text variant="caption" style={styles.status}>
          {statusLabel}
        </Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.btn}
            onPress={onToggleMute}
            accessibilityLabel={isMuted ? 'Unmute' : 'Mute'}>
            <Icon
              name={isMuted ? 'mic-off' : 'mic'}
              size={22}
              color="#fff"
              library="MaterialIcons"
            />
            <Text variant="captionSmall" style={styles.label}>
              {isMuted ? 'Unmute' : 'Mute'}
            </Text>
          </TouchableOpacity>

          {isVideo && (
            <>
              <TouchableOpacity
                style={styles.btn}
                onPress={onToggleCamera}
                accessibilityLabel={isCameraOff ? 'Camera on' : 'Camera off'}>
                <Icon
                  name={isCameraOff ? 'videocam-off' : 'videocam'}
                  size={22}
                  color="#fff"
                  library="MaterialIcons"
                />
                <Text variant="captionSmall" style={styles.label}>
                  {isCameraOff ? 'Cam On' : 'Cam Off'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn}
                onPress={onSwitchCamera}
                accessibilityLabel="Switch camera">
                <Icon
                  name="cameraswitch"
                  size={22}
                  color="#fff"
                  library="MaterialIcons"
                />
                <Text variant="captionSmall" style={styles.label}>
                  Flip
                </Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={[styles.btn, styles.leave]}
            onPress={onLeave}
            disabled={ending || status === 'demoting'}
            accessibilityLabel="Leave live interaction">
            {ending || status === 'demoting' ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Icon
                name="call-end"
                size={22}
                color="#fff"
                library="MaterialIcons"
              />
            )}
            <Text variant="captionSmall" style={styles.label}>
              Leave
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 35,
    elevation: 35,
  },
  localPreview: {
    position: 'absolute',
    right: 12,
    width: 100,
    height: 140,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: '#222',
  },
  bar: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingTop: 10,
    paddingHorizontal: 12,
  },
  status: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 56,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  leave: {
    backgroundColor: '#E53935',
  },
  label: {
    color: '#fff',
    marginTop: 2,
  },
});

export default LiveCohostControls;
