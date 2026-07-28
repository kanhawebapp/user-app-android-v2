// import React, {useState, useCallback, useEffect, useRef} from 'react';
// import {
//   View,
//   TouchableOpacity,
//   Text, 
//   TextInput,
//   StatusBar,
//   FlatList,
// } from 'react-native';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
// import {useTheme} from '../../../theme';
// import {ChatCallScreenProps, Astrologer} from './types';
// import {useChatCall} from './hooks';
// import {FilterSection} from './components/FilterSection';
// import {AstrologerCard} from './components/AstrologerCard';
// import {useAuthStore} from '../../../stores';
// import {useChatStore} from '../../../services/chat/chat.store';
// import {
//   LoginRequiredModal,
//   ChatRequestData,
// } from '../../../components/Modal';
// import {Icon} from '../../../components/Icon';
// import {CHAT_CALL_LABELS} from '../../../constants/app.constants';
// import {ChatScreen} from '../chat';
// import styles from './styles';
// import Filter from '../../../assets/images/filter.svg';
// import { useAstrologers } from '../../../services/api/recomandedAstrologer/astrologer.hooks';

// const ChatCallScreen: React.FC<ChatCallScreenProps> = ({
//   onNavigateToLogin,
//   onNavigateToSignup,
//   onNavigateToAstrologerProfile,
//   onNavigateToChat,
// }) => {
//   const theme = useTheme();
//   const colors = theme.colors;

//   // Auth state
//   const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
//   //  const {data = []} = useAstrologers();


//   //  console.log('Astrologers data:', data);

//   // Custom hook for chat/call logic
//   const {
//     filteredAstrologers,
//     filters,
//     searchQuery,
//     activeTab,
//     setFilters,
//     setSearchQuery,
//     setActiveTab,
//     availableLanguages,
//     onlineCount,
//     totalCount,
//   } = useChatCall();

