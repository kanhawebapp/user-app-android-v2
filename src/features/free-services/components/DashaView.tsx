/**
 * Char Dasha + Yogini Dasha report screen.
 *
 * Two logical sections/tabs (Char Dasha and Yogini Dasha), each showing its
 * major period sequence plus the currently running major/sub/sub-sub
 * breakdown. Follows the existing Kundli report pattern: ChartTabs header,
 * per-section loading/error/empty states, InfoCard rows and ListStateView.
 */

import React, {useEffect, useMemo} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Icon} from '../../../components/Icon';
import {Text} from '../../../components/Text';
import {useToast} from '../../../context/ToastContext';
import {useTheme} from '../../../theme';
import {useDasha} from '../hooks/useDasha';
import {
  DASHA_TABS,
  isDashaTab,
  resolveDashaInput,
  toDashaInfoItems,
  toNamedDashaInfoItems,
  type DashaCurrentView,
  type DashaPeriodView,
} from '../utils/dasha';
import ChartTabs from './ChartTabs';
import InfoCard from './InfoCard';
import ListStateView from './ListStateView';
import SectionHeader from './SectionHeader';
import {LifePredictionCardSkeleton} from './Skeletons';

export interface DashaViewProps {
  /** Navigation result carrying the stored Kundli birth-details payload. */
  result: any;
  serviceTitle?: string;
  onBack: () => void;
}

interface SectionState {
  title: string;
  icon: {
    name: string;
    library: 'MaterialIcons';
  };
  loading: boolean;
  error: any;
  data: DashaPeriodView[] | DashaCurrentView | null;
}

const DEFAULT_ERROR_TEXT = 'Unable to load Dasha details. Please try again.';

const DashaView: React.FC<DashaViewProps> = ({
  result,
  serviceTitle,
  onBack,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const {showError} = useToast();

  // Birth details come from the Kundli flow payload (date of birth, birth time
  // and the geocoded birth place). Nothing is requested while they are missing.
  const payload = useMemo(() => resolveDashaInput(result), [result]);

  const {
    activeTab,
    setActiveTab,
    majorChar,
    currentChar,
    majorYogini,
    currentYogini,
    missingDetails,
    reload,
  } = useDasha(payload);

  // One message for the whole screen: the failed section also renders its own
  // inline error state with a Retry button.
  const activeErrors =
    activeTab === 'char'
      ? majorChar.error || currentChar.error
      : majorYogini.error || currentYogini.error;

  useEffect(() => {
    if (activeErrors) {
      const message =
        (typeof activeErrors?.message === 'string' && activeErrors.message) ||
        DEFAULT_ERROR_TEXT;
      showError(message);
    }
  }, [activeErrors, showError]);

  const renderSkeleton = (count: number) => (
    <View>
      {Array.from({length: count}).map((_, index) => (
        <LifePredictionCardSkeleton key={index} />
      ))}
    </View>
  );

  const renderMajorSection = ({
    title,
    icon,
    loading: sectionLoading,
    error: sectionError,
    data,
  }: SectionState) => {
    if (sectionLoading && !data) {
      return renderSkeleton(3);
    }
    if (sectionError && !data) {
      return (
        <ListStateView
          error={sectionError}
          errorText={DEFAULT_ERROR_TEXT}
          onRetry={reload}
        />
      );
    }
    const periodList = data as DashaPeriodView[];
    if (!periodList?.length) {
      return (
        <ListStateView
          empty
          emptyText={
            activeTab === 'char'
              ? 'No Char Dasha details available.'
              : 'No Yogini Dasha details available.'
          }
        />
      );
    }
    return (
      <View>
        <SectionHeader title={title} icon={icon} />
        {periodList.map(period => (
          <InfoCard
            key={period.key}
            title={period.name}
            items={toDashaInfoItems(period)}
          />
        ))}
      </View>
    );
  };

  const renderCurrentSection = ({
    title,
    icon,
    loading: sectionLoading,
    error: sectionError,
    data,
    nameLabel,
    subSubTitle,
  }: SectionState & {nameLabel: string; subSubTitle: string}) => {
    const current = data as DashaCurrentView | null;

    if (sectionLoading && !current) {
      return renderSkeleton(3);
    }
    if (sectionError && !current) {
      return (
        <ListStateView
          error={sectionError}
          errorText={DEFAULT_ERROR_TEXT}
          onRetry={reload}
        />
      );
    }

    return (
      <View>
        <SectionHeader title={title} icon={icon} />
        {!current ||
        (!current.major && !current.sub && !current.subSub.length) ? (
          <ListStateView
            empty
            emptyText={
              activeTab === 'char'
                ? 'No Char Dasha details available.'
                : 'No Yogini Dasha details available.'
            }
          />
        ) : (
          <>
            {current.dashaDate ? (
              <InfoCard
                title="Dasha Date"
                items={[{label: 'Date', value: current.dashaDate}]}
              />
            ) : null}
            {current.major ? (
              <InfoCard
                title="Major Dasha"
                items={toNamedDashaInfoItems(current.major, nameLabel)}
              />
            ) : null}
            {current.sub ? (
              <InfoCard
                title="Sub Dasha"
                items={toNamedDashaInfoItems(current.sub, nameLabel)}
              />
            ) : null}
            {current.subSub.length ? (
              <>
                <SectionHeader title={subSubTitle} />
                {current.subSub.map(period => (
                  <InfoCard
                    key={period.key}
                    title={period.name}
                    items={toNamedDashaInfoItems(period, nameLabel)}
                  />
                ))}
              </>
            ) : (
              <ListStateView
                empty
                emptyText="No sub-sub dasha details available."
              />
            )}
          </>
        )}
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
          {serviceTitle || 'Char / Yogini Dasha'}
        </Text>
      </View>

      <ChartTabs
        tabs={DASHA_TABS}
        activeKey={activeTab}
        onChange={key => {
          if (isDashaTab(key)) {
            setActiveTab(key);
          }
        }}
      />

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        testID="dasha-content">
        {missingDetails ? (
          <ListStateView
            empty
            emptyText="Birth details are required to show your Dasha report. Please complete the Kundli form."
          />
        ) : activeTab === 'char' ? (
          <>
            {renderMajorSection({
              title: 'Major Char Dasha',
              icon: {name: 'timeline', library: 'MaterialIcons'},
              loading: majorChar.loading,
              error: majorChar.error,
              data: majorChar.data,
            })}
            {renderCurrentSection({
              title: 'Current Char Dasha',
              icon: {name: 'today', library: 'MaterialIcons'},
              loading: currentChar.loading,
              error: currentChar.error,
              data: currentChar.data,
              nameLabel: 'Sign',
              subSubTitle: 'Sub Sub Dasha',
            })}
          </>
        ) : (
          <>
            {renderMajorSection({
              title: 'Major Yogini Dasha',
              icon: {name: 'timeline', library: 'MaterialIcons'},
              loading: majorYogini.loading,
              error: majorYogini.error,
              data: majorYogini.data,
            })}
            {renderCurrentSection({
              title: 'Current Yogini Dasha',
              icon: {name: 'today', library: 'MaterialIcons'},
              loading: currentYogini.loading,
              error: currentYogini.error,
              data: currentYogini.data,
              nameLabel: 'Yogini',
              subSubTitle: 'Sub Sub Dasha',
            })}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default React.memo(DashaView);

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
});
