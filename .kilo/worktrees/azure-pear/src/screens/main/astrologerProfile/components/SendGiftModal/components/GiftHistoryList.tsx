import React from 'react';
import {FlatList, View, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {GiftHistoryItem} from './GiftHistoryItem';
import { GiftHistory } from '../../../../../../services/api/giftHistory/gift-history.types';
import { Icon, Text, useTheme } from '../../../../../../components';

interface GiftHistoryListProps {
  history: GiftHistory[];
  loading?: boolean;
}

export const GiftHistoryList: React.FC<GiftHistoryListProps> = ({
  history,
  loading = false,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text
          variant="bodySmall"
          color={colors.text.tertiary}
          style={styles.loadingText}>
          Loading gift history...
        </Text>
      </View>
    );
  }

  if (!history || history.length === 0) {
    return <EmptyHistory />;
  }

  // Sort history by date (latest first)
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <FlatList
      data={sortedHistory}
      renderItem={({item}) => <GiftHistoryItem item={item} />}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.historyList}
    />
  );
};

const EmptyHistory: React.FC = () => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View style={styles.emptyHistory}>
      <Icon
        name="history"
        size={48}
        color={colors.text.tertiary}
        library="MaterialIcons"
      />
      <Text
        variant="body"
        weight="medium"
        color={colors.text.secondary}
        style={styles.emptyHistoryText}>
        No gifts sent yet
      </Text>
      <Text
        variant="captionSmall"
        color={colors.text.tertiary}
        style={styles.emptyHistorySubtext}>
        Your gift history will appear here
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  historyList: {
    paddingBottom: 80,
    paddingHorizontal: 4,
  } as ViewStyle,
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  } as ViewStyle,
  loadingText: {
    fontSize: 14,
  } as TextStyle,
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  } as ViewStyle,
  emptyHistoryText: {
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  } as TextStyle,
  emptyHistorySubtext: {
    textAlign: 'center',
    opacity: 0.7,
  } as TextStyle,
});