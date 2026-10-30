/**
 * Sade Sati detail screen: fetches current status, remedies and life details
 * in parallel for the stored birth details, then renders them in three tabs
 * (Current Status / Remedies / Life Details).
 */

import React, {useMemo} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Card} from '../../../components/Card';
import {Icon} from '../../../components/Icon';
import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';
import {useSadeSati} from '../hooks/useSadeSati';
import {buildBasicDetailsPayload} from '../utils/kundliService';
import {
  isSadeSatiLifeEmpty,
  isSadeSatiRemediesEmpty,
  isSadeSatiStatusEmpty,
  presentText,
  SADE_SATI_TABS,
  type SadeSatiTab,
} from '../utils/doshaReport';
import ChartTabs from './ChartTabs';
import DoshaReportSection from './DoshaReportSection';
import InfoCard from './InfoCard';
import ListStateView from './ListStateView';
import {InfoCardSkeleton, LifePredictionCardSkeleton} from './Skeletons';

export interface SadeSatiViewProps {
  result: any;
  serviceTitle?: string;
  onBack: () => void;
}

const SadeSatiView: React.FC<SadeSatiViewProps> = ({
  result,
  serviceTitle,
  onBack,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const payload = useMemo(
    () => buildBasicDetailsPayload(result?.payload),
    [result?.payload],
  );

  const {
    data,
    activeTab,
    setActiveTab,
    tabLoading,
    tabError,
    reloadTab,
  } = useSadeSati(payload);

  const renderLoading = () => (
    <View>
      <InfoCardSkeleton rows={5} />
      <LifePredictionCardSkeleton />
      <LifePredictionCardSkeleton />
    </View>
  );

  const renderStatusTab = () => {
    if (isSadeSatiStatusEmpty(data)) {
      return (
        <ListStateView
          empty
          emptyText="No Sade Sati status is available for these birth details."
        />
      );
    }

    const isActive = data?.present === true;

    return (
      <View>
        <View
          style={[
            styles.statusBanner,
            {
              backgroundColor: isActive
                ? colors.error.background
                : colors.success.background,
            },
          ]}>
          <Icon
            name={isActive ? 'warning' : 'check-circle'}
            size={20}
            color={isActive ? colors.error.main : colors.success.main}
            library="MaterialIcons"
          />
          <Text
            variant="bodySmall"
            weight="semibold"
            style={{
              color: isActive ? colors.error.main : colors.success.main,
              marginLeft: 8,
              flex: 1,
            }}>
            {data?.isUndergoing ||
              (isActive
                ? 'Currently undergoing Sadhesati.'
                : 'Not currently undergoing Sadhesati.')}
          </Text>
        </View>

        <InfoCard
          title="Sade Sati Status"
          icon={{name: 'tune', library: 'MaterialIcons'}}
          items={[
            {label: 'Present', value: presentText(data?.present)},
            {
              label: 'Sade Sati Status',
              value:
                data?.isUndergoing ||
                (data?.present === null || data?.present === undefined
                  ? null
                  : presentText(data?.present)),
            },
            {label: 'Phase', value: data?.currentPhase?.label || '—'},
            {label: 'Moon Sign', value: data?.moonSign},
            {label: 'Saturn Sign', value: data?.saturnSign},
            {
              label: 'Saturn Retrograde',
              value:
                data?.saturnRetrograde === null ||
                data?.saturnRetrograde === undefined
                  ? null
                  : presentText(data?.saturnRetrograde),
            },
            {label: 'Consideration Date', value: data?.considerationDate},
          ]}
        />

        {data?.whatIs ? (
          <DoshaReportSection
            title="What is Sade Sati?"
            icon={{name: 'info', library: 'MaterialIcons'}}
            items={[data.whatIs]}
          />
        ) : null}
      </View>
    );
  };

  const renderRemediesTab = () => {
    if (isSadeSatiRemediesEmpty(data)) {
      return (
        <ListStateView
          empty
          emptyText="No Sade Sati remedies are available for these birth details."
        />
      );
    }

    const explanation = data?.remediesWhatIs || data?.whatIs;

    return (
      <View>
        {explanation ? (
          <DoshaReportSection
            title="What is Sade Sati?"
            icon={{name: 'info', library: 'MaterialIcons'}}
            items={[explanation]}
          />
        ) : null}

        <DoshaReportSection
          title="Remedies"
          icon={{name: 'spa', library: 'MaterialIcons'}}
          items={data?.remedies || []}
          emptyText="No remedies are available."
        />
      </View>
    );
  };

  const renderLifeTab = () => {
    if (isSadeSatiLifeEmpty(data)) {
      return (
        <ListStateView
          empty
          emptyText="No Sade Sati life details are available for these birth details."
        />
      );
    }

    const phases = data?.phases || [];

    return (
      <View>
        <Text
          variant="body"
          weight="bold"
          style={{color: colors.text.primary, marginBottom: 12}}>
          Sade Sati Life Details
        </Text>
        {phases.map((phase, index) => {
          const isCurrent = data?.currentPhase?.key === phase.key;
          const isLast = index === phases.length - 1;

          return (
            <View key={phase.key} style={styles.timelineRow}>
              <View style={styles.timelineRail}>
                <View
                  style={[
                    styles.timelineDot,
                    {
                      backgroundColor: isCurrent
                        ? colors.primary.main
                        : colors.border.main,
                    },
                  ]}
                />
                {!isLast ? (
                  <View
                    style={[
                      styles.timelineLine,
                      {backgroundColor: colors.border.main},
                    ]}
                  />
                ) : null}
              </View>

              <Card
                variant="elevated"
                style={[styles.phaseCard, isLast && styles.phaseCardLast]}>
                <View style={styles.phaseHeader}>
                  <Text
                    variant="body"
                    weight="bold"
                    style={{color: colors.text.primary, flex: 1}}>
                    {phase.label}
                  </Text>
                  {isCurrent ? (
                    <View
                      style={[
                        styles.currentBadge,
                        {backgroundColor: colors.success.background},
                      ]}>
                      <Text
                        variant="captionSmall"
                        weight="semibold"
                        style={{color: colors.success.main}}>
                        Current
                      </Text>
                    </View>
                  ) : null}
                </View>

                {phase.date ? (
                  <Text
                    variant="captionSmall"
                    style={{color: colors.text.tertiary}}>
                    {phase.date}
                  </Text>
                ) : null}

                <View style={styles.phaseMeta}>
                  {phase.moonSign ? (
                    <Text
                      variant="captionSmall"
                      style={{color: colors.text.secondary, marginRight: 12}}>
                      Moon: {phase.moonSign}
                    </Text>
                  ) : null}
                  {phase.saturnSign ? (
                    <Text
                      variant="captionSmall"
                      style={{color: colors.text.secondary}}>
                      Saturn: {phase.saturnSign}
                    </Text>
                  ) : null}
                </View>

                {phase.isRetrograde !== null &&
                phase.isRetrograde !== undefined ? (
                  <Text
                    variant="captionSmall"
                    style={{color: colors.text.secondary, marginTop: 4}}>
                    Saturn Retrograde: {presentText(phase.isRetrograde)}
                  </Text>
                ) : null}

                {phase.summary ? (
                  <Text
                    variant="bodySmall"
                    lineHeight={22}
                    style={{color: colors.text.primary, marginTop: 8}}>
                    {phase.summary}
                  </Text>
                ) : null}
              </Card>
            </View>
          );
        })}
      </View>
    );
  };

  const renderTabContent = () => {
    if (tabLoading) {
      return renderLoading();
    }

    if (tabError) {
      return (
        <ListStateView
          error={tabError}
          errorText="Failed to load the Sade Sati report."
          onRetry={() => reloadTab(activeTab)}
        />
      );
    }

    if (activeTab === 'remedies') {
      return renderRemediesTab();
    }
    if (activeTab === 'life') {
      return renderLifeTab();
    }
    return renderStatusTab();
  };

  return (
    <SafeAreaView
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
        <Text
          variant="h6"
          weight="bold"
          style={{color: colors.text.primary, flex: 1}}>
          {serviceTitle || 'Sade Sati'}
        </Text>
      </View>

      <ChartTabs
        tabs={SADE_SATI_TABS}
        activeKey={activeTab}
        onChange={key => setActiveTab(key as SadeSatiTab)}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default React.memo(SadeSatiView);

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
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  timelineRail: {
    width: 18,
    alignItems: 'center',
    marginRight: 10,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 18,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
    marginBottom: 4,
  },
  phaseCard: {
    flex: 1,
    marginBottom: 12,
  },
  phaseCardLast: {
    marginBottom: 0,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  phaseMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  currentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
});
