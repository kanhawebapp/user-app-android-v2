import React, {useState, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  Image,
  Animated,
} from 'react-native';
import Modal from '../../../../components/Modal/Modal';
import Icon from '../../../../components/Icon/Icon';
import {ITEM_IMAGES, POOJA_ITEM_OPTIONS} from './helpers';
import {ItemSelectorModalProps, PujaItemOption} from './types';
import {itemSelectorModalStyle} from './styles';

export default function ItemSelectorModal({
  visible,
  onClose,
  item,
  selectedOption,
  onSelect,
}: ItemSelectorModalProps) {
  const [pressedOption, setPressedOption] = useState<string | null>(null);

  if (!item) {
    return null;
  }
  const styles = itemSelectorModalStyle;
  const options = item.options || POOJA_ITEM_OPTIONS[item.id] || [];
  // console.log('itemss in the modal', item);

  // Check if we have an image for this item type
  const itemImage = ITEM_IMAGES[item.id];

  // Animated option item component
  const AnimatedOptionItem = ({
    option,
    isSelected,
  }: {
    option: PujaItemOption;
    isSelected: boolean;
  }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    const optionImage = ITEM_IMAGES[option.id];

    const handlePressIn = () => {
      setPressedOption(option.id);
      // Scale down animation
      Animated.spring(scaleAnim, {
        toValue: 0.9,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }).start();

      // Glow animation
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }).start();
    };

    const handlePressOut = () => {
      setPressedOption(null);
      // Scale back animation
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 100,
        useNativeDriver: true,
      }).start();

      // Glow fade out
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    };

    const handlePress = () => {
      onSelect(option);
      setTimeout(onClose, 300);
    };

    const glowOpacity = glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.5],
    });

    const glowScale = glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.3],
    });

    return (
      <Animated.View style={[{transform: [{scale: scaleAnim}]}]}>
        <TouchableOpacity
          style={[
            styles.optionItem,
            isSelected && {
              backgroundColor: option.color + '20',
              borderColor: option.color,
            },
            pressedOption === option.id && {
              transform: [{scale: 0.95}],
            },
          ]}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}>
          {/* Glow effect behind icon */}
          <Animated.View
            style={[
              styles.optionGlow,
              {
                backgroundColor: option.color,
                opacity: glowOpacity,
                transform: [{scale: glowScale}],
              },
            ]}
          />

          <View
            style={[
              styles.optionIconBg,
              {backgroundColor: option.color + '20'},
            ]}>
            {optionImage ? (
              <Image source={optionImage} style={styles.optionImage} />
            ) : (
              <Icon
                name={option.icon}
                size={32}
                color={option.color}
                library="MaterialCommunityIcons"
              />
            )}
          </View>
          <Text
            style={[styles.optionName, isSelected && {color: option.color}]}>
            {option.name}
          </Text>
          <Text style={styles.optionNameHindi}>{option.nameHindi}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      // title={`Select ${item.name}`}
      // showCloseButton
      contentStyle={styles.modalContent}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>
          Select{' '}
          {item?.id === 'camara'
            ? 'Dhoop'
            : item?.id?.charAt(0).toUpperCase() + item?.id?.slice(1)}
        </Text>

        <TouchableOpacity
          onPress={onClose}
          style={styles.closeButton}
          activeOpacity={0.7}>
          <Icon
            name="close"
            size={24}
            color="#333"
            library="MaterialCommunityIcons"
          />
        </TouchableOpacity>
      </View>
      {/* Selected option display at top */}
      {selectedOption && (
        <View
          style={[
            styles.selectedContainer,
            {borderColor: selectedOption.color},
          ]}>
          <Text style={styles.selectedLabel}>Selected / चयनित:</Text>
          <View style={styles.selectedItem}>
            <View
              style={[
                styles.selectedIconBg,
                {backgroundColor: selectedOption.color + '30'},
              ]}>
              {ITEM_IMAGES[selectedOption.id] ? (
                <Image
                  source={ITEM_IMAGES[selectedOption.id]}
                  style={styles.selectedImage}
                />
              ) : itemImage ? (
                <Image source={itemImage} style={styles.selectedImage} />
              ) : (
                <Icon
                  name={selectedOption.icon}
                  size={28}
                  color={selectedOption.color}
                  library="MaterialCommunityIcons"
                />
              )}
            </View>
            <View style={styles.selectedTextContainer}>
              <Text
                style={[styles.selectedName, {color: selectedOption.color}]}>
                {selectedOption.name}
              </Text>
              <Text style={styles.selectedNameHindi}>
                {selectedOption.nameHindi}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Options grid */}
      <ScrollView
        style={styles.optionsContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.optionsGrid}>
          {options.map(option => (
            <AnimatedOptionItem
              key={option.id}
              option={option}
              isSelected={selectedOption?.id === option.id}
            />
          ))}
        </View>
      </ScrollView>
    </Modal>
  );
}
