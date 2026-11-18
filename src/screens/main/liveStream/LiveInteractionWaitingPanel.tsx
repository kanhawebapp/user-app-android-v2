import React, {useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Text} from '../../../components/Text';
import {Button} from '../../../components/Button';
import {AvatarImage} from '../../../components/Image';
import {useTheme} from '../../../theme';
import type {LiveInteractionType} from '../../../services/api/liveInteractions/live-interactions.types';

interface LiveInteractionWaitingPanelProps {
  visible: boolean;
  astrologerName: string;
  profilePicUrl: string | null;
  interactionType: LiveInteractionType | null;
  pricePerMinute: number | null;
  cancelling?: boolean;
  onCancel: () => void;
}

export const LiveInteractionWaitingPanel: React.FC<
  LiveInteractionWaitingPanelProps
> = ({
  visible,
  astrologerName,
  profilePicUrl,
  interactionType,
  pricePerMinute,
  cancelling = false,
  onCancel,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (!visible) {
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.4,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [visible, pulse]);

  if (!visible) {
    return null;
  }

  const callLabel =
    interactionType === 'VIDEO' ? 'video co-host' : 'audio co-host';

  return (
    <View style={styles.anchor} pointerEvents="box-none">
      <View
        style={[
          styles.sheet,
          {
            backgroundColor: colors.background.primary,
            paddingBottom: insets.bottom + 16,
          },
        ]}>
        <View style={styles.handle} />
        <Text
          variant="subtitle"
          weight="semibold"
          color={colors.text.primary}
          style={styles.title}>
          Join Request Sent
        </Text>

        <View style={styles.profileRow}>
          <AvatarImage
            source={profilePicUrl ? {uri: profilePicUrl} : undefined}
            size={56}
            name={astrologerName}
          />
          <View style={styles.profileText}>
            <Text
              variant="body"
              weight="semibold"
              color={colors.text.primary}
              numberOfLines={1}>
              {astrologerName || 'Astrologer'}
            </Text>
            <Text variant="caption" color={colors.text.secondary}>
              {interactionType === 'VIDEO' ? 'Video Co-host' : 'Audio Co-host'}
              {pricePerMinute != null ? ` · ${pricePerMinute} coins/min` : ''}
            </Text>
          </View>
        </View>

        <View style={styles.waitingRow}>
          <ActivityIndicator color={colors.primary.main} />
          <Animated.View style={{opacity: pulse, flex: 1}}>
            <Text variant="bodySmall" color={colors.text.secondary}>
              Waiting for Astrologer to accept your {callLabel} request.
            </Text>
          </Animated.View>
        </View>

        <Text
          variant="caption"
          color={colors.text.tertiary}
          style={styles.hint}>
          Keep watching — you will go live in this public stream when accepted.
        </Text>

        <Button
          title="Cancel Request"
          variant="outline"
          size="medium"
          loading={cancelling}
          disabled={cancelling}
          onPress={onCancel}
          accessibilityLabel="Cancel call request"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  anchor: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 28,
    elevation: 28,
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.15)',
    marginBottom: 12,
  },
  title: {
    marginBottom: 14,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileText: {
    flex: 1,
    marginLeft: 12,
    minWidth: 0,
  },
  waitingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  hint: {
    marginBottom: 16,
  },
});

export default LiveInteractionWaitingPanel;
