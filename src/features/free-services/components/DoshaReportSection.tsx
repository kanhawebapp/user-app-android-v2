/**
 * Card section used by the Kundli Dosha detail screens: an icon + title
 * header and a list of bulleted text lines (paragraphs, rules, effects,
 * remedies, ...). Mirrors the General Life Prediction section card.
 */

import React from 'react';
import {StyleSheet, View} from 'react-native';

import {Card} from '../../../components/Card';
import {Icon} from '../../../components/Icon';
import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';
import type {IconProps} from '../../../components/Icon/iconType';

export interface DoshaReportSectionProps {
  title: string;
  icon?: IconProps;
  /** Lines rendered as bullet points (paragraphs or list items). */
  items: string[];
  emptyText?: string;
}

const DoshaReportSection: React.FC<DoshaReportSectionProps> = ({
  title,
  icon,
  items,
  emptyText,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const hasItems = items.length > 0;

  return (
    <Card variant="elevated" style={styles.card}>
      <View style={styles.header}>
        {icon ? (
          <View
            style={[
              styles.iconContainer,
              {backgroundColor: colors.primary.light + '20'},
            ]}>
            <Icon
              name={icon.name}
              size={18}
              color={colors.primary.main}
              library={icon.library || 'MaterialIcons'}
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

      {!hasItems ? (
        <Text
          variant="bodySmall"
          style={{color: colors.text.tertiary, textAlign: 'center'}}>
          {emptyText || `No ${title.toLowerCase()} details available.`}
        </Text>
      ) : (
        <View style={styles.items}>
          {items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View
                style={[styles.bullet, {backgroundColor: colors.primary.main}]}
              />
              <Text
                variant="bodySmall"
                lineHeight={22}
                style={{color: colors.text.primary, flex: 1}}>
                {item}
              </Text>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
};

export default React.memo(DoshaReportSection);

const styles = StyleSheet.create({
  card: {
    marginBottom: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  items: {
    width: '100%',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
    marginRight: 10,
  },
});
