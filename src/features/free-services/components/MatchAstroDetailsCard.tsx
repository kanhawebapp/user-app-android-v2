/**
 * Astrological birth details of one party, as returned by
 * match_astro_details. Fields are rendered from whatever the API provided
 * (see ASTRO_DETAIL_FIELDS), so a partial response never breaks the report.
 *
 * Layout only: an icon chip identifies the party, and each field is a scan-friendly
 * label/value row. Fields the API left empty are not rendered, and a party with
 * no fields at all renders no card.
 */

import React from 'react';
import {StyleSheet, View} from 'react-native';

import {Card} from '../../../components/Card';
import {Icon} from '../../../components/Icon';
import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';
import type {AstroDetailItem} from '../utils/matchMaking';

export interface MatchAstroDetailsCardProps {
  title: string;
  items: AstroDetailItem[];
  /** Optional leading icon, so the two party cards read apart at a glance. */
  icon?: string;
}

const MatchAstroDetailsCard: React.FC<MatchAstroDetailsCardProps> = ({
  title,
  items,
  icon,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  // Drop any field the API returned without a usable value.
  const fields = items.filter(
    item => item.value && item.value.trim().length > 0,
  );

  if (fields.length === 0) {
    return null;
  }

  return (
    <Card variant="elevated" style={styles.card}>
      <View style={styles.header}>
        {icon ? (
          <View
            style={[
              styles.iconContainer,
              {backgroundColor: colors.primary.light},
            ]}>
            <Icon
              name={icon}
              size={18}
              color={colors.primary.main}
              library="MaterialIcons"
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

      <View style={styles.list}>
        {fields.map((item, index) => (
          <View
            key={item.label}
            style={[
              styles.row,
              index > 0
                ? {
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderTopColor: colors.divider,
                  }
                : null,
            ]}>
            <Text
              variant="bodySmall"
              style={{color: colors.text.secondary, marginRight: 12}}>
              {item.label}
            </Text>
            <Text
              variant="bodySmall"
              weight="semibold"
              align="right"
              style={{color: colors.text.primary, flex: 1}}>
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
};

export default React.memo(MatchAstroDetailsCard);

const styles = StyleSheet.create({
  card: {
    marginBottom: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  list: {
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
  },
});
