/**
 * Manglik Dosha detail screen: fetches POST /v1/manglik for the stored
 * birth details and renders the present/effective status, percentages,
 * the report, and the aspect / house / cancellation rules.
 */

import React, {useMemo} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Icon} from '../../../components/Icon';
import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';
import {useManglik} from '../hooks/useManglik';
import {buildBasicDetailsPayload} from '../utils/kundliService';
import {formatPercent, isManglikEmpty, presentText} from '../utils/doshaReport';
import DoshaReportSection from './DoshaReportSection';
import InfoCard from './InfoCard';
import ListStateView from './ListStateView';
import {InfoCardSkeleton, LifePredictionCardSkeleton} from './Skeletons';

export interface ManglikDoshaViewProps {
  result: any;
  serviceTitle?: string;
  onBack: () => void;
}

const ManglikDoshaView: React.FC<ManglikDoshaViewProps> = ({
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

  const {data, loading, error, reload} = useManglik(payload);

  const renderLoading = () => (
    <View>
      <InfoCardSkeleton rows={5} />
      <LifePredictionCardSkeleton />
      <LifePredictionCardSkeleton />
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return renderLoading();
    }

    if (error) {
      return (
        <ListStateView
          error={error}
          errorText="Failed to load the Manglik Dosha report."
          onRetry={reload}
        />
      );
    }

    if (isManglikEmpty(data)) {
      return (
        <ListStateView
          empty
          emptyText="No Manglik Dosha data is available for these birth details."
        />
      );
    }

    return (
      <View>
        <InfoCard
          title="Manglik Status"
          icon={{name: 'warning', library: 'MaterialIcons'}}
          items={[
            {label: 'Present', value: presentText(data?.present)},
            {label: 'Status', value: data?.status},
            {
              label: 'Manglik Percentage',
              value: formatPercent(data?.percentage),
            },
            {
              label: 'After Cancellation',
              value: formatPercent(data?.percentageAfterCancellation),
            },
            {
              label: 'Mars Cancelled',
              value:
                data?.isMarsCancelled === null ||
                data?.isMarsCancelled === undefined
                  ? null
                  : presentText(data?.isMarsCancelled),
            },
          ]}
        />

        <DoshaReportSection
          title="Manglik Report"
          icon={{name: 'menu-book', library: 'MaterialIcons'}}
          items={data?.reportParagraphs || []}
        />

        <DoshaReportSection
          title="Manglik in House"
          icon={{name: 'home', library: 'MaterialIcons'}}
          items={data?.basedOnHouse || []}
        />

        <DoshaReportSection
          title="Based on Aspect"
          icon={{name: 'visibility', library: 'MaterialIcons'}}
          items={data?.basedOnAspect || []}
        />

        <DoshaReportSection
          title="Cancellation Rules"
          icon={{name: 'fact-check', library: 'MaterialIcons'}}
          items={data?.cancelRules || []}
        />
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
          {serviceTitle || 'Manglik Dosha'}
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

export default React.memo(ManglikDoshaView);

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
});
