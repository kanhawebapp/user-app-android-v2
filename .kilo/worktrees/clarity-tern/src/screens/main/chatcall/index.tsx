import React, { useState, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StatusBar,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme';
import { ChatCallScreenProps, TabType, Astrologer } from './types';
import { useChatCall } from './hooks';
import { FilterSection } from './components/FilterSection';
import { AstrologerCard } from './components/AstrologerCard';
import { useAuthStore } from '../../../stores';
import { LoginRequiredModal } from '../../../components/Modal';
import { Icon } from '../../../components/Icon';
import { CHAT_CALL_LABELS } from '../../../constants/app.constants';
import styles from './styles';

const ChatCallScreen: React.FC<ChatCallScreenProps> = ({
  onNavigateToLogin,
  onNavigateToSignup,
  onNavigateToAstrologerProfile,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const typography = theme.typography;
  const insets = useSafeAreaInsets();

  // Auth state
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);

  // Custom hook for chat/call logic
  const {
    filteredAstrologers,
    filters,
    searchQuery,
    activeTab,
    setFilters,
    setSearchQuery,
    setActiveTab,
    availableLanguages,
    onlineCount,
    totalCount,
  } = useChatCall();

  // Modal state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalMessage, setModalMessage] = useState<string>(
    CHAT_CALL_LABELS.LOGIN_REQUIRED_MESSAGE,
  );

  // Filter visibility
  const [showFilters, setShowFilters] = useState(false);

  // Handle restricted action
  const handleRestrictedAction = useCallback(
    (actionMessage: string, callback?: () => void) => {
      if (isAuthenticated) {
        callback?.();
        return;
      }
      setModalMessage(actionMessage);
      setShowLoginModal(true);
    },
    [isAuthenticated],
  );

  // Handle chat button press
  const handleChatPress = useCallback(
    (astrologer: Astrologer) => {
      handleRestrictedAction(
        CHAT_CALL_LABELS.LOGIN_REQUIRED_CHAT(astrologer.name),
        () => {
          // Navigate to chat screen
          console.log('Start chat with:', astrologer.name);
        },
      );
    },
    [handleRestrictedAction],
  );

  // Handle call button press
  const handleCallPress = useCallback(
    (astrologer: Astrologer) => {
      handleRestrictedAction(
        CHAT_CALL_LABELS.LOGIN_REQUIRED_CALL(astrologer.name),
        () => {
          // Navigate to call screen
          console.log('Start call with:', astrologer.name);
        },
      );
    },
    [handleRestrictedAction],
  );

  // Handle profile press
  const handleProfilePress = useCallback(
    (astrologer: Astrologer) => {
      handleRestrictedAction(
        CHAT_CALL_LABELS.LOGIN_REQUIRED_PROFILE(astrologer.name),
        () => {
          onNavigateToAstrologerProfile?.(astrologer.id);
        },
      );
    },
    [handleRestrictedAction, onNavigateToAstrologerProfile],
  );

  // Modal handlers
  const handleCloseModal = useCallback(() => {
    setShowLoginModal(false);
  }, []);

  const handleLoginPress = useCallback(() => {
    setShowLoginModal(false);
    onNavigateToLogin?.();
  }, [onNavigateToLogin]);

  const handleSignupPress = useCallback(() => {
    setShowLoginModal(false);
    onNavigateToSignup?.();
  }, [onNavigateToSignup]);

  // Render tab button
  const renderTabButton = (tab: TabType, label: string, iconName: string) => {
    const isActive = activeTab === tab;
    return (
      <TouchableOpacity
        style={[
          styles.tabButton,
          isActive && { backgroundColor: colors.primary.main },
        ]}
        onPress={() => setActiveTab(tab)}
        activeOpacity={0.7}
      >
        <Icon
          name={iconName}
          size={18}
          color={isActive ? colors.primary.contrastText : colors.text.secondary}
          library="Ionicons"
        />
        <Text
          style={[
            styles.tabText,
            isActive
              ? { color: colors.primary.contrastText }
              : { color: colors.text.secondary },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  // Render astrologer card
  const renderAstrologerCard = ({ item }: { item: Astrologer }) => (
    <AstrologerCard
      astrologer={item}
      activeTab={activeTab}
      onChatPress={handleChatPress}
      onCallPress={handleCallPress}
      onProfilePress={handleProfilePress}
    />
  );

  // Render empty state
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
      <Text style={[styles.emptySubtitle, { color: colors.text.secondary }]}>
        {CHAT_CALL_LABELS.EMPTY_SUBTITLE}
      </Text>
    </View>
  );

  // Get header title based on active tab
  const getHeaderTitle = () => {
    return activeTab === 'chat'
      ? CHAT_CALL_LABELS.CHAT_HEADER_TITLE
      : CHAT_CALL_LABELS.CALL_HEADER_TITLE;
  };

  // Get header subtitle based on active tab
  const getHeaderSubtitle = () => {
    return activeTab === 'chat'
      ? CHAT_CALL_LABELS.CHAT_HEADER_SUBTITLE(onlineCount)
      : CHAT_CALL_LABELS.CALL_HEADER_SUBTITLE(onlineCount);
  };

  // Calculate active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.availability !== 'all') count++;
    if (filters.rating !== 'all') count++;
    if (filters.priceRange.min !== 0 || filters.priceRange.max !== Infinity)
      count++;
    if (filters.languages.length > 0) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background.secondary },
      ]}
    >
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background.primary}
      />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            // paddingTop: insets.top,
            backgroundColor: colors.background.primary,
            borderBottomColor: colors.border.light,
          },
        ]}
      >
     
        <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
          {getHeaderSubtitle()}
        </Text>
      </View>

      {/* Tabs */}
      <View
        style={[
          styles.tabsContainer,
          {
            backgroundColor: colors.background.primary,
            borderBottomColor: colors.border.light,
          },
        ]}
      >
        <View style={styles.tabsRow}>
          {renderTabButton('chat', CHAT_CALL_LABELS.TAB_CHAT, 'chatbubbles')}
          {renderTabButton('call', CHAT_CALL_LABELS.TAB_CALL, 'call-outline')}
        </View>
      </View>

      {/* Search */}
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: colors.background.primary },
        ]}
      >
        <View
          style={[
            styles.searchInputContainer,
            { backgroundColor: colors.background.secondary },
          ]}
        >
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
      </View>

      {/* Filter Toggle */}
      <View
        style={[
          styles.filterToggleContainer,
          { backgroundColor: colors.background.primary },
        ]}
      >
        <View style={styles.filterToggleRow}>
          <View style={styles.filterInfo}>
            <Text
              style={[styles.filterCount, { color: colors.text.secondary }]}
            >
              {CHAT_CALL_LABELS.FILTER_SHOWING}{' '}
              <Text
                style={[
                  styles.filterCountHighlight,
                  { color: colors.primary.main },
                ]}
              >
                {filteredAstrologers.length}
              </Text>{' '}
              {CHAT_CALL_LABELS.FILTER_OF} {totalCount}{' '}
              {CHAT_CALL_LABELS.FILTER_ASTROLOGERS}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.filterToggleButton,
              { backgroundColor: colors.background.secondary },
            ]}
            onPress={() => setShowFilters(!showFilters)}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.filterToggleText, { color: colors.primary.main }]}
            >
              {showFilters
                ? `▲ ${CHAT_CALL_LABELS.FILTER_TOGGLE_HIDE}`
                : `▼ ${CHAT_CALL_LABELS.FILTER_TOGGLE_SHOW}${
                    activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ''
                  }`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Section */}
      {showFilters && (
        <View
          style={[
            styles.filterSection,
            {
              backgroundColor: colors.background.primary,
              borderBottomColor: colors.border.light,
            },
          ]}
        >
          <FilterSection
            filters={filters}
            onFiltersChange={setFilters}
            availableLanguages={availableLanguages}
          />
        </View>
      )}

      {/* Astrologers List */}
      <FlatList
        data={filteredAstrologers}
        renderItem={renderAstrologerCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />

      {/* Login Required Modal */}
      <LoginRequiredModal
        visible={showLoginModal}
        onClose={handleCloseModal}
        onLoginPress={handleLoginPress}
        onSignupPress={handleSignupPress}
        message={modalMessage}
      />
    </View>
  );
};

export default ChatCallScreen;
