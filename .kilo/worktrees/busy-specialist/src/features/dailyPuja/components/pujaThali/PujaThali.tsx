import React, { useRef, useEffect } from 'react';
import {
  View,
  Animated,
  Text,
  Image,
  Easing,
} from 'react-native';
import Icon from '../../../../components/Icon/Icon';
import { pujaThaliStyle } from './styles';
import { ALL_POOJA_ITEMS } from './helpers';
import { ITEM_IMAGES } from '../pujaItems/helpers';
import { PujaThaliProps } from './types';
import { ThaliItem } from './ThaliItem';

const pujaThaliImage = require('../../assets/images/pujaThali.png');
const styles = pujaThaliStyle

export default function PujaThali({
  selectedItems,
  onItemPress,
}: PujaThaliProps) {
  const selectedCount = Object.keys(selectedItems).length;

  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (selectedCount > 0) {
      rotateAnim.setValue(0);

      const animation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 6000, // speed of aarti
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      );

      animation.start();

      return () => {
        animation.stop();
        rotateAnim.setValue(0);
      };
    }
  }, [selectedCount]);

  // Convert 0 → 1 into 0deg → 360deg
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const radius = 30; // control circle size

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.thaliPlate,
          {
            transform: [
              { rotate },
              { translateX: radius },
              {
                rotate: Animated.multiply(rotateAnim, -360).interpolate({
                  inputRange: [-360, 0],
                  outputRange: ['-360deg', '0deg'],
                }),
              },
            ],
          },
        ]}
      >
        <Image
          source={pujaThaliImage}
          style={styles.thaliImage}
          resizeMode="contain"
        />

        <View style={styles.thaliInner}>
          {selectedCount === 0 && (
            <View style={styles.emptyState}>
              <Icon
                name="silverware-variant"
                size={40}
                color="rgba(255, 215, 0, 0.4)"
                library="MaterialCommunityIcons"
              />
              <Text style={styles.emptyText}>Select items below</Text>
              <Text style={styles.emptyTextHindi}>नीचे से आइटम चुनें</Text>
            </View>
          )}

         
          {selectedCount > 0 && (
            <View style={styles.itemsContainer}>
              {/* Top row - 3 items */}
              <View style={styles.topRow}>
                {ALL_POOJA_ITEMS.slice(0, 3).map((item, index) => (
                  <ThaliItem
                    key={item.id}
                    item={item}
                    selectedOption={selectedItems[item.id]}
                    onPress={() => onItemPress(item.id)}
                    index={index}
                    showImage={!!ITEM_IMAGES[item.id]}
                  />
                ))}
              </View>

              {/* Middle row - 4 items (2 on left, 2 on right) */}
              <View style={styles.middleRow}>
                <View style={styles.middleLeft}>
                  {ALL_POOJA_ITEMS.slice(3, 5).map((item, index) => (
                    <ThaliItem
                      key={item.id}
                      item={item}
                      selectedOption={selectedItems[item.id]}
                      onPress={() => onItemPress(item.id)}
                      index={index + 3}
                      showImage={!!ITEM_IMAGES[item.id]}
                    />
                  ))}
                </View>

                {/* Center decoration */}
                <View style={styles.centerDecoration}>
                  <Icon
                    name="om"
                    size={28}
                    color="rgba(255, 215, 0, 0.6)"
                    library="MaterialCommunityIcons"
                  />
                </View>

                <View style={styles.middleRight}>
                  {ALL_POOJA_ITEMS.slice(5, 7).map((item, index) => (
                    <ThaliItem
                      key={item.id}
                      item={item}
                      selectedOption={selectedItems[item.id]}
                      onPress={() => onItemPress(item.id)}
                      index={index + 5}
                      showImage={!!ITEM_IMAGES[item.id]}
                    />
                  ))}
                </View>
              </View>

              {/* Bottom row - 2 items */}
              <View style={styles.bottomRow}>
                {ALL_POOJA_ITEMS.slice(7).map((item, index) => (
                  <ThaliItem
                    key={item.id}
                    item={item}
                    selectedOption={selectedItems[item.id]}
                    onPress={() => onItemPress(item.id)}
                    index={index + 7}
                    showImage={!!ITEM_IMAGES[item.id]}
                  />
                ))}
              </View>
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  );
}
