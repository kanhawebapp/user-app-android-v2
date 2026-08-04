import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {Card} from '../../../components/Card/Card';
import {Icon} from '../../../components/Icon';
import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';
import type {IconProps} from '../../../components/Icon/iconType';
import {InfoRowsSkeleton} from './Skeletons';

export interface InfoItem {
  label: string;
  value: string | number | undefined | null;
}

export interface InfoCardProps {
  title: string;
  /** Icon rendered next to the title (optional). */
  icon?: IconProps;
  /** Label/value pairs rendered inside the card body. */
  items: InfoItem[];
  loading?: boolean;
  error?: any;
  onRetry?: () => void;
}

/**
 * Reusable information card: a title header and a list of label/value rows.
 * Handles loading, error + retry, and empty states.
 */
const InfoCard: React.FC<InfoCardProps> = ({
  title,
  icon,
  items,
  loading = false,
  error,
  onRetry,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const renderBody = () => {
    if (loading) {
      return <InfoRowsSkeleton rows={3} />;
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
            {error?.message || 'Failed to load this data.'}
          </Text>
          {onRetry ? (
            <TouchableOpacity
              style={[
                styles.retryButton,
                {backgroundColor: colors.primary.main},
              ]}
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

    const visibleItems = items.filter(
      item => item.label && item.value !== undefined && item.value !== null,
    );

    if (visibleItems.length === 0) {
      return (
        <View style={styles.state}>
          <Text
            variant="bodySmall"
            style={{color: colors.text.tertiary, textAlign: 'center'}}>
            No data available.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.items}>
        {visibleItems.map((item, index) => (
          <View
            key={`${item.label}-${index}`}
            style={[
              styles.itemRow,
              index > 0 && {
                borderTopWidth: StyleSheet.hairlineWidth,
                borderTopColor: colors.divider,
              },
            ]}>
            <Text
              variant="bodySmall"
              style={{color: colors.text.tertiary, flex: 1}}>
              {item.label}
            </Text>
            <Text
              variant="bodySmall"
              weight="semibold"
              align="right"
              style={{color: colors.text.primary, flex: 1, marginLeft: 12}}>
              {String(item.value)}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <Card variant="elevated" style={styles.card}>
      <View style={styles.header}>
        {icon ? (
          <Icon
            name={icon.name}
            size={18}
            color={colors.primary.main}
            library={icon.library}
          />
        ) : null}
        <Text
          variant="body"
          weight="bold"
          style={{
            color: colors.text.primary,
            flex: 1,
            marginLeft: icon ? 8 : 0,
          }}>
          {title}
        </Text>
      </View>

      <View style={styles.body}>{renderBody()}</View>
    </Card>
  );
};

export default React.memo(InfoCard);

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  body: {
    width: '100%',
  },
  items: {
    width: '100%',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
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
