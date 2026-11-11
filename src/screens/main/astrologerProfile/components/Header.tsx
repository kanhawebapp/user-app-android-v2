import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../../theme';
import { Icon } from '../../../../components/Icon';

type HeaderProps = {
  data?: any;
  onBack: () => void;
  followersCount?: any;
};

export const Header: React.FC<HeaderProps> = ({ onBack }) => {
  const theme = useTheme();
  const themeColors = theme.colors;

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon
            name="arrow-back"
            size={22}
            color={themeColors.primary.main}
            library="Ionicons"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 4,
    paddingTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Header;
