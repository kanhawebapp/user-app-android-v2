import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../../theme';
import {GoBack} from '../../../components';
import {
  useLiveInteractionHistory,
  type LiveInteractionHistoryItem,
} from '../../../services/api/liveInteractions';
import {
  EmptyState,
  ErrorState,
  HistoryCard,
  SummarySection,
} from './components';

interface LiveInteractionHistoryScreenProps {
  onNavigateBack?: () => void;
}

const LiveInteractionHistoryScreen: React.FC<
  LiveInteractionHistoryScreenProps
> = ({onNavigateBack}) => {
  const {colors, isDark} = useTheme();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const {data, summary, loading, loadingMore, error, hasMore, loadMore, refresh} =
    useLiveInteractionHistory({limit: 10});

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const handleEndReached = useCallback(() => {
    if (!loading && !loadingMore && hasMore && !error) {
      loadMore();
    }
  }, [loading, loadingMore, hasMore, error, loadMore]);

  const renderItem = useCallback(
    ({item}: {item: LiveInteractionHistoryItem}) => (
      <HistoryCard item={item} />
    ),
    [],
  );

  const keyExtractor = useCallback(
    (item: LiveInteractionHistoryItem, index: number) =>
      item.sessionId || `${item.liveStreamId}-${index}`,
    [],
  );

  const listHeader = <SummarySection summary={summary} />;

  const listFooter = () => {
    if (!loadingMore) {
      return null;
    }
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary.main} />
      </View>
    );
  };

  const listEmpty = () => {
    if (loading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      );
    }
    if (error && data.length === 0) {
      return <ErrorState message={error} onRetry={refresh} />;
    }
    return <EmptyState />;
  };

  return (
    <View
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <GoBack onBack={onNavigateBack} title="Live Interaction History" />

      <FlatList
        data={loading && data.length === 0 ? [] : data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
        ListFooterComponent={listFooter}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary.main}
            colors={[colors.primary.main]}
          />
        }
        contentContainerStyle={[
          styles.listContent,
          {paddingBottom: insets.bottom + 24},
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    paddingTop: 8,
  },
  loader: {
    marginTop: 48,
    alignItems: 'center',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default LiveInteractionHistoryScreen;
