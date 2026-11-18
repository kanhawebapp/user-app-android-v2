import React, {useMemo} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Text} from '../../../components/Text';
import {Button} from '../../../components/Button';
import {Icon} from '../../../components/Icon';
import {useTheme} from '../../../theme';
import type {LiveInteractionPricing} from '../../../services/api/liveInteractions/live-interactions.types';
import type {LiveInteractionType} from '../../../services/api/liveInteractions/live-interactions.types';

interface CallNowPanelProps {
  visible: boolean;
  pricing: LiveInteractionPricing | null;
  loading: boolean;
  error: string | null;
  requesting: boolean;
  onClose: () => void;
  onRetry: () => void;
  onSelect: (type: LiveInteractionType) => void;
}

export const CallNowPanel: React.FC<CallNowPanelProps> = ({
  visible,
  pricing,
  loading,
  error,
  requesting,
  onClose,
  onRetry,
  onSelect,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  const audioDisabled = useMemo(() => {
    if (!pricing || loading || requesting) {
      return true;
    }
    return (
      !pricing.audioAvailable || pricing.walletBalance < pricing.audioPrice
    );
  }, [pricing, loading, requesting]);

  const videoDisabled = useMemo(() => {
    if (!pricing || loading || requesting) {
      return true;
    }
    return (
      !pricing.videoAvailable || pricing.walletBalance < pricing.videoPrice
    );
  }, [pricing, loading, requesting]);

  if (!visible) {
    return null;
  }

  const insufficientAudio =
    !!pricing &&
    pricing.audioAvailable &&
    pricing.walletBalance < pricing.audioPrice;
  const insufficientVideo =
    !!pricing &&
    pricing.videoAvailable &&
    pricing.walletBalance < pricing.videoPrice;

  return (
    <View style={styles.anchor} pointerEvents="box-none">
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
        accessibilityLabel="Close call options"
      />
      <View
        style={[
          styles.sheet,
          {
            backgroundColor: colors.background.primary,
            paddingBottom: insets.bottom + 16,
          },
        ]}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <Text variant="subtitle" weight="semibold" color={colors.text.primary}>
            Join Live
          </Text>
          <TouchableOpacity onPress={onClose} accessibilityLabel="Close">
            <Icon
              name="close"
              size={22}
              color={colors.text.secondary}
              library="MaterialIcons"
            />
          </TouchableOpacity>
        </View>

        {loading && !pricing ? (
          <View style={styles.centered}>
            <ActivityIndicator color={colors.primary.main} />
            <Text
              variant="caption"
              color={colors.text.secondary}
              style={styles.statusText}>
              Loading pricing...
            </Text>
          </View>
        ) : error && !pricing ? (
          <View style={styles.centered}>
            <Text
              variant="bodySmall"
              color={colors.error.main}
              style={styles.statusText}>
              {error}
            </Text>
            <Button title="Retry" variant="outline" size="small" onPress={onRetry} />
          </View>
        ) : (
          <>
            <View
              style={[
                styles.balanceCard,
                {backgroundColor: colors.card.background},
              ]}>
              <Text variant="caption" color={colors.text.secondary}>
                Wallet balance
              </Text>
              <Text
                variant="subtitle"
                weight="bold"
                color={colors.text.primary}>
                {pricing ? `${Math.floor(pricing.walletBalance)} coins` : '—'}
              </Text>
            </View>

            {(insufficientAudio || insufficientVideo) && (
              <Text
                variant="caption"
                color={colors.error.main}
                style={styles.warning}>
                Insufficient wallet balance for{' '}
                {insufficientAudio && insufficientVideo
                  ? 'audio and video'
                  : insufficientAudio
                  ? 'audio'
                  : 'video'}{' '}
                call.
              </Text>
            )}

            {!!error && (
              <Text
                variant="caption"
                color={colors.error.main}
                style={styles.warning}>
                {error}
              </Text>
            )}

            <TouchableOpacity
              style={[
                styles.option,
                {
                  borderColor: colors.border.light,
                  opacity: audioDisabled ? 0.5 : 1,
                },
              ]}
              disabled={audioDisabled}
              onPress={() => onSelect('AUDIO')}
              accessibilityLabel="Request audio co-host">
              <View
                style={[
                  styles.optionIcon,
                  {backgroundColor: colors.primary.main + '18'},
                ]}>
                <Icon
                  name="call"
                  size={22}
                  color={colors.primary.main}
                  library="MaterialIcons"
                />
              </View>
              <View style={styles.optionText}>
                <Text
                  variant="body"
                  weight="semibold"
                  color={colors.text.primary}>
                  Audio Co-host
                </Text>
                <Text variant="caption" color={colors.text.secondary}>
                  {!pricing?.audioAvailable
                    ? 'Unavailable right now'
                    : `Go live with mic · ${pricing.audioPrice} coins / min`}
                </Text>
              </View>
              {requesting ? (
                <ActivityIndicator color={colors.primary.main} />
              ) : (
                <Icon
                  name="chevron-right"
                  size={22}
                  color={colors.text.tertiary}
                  library="MaterialIcons"
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.option,
                {
                  borderColor: colors.border.light,
                  opacity: videoDisabled ? 0.5 : 1,
                },
              ]}
              disabled={videoDisabled}
              onPress={() => onSelect('VIDEO')}
              accessibilityLabel="Request video co-host">
              <View
                style={[
                  styles.optionIcon,
                  {backgroundColor: colors.primary.main + '18'},
                ]}>
                <Icon
                  name="videocam"
                  size={22}
                  color={colors.primary.main}
                  library="MaterialIcons"
                />
              </View>
              <View style={styles.optionText}>
                <Text
                  variant="body"
                  weight="semibold"
                  color={colors.text.primary}>
                  Video Co-host
                </Text>
                <Text variant="caption" color={colors.text.secondary}>
                  {!pricing?.videoAvailable
                    ? 'Unavailable right now'
                    : `Go live with camera · ${pricing.videoPrice} coins / min`}
                </Text>
              </View>
              {requesting ? (
                <ActivityIndicator color={colors.primary.main} />
              ) : (
                <Icon
                  name="chevron-right"
                  size={22}
                  color={colors.text.tertiary}
                  library="MaterialIcons"
                />
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  anchor: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 30,
    elevation: 30,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    gap: 10,
  },
  statusText: {
    textAlign: 'center',
    marginHorizontal: 12,
  },
  balanceCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  warning: {
    marginBottom: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  optionIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionText: {
    flex: 1,
    minWidth: 0,
  },
});

export default CallNowPanel;
