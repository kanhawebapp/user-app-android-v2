/**
 * Kaal Sarp Dosha detail screen: fetches POST /v1/kalsarpa_details for the
 * stored birth details. When the dosha is not present it shows the absence
 * state and hides the type / name / house / report details.
 */

import React, {useMemo} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Icon} from '../../../components/Icon';
import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';
import {useKalsarpa} from '../hooks/useKalsarpa';
import {buildBasicDetailsPayload} from '../utils/kundliService';
import {isKalsarpaEmpty, presentText} from '../utils/doshaReport';
import DoshaReportSection from './DoshaReportSection';
import InfoCard from './InfoCard';
import ListStateView from './ListStateView';
import {InfoCardSkeleton, LifePredictionCardSkeleton} from './Skeletons';

export interface KalsarpaDoshaViewProps {
  result: any;
  serviceTitle?: string;
  onBack: () => void;
}

const KalsarpaDoshaView: React.FC<KalsarpaDoshaViewProps> = ({
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

  const {data, loading, error, reload} = useKalsarpa(payload);

  const renderLoading = () => (
    <View>
      <InfoCardSkeleton rows={4} />
      <LifePredictionCardSkeleton />
      <LifePredictionCardSkeleton />
    </View>
  );

  const renderNotPresent = () => (
    <View>
      <InfoCard
        title="Kaal Sarp Status"
        icon={{name: 'swap-horiz', library: 'MaterialIcons'}}
        items={[{label: 'Present', value: presentText(data?.present)}]}
      />
      <ListStateView
        empty
        emptyText="Kaal Sarp Dosha is not present in this Kundli."
      />
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
          errorText="Failed to load the Kaal Sarp Dosha report."
          onRetry={reload}
        />
      );
    }

    if (data?.present === false) {
      return renderNotPresent();
    }

    if (isKalsarpaEmpty(data)) {
      return (
        <ListStateView
          empty
          emptyText="No Kaal Sarp Dosha data is available for these birth details."
        />
      );
    }

    const statusItems = [
      {label: 'Present', value: presentText(data?.present)},
      {label: 'Type', value: data?.type},
      {label: 'Name', value: data?.name},
      {label: 'House', value: data?.house},
    ];

    return (
      <View>
        <InfoCard
          title="Kaal Sarp Status"
          icon={{name: 'swap-horiz', library: 'MaterialIcons'}}
          items={statusItems}
        />

        {data?.oneLine ? (
          <DoshaReportSection
            title="Overview"
            icon={{name: 'info', library: 'MaterialIcons'}}
            items={[data.oneLine]}
          />
        ) : null}

        {data?.reportParagraphs && data.reportParagraphs.length > 0 ? (
          <DoshaReportSection
            title="Kaal Sarp Report"
            icon={{name: 'menu-book', library: 'MaterialIcons'}}
            items={data.reportParagraphs}
          />
        ) : null}
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
          {serviceTitle || 'Kaal Sarp Dosha'}
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

export default React.memo(KalsarpaDoshaView);

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
