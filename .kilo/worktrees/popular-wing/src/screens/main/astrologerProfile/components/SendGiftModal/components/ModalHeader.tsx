import React from 'react';
import {View, TouchableOpacity, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import { Icon, Text, useTheme } from '../../../../../../components';

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  colors: ReturnType<typeof useTheme>['colors'];
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({title, onClose, colors}) => {
  return (
    <View style={[styles.header, {borderBottomColor: colors.border.light}]}>
      <Text
        variant="h5"
        weight="semibold"
        color={colors.text.primary}
        style={styles.headerTitle}>
        {title}
      </Text>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onClose}
        style={[
          styles.closeButton,
          {
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.light,
          },
        ]}>
        <Icon
          name="close"
          size={22}
          color={colors.text.primary}
          library="MaterialIcons"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    backgroundColor: 'transparent',
  } as ViewStyle,
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    marginRight: 36,
  } as TextStyle,
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  } as ViewStyle,
});