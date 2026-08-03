import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';
import type {HoroscopeTab} from '../../../services/api/astrologyApi/astrology.types';

export interface TabSelectorProps {
  activeTab: HoroscopeTab;
  onChangeTab: (tab: HoroscopeTab) => void;
  disabled?: boolean;
}

export const TABS: {key: HoroscopeTab; label: string}[] = [
  {key: 'previous', label: 'Previous'},
  {key: 'today', label: 'Today'},
  {key: 'next', label: 'Next'},
];

export const TabSelector: React.FC<TabSelectorProps> = ({
  activeTab,
  onChangeTab,
  disabled,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      {TABS.map(tab => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.7}
            disabled={disabled}
            onPress={() => onChangeTab(tab.key)}
            style={[
              styles.tab,
              {
                backgroundColor: disabled
                  ? colors.background.secondary
                  : isActive
                  ? colors.primary.main
                  : colors.background.secondary,
                opacity: disabled ? 0.6 : 1,
              },
            ]}
            accessibilityRole="tab"
            accessibilityState={{selected: isActive, disabled}}>
            <Text
              variant="bodySmall"
              weight="semibold"
              style={{
                color: isActive
                  ? colors.primary.contrastText
                  : colors.text.secondary,
              }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    minHeight: 44,
  },
});

export default TabSelector;
