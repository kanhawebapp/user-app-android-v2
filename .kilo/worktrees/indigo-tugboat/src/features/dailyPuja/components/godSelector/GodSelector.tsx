import React from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { godSelectorStyle } from './styles';
import { GodSelectorProps } from './types';

export default function GodSelector({
  gods,
  onSelect,
  selectedId,
  onOpenGodSelector,
}: GodSelectorProps) {
  const selectedGod = gods.find(god => god.id === selectedId);
  const styles = godSelectorStyle;

  const getGodColor = (godId: string): string => {
    const colorMap: Record<string, string> = {
      ganesha: '#FF9800',
      shiv: '#9C27B0',
      krishna: '#3F51B5',
      vishnu: '#2196F3',
      hanuman: '#F44336',
      laxmi: '#FFEB3B',
    };
    return colorMap[godId] || '#FFD700';
  };

  return (
    <View style={styles.container}>
      {/* Select God Button */}
      {onOpenGodSelector && (
        <TouchableOpacity
          onPress={onOpenGodSelector}
          activeOpacity={0.8}
          style={styles.selectButtonWrapper}
        >
          <View style={styles.selectButtonContainer}>
            <View
              style={[
                styles.selectButton,
                selectedGod && {
                  backgroundColor: getGodColor(selectedGod.id) + '30',
                  borderColor: getGodColor(selectedGod.id),
                },
              ]}
            >
              <Image
                source={selectedGod?.image}
                style={styles.lordImage}
                resizeMode="contain"
              />
            </View>

            <Text
              style={[
                styles.selectButtonLabel,
                selectedGod && {
                  color: getGodColor(selectedGod.id),
                  fontWeight: '700',
                },
              ]}
            >
              {selectedGod ? selectedGod.name.replace('Lord ', '') : 'Select'}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}