//   // Modal state
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [modalMessage, setModalMessage] = useState<string>(
//     CHAT_CALL_LABELS.LOGIN_REQUIRED_MESSAGE,
//   );

//   // Chat request modal state
//   const [showChatRequestModal, setShowChatRequestModal] = useState(false);
//   const [selectedAstrologer, setSelectedAstrologer] =
//     useState<Astrologer | null>(null);
//   const [showChatScreen, setShowChatScreen] = useState(false);

//   // Ref to prevent duplicate navigation
//   const hasNavigatedRef = useRef(false);

//   // Filter visibility
//   const [showFilters, setShowFilters] = useState(false);

//   // Convert chatcall Astrologer to ChatRequestModal Astrologer format


//   // Chat state from store
//   const chatStatus = useChatStore(state => state.chatStatus);
//   const queueData = useChatStore(state => state.queueData);
//   const shouldNavigateToChat = useChatStore(
//     state => state.shouldNavigateToChat,
//   );
//   const roomId = useChatStore(state => state.roomId);
//   const setUserData = useChatStore(state => state.setUserData);
//   const userData = useChatStore(state => state.userData);
//   const storeSelectedAstrologer = useChatStore(
//     state => state.selectedAstrologer,
//   );

//   // Watch for navigation flag and navigate to chat screen
//   useEffect(() => {
//     const roomIdStr = roomId ? String(roomId) : null;

//     console.log(
//       '[ChatCallScreen] shouldNavigateToChat:',
//       shouldNavigateToChat,
//       'chatStatus:',
//       chatStatus,
//       'roomId:',
//       roomId,
//       'hasNavigated:',
//       hasNavigatedRef.current,
//     );

//     if (
//       chatStatus === 'active' &&
//       roomIdStr &&
//       roomIdStr !== 'undefined' &&
//       roomIdStr !== 'null' &&
//       !hasNavigatedRef.current
//     ) {
//       console.log('[ChatCallScreen] Navigating to chat screen');
//       hasNavigatedRef.current = true;
//       setShowChatScreen(true);
//     }
//   }, [chatStatus, roomId, shouldNavigateToChat]);

//   // Handle restricted action
//   const handleRestrictedAction = useCallback(
//     (actionMessage: string, callback?: () => void) => {
//       if (isAuthenticated) {
//         callback?.();
//         return;
//       }
//       setModalMessage(actionMessage);
//       setShowLoginModal(true);
//     },
//     [isAuthenticated],
//   );

//   // Handle chat button press
//   const handleChatPress = useCallback(
//     (astrologer: Astrologer) => {
//       handleRestrictedAction(
//         CHAT_CALL_LABELS.LOGIN_REQUIRED_CHAT(astrologer.name),
//         () => {
//           setSelectedAstrologer(astrologer);
//           setShowChatRequestModal(true);
//         },
//       );
//     },
//     [handleRestrictedAction],
//   );

//   // Handle chat request modal submit
//   // IMPORTANT: `ChatRequestModal` only calls `onSubmit` after `sendChatRequest()` returns `result.success === true`.
//   const handleChatRequestSubmit = useCallback(
//     async (data: ChatRequestData) => {
//       if (!selectedAstrologer) {
//         return;
//       }

//       // Close modal ONLY on confirmed success (direct-call or queued-call),
//       // and only for this modal success path.
//       setShowChatRequestModal(false);
//       setSelectedAstrologer(null);
//       // Keep existing behavior for chat flow: store user + astrologer for ChatScreen.
//       setUserData(data);
//       useChatStore.getState().setSelectedAstrologer({
//         id: selectedAstrologer.id,
//         name: selectedAstrologer.name,
//         image: selectedAstrologer.image,
//         rating: selectedAstrologer.rating,
//         experience: selectedAstrologer.experience,
//         skills: selectedAstrologer.skills,
//         isAvailableForChat: selectedAstrologer.isAvailableForChat,
//       });

//       onNavigateToChat?.(selectedAstrologer, data);
//     },
//     [selectedAstrologer, onNavigateToChat, setUserData],
//   );

//   // Handle back from chat screen
//   const handleBackFromChat = useCallback(() => {
//     setShowChatScreen(false);
//     setSelectedAstrologer(null);
//   }, []);

//   // Handle end chat
//   const handleEndChat = useCallback(() => {
//     setShowChatScreen(false);
//     setSelectedAstrologer(null);
//   }, []);

//   // Handle profile press
//   const handleProfilePress = useCallback(
//     (astrologer: Astrologer) => {
//       handleRestrictedAction(
//         CHAT_CALL_LABELS.LOGIN_REQUIRED_PROFILE(astrologer.name),
//         () => {
//           onNavigateToAstrologerProfile?.(astrologer.id);
//         },
//       );
//     },
//     [handleRestrictedAction, onNavigateToAstrologerProfile],
//   );

//   // Modal handlers
//   const handleCloseModal = useCallback(() => {
//     setShowLoginModal(false);
//   }, []);

//   const handleLoginPress = useCallback(() => {
//     setShowLoginModal(false);
//     onNavigateToLogin?.();
//   }, [onNavigateToLogin]);

//   const handleSignupPress = useCallback(() => {
//     setShowLoginModal(false);
//     onNavigateToSignup?.();
//   }, [onNavigateToSignup]);

//   // Render astrologer card
//   const renderAstrologerCard = ({item}: {item: Astrologer}) => (
//     <AstrologerCard
//       astrologer={item}
//       activeTab={activeTab}
//       onChatPress={handleChatPress}
//       // onCallPress={handleCallPress}
//       onProfilePress={handleProfilePress}
//     />
//   );

//   // Render empty state
//   const renderEmptyState = () => (
//     <View style={styles.emptyContainer}>
//       <Icon
//         name="search"
//         size={48}
//         color={colors.text.secondary}
//         library="Ionicons"
//         style={styles.emptyIcon}
//       />
//       <Text style={[styles.emptyTitle, {color: colors.text.primary}]}>
//         {CHAT_CALL_LABELS.EMPTY_TITLE}
//       </Text>
//       <Text style={[styles.emptySubtitle, {color: colors.text.secondary}]}>
//         {CHAT_CALL_LABELS.EMPTY_SUBTITLE}
//       </Text>
//     </View>
//   );

//   // Get header subtitle based on active tab
//   const getHeaderSubtitle = () => {
//     return activeTab === 'chat'
//       ? CHAT_CALL_LABELS.CHAT_HEADER_SUBTITLE(onlineCount)
//       : CHAT_CALL_LABELS.CALL_HEADER_SUBTITLE(onlineCount);
//   };

//   // Determine which astrologer to use: local selection or from store (for Home flow)
//   const astroToUse = selectedAstrologer || storeSelectedAstrologer;

//   // Render chat screen if active
//   if (showChatScreen && astroToUse && userData) {
//     return (
//       <ChatScreen
//         astrologerName={astroToUse.name}
//         astrologerImage={astroToUse.image}
//         astrologerRating={astroToUse.rating}
//         astrologerExperience={astroToUse.experience}
//         astrologerSkills={astroToUse.skills}
//         isOnline={astroToUse.isAvailableForChat}
//         userData={userData}
//         onBack={handleBackFromChat}
//         onEndChat={handleEndChat}
//       />
//     );
//   }

//   // Calculate active filters count
//   const getActiveFiltersCount = () => {
//     let count = 0;
//     if (filters.availability !== 'all') {
//       count++;
//     }
//     if (filters.rating !== 'all') {
//       count++;
//     }
//     if (filters.priceRange.min !== 0 || filters.priceRange.max !== Infinity) {
//       count++;
//     }
//     if (filters.languages.length > 0) {
//       count++;
//     }
//     return count;
//   };

//   return (
//     <View
//       style={[
//         styles.container,
//         {backgroundColor: colors.background.secondary},
//       ]}>
//       <StatusBar
//         barStyle={theme.isDark ? 'light-content' : 'dark-content'}
//         backgroundColor={colors.background.primary}
//       />

//       {/* Header */}
//       <View
//         style={[
//           styles.header,
//           {
//             // paddingTop: insets.top,
//             backgroundColor: colors.background.primary,
//             borderBottomColor: colors.border.light,
//           },
//         ]}>
//         <Text style={[styles.headerSubtitle, {color: colors.text.secondary}]}>
//           {getHeaderSubtitle()}
//         </Text>
//       </View>

//       {/* Search */}
//       <View
//         style={[
//           styles.searchContainer,
//           {backgroundColor: colors.background.primary},
//         ]}>
//         <View
//           style={[
//             styles.searchInputContainer,
//             {backgroundColor: colors.background.secondary},
//           ]}>
//           <Icon
//             name="search"
//             size={20}
//             color={colors.text.secondary}
//             library="Ionicons"
//             style={styles.searchIcon}
//           />
//           <TextInput
//             style={[styles.searchInput, {color: colors.text.primary}]}
//             placeholder={CHAT_CALL_LABELS.SEARCH_PLACEHOLDER}
//             placeholderTextColor={colors.text.tertiary}
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//           />
//         </View>
//         <TouchableOpacity
//           style={[styles.filterToggleButton]}
//           onPress={() => setShowFilters(!showFilters)}
//           activeOpacity={0.7}>
//           <Filter />
//         </TouchableOpacity>
//       </View>

//       {/* Filter Toggle */}

//       {/* Filter Section */}
//       {showFilters && (
//         <View
//           style={[
//             styles.filterSection,
//             {
//               backgroundColor: colors.background.primary,
//               borderBottomColor: colors.border.light,
//             },
//           ]}>
//           <FilterSection
//             filters={filters}
//             onFiltersChange={setFilters}
//             availableLanguages={availableLanguages}
//           />
//         </View>
//       )}

//       {/* Astrologers List */}
//       <FlatList
//         data={filteredAstrologers}
//         renderItem={renderAstrologerCard}
//         keyExtractor={item => item.id}
//         contentContainerStyle={styles.listContent}
//         showsVerticalScrollIndicator={false}
//         ListEmptyComponent={renderEmptyState}
//       />

//       {/* Login Required Modal */}
//       <LoginRequiredModal
//         visible={showLoginModal}
//         onClose={handleCloseModal}
//         onLoginPress={handleLoginPress}
//         onSignupPress={handleSignupPress}
//         message={modalMessage}
//       />
//     </View>
//   );
// };

// export default ChatCallScreen;



import React, { useState, useCallback, useEffect, useRef } from 'react';
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
import { ChatCallScreenProps, Astrologer } from './types';
import { useChatCall } from './hooks';
import { FilterSection } from './components/FilterSection';
import { AstrologerCard } from './components/AstrologerCard';
import { useAuthStore } from '../../../stores';
import { useChatStore } from '../../../services/chat/chat.store';
import {
  LoginRequiredModal,
  ChatRequestData,
  ChatRequestModal,
} from '../../../components/Modal';
import { Icon } from '../../../components/Icon';
import { CHAT_CALL_LABELS } from '../../../constants/app.constants';
import { ChatScreen } from '../chat';
import styles from './styles';
import Filter from '../../../assets/images/filter.svg';
import { useAstrologers } from '../../../services/api/recomandedAstrologer/astrologer.hooks';
import { useConsultationFlow } from '../call/hooks/useConsultationFlow';


const ChatCallScreen: React.FC<ChatCallScreenProps> = ({
  onNavigateToLogin,
  onNavigateToSignup,
  onNavigateToAstrologerProfile,
  onNavigateToChat,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  // Auth state
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const { data = [] } = useAstrologers();
  const [consultationType, setConsultationType] =
    useState<'chat' | 'call'>('chat');




  const astrologers = React.useMemo(() => {
    return data.map((item: any) => {
      const chatPricing = item.pricing?.find(
        (p: any) => p.type === 'CHAT',
      );

      const callPricing = item.pricing?.find(
        (p: any) => p.type === 'CALL',
      );

      return {
        id: item.id,
        name: item.name,
        rating: item.rating || 0,
        reviewCount: 0,
        experience: `${item.experience}+ years`,
        languages: item.languages || [],
        skills: item.skills || [],
        image: item.profilePic,

        // temporary defaults
        availability: 'online',
        isAvailableForChat: true,
        isAvailableForCall: true,

        chatRate: chatPricing?.offerPrice || chatPricing?.price || 0,
        callRate: callPricing?.offerPrice || callPricing?.price || 0,
      };
    });
  }, [data]);

  // Custom hook for chat/call logic
  const {
    filteredAstrologers,
    filters,
    searchQuery,
    activeTab,
    setFilters,
    setSearchQuery,
    availableLanguages,
    onlineCount,
    totalCount,
  } = useChatCall(astrologers);


  const {
    submitConsultationRequest,
    loading: consultationLoading,
  } = useConsultationFlow();

  // Modal state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalMessage, setModalMessage] = useState<string>(
    CHAT_CALL_LABELS.LOGIN_REQUIRED_MESSAGE,
  );

  const handleAstrologerCardPress = useCallback(

    (astrologer: any) => {
      console.log('ASTRO CARD PRESS');
      handleRestrictedAction(

        'Please login to view astrologer profile',

        () => {

          onNavigateToAstrologerProfile?.(astrologer);

        },

      );

    },

    [onNavigateToAstrologerProfile],

  );




  // Chat request modal state
  const [showChatRequestModal, setShowChatRequestModal] = useState(false);
  const [selectedAstrologer, setSelectedAstrologer] =
    useState<Astrologer | null>(null);
  const [showChatScreen, setShowChatScreen] = useState(false);

  // Ref to prevent duplicate navigation
  const hasNavigatedRef = useRef(false);

  // Filter visibility
  const [showFilters, setShowFilters] = useState(false);

  // Convert chatcall Astrologer to ChatRequestModal Astrologer format


  // Chat state from store
  const chatStatus = useChatStore(state => state.chatStatus);
  const queueData = useChatStore(state => state.queueData);
  const shouldNavigateToChat = useChatStore(
    state => state.shouldNavigateToChat,
  );
  const roomId = useChatStore(state => state.roomId);
  const setUserData = useChatStore(state => state.setUserData);
  const userData = useChatStore(state => state.userData);
  const storeSelectedAstrologer = useChatStore(
    state => state.selectedAstrologer,
  );

  // Watch for navigation flag and navigate to chat screen
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

  const handleChatPress = useCallback(
    (astrologer: Astrologer) => {
      handleRestrictedAction(
        CHAT_CALL_LABELS.LOGIN_REQUIRED_CHAT(astrologer.name),
        () => {
          setConsultationType('chat');
          setSelectedAstrologer(astrologer);
          setShowChatRequestModal(true);
        },
      );
    },
    [handleRestrictedAction],
  );

  const handleCallPress = useCallback(
    (astrologer: Astrologer) => {
      handleRestrictedAction(
        CHAT_CALL_LABELS.LOGIN_REQUIRED_CHAT(astrologer.name),
        () => {
          setConsultationType('call');
          setSelectedAstrologer(astrologer);
          setShowChatRequestModal(true);
        },
      );
    },
    [handleRestrictedAction],
  );


  // Handle back from chat screen
  const handleBackFromChat = useCallback(() => {
    setShowChatScreen(false);
    setSelectedAstrologer(null);
  }, []);

  // Handle end chat
  const handleEndChat = useCallback(() => {
    setShowChatScreen(false);
    setSelectedAstrologer(null);
  }, []);

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

  // Render astrologer card
  const renderAstrologerCard = ({ item }: { item: Astrologer }) => (
    <AstrologerCard
      astrologer={item}
      activeTab={activeTab}
      onChatPress={handleChatPress}
      onCallPress={handleCallPress}
      onProfilePress={handleProfilePress}
      onCardPress={handleAstrologerCardPress}
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

  // Get header subtitle based on active tab
  const getHeaderSubtitle = () => {
    return activeTab === 'chat'
      ? CHAT_CALL_LABELS.CHAT_HEADER_SUBTITLE(onlineCount)
      : CHAT_CALL_LABELS.CALL_HEADER_SUBTITLE(onlineCount);
  };

  // Determine which astrologer to use: local selection or from store (for Home flow)
  const astroToUse = selectedAstrologer || storeSelectedAstrologer;

  // Render chat screen if active
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

  // Calculate active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.availability !== 'all') {
      count++;
    }
    if (filters.rating !== 'all') {
      count++;
    }
    if (filters.priceRange.min !== 0 || filters.priceRange.max !== Infinity) {
      count++;
    }
    if (filters.languages.length > 0) {
      count++;
    }
    return count;
  };

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

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            // paddingTop: insets.top,
            backgroundColor: colors.background.primary,
            borderBottomColor: colors.border.light,
          },
        ]}>
        <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
          {getHeaderSubtitle()}
        </Text>
      </View>

      {/* Search */}
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

      {/* Filter Toggle */}

      {/* Filter Section */}
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

      <ChatRequestModal
        visible={showChatRequestModal}
        type={consultationType}
        astrologer={selectedAstrologer ?? undefined}
        loading={consultationLoading}
        onClose={() => {
          setShowChatRequestModal(false);
          setSelectedAstrologer(null);
        }}
        onSubmit={(formData: ChatRequestData) => {
          if (!selectedAstrologer) {
            return;
          }

          submitConsultationRequest({
            astrologer: selectedAstrologer,
            consultationType,
            formData,
            onClose: () => {
              setShowChatRequestModal(false);
              setSelectedAstrologer(null);
            },
          });
        }}
      />

    </View>
  );
};

export default ChatCallScreen;




