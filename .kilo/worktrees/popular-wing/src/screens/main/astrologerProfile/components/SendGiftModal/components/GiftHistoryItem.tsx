import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { format } from 'date-fns';
import { GiftHistory } from '../../../../../../services/api/giftHistory/gift-history.types';
import { Text, useTheme } from '../../../../../../components';

interface GiftHistoryItemProps {
  item: GiftHistory;
}

export const GiftHistoryItem: React.FC<GiftHistoryItemProps> = ({ item }) => {
  const theme = useTheme();
  const colors = theme.colors;

  // Format date and time
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'dd MMM yyyy');
    } catch {
      return dateStr;
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'hh:mm a');
    } catch {
      return '';
    }
  };

  return (
    <View
      style={[
        styles.historyItem,
        {
          backgroundColor: colors.card.background,
          borderColor: colors.border.light,
        },
      ]}>
      <View style={styles.historyItemLeft}>
        <Text
          variant="body"
          weight="semibold"
          color={colors.text.primary}
          style={styles.giftName}>
          🎁 {item.giftName}
        </Text>
        <Text
          variant="body"
          weight="bold"
          color={colors.primary.main}
          style={styles.giftPrice}>
          ₹ {item.giftPrice}
        </Text>
        <View style={{flexDirection:'row', gap:10}}>
          <Text
            variant="captionSmall"
            color={colors.text.secondary}
            style={styles.sentToLabel}>
            Sent to:
          </Text>
          <Text
            variant="caption"
            weight="medium"
            color={colors.text.primary}
            style={styles.astrologerName}
            numberOfLines={1}>
            {item.astrologer?.name || 'Unknown Astrologer'}
          </Text>
        </View>
      </View>

      <View style={styles.historyItemRight}>
        <Text
          variant="captionSmall"
          color={colors.text.tertiary}
          style={styles.historyDate}>
          {formatDate(item.createdAt)}
        </Text>
        <Text
          variant="captionSmall"
          color={colors.text.tertiary}
          style={styles.historyTime}>
          {formatTime(item.createdAt)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  historyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    marginVertical:5
  } as ViewStyle,
  historyItemLeft: {
    flex: 1,
    marginRight: 12,
  } as ViewStyle,
  giftName: {
    marginBottom: 4,
  } as TextStyle,
  giftPrice: {
    marginBottom: 8,
  } as TextStyle,
  sentToLabel: {
    marginBottom: 2,
  } as TextStyle,
  astrologerName: {
    marginBottom: 2,
    maxWidth: 180,
  } as TextStyle,
  historyItemRight: {
    alignItems: 'flex-end',
  } as ViewStyle,
  historyDate: {
    marginBottom: 2,
  } as TextStyle,
  historyTime: {
    opacity: 0.8,
  } as TextStyle,
});