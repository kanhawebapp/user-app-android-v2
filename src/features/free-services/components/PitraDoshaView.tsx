/**
 * Pitra Dosha detail screen: fetches POST /v1/pitra_dosha_report for the
 * stored birth details and renders the presence, explanation, causes,
 * conclusion, effects and remedies.
 */

import React, {useMemo} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Icon} from '../../../components/Icon';
import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';
import {usePitraDosha} from '../hooks/usePitraDosha';
import {buildBasicDetailsPayload} from '../utils/kundliService';
import {isPitraDoshaEmpty, presentText} from '../utils/doshaReport';
import DoshaReportSection from './DoshaReportSection';
import InfoCard from './InfoCard';
import ListStateView from './ListStateView';
import {InfoCardSkeleton, LifePredictionCardSkeleton} from './Skeletons';

export interface PitraDoshaViewProps {
  result: any;
  serviceTitle?: string;
  onBack: () => void;
}

const PitraDoshaView: React.FC<PitraDoshaViewProps> = ({
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

  const {data, loading, error, reload} = usePitraDosha(payload);

  const renderLoading = () => (
    <View>
      <InfoCardSkeleton rows={2} />
      <LifePredictionCardSkeleton />
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
          errorText="Failed to load the Pitra Dosha report."
          onRetry={reload}
        />
      );
    }

    if (isPitraDoshaEmpty(data)) {
      return (
        <ListStateView
          empty
          emptyText="No Pitra Dosha data is available for these birth details."
        />
      );
    }

    return (
      <View>
        <InfoCard
          title="Pitra Dosha"
          icon={{name: 'spa', library: 'MaterialIcons'}}
          items={[{label: 'Present', value: presentText(data?.present)}]}
        />

        {data?.whatIs ? (
          <DoshaReportSection
            title="What is Pitra Dosha?"
            icon={{name: 'info', library: 'MaterialIcons'}}
            items={[data.whatIs]}
          />
        ) : null}

        {data?.rulesMatched && data.rulesMatched.length > 0 ? (
          <DoshaReportSection
            title="Causes Matched"
            icon={{name: 'fact-check', library: 'MaterialIcons'}}
            items={data.rulesMatched}
          />
        ) : null}

        {data?.conclusion ? (
          <DoshaReportSection
            title="Conclusion"
            icon={{name: 'check-circle', library: 'MaterialIcons'}}
            items={[data.conclusion]}
          />
        ) : null}

        {data?.effects && data.effects.length > 0 ? (
          <DoshaReportSection
            title="Effects"
            icon={{name: 'visibility', library: 'MaterialIcons'}}
            items={data.effects}
          />
        ) : null}

        {data?.remedies && data.remedies.length > 0 ? (
          <DoshaReportSection
            title="Remedies"
            icon={{name: 'healing', library: 'MaterialIcons'}}
            items={data.remedies}
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
          {serviceTitle || 'Pitra Dosha'}
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

export default React.memo(PitraDoshaView);

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
