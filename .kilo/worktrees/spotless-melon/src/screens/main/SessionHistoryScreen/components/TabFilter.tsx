import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '../../../../theme';
import {Text} from '../../../../components/Text';
import {SessionStatus} from '../../../../services/api/sessions/sessions.types';

export interface TabItem {
  key: SessionStatus | 'all';
  label: string;
}

interface TabFilterProps {
  tabs: TabItem[];
  activeTab: SessionStatus | 'all';
  onTabChange: (tab: SessionStatus | 'all') => void;
}

export const TabFilter: React.FC<TabFilterProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  const {colors} = useTheme();

  return (
    <View
      style={[
        styles.tabContainer,
        {backgroundColor: colors.background.primary},
      ]}>
      <View
        style={[
          styles.tabPillContainer,
          {backgroundColor: colors.background.secondary},
        ]}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabPill,
                {
                  backgroundColor: isActive
                    ? colors.primary.main
                    : 'transparent',
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
      </View>
    </View>
  );
};

export const DEFAULT_TABS: TabItem[] = [
  {key: 'all', label: 'All'},
  {key: 'COMPLETED', label: 'Completed'},
  {key: 'ONGOING', label: 'Ongoing'},
  {key: 'CANCELLED', label: 'Cancelled'},
  // {key: 'SCHEDULED', label: 'Scheduled'},
];

const styles = StyleSheet.create({
  tabContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  tabPillContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
  },
  tabPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default TabFilter;
