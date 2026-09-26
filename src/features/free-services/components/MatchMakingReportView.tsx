/**
 * Free Match Making - Kundli Milan report.
 *
 * Renders the five match_making_* responses as one scrollable report:
 * overview, conclusion, Manglik analysis, Ashtakoot score sheet, obstructions
 * and the astro details of both parties. Every value is taken from the API
 * responses — nothing is hardcoded.
 */

import React, {useMemo} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {Card} from '../../../components/Card';
import {Icon} from '../../../components/Icon';
import {Text} from '../../../components/Text';
import type {MatchMakingPayload} from '../../../services/api/astrologyApi/astrology.types';
import {useTheme} from '../../../theme';
import {presentText} from '../utils/doshaReport';
import {
  MATCH_MAKING_REPORT_TITLE,
  isAshtakootEmpty,
  isAstroDetailsEmpty,
  isManglikAnalysisEmpty,
  isMatchMakingReportEmpty,
  isMatchObstructionsEmpty,
  summarizeMatchPayload,
  type MatchMakingBundle,
  type MatchMakingSection,
  type MatchPartySummary,
} from '../utils/matchMaking';
import DoshaReportSection from './DoshaReportSection';
import KootaCard from './KootaCard';
import ManglikMatchCard from './ManglikMatchCard';
import MatchAstroDetailsCard from './MatchAstroDetailsCard';
import SectionHeader from './SectionHeader';
import {InfoCardSkeleton, LifePredictionCardSkeleton} from './Skeletons';

export interface MatchMakingReportViewProps {
  payload: MatchMakingPayload | null;
  bundle: MatchMakingBundle | null;
  loading: boolean;
  error: any;
  onRetry: () => void;
  onBack: () => void;
}

const PartySummaryCard: React.FC<{
  title: string;
  icon: string;
  party: MatchPartySummary;
}> = ({title, icon, party}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <Card variant="elevated" style={styles.card}>
      <View style={styles.partyHeader}>
        <View
          style={[styles.partyIcon, {backgroundColor: colors.primary.light}]}>
          <Icon
            name={icon}
            size={18}
            color={colors.primary.main}
            library="MaterialIcons"
          />
        </View>
        <Text variant="body" weight="bold" style={{color: colors.text.primary}}>
          {title}
        </Text>
      </View>

      <View style={styles.partyRow}>
        <Text variant="captionSmall" style={{color: colors.text.tertiary}}>
          Name
        </Text>
        <Text
          variant="bodySmall"
          weight="semibold"
          align="right"
          style={{color: colors.text.primary, flex: 1, marginLeft: 12}}>
          {party.name || '—'}
        </Text>
      </View>
      <View style={[styles.partyDivider, {backgroundColor: colors.divider}]} />
      <View style={styles.partyRow}>
        <Text variant="captionSmall" style={{color: colors.text.tertiary}}>
          Birth Date
        </Text>
        <Text
          variant="bodySmall"
          weight="semibold"
          align="right"
          style={{color: colors.text.primary, flex: 1, marginLeft: 12}}>
          {party.date || '—'}
        </Text>
      </View>
      <View style={[styles.partyDivider, {backgroundColor: colors.divider}]} />
      <View style={styles.partyRow}>
        <Text variant="captionSmall" style={{color: colors.text.tertiary}}>
          Birth Time
        </Text>
        <Text
          variant="bodySmall"
          weight="semibold"
          align="right"
          style={{color: colors.text.primary, flex: 1, marginLeft: 12}}>
          {party.time || '—'}
        </Text>
      </View>
      <View style={[styles.partyDivider, {backgroundColor: colors.divider}]} />
      <View style={styles.partyRow}>
        <Text variant="captionSmall" style={{color: colors.text.tertiary}}>
          Birth Place
        </Text>
        <Text
          variant="bodySmall"
          weight="semibold"
          align="right"
          style={{color: colors.text.primary, flex: 1, marginLeft: 12}}>
          {party.place || '—'}
        </Text>
      </View>
    </Card>
  );
};

