import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../../../theme';
import {Text} from '../../../../components/Text';
import type {PaymentLogsCategory} from '../../../../services/api/paymentLogs';

export interface CategoryTabItem {
  key: PaymentLogsCategory;
  label: string;
}

interface CategoryTabsProps {
  tabs: CategoryTabItem[];
  activeTab: PaymentLogsCategory;
  onTabChange: (tab: PaymentLogsCategory) => void;
}

export const CATEGORY_TABS: CategoryTabItem[] = [
  {key: 'all', label: 'All Payments'},
  {key: 'service', label: 'Service'},
  {key: 'puja', label: 'Puja'},
  {key: 'recharge', label: 'Recharge'},
];

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  const {colors} = useTheme();

  return (
    <View
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                {
                  backgroundColor: isActive
                    ? colors.primary.main
                    : colors.background.secondary,
                },
              ]}
              onPress={() => onTabChange(tab.key)}
              activeOpacity={0.7}>
              <Text
                variant="bodySmall"
                weight={isActive ? 'bold' : 'medium'}
                style={{
                  color: isActive ? '#ffffff' : colors.text.secondary,
                }}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
});

export default CategoryTabs;
