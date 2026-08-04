import React, {useMemo} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Card} from '../../../components/Card';
import {Icon} from '../../../components/Icon';
import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';
import {useGeneralLifePrediction} from '../hooks/useGeneralLifePrediction';
import {buildGeneralLifePredictionPayload} from '../utils/kundliService';
import {
  isGeneralLifePredictionEmpty,
  type LifePredictionSection,
} from '../utils/generalLifePrediction';
import ListStateView from './ListStateView';
import {LifePredictionCardSkeleton} from './Skeletons';

export interface GeneralLifePredictionViewProps {
  /** Navigation result carrying the stored Kundli payload (with gender). */
  result: any;
  serviceTitle?: string;
  onBack: () => void;
}

/**
 * A single report section card: heading plus every paragraph rendered as a
 * bullet point with comfortable line height and spacing.
 */
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
          style={{color: colors.text.primary, flex: 1}}>
          {section.title}
        </Text>
      </View>

      {section.paragraphs.length === 0 ? (
        <Text
          variant="bodySmall"
          style={{color: colors.text.tertiary, textAlign: 'center'}}>
          No {section.title.toLowerCase()} details available.
        </Text>
      ) : (
        <View style={styles.bullets}>
          {section.paragraphs.map((paragraph, index) => (
            <View key={index} style={styles.bulletRow}>
              <View
                style={[styles.bullet, {backgroundColor: colors.primary.main}]}
              />
              <Text
                variant="bodySmall"
                lineHeight={22}
                style={{color: colors.text.primary, flex: 1}}>
                {paragraph}
              </Text>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
};

const MemoizedSectionCard = React.memo(SectionCard);

const GeneralLifePredictionView: React.FC<GeneralLifePredictionViewProps> = ({
  result,
  serviceTitle,
  onBack,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const payload = useMemo(
    () => buildGeneralLifePredictionPayload(result?.payload),
    [result?.payload],
  );

  const {data, loading, error, reload} = useGeneralLifePrediction(payload);

  const renderLoading = () => (
    <View>
      {Array.from({length: 5}).map((_, index) => (
        <LifePredictionCardSkeleton key={index} />
      ))}
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
          errorText="Failed to load the life prediction report."
          onRetry={reload}
        />
      );
    }

    if (isGeneralLifePredictionEmpty(data)) {
      return (
        <ListStateView
          empty
          emptyText="No life prediction data is available for these birth details."
        />
      );
    }

    return (
      <FlatList
        data={data?.sections || []}
        keyExtractor={item => item.key}
        renderItem={({item}) => <MemoizedSectionCard section={item} />}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        testID="general-life-prediction-list"
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
          {serviceTitle || 'General Life Prediction'}
        </Text>
      </View>

      <View style={styles.body}>{renderContent()}</View>
    </SafeAreaView>
  );
};

export default React.memo(GeneralLifePredictionView);

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
