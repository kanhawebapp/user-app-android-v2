/**
 * Sade Sati detail screen: fetches POST /v1/sadhesati_life_details and
 * POST /v1/sadhesati_current_status in parallel for the stored birth
 * details and renders the current status plus the lifecycle phase timeline.
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
import {isSadeSatiEmpty, presentText} from '../utils/doshaReport';
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

  const {data, loading, error, reload} = useSadeSati(payload);

  const renderLoading = () => (
    <View>
      <InfoCardSkeleton rows={5} />
      <LifePredictionCardSkeleton />
      <LifePredictionCardSkeleton />
    </View>
  );

  const renderPhases = () => {
    const phases = data?.phases || [];
    if (phases.length === 0) {
      return null;
    }

    return (
      <View>
        <Text
          variant="body"
          weight="bold"
          style={{color: colors.text.primary, marginBottom: 12}}>
          Sade Sati Phases
        </Text>
        {phases.map(phase => {
          const isCurrent = data?.currentPhase?.key === phase.key;
          return (
            <Card key={phase.key} variant="elevated" style={styles.phaseCard}>
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
              <Text
                variant="captionSmall"
                style={{color: colors.text.tertiary}}>
                {phase.date}
              </Text>
              {phase.summary ? (
                <Text
                  variant="bodySmall"
                  lineHeight={22}
                  style={{color: colors.text.primary, marginTop: 8}}>
                  {phase.summary}
                </Text>
              ) : null}
            </Card>
          );
        })}
      </View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return renderLoading();
    }

    if (error) {
      return (
        <ListStateView
          error={error}
          errorText="Failed to load the Sade Sati report."
          onRetry={reload}
        />
      );
    }

    if (isSadeSatiEmpty(data)) {
      return (
        <ListStateView
          empty
          emptyText="No Sade Sati data is available for these birth details."
        />
      );
    }

    return (
      <View>
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
            {label: 'Saturn Sign', value: data?.saturnSign},
            {label: 'Moon Sign', value: data?.moonSign},
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

        {renderPhases()}
      </View>
    );
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

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {renderContent()}
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
  phaseCard: {
    marginBottom: 12,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  currentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
});
