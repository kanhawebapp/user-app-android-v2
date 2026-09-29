import React, {useEffect, useMemo} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Card} from '../../../components/Card';
import {Icon} from '../../../components/Icon';
import {Text} from '../../../components/Text';
import {useToast} from '../../../context/ToastContext';
import {useTheme} from '../../../theme';
import {useNakshatraPrediction} from '../hooks/useNakshatraPrediction';
import {
  isNakshatraPredictionEmpty,
  isNakshatraPredictionTab,
  NAKSHATRA_PREDICTION_TABS,
  resolveNakshatraPredictionInput,
  type NakshatraPredictionSection,
  type NakshatraPredictionViewModel,
} from '../utils/nakshatraPrediction';
import ChartTabs from './ChartTabs';
import InfoCard from './InfoCard';
import ListStateView from './ListStateView';
import {InfoCardSkeleton, LifePredictionCardSkeleton} from './Skeletons';

export interface NakshatraPredictionViewProps {
  /** Navigation result carrying the stored Kundli birth-details payload. */
  result: any;
  serviceTitle?: string;
  onBack: () => void;
}

/** A single prediction card: heading with icon plus the prediction text. */
const SectionCard: React.FC<{section: NakshatraPredictionSection}> = ({
  section,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <Card variant="elevated" style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <View
          style={[
            styles.sectionIcon,
            {backgroundColor: colors.primary.light + '20'},
          ]}>
          <Icon
            name={section.icon.name}
            size={18}
            color={colors.primary.main}
            library={section.icon.library || 'MaterialIcons'}
          />
        </View>
        <Text
          variant="body"
          weight="bold"
          style={{color: colors.text.primary, flex: 1}}>
          {section.title}
        </Text>
      </View>

      <Text
        variant="bodySmall"
        lineHeight={22}
        style={{color: colors.text.secondary}}>
        {section.text || 'No prediction available for this section.'}
      </Text>
    </Card>
  );
};

const MemoizedSectionCard = React.memo(SectionCard);

/** Title + prediction date card shown at the top of the prediction list. */
const PredictionHeaderCard: React.FC<{
  viewModel: NakshatraPredictionViewModel;
}> = ({viewModel}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <Card variant="elevated" style={styles.headerCard}>
      <View style={styles.headerTitleRow}>
        <Icon
          name="stars"
          size={20}
          color={colors.primary.main}
          library="MaterialIcons"
        />
        <Text
          variant="body"
          weight="bold"
          style={{color: colors.text.primary, flex: 1, marginLeft: 8}}>
          {viewModel.title}
        </Text>
      </View>

      <View style={[styles.dateRow, {borderTopColor: colors.divider}]}>
        <Text
          variant="captionSmall"
          weight="bold"
          style={{color: colors.text.tertiary, textTransform: 'uppercase'}}>
          Prediction Date
        </Text>
        <Text
          variant="bodySmall"
          weight="semibold"
          align="right"
          style={{color: colors.text.primary, flex: 1, marginLeft: 12}}>
          {viewModel.date}
        </Text>
      </View>
    </Card>
  );
};

const NakshatraPredictionView: React.FC<NakshatraPredictionViewProps> = ({
  result,
  serviceTitle,
  onBack,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const {showError} = useToast();

  // Birth details come from the Kundli flow payload (date of birth, birth time
  // and the geocoded birth place). Nothing is requested while they are missing.
  const payload = useMemo(
    () => resolveNakshatraPredictionInput(result),
    [result],
  );

  const {
    activeTab,
    setActiveTab,
    data,
    loading,
    error,
    missingDetails,
    reload,
  } = useNakshatraPrediction(payload);

  // Surface API errors through the existing toast.
  useEffect(() => {
    if (error) {
      showError(error?.message || 'Failed to load the Nakshatra prediction.');
    }
  }, [error, showError]);

  const renderLoading = () => (
    <View>
      <InfoCardSkeleton rows={3} />
      <LifePredictionCardSkeleton />
      <LifePredictionCardSkeleton />
      <LifePredictionCardSkeleton />
    </View>
  );

  const renderContent = () => {
    if (missingDetails) {
      return (
        <ListStateView
          empty
          emptyText="Birth details are required to show your Nakshatra prediction. Please complete the Kundli form."
        />
      );
    }

    // A cached prediction stays on screen while a re-fetch is running.
    if (loading && !data) {
      return renderLoading();
    }

    if (error && !data) {
      return (
        <ListStateView
          error={error}
          errorText="Failed to load the Nakshatra prediction."
          onRetry={reload}
        />
      );
    }

    if (!data) {
      return (
        <ListStateView
          empty
          emptyText="No Nakshatra prediction is available for this day."
        />
      );
    }

    if (isNakshatraPredictionEmpty(data)) {
      return (
        <ListStateView
          empty
          emptyText="No Nakshatra prediction is available for this day."
        />
      );
    }

    return (
      <View>
        <PredictionHeaderCard viewModel={data} />

        <InfoCard
          title="Nakshatra Details"
          icon={{name: 'auto-awesome', library: 'MaterialIcons'}}
          items={[
            {label: 'Moon Sign', value: data.moonSign},
            {label: 'Nakshatra', value: data.nakshatra},
          ]}
        />

        {data.sections.map(section => (
          <MemoizedSectionCard key={section.key} section={section} />
        ))}
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
          {serviceTitle || 'Nakshatra Prediction'}
        </Text>
      </View>

      <ChartTabs
        tabs={NAKSHATRA_PREDICTION_TABS}
        activeKey={activeTab}
        onChange={key => {
          if (isNakshatraPredictionTab(key)) {
            setActiveTab(key);
          }
        }}
      />

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        testID="nakshatra-prediction-content">
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default React.memo(NakshatraPredictionView);

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
  body: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  headerCard: {
    marginBottom: 16,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  sectionCard: {
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
});
