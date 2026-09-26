/**
 * Manglik Dosha analysis for one party of a match, as returned by
 * match_manglik_report. Reused for the male and the female, with the aspect,
 * house and cancellation-rule lists rendered from whatever the API returned.
 */

import React from 'react';
import {StyleSheet, View} from 'react-native';

import {Card} from '../../../components/Card';
import {Icon} from '../../../components/Icon';
import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';
import {formatPercent, presentText} from '../utils/doshaReport';
import type {ManglikAnalysisData} from '../utils/matchMaking';
import DoshaReportSection from './DoshaReportSection';

export interface ManglikMatchCardProps {
  title: string;
  analysis: ManglikAnalysisData;
}

const ManglikMatchCard: React.FC<ManglikMatchCardProps> = ({
  title,
  analysis,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const statusText = presentText(analysis.isPresent);
  const isPresent = analysis.isPresent === true;
  const statusColor = isPresent
    ? colors.error.main
    : analysis.isPresent === false
    ? colors.success.main
    : colors.text.tertiary;

  return (
    <View style={styles.wrapper}>
      <Card variant="elevated" style={styles.card}>
        <View style={styles.header}>
          <View
            style={[
              styles.iconContainer,
              {backgroundColor: colors.primary.light},
            ]}>
            <Icon
              name="favorite"
              size={18}
              color={colors.primary.main}
              library="MaterialIcons"
            />
          </View>
          <Text
            variant="body"
            weight="bold"
            style={{color: colors.text.primary, flex: 1}}>
            {title}
          </Text>
          <View style={[styles.badge, {backgroundColor: statusColor + '20'}]}>
            <Text
              variant="captionSmall"
              weight="bold"
              style={{color: statusColor}}>
              {statusText}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.summary,
            {backgroundColor: colors.background.secondary},
          ]}>
          <View style={styles.summaryItem}>
            <Text variant="captionSmall" style={{color: colors.text.tertiary}}>
              Is Manglik
            </Text>
            <Text
              variant="bodySmall"
              weight="bold"
              style={{color: colors.text.primary}}>
              {statusText}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text variant="captionSmall" style={{color: colors.text.tertiary}}>
              Manglik Status
            </Text>
            <Text
              variant="bodySmall"
              weight="bold"
              style={{color: colors.text.primary}}>
              {analysis.status ?? '—'}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text variant="captionSmall" style={{color: colors.text.tertiary}}>
              Manglik Percentage
            </Text>
            <Text
              variant="bodySmall"
              weight="bold"
              style={{color: colors.text.primary}}>
              {formatPercent(analysis.percentage) ?? '—'}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text variant="captionSmall" style={{color: colors.text.tertiary}}>
              After Cancellation
            </Text>
            <Text
              variant="bodySmall"
              weight="bold"
              style={{color: colors.text.primary}}>
              {formatPercent(analysis.percentageAfterCancellation) ?? '—'}
            </Text>
          </View>
        </View>

        {analysis.reportParagraphs.length > 0 ? (
          <DoshaReportSection
            title="Report"
            icon={{name: 'menu-book', library: 'MaterialIcons'}}
            items={analysis.reportParagraphs}
          />
        ) : null}

        <DoshaReportSection
          title="Based on Aspects"
          icon={{name: 'visibility', library: 'MaterialIcons'}}
          items={analysis.basedOnAspect}
          emptyText="No aspect based rules were reported."
        />

        <DoshaReportSection
          title="Based on House"
          icon={{name: 'home', library: 'MaterialIcons'}}
          items={analysis.basedOnHouse}
          emptyText="No house based rules were reported."
        />

        <DoshaReportSection
          title="Cancellation Rules"
          icon={{name: 'fact-check', library: 'MaterialIcons'}}
          items={analysis.cancelRules}
          emptyText="No cancellation rules were reported."
        />
      </Card>
    </View>
  );
};

export default React.memo(ManglikMatchCard);

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 0,
  },
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
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  summary: {
    borderRadius: 14,
    padding: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
});
