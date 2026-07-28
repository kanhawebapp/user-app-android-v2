// import React, { useState, useCallback } from 'react';
// import {
//   View,
//   StyleSheet,
//   FlatList,
//   StatusBar,
//   ActivityIndicator,
//   RefreshControl,
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useTheme } from '../../theme';
// import { useUserSessions } from '../../services/api/sessions/sessions.hooks';
// import {
//   Session,
//   SessionStatus,
// } from '../../services/api/sessions/sessions.types';

// import {
//   Header,
//   StatsSection,
//   TabFilter,
//   DEFAULT_TABS,
//   SessionCard,
//   SessionDetailModal,
//   EmptyState,
// } from './SessionHistoryScreen/components';
// import ChatHistoryScreen from './ChatHistoryScreen/ChatHistoryScreen';

// const SessionHistoryScreen = ({ onNavigateBack }: any) => {
//   const { colors, isDark } = useTheme();
//   const insets = useSafeAreaInsets();

//   const { data, loading, applyStatusFilter, loadMore, refresh } =
//     useUserSessions();

//   const [activeTab, setActiveTab] = useState<SessionStatus | 'all'>('all');
//   const [refreshing, setRefreshing] = useState(false);
//   const [selectedSession, setSelectedSession] = useState<Session | null>(null);
//   const [showDetailModal, setShowDetailModal] = useState(false);

//   const handleTabChange = (tab: SessionStatus | 'all') => {
//     setActiveTab(tab);
//     if (tab === 'all') {
//       applyStatusFilter(null);
//     } else {
//       applyStatusFilter(tab);
//     }
//   };

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await refresh();
//     setRefreshing(false);
//   }, [refresh]);

//   const handleSessionPress = (session: Session) => {
//     setSelectedSession(session);
//     setShowDetailModal(true);
//   };

//   const getTotalStats = () => {
//     if (!data || data.length === 0) {
//       return { totalSessions: 0, totalMinutes: 0, totalSpent: 0 };
//     }
//     return data.reduce(
//       (acc, session) => ({
//         totalSessions: acc.totalSessions + 1,
//         totalMinutes: acc.totalMinutes + (session.durationMin || 0),
//         totalSpent: acc.totalSpent + (session.totalCharge || 0),
//       }),
//       { totalSessions: 0, totalMinutes: 0, totalSpent: 0 },
//     );
//   };

//   const stats = getTotalStats();

//   const renderItem = ({ item }: { item: Session }) => (
//     <SessionCard session={item} onPress={handleSessionPress} />
//   );

//   const renderFooter = () =>
//     loading ? (
//       <View style={styles.footerLoader}>
//         <ActivityIndicator size="small" color={colors.primary.main} />
//       </View>
//     ) : null;

//   return (
//     <View
//       style={[styles.container, { backgroundColor: colors.background.primary }]}>
//       <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

//       <Header onNavigateBack={onNavigateBack} insetsTop={insets.top} />

//       <StatsSection stats={stats} />

//       <TabFilter
//         tabs={DEFAULT_TABS}
//         activeTab={activeTab}
//         onTabChange={handleTabChange}
//       />

//       <FlatList
//         data={data}
//         renderItem={renderItem}
//         keyExtractor={(item: Session) => item.id}
//         onEndReached={loadMore}
//         onEndReachedThreshold={0.5}
//         ListFooterComponent={renderFooter}
//         ListEmptyComponent={!loading ? <EmptyState /> : null}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             tintColor={colors.primary.main}
//             colors={[colors.primary.main]}
//           />
//         }
//         contentContainerStyle={[
//           styles.listContent,
//           { paddingBottom: insets.bottom + 100 },
//         ]}
//         showsVerticalScrollIndicator={false}
//       />

//       <SessionDetailModal
//         visible={showDetailModal}
//         onClose={() => setShowDetailModal(false)}
//         session={selectedSession}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   listContent: {
//     paddingTop: 8,
//   },
//   footerLoader: {
//     paddingVertical: 20,
//     alignItems: 'center',
//   },
// });

// export default SessionHistoryScreen;

