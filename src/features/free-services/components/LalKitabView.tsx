import React, {useEffect, useMemo} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Card} from '../../../components/Card';
import {Icon} from '../../../components/Icon';
import {Text} from '../../../components/Text';
import {useToast} from '../../../context/ToastContext';
import {useTheme} from '../../../theme';
import {useLalKitab, type LalKitabData} from '../hooks/useLalKitab';
import {
  isLalKitabDebtsEmpty,
  isLalKitabHousesEmpty,
  isLalKitabHoroscopeEmpty,
  isLalKitabPlanetsEmpty,
  isLalKitabTab,
  LAL_KITAB_TABS,
  resolveLalKitabInput,
  type LalKitabDebtView,
  type LalKitabSignView,
} from '../utils/lalKitab';
import ChartTabs from './ChartTabs';
import InfoCard from './InfoCard';
import ListStateView from './ListStateView';
import SectionHeader from './SectionHeader';
import {LifePredictionCardSkeleton} from './Skeletons';

export interface LalKitabViewProps {
  /** Navigation result carrying the stored Kundli birth-details payload. */
  result: any;
  serviceTitle?: string;
  onBack: () => void;
}

/** Shown when a list field carries no planets. */
const NO_VALUE = 'None';

/** Renders a label/value list as a comma separated string for InfoCard. */
const joinValues = (values: string[]): string =>
  values.length > 0 ? values.join(', ') : NO_VALUE;

/** One zodiac sign: sign number, sign name and the planets placed in it. */
const SignCard: React.FC<{sign: LalKitabSignView}> = ({sign}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <Card variant="elevated" style={styles.card}>
      <View style={styles.cardHeader}>
        <View
          style={[styles.signBadge, {backgroundColor: colors.primary.light}]}>
          <Text
            variant="captionSmall"
            weight="bold"
            align="center"
            style={{color: colors.primary.main}}>
            {sign.signNumber}
          </Text>
        </View>
        <Text
          variant="body"
          weight="bold"
          style={{color: colors.text.primary, flex: 1, marginLeft: 10}}>
          {sign.signName}
        </Text>
      </View>

      {sign.isEmpty ? (
        <Text variant="bodySmall" style={{color: colors.text.tertiary}}>
          No planets
        </Text>
      ) : (
        sign.placements.map(placement => (
          <View key={placement.name} style={styles.placementRow}>
            <Text
              variant="bodySmall"
              weight="semibold"
              style={{color: colors.text.primary, flex: 1}}>
              {placement.short
                ? `${placement.name} (${placement.short})`
                : placement.name}
            </Text>
            {/* The degree is optional: it is only populated for signs that
                actually hold a planet. */}
            <Text
              variant="bodySmall"
              style={{color: colors.text.tertiary, marginLeft: 12}}>
              {placement.degree ?? '—'}
            </Text>
          </View>
        ))
      )}
    </Card>
  );
};

const MemoizedSignCard = React.memo(SignCard);

/** One debt: its name plus the indications and events paragraphs in full. */
const DebtCard: React.FC<{debt: LalKitabDebtView}> = ({debt}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const paragraphs = [
    {label: 'Indications', text: debt.indications},
    {label: 'Events', text: debt.events},
  ];

  return (
    <Card variant="elevated" style={styles.card}>
      <Text
        variant="body"
        weight="bold"
        style={{
          color: colors.text.primary,
          marginBottom: debt.isEmpty ? 0 : 10,
        }}>
        {debt.name}
      </Text>

      {debt.isEmpty ? (
        <Text variant="bodySmall" style={{color: colors.text.tertiary}}>
          No details available for this debt.
        </Text>
      ) : (
        paragraphs.map(paragraph =>
          paragraph.text ? (
            <View key={paragraph.label} style={styles.paragraphBlock}>
              <Text
                variant="captionSmall"
                weight="bold"
                style={{
                  color: colors.text.tertiary,
                  textTransform: 'uppercase',
                }}>
                {paragraph.label}
              </Text>
              <Text
                variant="bodySmall"
                lineHeight={22}
                style={{color: colors.text.secondary, marginTop: 4}}>
                {paragraph.text}
              </Text>
            </View>
          ) : null,
        )
      )}
    </Card>
  );
};

const MemoizedDebtCard = React.memo(DebtCard);

