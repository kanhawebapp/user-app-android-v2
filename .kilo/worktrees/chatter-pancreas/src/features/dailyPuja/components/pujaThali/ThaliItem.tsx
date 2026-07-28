import React, {useRef, useEffect} from 'react';
import {TouchableOpacity, Animated, Text, Image} from 'react-native';
import Icon from '../../../../components/Icon/Icon';
import {pujaThaliStyle} from './styles';
import {ITEM_IMAGES} from '../pujaItems/helpers';
import {ThaliItemProps} from './types';

const styles = pujaThaliStyle;

export function ThaliItem({
  item,
  selectedOption,
  onPress,
  index,
  showImage = false,
}: ThaliItemProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const hasSelection = !!selectedOption;
  const displayColor = hasSelection ? selectedOption.color : item.color;
  const displayIcon = hasSelection ? selectedOption.icon : item.iconName;

  // Check if we have an image for this item - prefer selected option image
  const itemImage =
    hasSelection && selectedOption.id
      ? ITEM_IMAGES[selectedOption.id]
      : ITEM_IMAGES[item.id];

  // Entry animation
  useEffect(() => {
    if (hasSelection) {
      Animated.sequence([
        Animated.delay(index * 100),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // Glow pulse animation
      const glowAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.5,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
      );
      glowAnimation.start();
      return () => {
        glowAnimation.stop();
        scaleAnim.setValue(0);
        glowAnim.setValue(0);
      };
    } else {
      scaleAnim.setValue(0);
      glowAnim.setValue(0);
    }
  }, [hasSelection]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.4],
  });

  const glowScale = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

  const handlePress = () => {
    // Scale bounce animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
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
    onPress();
  };

  return (
    <Animated.View
      style={[
        styles.thaliItemContainer,
        {
          transform: [{scale: scaleAnim}],
        },
      ]}>
      {/* Glow effect */}
      {hasSelection && (
        <Animated.View
          style={[
            // styles.thaliItemGlow,
            {
              opacity: glowOpacity,
              transform: [{scale: glowScale}],
              backgroundColor: displayColor,
            },
          ]}
        />
      )}

      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        {showImage && itemImage ? (
          <Image
            source={itemImage}
            style={[
              styles.thaliItemImage,
              // { tintColor: hasSelection ? undefined : displayColor },
            ]}
          />
        ) : (
          <Icon
            name={displayIcon}
            size={hasSelection ? 24 : 20}
            color={displayColor}
            library="MaterialCommunityIcons"
          />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}
