import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Text} from '../../../components/Text';
import {Button} from '../../../components/Button';
import {Icon} from '../../../components/Icon';
import {useTheme} from '../../../theme';
import type {EndLiveInteractionResult} from '../../../services/api/liveInteractions/live-interactions.types';

interface LiveInteractionSummarySheetProps {
  visible: boolean;
  summary: EndLiveInteractionResult | null;
  error: string | null;
  onClose: () => void;
  onRetryEnd?: () => void;
}

const formatDuration = (seconds: number | null | undefined) => {
  if (seconds == null || Number.isNaN(seconds)) {
    return '—';
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins <= 0) {
    return `${secs}s`;
  }
  return `${mins}m ${secs.toString().padStart(2, '0')}s`;
};

export const LiveInteractionSummarySheet: React.FC<
  LiveInteractionSummarySheetProps
> = ({visible, summary, error, onClose, onRetryEnd}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.anchor} pointerEvents="box-none">
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
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
            {summary ? 'Call Summary' : 'Call Ended'}
          </Text>
          <TouchableOpacity onPress={onClose} accessibilityLabel="Close summary">
            <Icon
              name="close"
              size={22}
              color={colors.text.secondary}
              library="MaterialIcons"
            />
          </TouchableOpacity>
        </View>

        {!!error && (
          <Text
            variant="caption"
            color={colors.error.main}
            style={styles.error}>
            {error}
          </Text>
        )}

        {summary ? (
          <View style={styles.rows}>
            <SummaryRow
              label="Type"
              value={
                summary.interactionType === 'VIDEO' ? 'Video Call' : 'Audio Call'
              }
              colors={colors}
            />
            <SummaryRow
              label="Duration"
              value={formatDuration(summary.durationSeconds)}
              colors={colors}
            />
            <SummaryRow
              label="Billable minutes"
              value={
                summary.billableMinutes != null
                  ? `${summary.billableMinutes}`
                  : '—'
              }
              colors={colors}
            />
            <SummaryRow
              label="Charged coins"
              value={
                summary.chargedCoins != null ? `${summary.chargedCoins}` : '—'
              }
              colors={colors}
            />
          </View>
        ) : (
          <Text variant="bodySmall" color={colors.text.secondary}>
            You can continue watching the live session.
          </Text>
        )}

        <View style={styles.actions}>
          {!!error && onRetryEnd && (
            <Button
              title="Retry End Call"
              variant="outline"
              size="medium"
              onPress={onRetryEnd}
              style={styles.retry}
            />
          )}
          <Button
            title="Back to Live"
            variant="primary"
            size="medium"
            onPress={onClose}
          />
        </View>
      </View>
    </View>
  );
};

const SummaryRow = ({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: any;
}) => (
  <View style={styles.row}>
    <Text variant="caption" color={colors.text.secondary}>
      {label}
    </Text>
    <Text variant="bodySmall" weight="semibold" color={colors.text.primary}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  anchor: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 45,
    elevation: 45,
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
  error: {
    marginBottom: 10,
  },
  rows: {
    marginBottom: 16,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actions: {
    gap: 10,
  },
  retry: {
    marginBottom: 4,
  },
});

export default LiveInteractionSummarySheet;
