import React from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  Image,
} from 'react-native';
import Modal from '../../../../components/Modal/Modal';
import { godSelectorModalStyle } from './styles';
import { GodSelectorModalProps } from './types';


export default function GodSelectorModal({
  visible,
  onClose,
  gods,
  selectedGod,
  onSelect,
}: GodSelectorModalProps) {
  const styles = godSelectorModalStyle
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Select Lord"
      showCloseButton
      contentStyle={styles.modalContent}
    >
      {/* Selected god display at top */}
      {selectedGod && (
        <View
          style={[styles.selectedContainer, { borderColor: selectedGod.color }]}
        >
          <Text style={styles.selectedLabel}>Selected / चयनित:</Text>
          <View style={styles.selectedItem}>
            <Image
              source={selectedGod.image}
              style={styles.selectedImage}
              resizeMode="cover"
            />
            <View style={styles.selectedTextContainer}>
              <Text style={[styles.selectedName, { color: selectedGod.color }]}>
                {selectedGod.name}
              </Text>
              <Text style={styles.selectedNameHindi}>
                {selectedGod.nameHindi}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Gods grid */}
      <ScrollView
        style={styles.optionsContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.optionsGrid}>
          {gods.map(god => (
            <TouchableOpacity
              key={god.id}
              style={[
                styles.optionItem,
                selectedGod?.id === god.id && {
                  backgroundColor: god.color + '20',
                  borderColor: god.color,
                },
              ]}
              onPress={() => {
                onSelect(god);
                setTimeout(onClose, 300);
              }}
              activeOpacity={0.7}
            >
              <Image
                source={god.image}
                style={styles.optionImage}
                resizeMode="cover"
              />
              <Text
                style={[
                  styles.optionName,
                  selectedGod?.id === god.id && { color: god.color },
                ]}
              >
                {god.name.replace('Lord ', '')}
              </Text>
              <Text style={styles.optionNameHindi}>{god.nameHindi}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Modal>
  );
}
