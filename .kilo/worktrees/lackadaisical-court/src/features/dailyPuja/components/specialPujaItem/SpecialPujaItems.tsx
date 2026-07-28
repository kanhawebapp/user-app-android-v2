import React from 'react';
import {View} from 'react-native';
import {SpecialPujaItemsProps} from './types';
import {specialPujaItemStyle} from './styles';
import {SPECIAL_POOJA_ITEMS} from './helpers';
import {SpecialItemButton} from './SpecialButton';

const styles = specialPujaItemStyle;

export default function SpecialPujaItems({
  onItemPress,
  activeItemId,
  onPressFlower,
}: SpecialPujaItemsProps) {
  return (
    <View style={styles.container}>
      {SPECIAL_POOJA_ITEMS.map(item => (
        <SpecialItemButton
          key={item.id}
          config={item}
          isActive={activeItemId === item.id}
          onPress={() => {
            if (item.id === 'mala') {
              onPressFlower(true);
              // onItemPress(item.id, item.soundFile);
            } else {
              onItemPress(item.id, item.soundFile);
            }
          }}
        />
      ))}
    </View>
  );
}
