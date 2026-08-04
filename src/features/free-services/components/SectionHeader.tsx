import React from 'react';
import {StyleSheet, View} from 'react-native';

import {Icon} from '../../../components/Icon';
import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';
import type {IconProps} from '../../../components/Icon/iconType';

export interface SectionHeaderProps {
  title: string;
  /** Icon rendered before the title (optional). */
  icon?: IconProps;
}

/**
 * Section title rendered above a group of cards (e.g. Planet Positions or
 * Vimshottari Dasha).
 */
const SectionHeader: React.FC<SectionHeaderProps> = ({title, icon}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View style={styles.container}>
      {icon ? (
        <View
          style={[styles.iconBadge, {backgroundColor: colors.primary.light}]}>
          <Icon
            name={icon.name}
            size={16}
            color={colors.primary.main}
            library={icon.library}
          />
        </View>
      ) : null}
      <Text
        variant="body"
        weight="bold"
        style={{color: colors.text.primary, flex: 1}}>
        {title}
      </Text>
    </View>
  );
};

export default SectionHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBadge: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
});
