import React, {useRef} from 'react';
import {View, TouchableOpacity, Animated, Text, Image} from 'react-native';
import Icon from '../../../../components/Icon/Icon';
import {SpecialItemButtonProps, SpecialPujaItemsProps} from './types';
import {specialPujaItemStyle} from './styles';
import {ITEM_IMAGES, SPECIAL_POOJA_ITEMS} from './helpers';

const styles = specialPujaItemStyle;

export function SpecialItemButton({
  config,
  isActive,
  onPress,
}: SpecialItemButtonProps) {
  const {id, name, nameHindi, color, soundFile} = config;

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Check if we have an image for this item
  const itemImage = ITEM_IMAGES[id];

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

    // playEffect(soundFile, 'mp3');

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
      {/* Glow effect when active */}
      <Animated.View
        style={[
          styles.glow,
          {
            opacity: glowOpacity,
            transform: [{scale: glowScale}],
            backgroundColor: color,
          },
        ]}
      />

      {/* Main button */}
      <Animated.View style={{transform: [{scale: scaleAnim}]}}>
        <TouchableOpacity
          onPress={handlePress}
          style={[
            styles.itemButton,
            {
              backgroundColor: color + (isActive ? '50' : '25'),
              borderColor: color,
              borderWidth: isActive ? 3 : 2,
            },
          ]}
          activeOpacity={0.7}>
          {itemImage ? (
            <Image
              source={itemImage}
              style={[
                styles.itemImage,
                // { tintColor: isActive ? undefined : color },
              ]}
            />
          ) : (
            <Icon
              name={config.iconName}
              size={isActive ? 32 : 28}
              color={color}
              library="MaterialCommunityIcons"
            />
          )}
        </TouchableOpacity>
      </Animated.View>

      {/* Item name label */}
      <Text
        style={[styles.itemLabel, {color: isActive ? color : color + '99'}]}>
        {name}
      </Text>
      <Text style={[styles.itemLabelHindi, {color: color + '77'}]}>
        {nameHindi}
      </Text>
    </View>
  );
}
