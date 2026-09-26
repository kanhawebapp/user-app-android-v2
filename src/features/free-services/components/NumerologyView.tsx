import React, {useMemo} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Card} from '../../../components/Card';
import {Icon} from '../../../components/Icon';
import {SkeletonLoader} from '../../../components/SkeletonLoader';
import {Text} from '../../../components/Text';
import {useAuthStore} from '../../../stores';
import {useTheme} from '../../../theme';
import {useNumerologyData} from '../hooks/useNumerologyData';
import {resolveNumeroInput} from '../utils/kundliService';
import {
  buildNumerologySections,
  type NumerologySection,
} from '../utils/numerology';
import InfoCard from './InfoCard';
import ListStateView from './ListStateView';
import {ParagraphBlockSkeleton} from './Skeletons';

export interface NumerologyViewProps {
  result: any;
  serviceTitle?: string;
  onBack: () => void;
}

const NumerologyView: React.FC<NumerologyViewProps> = ({
  result,
  serviceTitle,
  onBack,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const user = useAuthStore(state => state.user);

  const payload = useMemo(
    () => resolveNumeroInput(result, user),
    [result, user],
  );

  const {
    prediction,
    table,
    report,
    favTime,
    placeVastu,
    fastsReport,
    favLord,
    favMantra,
    error,
    reload,
  } = useNumerologyData(payload);

  const sections = useMemo<NumerologySection[]>(
    () =>
      buildNumerologySections({
        prediction,
        table,
        report,
        favTime,
        placeVastu,
        fastsReport,
        favLord,
        favMantra,
      }),
    [
      prediction,
      table,
      report,
      favTime,
      placeVastu,
      fastsReport,
      favLord,
      favMantra,
    ],
  );

  const handleRetry = () => {
    if (payload) {
      reload();
    }
  };

  const renderPredictionCard = (section: NumerologySection) => {
    if (section.kind !== 'prediction') {
      return null;
    }

    let body: React.ReactNode;

    if (section.loading) {
      body = (
        <View style={styles.predictionSkeleton}>
          <ParagraphBlockSkeleton lines={4} />
          <View style={styles.luckyGrid}>
            <SkeletonLoader width="40%" height={16} />
            <SkeletonLoader width="40%" height={16} />
          </View>
        </View>
      );
    } else if (section.error) {
      body = (
        <ListStateView
          error={section.error}
          errorText="Failed to load the prediction."
          onRetry={handleRetry}
        />
      );
    } else if (section.description) {
      body = (
        <Text
          variant="bodySmall"
          lineHeight={22}
          style={{color: colors.text.primary}}>
          {section.description}
        </Text>
      );
    } else {
      body = (
        <Text
          variant="bodySmall"
          style={{color: colors.text.tertiary, textAlign: 'center'}}>
          No prediction available.
        </Text>
      );
    }

    return (
      <Card variant="elevated" style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon
            name={section.icon.name}
            size={18}
            color={colors.primary.main}
            library={section.icon.library || 'MaterialIcons'}
          />
          <Text
            variant="body"
            weight="bold"
            style={{color: colors.text.primary, flex: 1, marginLeft: 8}}>
            {section.title}
          </Text>
        </View>

        <View style={styles.cardBody}>
          {body}

          {!section.loading && !section.error && section.items.length > 0 ? (
            <View style={styles.luckyGrid}>
              {section.items.map(item => (
                <View key={item.label} style={styles.luckyItem}>
                  <Text
                    variant="captionSmall"
                    weight="bold"
                    style={{
                      color: colors.text.secondary,
                      marginBottom: 4,
                    }}>
                    {item.label}
                  </Text>
                  <Text
                    variant="bodySmall"
                    weight="semibold"
                    style={{color: colors.text.primary}}
                    numberOfLines={2}>
                    {String(item.value ?? '—')}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </Card>
    );
  };

  const renderReportCard = (section: NumerologySection) => {
    if (section.kind !== 'report') {
      return null;
    }

    let body: React.ReactNode;

    if (section.loading) {
      body = <ParagraphBlockSkeleton lines={4} />;
    } else if (section.error) {
      body = (
        <ListStateView
          error={section.error}
          errorText="Failed to load this report."
          onRetry={handleRetry}
        />
      );
    } else if (section.description) {
      body = (
        <Text
          variant="bodySmall"
          lineHeight={22}
          style={{color: colors.text.primary}}>
          {section.description}
        </Text>
      );
    } else {
      body = (
        <Text
          variant="bodySmall"
          style={{color: colors.text.tertiary, textAlign: 'center'}}>
          No information available.
        </Text>
      );
    }

    return (
      <Card variant="elevated" style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon
            name={section.icon.name}
            size={18}
            color={colors.primary.main}
            library={section.icon.library || 'MaterialIcons'}
          />
          <Text
            variant="body"
            weight="bold"
            style={{color: colors.text.primary, flex: 1, marginLeft: 8}}>
            {section.title}
          </Text>
        </View>

        <View style={styles.cardBody}>{body}</View>
      </Card>
    );
  };

  const renderSection = ({item}: {item: NumerologySection}) => {
    if (item.kind === 'prediction') {
      return renderPredictionCard(item);
    }
    if (item.kind === 'report') {
      return renderReportCard(item);
    }

    return (
      <InfoCard
        title={item.title}
        icon={item.icon}
        items={item.items}
        loading={item.loading}
        error={item.error}
        onRetry={handleRetry}
      />
    );
  };

  const renderContent = () => {
    if (!payload) {
      return (
        <ListStateView
          empty
          emptyText="Name and date of birth are required to generate the numerology report. Please complete the Kundli form."
        />
      );
    }

    if (error) {
      return (
        <ListStateView
          error={error}
          errorText="Failed to load the numerology report."
          onRetry={handleRetry}
        />
      );
    }

    if (sections.length === 0) {
      return (
        <ListStateView
          empty
          emptyText="No numerology data is available for these birth details."
        />
      );
    }

    return (
      <FlatList
        data={sections}
        keyExtractor={item => item.key}
        renderItem={renderSection}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        testID="numerology-list"
      />
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
          {serviceTitle || 'Numerology'}
        </Text>
      </View>

      <View style={styles.body}>{renderContent()}</View>
    </SafeAreaView>
  );
};

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
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardBody: {
    width: '100%',
  },
  predictionSkeleton: {
    marginBottom: 12,
  },
  luckyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  luckyItem: {
    flex: 1,
    minWidth: '40%',
  },
});

export default React.memo(NumerologyView);
