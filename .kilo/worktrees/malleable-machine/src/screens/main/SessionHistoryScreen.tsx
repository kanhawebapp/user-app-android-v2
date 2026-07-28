import React, {useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../theme';
import {useUserSessions} from '../../services/api/sessions/sessions.hooks';
import {
  Session,
  SessionStatus,
} from '../../services/api/sessions/sessions.types';

import {
  Header,
  StatsSection,
  TabFilter,
  DEFAULT_TABS,
  SessionCard,
  SessionDetailModal,
  EmptyState,
} from './SessionHistoryScreen/components';

const SessionHistoryScreen = ({onNavigateBack}: any) => {
  const {colors, isDark} = useTheme();
  const insets = useSafeAreaInsets();

  const {data, loading, applyStatusFilter, loadMore, refresh} =
    useUserSessions();

  const [activeTab, setActiveTab] = useState<SessionStatus | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleTabChange = (tab: SessionStatus | 'all') => {
    setActiveTab(tab);
    if (tab === 'all') {
      applyStatusFilter(null);
    } else {
      applyStatusFilter(tab);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const handleSessionPress = (session: Session) => {
    setSelectedSession(session);
    setShowDetailModal(true);
  };

  const getTotalStats = () => {
    if (!data || data.length === 0) {
      return {totalSessions: 0, totalMinutes: 0, totalSpent: 0};
    }
    return data.reduce(
      (acc, session) => ({
        totalSessions: acc.totalSessions + 1,
        totalMinutes: acc.totalMinutes + (session.durationMin || 0),
        totalSpent: acc.totalSpent + (session.totalCharge || 0),
      }),
      {totalSessions: 0, totalMinutes: 0, totalSpent: 0},
    );
  };

  const stats = getTotalStats();

  const renderItem = ({item}: {item: Session}) => (
    <SessionCard session={item} onPress={handleSessionPress} />
  );

  const renderFooter = () =>
    loading ? (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary.main} />
      </View>
    ) : null;

  return (
    <View
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <Header onNavigateBack={onNavigateBack} insetsTop={insets.top} />

      <StatsSection stats={stats} />

      <TabFilter
        tabs={DEFAULT_TABS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item: Session) => item.id}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={!loading ? <EmptyState /> : null}
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
          {paddingBottom: insets.bottom + 100},
        ]}
        showsVerticalScrollIndicator={false}
      />

      <SessionDetailModal
        visible={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        session={selectedSession}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingTop: 8,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default SessionHistoryScreen;
