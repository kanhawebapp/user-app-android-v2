import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {Icon} from '../../../components/Icon';
import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';

export interface ListStateViewProps {
  /** Renders `skeleton` while true. */
  loading?: boolean;
  /** Placeholder rendered while loading (e.g. skeleton cards). */
  skeleton?: React.ReactNode;
  /** Error rendered with a retry button (when `onRetry` is provided). */
  error?: any;
  /** Fallback text when `error` has no message. */
  errorText?: string;
  /** Renders an empty-state message when true. */
  empty?: boolean;
  emptyText?: string;
  onRetry?: () => void;
}

/**
 * Reusable loading / error / empty state block used inside the Kundli tab
 * lists. Keeps the state UI in one place instead of duplicating it per card.
 */
const ListStateView: React.FC<ListStateViewProps> = ({
  loading = false,
  skeleton,
  error,
  errorText,
  empty = false,
  emptyText,
  onRetry,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  if (loading) {
    return skeleton ? <>{skeleton}</> : null;
  }

  if (error) {
    return (
      <View style={styles.state}>
        <Icon
          name="error-outline"
          size={24}
          color={colors.error.main}
          library="MaterialIcons"
        />
        <Text
          variant="bodySmall"
          style={{
            color: colors.text.secondary,
            marginTop: 8,
            textAlign: 'center',
          }}>
          {error?.message || errorText || 'Failed to load this data.'}
        </Text>
        {onRetry ? (
          <TouchableOpacity
            style={[styles.retryButton, {backgroundColor: colors.primary.main}]}
            onPress={onRetry}
            activeOpacity={0.85}>
            <Text
              variant="bodySmall"
              weight="bold"
              style={{color: colors.primary.contrastText}}>
              Retry
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }

  if (empty) {
    return (
      <View style={styles.state}>
        <Text
          variant="bodySmall"
          style={{color: colors.text.tertiary, textAlign: 'center'}}>
          {emptyText || 'No data available.'}
        </Text>
      </View>
    );
  }

  return null;
};

export default React.memo(ListStateView);

const styles = StyleSheet.create({
  state: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  retryButton: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
});
