import React, {useState, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  Image,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Modal from '../../../../components/Modal/Modal';
import Icon from '../../../../components/Icon/Icon';
import {HeaderSelectorModalProps} from './types';

const {width} = Dimensions.get('window');
const CARD_SIZE = width / 2 - 80;

export default function HeaderSelectorModal({
  visible,
  onClose,
  options,
  selectedOption,
  onSelect,
}: HeaderSelectorModalProps) {
  const [pressedOption, setPressedOption] = useState<string | null>(null);

  // Animated option item component
  const AnimatedOptionItem = ({
    option,
    isSelected,
  }: {
    option: (typeof options)[0];
    isSelected: boolean;
  }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    const handlePressIn = () => {
      setPressedOption(option.id);

      Animated.spring(scaleAnim, {
        toValue: 0.95,
        friction: 5,
        useNativeDriver: true,
      }).start();

      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }).start();
    };

    const handlePressOut = () => {
      setPressedOption(null);

      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }).start();

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
      outputRange: [0, 0.3],
    });

    return (
      <Animated.View style={{transform: [{scale: scaleAnim}]}}>
        <TouchableOpacity
          style={[styles.optionCard, isSelected && styles.optionCardSelected]}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}>
          {/* Glow */}
          <Animated.View style={[styles.glow, {opacity: glowOpacity}]} />

          <Image source={option.image} style={styles.optionImage} />

          <Text style={[styles.optionName, isSelected && styles.selectedText]}>
            {option.name}
          </Text>

          <Text style={styles.optionHindi}>{option.nameHindi}</Text>

          {isSelected && (
            <View style={styles.checkBadge}>
              <Icon
                name="check"
                size={14}
                color="#fff"
                library="MaterialCommunityIcons"
              />
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Modal visible={visible} onClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Select Header Background</Text>
            <Text style={styles.subtitle}>हेडर बैकग्राउंड चुनें</Text>
          </View>

          <TouchableOpacity onPress={onClose}>
            <Icon
              name="close"
              size={24}
              color="#444"
              library="MaterialCommunityIcons"
            />
          </TouchableOpacity>
        </View>

        {/* Selected Section */}
        {selectedOption && (
          <View style={styles.selectedBox}>
            <Text style={styles.selectedLabel}>Selected / चयनित</Text>

            <View style={styles.selectedContent}>
              <Image
                source={selectedOption.image}
                style={styles.selectedImage}
              />
              <View>
                <Text style={styles.selectedName}>{selectedOption.name}</Text>
                <Text style={styles.selectedHindi}>
                  {selectedOption.nameHindi}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Options */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>
            {options.map(option => (
              <AnimatedOptionItem
                key={option.id}
                option={option}
                isSelected={selectedOption?.id === option.id}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 30,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },

  subtitle: {
    fontSize: 12,
    color: '#777',
  },

  selectedBox: {
    backgroundColor: '#f9f4ea',
    borderRadius: 14,
    padding: 15,
    marginBottom: 20,
  },

  selectedLabel: {
    fontSize: 12,
    color: '#b9935a',
    marginBottom: 8,
    fontWeight: '600',
  },

  selectedContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  selectedImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 12,
  },

  selectedName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#b9935a',
  },

  selectedHindi: {
    fontSize: 12,
    color: '#666',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  optionCard: {
    width: CARD_SIZE,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    marginBottom: 18,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
  },

  optionCardSelected: {
    borderWidth: 2,
    borderColor: '#b9935a',
    backgroundColor: '#fff8ec',
  },

  glow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#b9935a',
    borderRadius: 16,
  },

  optionImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginBottom: 10,
  },

  optionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },

  selectedText: {
    color: '#b9935a',
  },

  optionHindi: {
    fontSize: 11,
    color: '#777',
  },

  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#b9935a',
    borderRadius: 12,
    padding: 4,
  },
});
