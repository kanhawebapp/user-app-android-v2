import React from 'react';
import {FlatList, View, StyleSheet, ViewStyle, TextStyle} from 'react-native';

import {GiftCard} from './GiftCard';
import { Gift } from '../../../../../../services/api/gift/gift.types';
import { Text, useTheme } from '../../../../../../components';

interface GiftGridProps {
  gifts: Gift[];
  selectedGift: Gift | null;
  onGiftSelect: (gift: Gift) => void;
  emptyMessage?: string;
}

export const GiftGrid: React.FC<GiftGridProps> = ({
  gifts,
  selectedGift,
  onGiftSelect,
  emptyMessage = 'No gifts available right now',
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const renderGiftItem = ({item}: {item: Gift}) => (
    <GiftCard
      gift={item}
      isSelected={selectedGift?.id === item.id}
      onPress={onGiftSelect}
    />
  );

  if (!gifts || gifts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text
          variant="bodySmall"
          color={colors.text.tertiary}
          style={styles.emptyText}>
          {emptyMessage}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={gifts}
      renderItem={renderGiftItem}
      keyExtractor={item => item.id}
      numColumns={3}
      columnWrapperStyle={styles.giftRow}
      contentContainerStyle={styles.giftList}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  giftList: {
    paddingBottom: 16,
    paddingHorizontal: 4,
  } as ViewStyle,
  giftRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  } as ViewStyle,
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  } as ViewStyle,
  emptyText: {
    marginTop: 12,
    fontSize: 14,
  } as TextStyle,
});