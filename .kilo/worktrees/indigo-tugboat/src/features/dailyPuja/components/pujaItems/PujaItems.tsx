import React, { useRef } from 'react';
import { View, TouchableOpacity, Animated, Text, Image } from 'react-native';
import Icon from '../../../../components/Icon/Icon';
import { ITEM_IMAGES, POOJA_ITEMS } from './helpers';
import { pujaItemStyle } from './styles';
import { PujaItemButtonProps, PujaItemsProps } from './types';

function PujaItemButton({
  config,
  selectedOption,
  onPress,
}: PujaItemButtonProps) {
  const { id, name, nameHindi, color } = config;

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const hasSelection = !!selectedOption;
  const displayColor = hasSelection ? selectedOption.color : color;
  const displayIcon = hasSelection ? selectedOption.icon : config.iconName;
  const styles = pujaItemStyle;
  // Check if we have an image for this item - prefer selected option image
  const itemImage =
    hasSelection && selectedOption.id
      ? ITEM_IMAGES[selectedOption.id]
      : ITEM_IMAGES[id];

  const handlePress = () => {
    // Scale bounce animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Glow animation
    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Trigger callback
    onPress();
  };

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.6],
  });

  const glowScale = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });

  return (
    <View style={styles.itemWrapper}>
      {/* Glow effect */}
      <Animated.View
        style={[
          styles.glow,
          {
            opacity: glowOpacity,
            transform: [{ scale: glowScale }],
            backgroundColor: displayColor,
          },
        ]}
      />

      {/* Main button */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={handlePress}
          style={[
            styles.itemButton,
            {
              backgroundColor: displayColor + (hasSelection ? '40' : '25'),
              borderColor: displayColor,
              borderWidth: hasSelection ? 3 : 2,
            },
          ]}
          activeOpacity={0.7}
        >
          {itemImage ? (
            <Image
              source={itemImage}
              style={[
                styles.itemImage,
                // { tintColor: hasSelection ? undefined : displayColor },
              ]}
            />
          ) : (
            <Icon
              name={displayIcon}
              size={hasSelection ? 28 : 26}
              color={displayColor}
              library="MaterialCommunityIcons"
            />
          )}
        </TouchableOpacity>
      </Animated.View>

      {/* Item name label */}
      <Text style={[styles.itemLabel, { color: displayColor }]}>
        {hasSelection ? selectedOption.name : name}
      </Text>
      <Text style={[styles.itemLabelHindi, { color: displayColor + '99' }]}>
        {hasSelection ? selectedOption.nameHindi : nameHindi}
      </Text>
    </View>
  );
}

export default function PujaItems({
  onItemPress,
  onFlowerPress,
  selectedItems,
}: PujaItemsProps) {
  const handleItemPress = (itemId: string) => {
    // For flower, trigger flower rain
    if (itemId === 'flower' && onFlowerPress) {
      onFlowerPress();
    }
    // Callback for opening selection modal
    onItemPress(itemId);
  };
  const styles = pujaItemStyle;

  return (
    <View style={styles.container}>
      {/* First row - 3 items */}
      <View style={styles.firstRow}>
        {POOJA_ITEMS.slice(0, 3).map(item => (
          <PujaItemButton
            key={item.id}
            config={item}
            selectedOption={selectedItems[item.id]}
            onPress={() => handleItemPress(item.id)}
          />
        ))}
      </View>

      {/* Second row - 3 items */}
      <View style={styles.secondRow}>
        {POOJA_ITEMS.slice(3, 6).map(item => (
          <PujaItemButton
            key={item.id}
            config={item}
            selectedOption={selectedItems[item.id]}
            onPress={() => handleItemPress(item.id)}
          />
        ))}
      </View>
    </View>
  );
}
