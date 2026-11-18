import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  AppState,
  AppStateStatus,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Text} from '../../../components/Text';
import {Button} from '../../../components/Button';
import {Icon} from '../../../components/Icon';
import {useTheme} from '../../../theme';
import type {LiveInteractionPricing} from '../../../services/api/liveInteractions/live-interactions.types';
import type {LiveInteractionType} from '../../../services/api/liveInteractions/live-interactions.types';
import {
  formatCallCountdown,
  getAvailableCallSeconds,
  getLiveInteractionPricePerMinute,
  getMinimumRequiredBalance,
  getRemainingSecondsFromEndTime,
  hasMinimumCallBalance,
  MIN_LIVE_INTERACTION_MINUTES,
} from '../../../services/api/liveInteractions/live-interaction-billing';

interface CallNowPanelProps {
  visible: boolean;
  pricing: LiveInteractionPricing | null;
  loading: boolean;
  error: string | null;
  requesting: boolean;
  /** Wallet balance in coins from auth/pricing (same unit as prices). */
  walletBalance: number;
  onClose: () => void;
  onRetry: () => void;
  onSelect: (type: LiveInteractionType) => void;
  /**
   * Active connected call. Pass absolute endsAt so this panel ticks locally
   * without re-rendering the parent RTC tree every second.
   */
  activeCall?: {
    interactionType: LiveInteractionType;
    /** Absolute end timestamp (ms): interactionStartTime + availableSeconds */
    endsAt: number;
  } | null;
  onCountdownExpired?: () => void;
}

const ActiveCallCountdown: React.FC<{
  interactionType: LiveInteractionType;
  endsAt: number;
  onExpired?: () => void;
}> = ({interactionType, endsAt, onExpired}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const expiredRef = useRef(false);
  const onExpiredRef = useRef(onExpired);
  onExpiredRef.current = onExpired;

  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    getRemainingSecondsFromEndTime(endsAt),
  );

  useEffect(() => {
    expiredRef.current = false;
    setRemainingSeconds(getRemainingSecondsFromEndTime(endsAt));

    const tick = () => {
      const remaining = getRemainingSecondsFromEndTime(endsAt);
      setRemainingSeconds(remaining);
      if (remaining <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        onExpiredRef.current?.();
      }
    };

    const intervalId = setInterval(tick, 1000);

    const onAppState = (next: AppStateStatus) => {
      if (next === 'active') {
        // Recompute from absolute endsAt after background — never restart.
        tick();
      }
    };
    const sub = AppState.addEventListener('change', onAppState);

    return () => {
      clearInterval(intervalId);
      sub.remove();
    };
  }, [endsAt]);

  const callLabel =
    interactionType === 'VIDEO' ? 'VIDEO CALL' : 'AUDIO CALL';

  return (
    <View
      style={[
        styles.timerBanner,
        {
          backgroundColor: colors.background.primary,
          top: insets.top + 56,
          borderColor: colors.border.light,
        },
      ]}
      pointerEvents="none"
      accessibilityLabel={`${callLabel}, time remaining ${formatCallCountdown(remainingSeconds)}`}>
      <Text
        variant="caption"
        weight="bold"
        color={colors.primary.main}
        style={styles.timerCallType}>
        {callLabel}
      </Text>
      <Text variant="caption" color={colors.text.secondary}>
        Time Remaining
      </Text>
      <Text
        variant="h3"
        weight="bold"
        color={colors.text.primary}
        style={styles.timerValue}>
        {formatCallCountdown(remainingSeconds)}
      </Text>
    </View>
  );
};

export const CallNowPanel: React.FC<CallNowPanelProps> = ({
  visible,
  pricing,
  loading,
  error,
  requesting,
  walletBalance,
  onClose,
  onRetry,
  onSelect,
  activeCall = null,
  onCountdownExpired,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  const audioPrice = getLiveInteractionPricePerMinute(pricing, 'AUDIO');
  const videoPrice = getLiveInteractionPricePerMinute(pricing, 'VIDEO');

  const audioDisabled = useMemo(() => {
    if (!pricing || loading || requesting || audioPrice == null) {
      return true;
    }
    return (
      !pricing.audioAvailable ||
      !hasMinimumCallBalance(walletBalance, audioPrice)
    );
  }, [pricing, loading, requesting, audioPrice, walletBalance]);

  const videoDisabled = useMemo(() => {
    if (!pricing || loading || requesting || videoPrice == null) {
      return true;
    }
    return (
      !pricing.videoAvailable ||
      !hasMinimumCallBalance(walletBalance, videoPrice)
    );
  }, [pricing, loading, requesting, videoPrice, walletBalance]);

  const insufficientAudio =
    !!pricing &&
    pricing.audioAvailable &&
    audioPrice != null &&
    !hasMinimumCallBalance(walletBalance, audioPrice);
  const insufficientVideo =
    !!pricing &&
    pricing.videoAvailable &&
    videoPrice != null &&
    !hasMinimumCallBalance(walletBalance, videoPrice);

  const audioAvailableSeconds =
    audioPrice != null
      ? getAvailableCallSeconds(walletBalance, audioPrice)
      : 0;
  const videoAvailableSeconds =
    videoPrice != null
      ? getAvailableCallSeconds(walletBalance, videoPrice)
      : 0;

  const countdownOverlay =
    activeCall != null ? (
      <ActiveCallCountdown
        interactionType={activeCall.interactionType}
        endsAt={activeCall.endsAt}
        onExpired={onCountdownExpired}
      />
    ) : null;

  if (!visible) {
    if (!countdownOverlay) {
      return null;
    }
    return (
      <View style={styles.timerAnchor} pointerEvents="box-none">
        {countdownOverlay}
      </View>
    );
  }

  return (
    <View style={styles.anchor} pointerEvents="box-none">
      {countdownOverlay}
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
                {`${Math.floor(walletBalance)} coins`}
              </Text>
              <Text
                variant="captionSmall"
                color={colors.text.tertiary}
                style={styles.minBalanceHint}>
                Minimum {MIN_LIVE_INTERACTION_MINUTES} minutes balance required
              </Text>
            </View>

            {(insufficientAudio || insufficientVideo) && (
              <Text
                variant="caption"
                color={colors.error.main}
                style={styles.warning}>
                A minimum {MIN_LIVE_INTERACTION_MINUTES}-minute wallet balance is
                required
                {insufficientAudio && audioPrice != null
                  ? ` (audio: ${getMinimumRequiredBalance(audioPrice)} coins)`
                  : ''}
                {insufficientVideo && videoPrice != null
                  ? ` (video: ${getMinimumRequiredBalance(videoPrice)} coins)`
                  : ''}
                .
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
                    : audioPrice == null
                    ? 'Pricing unavailable'
                    : `Go live with mic · ${audioPrice} coins / min · ~${formatCallCountdown(audioAvailableSeconds)} available`}
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
                    : videoPrice == null
                    ? 'Pricing unavailable'
                    : `Go live with camera · ${videoPrice} coins / min · ~${formatCallCountdown(videoAvailableSeconds)} available`}
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
  timerAnchor: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 42,
    elevation: 42,
  },
  timerBanner: {
    position: 'absolute',
    left: 48,
    right: 48,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    elevation: 8,
  },
  timerCallType: {
    letterSpacing: 0.8,
    marginBottom: 2,
    textAlign: 'center',
  },
  timerValue: {
    marginTop: 2,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
    letterSpacing: 1,
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
  minBalanceHint: {
    marginTop: 4,
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
