import React, {useEffect, useMemo} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Card} from '../../../components/Card';
import {Icon} from '../../../components/Icon';
import {Text} from '../../../components/Text';
import {useToast} from '../../../context/ToastContext';
import {useTheme} from '../../../theme';
import {useAscendantReport} from '../hooks/useAscendantReport';
import {
  ASCENDANT_SECTION_TITLE,
  ASCENDANT_REPORT_TITLE,
  NAKSHATRA_REPORT_TITLE,
  hasAscendantContent,
  isAscendantReportEmpty,
  resolveAscendantReportInput,
} from '../utils/ascendantReport';
import type {LifePredictionSection} from '../utils/generalLifePrediction';
import ListStateView from './ListStateView';
import SectionHeader from './SectionHeader';
import {LifePredictionCardSkeleton} from './Skeletons';

export interface AscendantReportViewProps {
  /** Navigation result carrying the stored Kundli birth-details payload. */
  result: any;
  serviceTitle?: string;
  onBack: () => void;
}

/** The rising sign card: the sign on top, the API description below it. */
const AscendantCard: React.FC<{
  ascendant: string | null;
  report: string | null;
}> = ({ascendant, report}) => {
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
            name="trending-up"
            size={18}
            color={colors.primary.main}
            library="MaterialIcons"
          />
        </View>
        <Text
          variant="body"
          weight="bold"
          style={[styles.flex, {color: colors.text.primary}]}>
          {ASCENDANT_SECTION_TITLE}
        </Text>
      </View>

      {ascendant ? (
        <View
          style={[
            styles.signBox,
            {
              backgroundColor: colors.primary.light + '20',
              borderColor: colors.primary.main + '33',
            },
          ]}>
          <Text
            variant="h5"
            weight="bold"
            align="center"
            style={{color: colors.primary.main}}>
            {ascendant}
          </Text>
        </View>
      ) : null}

      {report ? (
        <Text
          variant="bodySmall"
          lineHeight={22}
          style={[styles.description, {color: colors.text.secondary}]}>
          {report}
        </Text>
      ) : null}
    </Card>
  );
};

const MemoizedAscendantCard = React.memo(AscendantCard);

/** One Nakshatra section card: heading plus each paragraph as a bullet. */
const SectionCard: React.FC<{section: LifePredictionSection}> = ({section}) => {
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
          style={[styles.flex, {color: colors.text.primary}]}>
          {section.title}
        </Text>
      </View>

      <View style={styles.bullets}>
        {section.paragraphs.map((paragraph, index) => (
          <View key={index} style={styles.bulletRow}>
            <View
              style={[styles.bullet, {backgroundColor: colors.primary.main}]}
            />
            <Text
              variant="bodySmall"
              lineHeight={22}
              style={[styles.flex, {color: colors.text.primary}]}>
              {paragraph}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
};

const MemoizedSectionCard = React.memo(SectionCard);

const AscendantReportView: React.FC<AscendantReportViewProps> = ({
  result,
  serviceTitle,
  onBack,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const {showError} = useToast();

  // Birth details come from the Kundli flow payload (date of birth, birth time
  // and the geocoded birth place). Nothing is requested while they are missing.
  const payload = useMemo(() => resolveAscendantReportInput(result), [result]);

  const {
    data,
    loading,
    error,
    ascendantError,
    nakshatraError,
    missingDetails,
    reload,
  } = useAscendantReport(payload);

  // Surface API errors through the existing toast.
  useEffect(() => {
    if (error) {
      showError(error?.message || 'Failed to load the Ascendant Report.');
    }
  }, [error, showError]);

  const renderLoading = () => (
    <View>
      <LifePredictionCardSkeleton />
      <LifePredictionCardSkeleton />
      <LifePredictionCardSkeleton />
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
          emptyText="Birth details are required to show your Ascendant Report. Please complete the Kundli form."
        />
      );
    }

    // A report already on screen stays visible while a re-fetch is running.
    if (loading && !data) {
      return renderLoading();
    }

    // Both requests failing produces an empty view model, so the error state is
    // what has to be preferred over the "nothing to show" message.
    if (error && isAscendantReportEmpty(data)) {
      return (
        <ListStateView
          error={error}
          errorText="Failed to load the Ascendant Report."
          onRetry={reload}
        />
      );
    }

    if (isAscendantReportEmpty(data)) {
      return (
        <ListStateView
          empty
          emptyText="No Ascendant Report is available for these birth details."
        />
      );
    }

    const showAscendant = hasAscendantContent(data!.ascendant);
    const showNakshatra = data!.sections.length > 0;

    return (
      <View>
        {showAscendant ? (
          <MemoizedAscendantCard
            ascendant={data!.ascendant.ascendant}
            report={data!.ascendant.report}
          />
        ) : null}

        {/* One half can still render when the other request failed. */}
        {ascendantError ? (
          <ListStateView error={ascendantError} onRetry={reload} />
        ) : null}

        {showNakshatra || nakshatraError ? (
          <>
            <SectionHeader
              title={NAKSHATRA_REPORT_TITLE}
              icon={{name: 'stars', library: 'MaterialIcons'}}
            />
            {data!.sections.map(section => (
              <MemoizedSectionCard key={section.key} section={section} />
            ))}
            {nakshatraError ? (
              <ListStateView error={nakshatraError} onRetry={reload} />
            ) : null}
          </>
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
          style={[styles.flex, {color: colors.text.primary}]}>
          {serviceTitle || ASCENDANT_REPORT_TITLE}
        </Text>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        testID="ascendant-report-content">
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default React.memo(AscendantReportView);

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
  signBox: {
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  description: {
    marginTop: 2,
  },
  flex: {
    flex: 1,
  },
  bullets: {
    width: '100%',
  },
  bulletRow: {
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