const MatchMakingReportView: React.FC<MatchMakingReportViewProps> = ({
  payload,
  bundle,
  loading,
  error,
  onRetry,
  onBack,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  const parties = useMemo(() => {
    if (bundle?.parties) {
      return bundle.parties;
    }
    return summarizeMatchPayload(payload);
  }, [bundle?.parties, payload]);

  const renderSectionError = (
    section: MatchMakingSection,
    emptyText: string,
    isEmpty: boolean,
  ) => {
    if (bundle?.errors?.[section]) {
      return (
        <Card
          variant="elevated"
          style={[styles.card, {borderColor: colors.error.main}]}>
          <View style={styles.partyHeader}>
            <Icon
              name="error-outline"
              size={18}
              color={colors.error.main}
              library="MaterialIcons"
            />
            <Text
              variant="bodySmall"
              weight="semibold"
              style={{color: colors.error.main, flex: 1, marginLeft: 8}}>
              {bundle.errors[section]}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.retryButton, {backgroundColor: colors.primary.main}]}
            onPress={onRetry}
            activeOpacity={0.85}>
            <Text
              variant="bodySmall"
              weight="bold"
              style={{color: colors.primary.contrastText}}>
              Retry
            </Text>
          </TouchableOpacity>
        </Card>
      );
    }

    if (isEmpty) {
      return (
        <Card variant="elevated" style={styles.card}>
          <Text
            variant="bodySmall"
            style={{color: colors.text.tertiary, textAlign: 'center'}}>
            {emptyText}
          </Text>
        </Card>
      );
    }

    return null;
  };

  const renderLoading = () => (
    <View>
      <InfoCardSkeleton rows={4} />
      <LifePredictionCardSkeleton />
      <InfoCardSkeleton rows={4} />
    </View>
  );

  const renderError = () => (
    <View style={styles.stateView}>
      <Icon
        name="error-outline"
        size={32}
        color={colors.error.main}
        library="MaterialIcons"
      />
      <Text
        variant="bodySmall"
        style={{
          color: colors.text.secondary,
          marginTop: 10,
          textAlign: 'center',
        }}>
        {error?.message || 'Failed to load the match making report.'}
      </Text>
      <TouchableOpacity
        style={[styles.retryButton, {backgroundColor: colors.primary.main}]}
        onPress={onRetry}
        activeOpacity={0.85}>
        <Text
          variant="bodySmall"
          weight="bold"
          style={{color: colors.primary.contrastText}}>
          Retry
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderOverview = () => {
    const overview = bundle?.report.overview ?? [];
    const isEmpty = isMatchMakingReportEmpty(bundle?.report ?? null);
    const errorCard = renderSectionError(
      'report',
      'No match overview is available for these details.',
      isEmpty,
    );

    if (errorCard) {
      return errorCard;
    }

    return (
      <View style={styles.grid}>
        {overview.map(item => {
          const isPresent = item.isPresent === true;
          const isAbsent = item.isPresent === false;
          const badgeColor = isPresent
            ? colors.error.main
            : isAbsent
            ? colors.success.main
            : colors.text.tertiary;

          return (
            <View key={item.key} style={styles.gridItem}>
              <Card variant="elevated" style={styles.overviewCard}>
                <View style={styles.overviewHeader}>
                  <Text
                    variant="bodySmall"
                    weight="bold"
                    style={{color: colors.text.primary, flex: 1}}>
                    {item.label}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {backgroundColor: badgeColor + '20'},
                    ]}>
                    <Text
                      variant="captionSmall"
                      weight="bold"
                      style={{color: badgeColor}}>
                      {item.status}
                    </Text>
                  </View>
                </View>

                {item.details.length > 0 ? (
                  <View style={styles.overviewDetails}>
                    {item.details.map(detail => (
                      <Text
                        key={detail.label}
                        variant="captionSmall"
                        style={{color: colors.text.tertiary}}>
                        {detail.label}: {detail.value}
                      </Text>
                    ))}
                  </View>
                ) : null}
              </Card>
            </View>
          );
        })}
      </View>
    );
  };

  const renderConclusion = () => {
    const paragraphs = bundle?.report.conclusionParagraphs ?? [];
    if (paragraphs.length === 0) {
      return null;
    }

    return (
      <View>
        <SectionHeader
          title="Conclusion"
          icon={{name: 'task-alt', library: 'MaterialIcons'}}
        />
        <Card variant="elevated" style={styles.card}>
          {paragraphs.map((paragraph, index) => (
            <Text
              key={index}
              variant="bodySmall"
              lineHeight={22}
              selectable
              style={{
                color: colors.text.primary,
                marginBottom:
                  index < paragraphs.length - 1
                    ? styles.paragraphSpacing.marginBottom
                    : 0,
              }}>
              {paragraph}
            </Text>
          ))}
        </Card>
      </View>
    );
  };

  const renderManglik = () => {
    const manglik = bundle?.manglik;
    const isEmpty =
      isManglikAnalysisEmpty(manglik?.male ?? null) &&
      isManglikAnalysisEmpty(manglik?.female ?? null) &&
      !manglik?.conclusion;
    const errorCard = renderSectionError(
      'manglik',
      'No Manglik Dosha data is available for this match.',
      isEmpty,
    );

    if (errorCard) {
      return errorCard;
    }

    return (
      <View>
        <SectionHeader
          title="Manglik Dosha Analysis"
          icon={{name: 'favorite', library: 'MaterialIcons'}}
        />
        {manglik ? (
          <>
            <ManglikMatchCard title="Male's Analysis" analysis={manglik.male} />
            <ManglikMatchCard
              title="Female's Analysis"
              analysis={manglik.female}
            />

            {manglik.conclusionParagraphs.length > 0 ? (
              <View>
                <SectionHeader
                  title="Manglik Conclusion"
                  icon={{name: 'gavel', library: 'MaterialIcons'}}
                />
                <DoshaReportSection
                  title="Conclusion"
                  items={manglik.conclusionParagraphs}
                />
              </View>
            ) : null}
          </>
        ) : null}
      </View>
    );
  };

  const renderAshtakoot = () => {
    const ashtakoot = bundle?.ashtakoot;
    const isEmpty = isAshtakootEmpty(ashtakoot ?? null);
    const errorCard = renderSectionError(
      'ashtakoot',
      'No Ashtakoot points are available for this match.',
      isEmpty,
    );

    if (errorCard || !ashtakoot) {
      return errorCard;
    }

    const totalText =
      ashtakoot.receivedPoints !== null
        ? `${ashtakoot.receivedPoints} / ${ashtakoot.totalPoints ?? '—'}`
        : (ashtakoot.totalPoints ?? '—').toString();

    return (
      <View>
        <SectionHeader
          title="Ashtakoot Match Summary"
          icon={{name: 'stars', library: 'MaterialIcons'}}
        />

        <Card variant="elevated" style={styles.scoreCard}>
          <View style={styles.scoreRow}>
            <View style={styles.scoreItem}>
              <Text
                variant="captionSmall"
                weight="semibold"
                style={{color: colors.text.tertiary}}>
                Total Score
              </Text>
              <Text
                variant="h5"
                weight="bold"
                style={{color: colors.primary.main, marginTop: 4}}>
                {totalText}
              </Text>
            </View>
            <View
              style={[styles.scoreDivider, {backgroundColor: colors.divider}]}
            />
            <View style={styles.scoreItem}>
              <Text
                variant="captionSmall"
                weight="semibold"
                style={{color: colors.text.tertiary}}>
                Minimum Required
              </Text>
              <Text
                variant="h5"
                weight="bold"
                style={{color: colors.text.primary, marginTop: 4}}>
                {ashtakoot.minimumRequired ?? '—'}
              </Text>
            </View>
          </View>
        </Card>

        {ashtakoot.kootas.map(koota => (
          <KootaCard key={koota.key} koota={koota} />
        ))}

        {ashtakoot.conclusionParagraphs.length > 0 ? (
          <Card variant="elevated" style={styles.card}>
            <View style={styles.partyHeader}>
              <Icon
                name="gavel"
                size={18}
                color={colors.primary.main}
                library="MaterialIcons"
              />
              <Text
                variant="body"
                weight="bold"
                style={{color: colors.text.primary, flex: 1, marginLeft: 8}}>
                Conclusion
              </Text>
            </View>
            {ashtakoot.conclusionParagraphs.map((paragraph, index) => (
              <Text
                key={index}
                variant="bodySmall"
                lineHeight={22}
                selectable
                style={{
                  color: colors.text.primary,
                  marginBottom:
                    index < ashtakoot.conclusionParagraphs.length - 1
                      ? styles.paragraphSpacing.marginBottom
                      : 0,
                }}>
                {paragraph}
              </Text>
            ))}
          </Card>
        ) : null}
      </View>
    );
  };

  const renderObstructions = () => {
    const obstructions = bundle?.obstructions;
    const isEmpty = isMatchObstructionsEmpty(obstructions ?? null);
    const errorCard = renderSectionError(
      'obstructions',
      'No obstruction data is available for this match.',
      isEmpty,
    );

    if (errorCard || !obstructions) {
      return errorCard;
    }

    const isPresent = obstructions.isPresent === true;
    const statusColor = isPresent
      ? colors.error.main
      : obstructions.isPresent === false
      ? colors.success.main
      : colors.text.tertiary;

    return (
      <View>
        <SectionHeader
          title="Obstructions in Match Making"
          icon={{name: 'block', library: 'MaterialIcons'}}
        />
        <Card variant="elevated" style={styles.card}>
          <View style={styles.partyRow}>
            <Text variant="bodySmall" style={{color: colors.text.secondary}}>
              Is Vedha Present?
            </Text>
            <View
              style={[
                styles.statusBadge,
                {backgroundColor: statusColor + '20'},
              ]}>
              <Text
                variant="captionSmall"
                weight="bold"
                style={{color: statusColor}}>
                {presentText(obstructions.isPresent)}
              </Text>
            </View>
          </View>

          {obstructions.vedhaName ? (
            <>
              <View
                style={[styles.partyDivider, {backgroundColor: colors.divider}]}
              />
              <View style={styles.partyRow}>
                <Text
                  variant="bodySmall"
                  style={{color: colors.text.secondary}}>
                  Vedha Name
                </Text>
                <Text
                  variant="bodySmall"
                  weight="semibold"
                  align="right"
                  style={{color: colors.text.primary, flex: 1, marginLeft: 12}}>
                  {obstructions.vedhaName}
                </Text>
              </View>
            </>
          ) : null}
        </Card>

        <DoshaReportSection
          title="Vedha Report"
          icon={{name: 'menu-book', library: 'MaterialIcons'}}
          items={obstructions.reportParagraphs}
          emptyText="No vedha report is available."
        />
      </View>
    );
  };

  const renderAstroDetails = () => {
    const astro = bundle?.astroDetails;
    const isEmpty = isAstroDetailsEmpty(astro ?? null);
    const errorCard = renderSectionError(
      'astroDetails',
      'No matching astrological birth details are available.',
      isEmpty,
    );

    if (errorCard || !astro) {
      return errorCard;
    }

    return (
      <View>
        <SectionHeader
          title="Matching Astrological Birth Details"
          icon={{name: 'auto-awesome', library: 'MaterialIcons'}}
        />
        <MatchAstroDetailsCard
          title="Male's Astrological Details"
          items={astro.male}
        />
        <MatchAstroDetailsCard
          title="Female's Astrological Details"
          items={astro.female}
        />
      </View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return renderLoading();
    }

    if (error) {
      return renderError();
    }

    if (!bundle || !bundle.hasAnyData) {
      return (
        <View style={styles.stateView}>
          <Icon
            name="inbox"
            size={32}
            color={colors.text.tertiary}
            library="MaterialIcons"
          />
          <Text
            variant="bodySmall"
            style={{
              color: colors.text.secondary,
              marginTop: 10,
              textAlign: 'center',
            }}>
            No match making data is available for these birth details.
          </Text>
        </View>
      );
    }

    return (
      <View>
        <PartySummaryCard title="Male" icon="person" party={parties.male} />
        <PartySummaryCard
          title="Female"
          icon="person-outline"
          party={parties.female}
        />

        <SectionHeader
          title="Match Overview"
          icon={{name: 'dashboard', library: 'MaterialIcons'}}
        />
        {renderOverview()}

        {renderConclusion()}
        {renderManglik()}
        {renderAshtakoot()}
        {renderObstructions()}
        {renderAstroDetails()}
      </View>
    );
  };

  return (
    <View
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon
            name="arrow-back"
            size={22}
            color={colors.text.primary}
            library="MaterialIcons"
          />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text variant="h6" weight="bold" style={{color: colors.text.primary}}>
            {MATCH_MAKING_REPORT_TITLE}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          {paddingBottom: insets.bottom + 32},
        ]}
        showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>
    </View>
  );
};

export default React.memo(MatchMakingReportView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitleWrap: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 14,
  },
  partyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  partyIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  partyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 7,
  },
  partyDivider: {
    height: StyleSheet.hairlineWidth,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: 4,
  },
  overviewCard: {
    marginBottom: 12,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overviewDetails: {
    marginTop: 6,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreCard: {
    marginBottom: 12,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreItem: {
    flex: 1,
    alignItems: 'center',
  },
  scoreDivider: {
    width: StyleSheet.hairlineWidth,
    height: 40,
  },
  paragraphSpacing: {
    marginBottom: 10,
  },
  retryButton: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    alignSelf: 'center',
  },
  stateView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
});