// // import React, { useState, useCallback } from 'react';
// // import {
// //   View,
// //   StyleSheet,
// //   FlatList,
// //   StatusBar,
// //   ActivityIndicator,
// //   RefreshControl,
// //   TouchableOpacity,
// //   Text,
// // } from 'react-native';
// // import { useSafeAreaInsets } from 'react-native-safe-area-context';

// // import { useTheme } from '../../theme';
// // import { useUserSessions } from '../../services/api/sessions/sessions.hooks';

// // import {
// //   Session,
// //   SessionStatus,
// // } from '../../services/api/sessions/sessions.types';

// // import {
// //   Header,
// //   StatsSection,
// //   TabFilter,
// //   DEFAULT_TABS,
// //   SessionCard,
// //   SessionDetailModal,
// //   EmptyState,
// // } from './SessionHistoryScreen/components';

// // import ChatHistoryScreen from './ChatHistoryScreen/ChatHistoryScreen';

// // const SessionHistoryScreen = ({ onNavigateBack }: any) => {
// //   const { colors, isDark } = useTheme();
// //   const insets = useSafeAreaInsets();

// //   // MAIN TABS
// //   const [historyType, setHistoryType] = useState<'call' | 'chat'>('call');

// //   const { data, loading, applyStatusFilter, loadMore, refresh } =
// //     useUserSessions();

// //   const [activeTab, setActiveTab] = useState<SessionStatus | 'all'>('all');
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [selectedSession, setSelectedSession] = useState<Session | null>(null);
// //   const [showDetailModal, setShowDetailModal] = useState(false);

// //   const handleTabChange = (tab: SessionStatus | 'all') => {
// //     setActiveTab(tab);

// //     if (tab === 'all') {
// //       applyStatusFilter(null);
// //     } else {
// //       applyStatusFilter(tab);
// //     }
// //   };

// //   const onRefresh = useCallback(async () => {
// //     setRefreshing(true);
// //     await refresh();
// //     setRefreshing(false);
// //   }, [refresh]);

// //   const handleSessionPress = (session: Session) => {
// //     setSelectedSession(session);
// //     setShowDetailModal(true);
// //   };

// //   const getTotalStats = () => {
// //     if (!data || data.length === 0) {
// //       return { totalSessions: 0, totalMinutes: 0, totalSpent: 0 };
// //     }

// //     return data.reduce(
// //       (acc, session) => ({
// //         totalSessions: acc.totalSessions + 1,
// //         totalMinutes: acc.totalMinutes + (session.durationMin || 0),
// //         totalSpent: acc.totalSpent + (session.totalCharge || 0),
// //       }),
// //       {
// //         totalSessions: 0,
// //         totalMinutes: 0,
// //         totalSpent: 0,
// //       },
// //     );
// //   };

// //   const stats = getTotalStats();

// //   const renderItem = ({ item }: { item: Session }) => (
// //     <SessionCard session={item} onPress={handleSessionPress} />
// //   );

// //   const renderFooter = () =>
// //     loading ? (
// //       <View style={styles.footerLoader}>
// //         <ActivityIndicator size="small" color={colors.primary.main} />
// //       </View>
// //     ) : null;

// //   return (
// //     <View
// //       style={[styles.container, { backgroundColor: colors.background.primary }]}>
// //       <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

// //       <Header onNavigateBack={onNavigateBack} insetsTop={insets.top} />

// //       {/* TOP HISTORY TABS */}
// //       <View
// //         style={[
// //           styles.topTabsContainer,
// //           { backgroundColor: colors.background.secondary },
// //         ]}>
// //         <TouchableOpacity
// //           activeOpacity={0.8}
// //           onPress={() => setHistoryType('call')}
// //           style={[
// //             styles.topTab,
// //             historyType === 'call' && {
// //               backgroundColor: colors.primary.main,
// //             },
// //           ]}>
// //           <Text
// //             style={[
// //               styles.topTabText,
// //               {
// //                 color:
// //                   historyType === 'call'
// //                     ? '#FFFFFF'
// //                     : colors.text.primary,
// //               },
// //             ]}>
// //             Call History
// //           </Text>
// //         </TouchableOpacity>

