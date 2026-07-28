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
import {colors, useTheme} from '../../../theme';
import {useChatHistory} from '../../../services/api/chatHistory/useChatHistory';
import {Header, ChatHistoryCard, EmptyState} from './components';

const ChatHistoryScreen = ({onNavigateBack}: any) => {
  const {colors, isDark} = useTheme();
  const insets = useSafeAreaInsets();

  const {data, loading, loadMore, refresh} = useChatHistory();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const handleChatPress = (chat: any) => {
    setSelectedChat(chat);
    setShowDetailModal(true);
  };

  const renderItem = ({item}: {item: any}) => (
    <View style={styles.chatItem}>
      <ChatHistoryCard chat={item} onPress={handleChatPress} />
    </View>
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
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.sessionId}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  chatItem: {
    backgroundColor: colors.background.secondary,
    // borderRadius: 12,
    // padding: 16,
    // marginVertical: 8,
    // elevation: 2,
    // shadowColor: 'gray',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default ChatHistoryScreen;
