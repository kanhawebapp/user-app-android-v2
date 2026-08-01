import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StatusBar,
  FlatList,
} from 'react-native';
import { useTheme } from '../../../theme';
import { ChatCallScreenProps, Astrologer } from './types';
import { useChatCall } from './hooks';
import { FilterSection } from './components/FilterSection';
import { AstrologerCard } from './components/AstrologerCard';
import { useChatStore } from '../../../services/chat/chat.store';
import { Icon } from '../../../components/Icon';
import { CHAT_CALL_LABELS } from '../../../constants/app.constants';
import { ChatScreen } from '../chat';
import styles from './styles';
import Filter from '../../../assets/images/filter.svg';
import { useAstrologers } from '../../../services/api/recomandedAstrologer/astrologer.hooks';
import { ConsultationFlowLayer } from '../consultation';
import { useChatActions } from '../../../services/chat';

const ChatCallScreen: React.FC<ChatCallScreenProps> = ({
  onNavigateToLogin,
  onNavigateToSignup,
  onNavigateToAstrologerProfile,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const { data = [], loading, refresh } = useAstrologers();

  const astrologers = React.useMemo(() => {
    return data.map((item: any) => {
      const chatPricing = item.pricing?.find((p: any) => p.type === 'CHAT');
      const callPricing = item.pricing?.find((p: any) => p.type === 'CALL');

      return {
        id: item.id,
        name: item.name,
        rating: item.rating || 0,
        reviewCount: 0,
        experience: `${item.experience}+ years`,
        languages: item.languages || [],
        skills: item.skills || [],
        image: item.profilePic,
        availability: 'online',
        // isAvailableForChat: true,
        // isAvailableForCall: true,
        chatRate: chatPricing?.offerPrice || chatPricing?.price || 0,
        callRate: callPricing?.offerPrice || callPricing?.price || 0,
        activeOffer: item.activeOffer || null,
        pricing: item.pricing || [],
        isBusy: item?.isBusy,
        isCallActive: item?.isCallActive,
        isChatActive: item?.isChatActive,
        isAvailableForCall: item?.isAvailableForCall,
        isAvailableForChat: item?.isAvailableForChat,
        isLiveActive: item?.isLiveActive,
        isOnline: item?.isOnline,
      };
    });
  }, [data]);

  const {
    filteredAstrologers,
    filters,
    searchQuery,
    activeTab,
    setFilters,
    setSearchQuery,
    availableLanguages,
    onlineCount,
  } = useChatCall(astrologers);

  const chatStatus = useChatStore(state => state.chatStatus);
  const shouldNavigateToChat = useChatStore(
    state => state.shouldNavigateToChat,
  );
  const roomId = useChatStore(state => state.roomId);
  const userData = useChatStore(state => state.userData);
  const storeSelectedAstrologer = useChatStore(
    state => state.selectedAstrologer,
  );

  const [showChatScreen, setShowChatScreen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const hasNavigatedRef = useRef(false);


  useEffect(() => {
  if (
    chatStatus === 'completed' ||
    chatStatus === 'rejected' ||
    chatStatus === 'cancelled'
  ) {
    console.log('[ChatCallScreen] Reset navigation');

    hasNavigatedRef.current = false;
    setShowChatScreen(false);
  }
}, [chatStatus]);


//  const { completeChat } = useChatActions();


//   // ⚠️ Testing only
// useEffect(() => {
//   console.log('[TEST] Force complete chat');
//   completeChat();
// }, []);

  useEffect(() => {
    const roomIdStr = roomId ? String(roomId) : null;

    console.log(
      '[ChatCallScreen] shouldNavigateToChat:',
      shouldNavigateToChat,
      'chatStatus:',
      chatStatus,
      'roomId:',
      roomId,
      'hasNavigated:',
      hasNavigatedRef.current,
    );

    if (
      chatStatus === 'active' &&
      roomIdStr &&
      roomIdStr !== 'undefined' &&
      roomIdStr !== 'null' &&
      !hasNavigatedRef.current
    ) {
      console.log('[ChatCallScreen] Navigating to chat screen');
      hasNavigatedRef.current = true;
      setShowChatScreen(true);
    }
  }, [chatStatus, roomId, shouldNavigateToChat]);

  const handleBackFromChat = useCallback(() => {
    setShowChatScreen(false);
  }, []);

  const handleEndChat = useCallback(() => {
    setShowChatScreen(false);
  }, []);

  const getHeaderSubtitle = () => {
    return activeTab === 'chat'
      ? CHAT_CALL_LABELS.CHAT_HEADER_SUBTITLE(onlineCount)
      : CHAT_CALL_LABELS.CALL_HEADER_SUBTITLE(onlineCount);
  };
  return (
    <ConsultationFlowLayer
      onNavigateToLogin={onNavigateToLogin}
      onNavigateToSignup={onNavigateToSignup}>
      {({ startChat, startCall, runIfAuthenticated, selectedAstrologer }) => {
        const handleAstrologerCardPress = (astrologer: Astrologer) => {
          console.log('ASTRO CARD PRESS');
          runIfAuthenticated('Please login to view astrologer profile', () => {
            onNavigateToAstrologerProfile?.(astrologer as any);
          });
        };

        const handleProfilePress = (astrologer: Astrologer) => {
          runIfAuthenticated(
            CHAT_CALL_LABELS.LOGIN_REQUIRED_PROFILE(astrologer.name),
            () => {
              onNavigateToAstrologerProfile?.(astrologer.id);
            },
          );
        };
        const renderAstrologerCard = ({ item }: { item: Astrologer }) => (
          <AstrologerCard
            astrologer={item}
            activeTab={activeTab}
            onChatPress={startChat}
            onCallPress={startCall}
            onProfilePress={handleProfilePress}
            onCardPress={handleAstrologerCardPress}
          />
        );

        const renderEmptyState = () => (
          <View style={styles.emptyContainer}>
            <Icon
              name="search"
              size={48}
              color={colors.text.secondary}
              library="Ionicons"
              style={styles.emptyIcon}
            />
            <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
              {CHAT_CALL_LABELS.EMPTY_TITLE}
            </Text>
            <Text
              style={[styles.emptySubtitle, { color: colors.text.secondary }]}>
              {CHAT_CALL_LABELS.EMPTY_SUBTITLE}
            </Text>
          </View>
        );

        const astroToUse = selectedAstrologer || storeSelectedAstrologer;

        if (showChatScreen && astroToUse && userData) {
          return (
            <ChatScreen
              astrologerName={astroToUse.name}
              astrologerImage={astroToUse.image}
              astrologerRating={astroToUse.rating}
              astrologerExperience={astroToUse.experience}
              astrologerSkills={astroToUse.skills}
              isOnline={astroToUse.isAvailableForChat}
              userData={userData}
              onBack={handleBackFromChat}
              onEndChat={handleEndChat}
            />
          );
        }

        return (
          <View
            style={[
              styles.container,
              { backgroundColor: colors.background.secondary },
            ]}>
            <StatusBar
              barStyle={theme.isDark ? 'light-content' : 'dark-content'}
              backgroundColor={colors.background.primary}
            />

            <View
              style={[
                styles.header,
                {
                  backgroundColor: colors.background.primary,
                  borderBottomColor: colors.border.light,
                },
              ]}>
              {/* <Text
                style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
                {getHeaderSubtitle()}
              </Text> */}
            </View>

            <View
              style={[
                styles.searchContainer,
                { backgroundColor: colors.background.primary },
              ]}>
              <View
                style={[
                  styles.searchInputContainer,
                  { backgroundColor: colors.background.secondary },
                ]}>
                <Icon
                  name="search"
                  size={20}
                  color={colors.text.secondary}
                  library="Ionicons"
                  style={styles.searchIcon}
                />
                <TextInput
                  style={[styles.searchInput, { color: colors.text.primary }]}
                  placeholder={CHAT_CALL_LABELS.SEARCH_PLACEHOLDER}
                  placeholderTextColor={colors.text.tertiary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <TouchableOpacity
                style={[styles.filterToggleButton]}
                onPress={() => setShowFilters(!showFilters)}
                activeOpacity={0.7}>
                <Filter />
              </TouchableOpacity>
            </View>

            {showFilters && (
              <View
                style={[
                  styles.filterSection,
                  {
                    backgroundColor: colors.background.primary,
                    borderBottomColor: colors.border.light,
                  },
                ]}>
                <FilterSection
                  filters={filters}
                  onFiltersChange={setFilters}
                  availableLanguages={availableLanguages}
                />
              </View>
            )}

            <FlatList
              data={filteredAstrologers}
              renderItem={renderAstrologerCard}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={renderEmptyState}
              refreshing={loading}
              onRefresh={refresh}
            />
          </View>
        );
      }}
    </ConsultationFlowLayer>
  );
};

export default ChatCallScreen;
