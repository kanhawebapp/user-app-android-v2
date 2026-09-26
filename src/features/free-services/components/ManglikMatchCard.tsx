/**
 * Manglik Dosha analysis for one party of a match, as returned by
 * match_manglik_report. Reused for the male and the female, with the aspect,
 * house and cancellation-rule lists rendered from whatever the API returned.
 *
 * Layout only: the four summary figures are shown as a labelled metrics grid and
 * the four text blocks as separate titled sections, so nothing reads as one long
 * block. Fields and sections the API left empty are not rendered at all.
 */

import React from 'react';
import {StyleSheet, View} from 'react-native';

import {Card} from '../../../components/Card';
import {Icon} from '../../../components/Icon';
import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';
import {formatPercent} from '../utils/doshaReport';
import type {ManglikAnalysisData} from '../utils/matchMaking';
import DoshaReportSection from './DoshaReportSection';

export interface ManglikMatchCardProps {
  title: string;
  analysis: ManglikAnalysisData;
}

interface ManglikFact {
  label: string;
  value: string;
  valueColor?: string;
}

const ManglikMatchCard: React.FC<ManglikMatchCardProps> = ({
  title,
  analysis,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  // Only the figures the API actually returned are listed, so a partial
  // response never leaves a placeholder or a half empty cell behind.
  const facts: ManglikFact[] = [];

  if (analysis.isPresent !== null) {
    facts.push({
      label: 'Is Manglik',
      value: analysis.isPresent ? 'Yes' : 'No',
      valueColor: analysis.isPresent ? colors.error.main : colors.success.main,
    });
  }

  if (analysis.status) {
    facts.push({label: 'Manglik Status', value: analysis.status});
  }

  const percentage = formatPercent(analysis.percentage);
  if (percentage) {
    facts.push({label: 'Manglik Percentage', value: percentage});
  }

  const afterCancellation = formatPercent(analysis.percentageAfterCancellation);
  if (afterCancellation) {
    facts.push({
      label: 'Percentage After Cancellation',
      value: afterCancellation,
    });
  }

  const hasSections =
    analysis.reportParagraphs.length > 0 ||
    analysis.basedOnAspect.length > 0 ||
    analysis.basedOnHouse.length > 0 ||
    analysis.cancelRules.length > 0;

  return (
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
      </View>

      {facts.length > 0 ? (
        <View
          style={[
            styles.facts,
            {backgroundColor: colors.background.secondary},
          ]}>
          {facts.map((fact, index) => (
            <View
              key={fact.label}
              style={[
                styles.fact,
                // Second row onwards gets a hairline above it, and the left
                // column a hairline to its right, so the grid stays readable
                // with any number of facts.
                index >= 2
                  ? {
                      borderTopWidth: StyleSheet.hairlineWidth,
                      borderTopColor: colors.divider,
                    }
                  : null,
                index % 2 === 0 && index < facts.length - 1
                  ? {
                      borderRightWidth: StyleSheet.hairlineWidth,
                      borderRightColor: colors.divider,
                    }
                  : null,
              ]}>
              <Text
                variant="captionSmall"
                weight="semibold"
                style={{color: colors.text.tertiary}}>
                {fact.label}
              </Text>
              <Text
                variant="body"
                weight="bold"
                style={{
                  color: fact.valueColor ?? colors.text.primary,
                  marginTop: 2,
                }}>
                {fact.value}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {hasSections ? (
        <View
          style={[
            styles.sections,
            {
              borderTopWidth: StyleSheet.hairlineWidth,
              borderTopColor: colors.divider,
            },
          ]}>
          {analysis.reportParagraphs.length > 0 ? (
            <DoshaReportSection
              title="Report"
              icon={{name: 'menu-book', library: 'MaterialIcons'}}
              items={analysis.reportParagraphs}
            />
          ) : null}

          {analysis.basedOnAspect.length > 0 ? (
            <DoshaReportSection
              title="Based on Aspects"
              icon={{name: 'visibility', library: 'MaterialIcons'}}
              items={analysis.basedOnAspect}
            />
          ) : null}

          {analysis.basedOnHouse.length > 0 ? (
            <DoshaReportSection
              title="Based on House"
              icon={{name: 'home', library: 'MaterialIcons'}}
              items={analysis.basedOnHouse}
            />
          ) : null}

          {analysis.cancelRules.length > 0 ? (
            <DoshaReportSection
              title="Cancellation Rules"
              icon={{name: 'fact-check', library: 'MaterialIcons'}}
              items={analysis.cancelRules}
            />
          ) : null}
        </View>
      ) : null}
    </Card>
  );
};

export default React.memo(ManglikMatchCard);

const styles = StyleSheet.create({
  card: {
    marginBottom: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  facts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 14,
    paddingVertical: 2,
  },
  fact: {
    flexGrow: 1,
    flexBasis: '45%',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  sections: {
    paddingTop: 14,
  },
});