// //         <TouchableOpacity
// //           activeOpacity={0.8}
// //           onPress={() => setHistoryType('chat')}
// //           style={[
// //             styles.topTab,
// //             historyType === 'chat' && {
// //               backgroundColor: colors.primary.main,
// //             },
// //           ]}>
// //           <Text
// //             style={[
// //               styles.topTabText,
// //               {
// //                 color:
// //                   historyType === 'chat'
// //                     ? '#FFFFFF'
// //                     : colors.text.primary,
// //               },
// //             ]}>
// //             Chat History
// //           </Text>
// //         </TouchableOpacity>
// //       </View>

// //       {/* CALL HISTORY */}
// //       {historyType === 'call' ? (
// //         <>
// //           <StatsSection stats={stats} />

// //           <TabFilter
// //             tabs={DEFAULT_TABS}
// //             activeTab={activeTab}
// //             onTabChange={handleTabChange}
// //           />

// //           <FlatList
// //             data={data}
// //             renderItem={renderItem}
// //             keyExtractor={(item: Session) => item.id}
// //             onEndReached={loadMore}
// //             onEndReachedThreshold={0.5}
// //             ListFooterComponent={renderFooter}
// //             ListEmptyComponent={!loading ? <EmptyState /> : null}
// //             refreshControl={
// //               <RefreshControl
// //                 refreshing={refreshing}
// //                 onRefresh={onRefresh}
// //                 tintColor={colors.primary.main}
// //                 colors={[colors.primary.main]}
// //               />
// //             }
// //             contentContainerStyle={[
// //               styles.listContent,
// //               { paddingBottom: insets.bottom + 100 },
// //             ]}
// //             showsVerticalScrollIndicator={false}
// //           />

// //           <SessionDetailModal
// //             visible={showDetailModal}
// //             onClose={() => setShowDetailModal(false)}
// //             session={selectedSession}
// //           />
// //         </>
// //       ) : (
// //         // CHAT HISTORY
// //         <ChatHistoryScreen />
// //       )}
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //   },

// //   topTabsContainer: {
// //     flexDirection: 'row',
// //     marginHorizontal: 16,
// //     marginTop: 14,
// //     marginBottom: 10,
// //     borderRadius: 14,
// //     padding: 4,
// //   },

// //   topTab: {
// //     flex: 1,
// //     paddingVertical: 12,
// //     borderRadius: 12,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },

// //   topTabText: {
// //     fontSize: 15,
// //     fontWeight: '700',
// //   },

// //   listContent: {
// //     paddingTop: 8,
// //   },

// //   footerLoader: {
// //     paddingVertical: 20,
// //     alignItems: 'center',
// //   },
// // });

// // export default SessionHistoryScreen;

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
import {useChatMessages} from '../../services/api/chatMessage/useChatMessages';
import ChatMessagesModal from './ChatHistoryScreen/components/ChatMessagesModal';

const SessionHistoryScreen = ({onNavigateBack}: any) => {
  const {colors, isDark} = useTheme();
  const insets = useSafeAreaInsets();

  const {data, loading, applyStatusFilter, loadMore, refresh} =
    useUserSessions();

  const [activeTab, setActiveTab] = useState<SessionStatus | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showMessagesModal, setShowMessagesModal] = useState(false);

  //new for msg
  const {
    data: messages,
    fetchMessages,
    loading: chatLoading,
  } = useChatMessages();

  //  YAHI API CALL HOGI
  const handleViewMore = async (sessionId: string) => {
    try {
      await fetchMessages(sessionId);
      setShowMessagesModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const closeModal = () => {
    setShowMessagesModal(false);
  };

  //end for msg

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
    // console.log("session gggg", session)
    handleViewMore(session?.id);
  };

  // const handleSessionPress = (session: Session) => {
  //   console.log("session gggg",session?.id)
  //   setSelectedSession(session);
  //   setShowDetailModal(true);
  // };

  //  onPress={() => {
  //             handleViewMore(session?.id)
  //           }}

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
      <ChatMessagesModal
        visible={showMessagesModal}
        loading={loading}
        messages={Array.isArray(messages) ? messages : []}
        onClose={closeModal}
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