const LalKitabView: React.FC<LalKitabViewProps> = ({
  result,
  serviceTitle,
  onBack,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const {showError} = useToast();

  // Birth details come from the Kundli flow payload (date of birth, birth time
  // and the geocoded birth place). Nothing is requested while they are missing.
  const payload = useMemo(() => resolveLalKitabInput(result), [result]);

  const {
    activeTab,
    setActiveTab,
    data,
    loading,
    errors,
    missingDetails,
    reload,
  } = useLalKitab(payload);

  // One message for the whole screen: the failing tab also renders its own
  // inline error state with a Retry button.
  useEffect(() => {
    const firstError = errors[activeTab];
    if (firstError) {
      showError(
        firstError.message ||
          'Unable to load Lal Kitab details. Please try again.',
      );
    }
  }, [errors, activeTab, showError]);

  const renderSkeleton = (count: number) => (
    <View>
      {Array.from({length: count}).map((_, index) => (
        <LifePredictionCardSkeleton key={index} />
      ))}
    </View>
  );

  const renderTabBody = () => {
    const error = errors[activeTab];
    const tabData = data[activeTab];

    // A cached report stays on screen while a re-fetch is running.
    if (loading && !tabData) {
      return renderSkeleton(3);
    }

    if (error && !tabData) {
      return (
        <ListStateView
          error={error}
          errorText="Unable to load Lal Kitab details. Please try again."
          onRetry={reload}
        />
      );
    }

    if (!tabData) {
      return (
        <ListStateView
          empty
          emptyText="No Lal Kitab details are available for this report."
        />
      );
    }

    switch (activeTab) {
      case 'horoscope': {
        if (isLalKitabHoroscopeEmpty(tabData as LalKitabSignView[])) {
          return (
            <ListStateView
              empty
              emptyText="No Lal Kitab horoscope is available for this chart."
            />
          );
        }
        return (
          <View>
            <SectionHeader
              title="Horoscope"
              icon={{name: 'menu-book', library: 'MaterialIcons'}}
            />
            {(tabData as LalKitabSignView[]).map(sign => (
              <MemoizedSignCard key={sign.key} sign={sign} />
            ))}
          </View>
        );
      }

      case 'debts': {
        if (isLalKitabDebtsEmpty(tabData as LalKitabDebtView[])) {
          return (
            <ListStateView
              empty
              emptyText="No Lal Kitab debts are available for this chart."
            />
          );
        }
        return (
          <View>
            <SectionHeader
              title="Debts"
              icon={{name: 'warning', library: 'MaterialIcons'}}
            />
            {(tabData as LalKitabDebtView[]).map(debt => (
              <MemoizedDebtCard key={debt.key} debt={debt} />
            ))}
          </View>
        );
      }

      case 'houses': {
        const houses = tabData as LalKitabData['houses'];
        if (isLalKitabHousesEmpty(houses)) {
          return (
            <ListStateView
              empty
              emptyText="No Lal Kitab houses are available for this chart."
            />
          );
        }
        return (
          <View>
            <SectionHeader
              title="Houses"
              icon={{name: 'grid-view', library: 'MaterialIcons'}}
            />
            {houses!.map(house => (
              <InfoCard
                key={house.key}
                title={`House ${house.khanaNumber}`}
                icon={{name: 'home', library: 'MaterialIcons'}}
                items={[
                  {label: 'Khana', value: house.khanaNumber},
                  {label: 'Maalik', value: house.maalik ?? '—'},
                  {label: 'Pakka Ghar', value: house.pakkaGhar ?? '—'},
                  {label: 'Kismat', value: house.kismat ?? '—'},
                  {label: 'Soya', value: house.sleepingLabel},
                  {label: 'Exalted', value: joinValues(house.exalt)},
                  {label: 'Debilitated', value: joinValues(house.debilitated)},
                ]}
              />
            ))}
          </View>
        );
      }

      case 'planets':
      default: {
        const planets = tabData as LalKitabData['planets'];
        if (isLalKitabPlanetsEmpty(planets)) {
          return (
            <ListStateView
              empty
              emptyText="No Lal Kitab planet details are available for this chart."
            />
          );
        }
        return (
          <View>
            <SectionHeader
              title="Planets"
              icon={{name: 'language', library: 'MaterialIcons'}}
            />
            {planets!.map(planet => (
              <InfoCard
                key={planet.key}
                title={planet.planet}
                icon={{name: 'brightness-5', library: 'MaterialIcons'}}
                items={[
                  {label: 'Rashi', value: planet.rashi ?? '—'},
                  {label: 'Soya', value: planet.sleepingLabel},
                  {label: 'Position', value: planet.position ?? '—'},
                  {label: 'Nature', value: planet.nature ?? '—'},
                ]}
              />
            ))}
          </View>
        );
      }
    }
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
          {serviceTitle || 'Lal Kitab'}
        </Text>
      </View>

      <ChartTabs
        tabs={LAL_KITAB_TABS}
        activeKey={activeTab}
        onChange={key => {
          if (isLalKitabTab(key)) {
            setActiveTab(key);
          }
        }}
      />

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        testID="lal-kitab-content">
        {missingDetails ? (
          <ListStateView
            empty
            emptyText="Birth details are required to show your Lal Kitab report. Please complete the Kundli form."
          />
        ) : (
          renderTabBody()
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default React.memo(LalKitabView);

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
  card: {
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  signBadge: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  paragraphBlock: {
    marginTop: 10,
  },
});
