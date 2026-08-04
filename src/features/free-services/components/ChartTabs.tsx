import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';

export interface ChartTabItem {
  key: string;
  label: string;
}

export interface ChartTabsProps {
  tabs: ChartTabItem[];
  activeKey: string;
  onChange: (key: string) => void;
}

/**
 * Segmented tab bar used on the Birth Chart screen
 * (Basic / Planets / Divisional Charts).
 */
const ChartTabs: React.FC<ChartTabsProps> = ({tabs, activeKey, onChange}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: colors.background.secondary},
      ]}>
      {tabs.map(tab => {
        const isActive = tab.key === activeKey;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              isActive && {backgroundColor: colors.primary.main},
            ]}
            onPress={() => onChange(tab.key)}
            activeOpacity={0.85}
            testID={`chart-tab-${tab.key}`}>
            <Text
              variant="bodySmall"
              weight="semibold"
              style={{
                color: isActive
                  ? colors.primary.contrastText
                  : colors.text.secondary,
                textAlign: 'center',
              }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default ChartTabs;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
});
