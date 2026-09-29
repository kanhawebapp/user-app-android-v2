import React, {useMemo} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Card} from '../../../components/Card';
import {Icon} from '../../../components/Icon';
import {SkeletonLoader} from '../../../components/SkeletonLoader';
import {Text} from '../../../components/Text';
import {useAuthStore} from '../../../stores';
import {useTheme} from '../../../theme';
import {useMyDayToday} from '../hooks/useMyDayToday';
import {
  buildMyDayTodayViewModel,
  isMyDayTodayViewModelEmpty,
  resolveMyDayTodayInput,
} from '../utils/myDayToday';
import ListStateView from './ListStateView';
import {ParagraphBlockSkeleton} from './Skeletons';

export interface MyDayTodayViewProps {
  result: any;
  serviceTitle?: string;
  onBack: () => void;
}

const MyDayTodayView: React.FC<MyDayTodayViewProps> = ({
  result,
  serviceTitle,
  onBack,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const user = useAuthStore(state => state.user);

  const payload = useMemo(
    () => resolveMyDayTodayInput(result, user),
    [result, user],
  );

  const {data, loading, error, missingDetails, reload} = useMyDayToday(payload);

  const viewModel = useMemo(() => buildMyDayTodayViewModel(data), [data]);

  const renderBody = () => {
    if (missingDetails) {
      return (
        <ListStateView
          empty
          emptyText="Name and date of birth are required to show today's prediction. Please complete the Kundli form."
        />
      );
    }

    if (loading) {
      return (
        <Card variant="elevated" style={styles.card}>
          <SkeletonLoader width="55%" height={14} style={styles.titleBar} />
          <SkeletonLoader width="70%" height={12} style={styles.titleBar} />
          <ParagraphBlockSkeleton lines={5} />
          <View style={styles.luckyGrid}>
            <SkeletonLoader width="40%" height={16} />
            <SkeletonLoader width="40%" height={16} />
          </View>
        </Card>
      );
    }

    if (error) {
      return (
        <ListStateView
          error={error}
          errorText="Failed to load today's prediction."
          onRetry={reload}
        />
      );
    }

    if (isMyDayTodayViewModelEmpty(viewModel)) {
      return (
        <ListStateView
          empty
          emptyText="No prediction is available for today."
        />
      );
    }

    return (
      <Card variant="elevated" style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="wb-sunny" size={18} color={colors.primary.main} />
          <Text
            variant="body"
            weight="bold"
            style={{color: colors.text.primary, flex: 1, marginLeft: 8}}>
            {viewModel.title}
          </Text>
        </View>

        <Text
          variant="caption"
          style={{color: colors.text.tertiary, marginBottom: 12}}>
          {viewModel.dateLabel}
        </Text>

        {viewModel.prediction ? (
          <Text
            variant="bodySmall"
            lineHeight={22}
            style={{color: colors.text.primary}}>
            {viewModel.prediction}
          </Text>
        ) : null}

        {viewModel.items.length > 0 ? (
          <View style={styles.luckyGrid}>
            {viewModel.items.map(item => (
              <View key={item.label} style={styles.luckyItem}>
                <Text
                  variant="captionSmall"
                  weight="bold"
                  style={{color: colors.text.secondary, marginBottom: 4}}>
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
      </Card>
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
          {serviceTitle || 'My Day Today'}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        testID="my-day-today-content">
        {renderBody()}
      </ScrollView>
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
    marginBottom: 8,
  },
  titleBar: {
    marginBottom: 12,
  },
  luckyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  luckyItem: {
    flex: 1,
    minWidth: '40%',
  },
});

export default React.memo(MyDayTodayView);
