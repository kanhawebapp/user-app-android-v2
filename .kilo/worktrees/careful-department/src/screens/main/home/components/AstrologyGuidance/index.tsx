import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../../../theme';
import { Text } from '../../../../../components/Text';
import { Icon } from '../../../../../components/Icon';
import { AstrologyGuidanceProps, GuidanceItem } from './type';
import { styles } from './styles';
import { useAstrologyGuidance } from './hooks/useAstrologyGuidance';

export const AstrologyGuidance: React.FC<AstrologyGuidanceProps> = ({
  items = [],
  onItemPress,
  style,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  
  const { handleItemPress } = useAstrologyGuidance(items, onItemPress);

  const renderItem = ({ item }: { item: GuidanceItem }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: colors.background.secondary },
        ]}
      >
        <Icon
          name={item.icon}
          library={item.iconLibrary as any}
          size={28}
          color={colors.primary.main}
        />
      </View>
      <Text
        variant="caption"
        weight="medium"
        style={[styles.itemTitle, { color: colors.text.primary }]}
        numberOfLines={2}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text variant="h6" weight="semibold">
          Guidance for Life Problems
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {items.map((item) => (
          <View key={item.id}>
            {renderItem({ item })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default AstrologyGuidance;

