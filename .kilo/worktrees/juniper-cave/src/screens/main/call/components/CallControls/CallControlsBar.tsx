/**
 * CallControlsBar
 *
 * Assembles the three call-control buttons row.
 * - Left:  Mute toggle
 * - Mid:   Speaker toggle
 * - Right: End-call / Cancel primary action
 *
 * The primary button icon and colour change between "waiting" (grey) and
 * "connected" (red) states so the user always gets the right affordance.
 */

import type {GestureResponderEvent} from 'react-native';
import {useCallback, useMemo} from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

export type ControlButtonConfig = {
  /** Material Icons icon name */
  iconName: any;
  /** Called when the control button is pressed */
  onPress: () => void;
  /** Whether the control is in its active state */
  isActive: boolean;
};

export type CallControlsBarProps = {
  isMuted: boolean;
  isSpeakerOn: boolean;
  isCallConnected: boolean;
  onToggleMute: () => void;
  onToggleSpeaker: () => void;
  /** Fires when the primary action button is pressed (end / cancel) */
  onPrimaryAction: () => void;
};

/**
 * CallControlButton
 *
 * Reusable individual control button with subtle scale animation.
 * Accepts `onPress: () => void` so callers never need to handle the
 * press event.
 */
export const CallControlButton: React.FC<ControlButtonConfig> = ({
  iconName,
  onPress,
  isActive,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const handlePress = useCallback(
    (_e: GestureResponderEvent) => {
      scale.value = withSpring(0.9, {damping: 15}, () => {
        scale.value = withSpring(1);
      });
      onPress();
    },
    [onPress, scale],
  );

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.controlButton, isActive && styles.controlButtonActive]}
        onPress={handlePress}
        accessibilityLabel={isActive ? 'Deactivate button' : 'Activate button'}>
        <Icon name={iconName} size={26} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
};

export const CallControlsBar: React.FC<CallControlsBarProps> = ({
  isMuted,
  isSpeakerOn,
  isCallConnected,
  onToggleMute,
  onToggleSpeaker,
  onPrimaryAction,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const primaryButtonStyle = useMemo(
    () => [
      styles.endCallButton,
      isCallConnected
        ? styles.endCallButtonConnected
        : styles.endCallButtonWaiting,
    ],
    [isCallConnected],
  );

  const handlePrimaryPress = useCallback(
    (_e: GestureResponderEvent) => {
      scale.value = withSpring(0.9, {damping: 15}, () => {
        scale.value = withSpring(1);
      });
      onPrimaryAction();
    },
    [onPrimaryAction, scale],
  );

  return (
    <View style={styles.controlsOuter}>
      <View style={styles.controlsContainer}>
        <CallControlButton
          iconName={isMuted ? 'mic-off' : 'mic'}
          onPress={onToggleMute}
          isActive={isMuted}
        />

        <CallControlButton
          iconName={isSpeakerOn ? 'volume-up' : 'volume-down'}
          onPress={onToggleSpeaker}
          isActive={isSpeakerOn}
        />

        <Animated.View style={animatedStyle}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={primaryButtonStyle}
            onPress={handlePrimaryPress}
            accessibilityLabel={isCallConnected ? 'End call' : 'Cancel call'}>
            <Icon
              name={isCallConnected ? 'call-end' : 'close'}
              size={30}
              color="#fff"
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  /* ================= Controls ================= */

  controlsOuter: {
    paddingBottom: 42,
    paddingTop: 20,
  },

  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 26,
  },

  controlButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },

  controlButtonActive: {
    backgroundColor: '#27272A',
    borderColor: 'rgba(255,255,255,0.12)',
  },

  endCallButton: {
    width: 82,
    height: 82,
    borderRadius: 41,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },

  endCallButtonWaiting: {
    backgroundColor: '#27272A',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  endCallButtonConnected: {
    backgroundColor: '#EF4444',

    shadowColor: '#EF4444',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 12,
    transform: [{scale: 1.05}],
  },
});

export default CallControlsBar;
