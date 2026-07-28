import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '../../../../theme';
import {Text} from '../../../../components/Text';
import {Icon} from '../../../../components/Icon';

interface HeaderProps {
  onNavigateBack: () => void;
  insetsTop: number;
}

export const Header: React.FC<HeaderProps> = ({onNavigateBack, insetsTop}) => {
  const {colors} = useTheme();

  return (
    <View
      style={[
        styles.header,
        {
          paddingTop: insetsTop + 8,
          backgroundColor: colors.background.primary,
        },
      ]}>
      <TouchableOpacity
        onPress={onNavigateBack}
        style={styles.backBtn}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
        <View
          style={[
            styles.backBtnCircle,
            {backgroundColor: colors.background.secondary},
          ]}>
          <Icon name="arrow-back-ios" size={20} color={colors.text.primary} />
        </View>
      </TouchableOpacity>

      <Text variant="h5" weight="bold" style={{color: colors.text.primary}}>
        Chat History
      </Text>

      <View style={{width: 40}} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Header;
