import React from 'react';
import {StyleSheet, View} from 'react-native';

import {Icon} from '../../../components/Icon';
import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';

export interface RatingItemProps {
  /** Leading emoji, e.g. "❤️". */
  emoji: string;
  /** Section label, e.g. "Personal Life". */
  label: string;
  /** Numeric rating. Falls back to "-" when missing. */
  value?: number;
}

export const RatingItem: React.FC<RatingItemProps> = ({
  emoji,
  label,
  value,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const displayValue = value != null ? String(value) : '-';

  return (
    <View style={styles.row}>
      <View style={styles.labelRow}>
        <Text variant="bodySmall" style={{color: colors.text.tertiary}}>
          {emoji}
        </Text>
        <Text
          variant="bodySmall"
          weight="medium"
          style={{color: colors.text.secondary, marginLeft: 6}}
          numberOfLines={1}>
          {label}
        </Text>
      </View>

      <View style={styles.valueRow}>
        <Icon
          name="star"
          size={14}
          color={colors.yellow[500]}
          library="MaterialIcons"
        />
        <Text
          variant="bodySmall"
          weight="bold"
          style={{color: colors.text.primary, marginLeft: 4}}
          numberOfLines={1}>
          {displayValue}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default RatingItem;
