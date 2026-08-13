// import React, {useState, useCallback} from 'react';
// import {
//   FlatList,
//   View,
//   ActivityIndicator,
//   TouchableOpacity,
//   Text,
//   StyleSheet,
// } from 'react-native';
// import {useAstrologers} from '../../../services/api/recomandedAstrologer/astrologer.hooks';
// import AstrologerCard from './AstrologerCard';
// import AstrologerProfileScreen from '../astrologerProfile';
// import {ChatRequestModal, ChatRequestData} from '../../../components/Modal';
// import type {Astrologer} from '../../../services/api/recomandedAstrologer/astrologer.types';

// interface AstrologerListScreenProps {
//   onBack?: () => void;
// }

// const AstrologerListScreen: React.FC<AstrologerListScreenProps> = ({
//   onBack,
// }) => {
//   const {data, loading, loadMore} = useAstrologers();

//   const [selectedAstrologer, setSelectedAstrologer] =
//     useState<Astrologer | null>(null);
//   const [showChatRequestModal, setShowChatRequestModal] = useState(false);
//   const [chatTargetAstrologer, setChatTargetAstrologer] =
//     useState<Astrologer | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleCardPress = useCallback((astrologer: Astrologer) => {
//     setSelectedAstrologer(astrologer);
//   }, []);

//   const handleChatPress = useCallback((astrologer: Astrologer) => {
//     setChatTargetAstrologer(astrologer);
//     setShowChatRequestModal(true);
//   }, []);

//   const handleAddPress = useCallback((astrologer: Astrologer) => {
//     console.log('Add/Follow astrologer:', astrologer.name);
//   }, []);

//   const handleBackFromProfile = useCallback(() => {
//     setSelectedAstrologer(null);
//   }, []);

//   const handleProfileChatPress = useCallback((astrologer: Astrologer) => {
//     setSelectedAstrologer(null);
//     setChatTargetAstrologer(astrologer);
//     setShowChatRequestModal(true);
//   }, []);

//   const handleChatRequestSubmit = useCallback(
//     async (_data: ChatRequestData) => {
//       if (!chatTargetAstrologer) {
//         return;
//       }
//       setIsSubmitting(true);
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       setIsSubmitting(false);
//       setShowChatRequestModal(false);
//       setChatTargetAstrologer(null);
//       console.log('Chat started with:', chatTargetAstrologer.name);
//     },
//     [chatTargetAstrologer],
//   );

//   if (selectedAstrologer) {
//     return (
//       <AstrologerProfileScreen
//         astrologer={selectedAstrologer}
//         onBack={handleBackFromProfile}
//         onChatPress={handleProfileChatPress}
//       />
//     );
//   }

//   return (
//     <View style={{flex: 1}}>
//       {onBack && (
//         <View style={styles.header}>
//           <TouchableOpacity onPress={onBack} style={styles.backButton}>
//             <Text style={styles.backText}>← Back</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//       <FlatList
//         data={data}
//         keyExtractor={item => item.id}
//         numColumns={2}
//         renderItem={({item}) => (
//           <View style={{flex: 1, margin: 6}}>
//             <AstrologerCard
//               item={item}
//               onPress={() => handleCardPress(item)}
//               onChatPress={() => handleChatPress(item)}
//               onAddPress={() => handleAddPress(item)}
//             />
//           </View>
//         )}
//         onEndReached={loadMore}
//         onEndReachedThreshold={0.5}
//         ListFooterComponent={
//           loading ? <ActivityIndicator style={{margin: 10}} /> : null
//         }
//       />

//       {/* <ChatRequestModal
//         visible={showChatRequestModal}
//         onClose={() => {
//           setShowChatRequestModal(false);
//           setChatTargetAstrologer(null);
//         }}
//         onSubmit={handleChatRequestSubmit}
//         astrologer={chatTargetAstrologer}
//         loading={isSubmitting}
//       /> */}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   header: {
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   backButton: {
//     paddingVertical: 8,
//     paddingRight: 16,
//   },
//   backText: {
//     fontSize: 16,
//     color: '#000',
//     fontWeight: '600',
//   },
// });

// export default AstrologerListScreen;

import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  FlatList,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
} from 'react-native';
import {Icon, GoBack} from '../../../components';
import {useAstrologers} from '../../../services/api/recomandedAstrologer/astrologer.hooks';
import AstrologerCard from './AstrologerCard';
import AstrologerProfileScreen from '../astrologerProfile';
import {
  ChatRequestModal,
  ChatRequestData,
  LoginRequiredModal,
} from '../../../components/Modal';
import {sendChatRequest} from '../../../services/chat/chat.service';
import {useChatStore} from '../../../services/chat/chat.store';
import {useAuthStore} from '../../../stores/auth.store';
import {useNavigation} from '@react-navigation/native';
import {useToast} from '../../../context/ToastContext';
import type {Astrologer} from '../../../services/api/recomandedAstrologer/astrologer.types';

interface AstrologerListScreenProps {
  onBack?: () => void;
}

const AstrologerListScreen: React.FC<AstrologerListScreenProps> = ({
  onBack,
}) => {
  const {
    data = [],
    loading,
    loadMore,
    filters,
    changeFilter,
    resetFilters,
  } = useAstrologers();

  const navigation = useNavigation();
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(
    (state: {isAuthenticated: any}) => state.isAuthenticated,
  );
  const {showSuccess, showError} = useToast();

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [searchText, setSearchText] = useState(filters.search ?? '');

  // Keep local input in sync when filters are externally reset
  useEffect(() => {
    setSearchText(filters.search ?? '');
  }, [filters.search]);

  // Debounced search so we don't fire an API call on every keystroke
  const handleSearchChange = useCallback(
    (text: string) => {
      setSearchText(text);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      searchTimeoutRef.current = setTimeout(() => {
        changeFilter('search', text || undefined);
      }, 500);
    },
    [changeFilter],
  );

  const [selectedAstrologer, setSelectedAstrologer] =
    useState<Astrologer | null>(null);

  // Chat request state
  const [chatTargetAstrologer, setChatTargetAstrologer] = useState<any>(null);
  const [showChatRequestModal, setShowChatRequestModal] = useState(false);
  const [consultationType, setConsultationType] = useState<'chat' | 'call'>(
    'chat',
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login required modal state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalMessage, setModalMessage] = useState(
    'Please login to perform this action',
  );

  // Reuse the same auth-gate pattern as useHomeData / HomeScreen
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

  const handleCloseLoginModal = useCallback(() => {
    setShowLoginModal(false);
  }, []);

  const handleCardPress = useCallback(
    (astrologer: Astrologer) => {
      handleRestrictedAction('Please login to view astrologer profile', () => {
        setSelectedAstrologer(astrologer);
      });
    },
    [handleRestrictedAction],
  );

  const handleChatPress = useCallback(
    (astrologer: Astrologer) => {
      handleRestrictedAction('Please login to start a chat', () => {
        setConsultationType('chat');
        setChatTargetAstrologer(astrologer);
        setShowChatRequestModal(true);
      });
    },
    [handleRestrictedAction],
  );

  const handleCallPress = useCallback(
    (astrologer: Astrologer) => {
      handleRestrictedAction('Please login to start a call', () => {
        setConsultationType('call');
        setChatTargetAstrologer(astrologer);
        setShowChatRequestModal(true);
      });
    },
    [handleRestrictedAction],
  );

  const handleBackFromProfile = useCallback(() => {
    setSelectedAstrologer(null);
  }, []);

  const handleProfileChatPress = useCallback(
    (astrologer: Astrologer) => {
      handleRestrictedAction('Please login to start a chat', () => {
        setSelectedAstrologer(null);
        setConsultationType('chat');
        setChatTargetAstrologer(astrologer);
        setShowChatRequestModal(true);
      });
    },
    [handleRestrictedAction],
  );

  const handleChatRequestSubmit = useCallback(
    async (formData: ChatRequestData) => {
      if (!chatTargetAstrologer) {
        return;
      }

      setIsSubmitting(true);

      try {
        const result = await sendChatRequest({
          astrologerId: chatTargetAstrologer.id,
          astrologerName:
            chatTargetAstrologer.displayName || chatTargetAstrologer.name,
          userProfile: {
            id: user?.id || '',
            name: user?.name || '',
            mobile: user?.mobile || '',
            countryCode: user?.countryCode || '',
            profilePic: user?.profilePic || '',
            gender: user?.gender || 'male',
            birthDate: user?.dateOfBirth || '',
            birthTime: user?.birthTime || '',
            occupation: (user as any)?.occupation || '',
          },
          name: formData.name,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          placeOfBirth: formData.placeOfBirth,
          birthTime: formData.birthTime,
          occupation: '',
          consultationType: consultationType,
        });

        if (!result.success) {
          console.error('Request failed:', result.error);
          showError(
            result.error ||
              'Unable to connect with astrologer. Please try again.',
          );
          setShowChatRequestModal(false);
          setChatTargetAstrologer(null);
          return;
        }

        showSuccess('Connecting you with astrologer...');

        const {isCall} = result;

        if (isCall) {
          setShowChatRequestModal(false);
          setChatTargetAstrologer(null);

          navigation.navigate(
            'Call' as never,
            {
              callId: result.callId || `call_${Date.now()}`,
              participant: {
                id: chatTargetAstrologer.id,
                name:
                  chatTargetAstrologer.displayName || chatTargetAstrologer.name,
                image: chatTargetAstrologer.profilePic,
              },
              isIncoming: false,
            } as never,
          );
        } else {
          setShowChatRequestModal(false);

          useChatStore.getState().setSelectedAstrologer({
            id: chatTargetAstrologer.id,
            name:
              chatTargetAstrologer.displayName || chatTargetAstrologer.name,
            image: chatTargetAstrologer.profilePic,
            rating: chatTargetAstrologer.rating,
            experience: String(chatTargetAstrologer.experience),
            skills: chatTargetAstrologer.skills,
            isAvailableForChat: true,
          });

          setChatTargetAstrologer(null);
          navigation.navigate('chatCall' as never);
        }
      } catch (error: any) {
        console.error('Request error:', error);
        showError(
          error?.message ||
            'Unable to connect with astrologer. Please try again.',
        );
        setShowChatRequestModal(false);
        setChatTargetAstrologer(null);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      chatTargetAstrologer,
      user,
      consultationType,
      navigation,
      showSuccess,
      showError,
    ],
  );

  // Active-chip flags — derived from hook's filter state
  const isAllActive =
    !filters.search &&
    !filters.minRating &&
    !filters.minPrice &&
    !filters.minExperience &&
    (!filters.skills || filters.skills.length === 0);

  const isTopRatedActive =
    filters.sortField === 'RATING' && filters.sortOrder === 'DESC';

  const isPriceAscActive =
    filters.sortField === 'PRICE' && filters.sortOrder === 'ASC';

  const isMostExpActive =
    filters.sortField === 'EXPERIENCE' && filters.sortOrder === 'DESC';

  if (selectedAstrologer) {
    return (
      <AstrologerProfileScreen
        astrologer={selectedAstrologer}
        onBack={handleBackFromProfile}
        onChatPress={handleProfileChatPress}
      />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <GoBack onBack={onBack} title="All Recommended Astrologers " />

      {/* Search — wired to hook's `search` filter via debounced handler */}
      <View style={styles.searchContainer}>
        <Icon
          name="search-outline"
          size={18}
          color="#6B7280"
          library="Ionicons"
        />

        <TextInput
          value={searchText}
          onChangeText={handleSearchChange}
          placeholder="Search astrologer, skills..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />

        {searchText.length > 0 && (
          <TouchableOpacity
            onPress={() => handleSearchChange('')}
            style={styles.closeSearchBtn}>
            <Icon
              name="close-circle"
              size={20}
              color="#9CA3AF"
              library="Ionicons"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Quick Filters — chips are fully functional */}
      <View style={styles.filterRow}>
        {/* All — resets every filter + search */}
        <TouchableOpacity
          onPress={() => {
            resetFilters();
            setSearchText('');
          }}
          style={[styles.filterChip, isAllActive ? styles.activeChip : null]}>
          <Text
            style={isAllActive ? styles.activeChipText : styles.filterChipText}>
            All
          </Text>
        </TouchableOpacity>

        {/* Top Rated — sort by RATING DESC */}
        <TouchableOpacity
          onPress={() => {
            changeFilter('sortField', 'RATING');
            changeFilter('sortOrder', 'DESC');
          }}
          style={[
            styles.filterChip,
            isTopRatedActive ? styles.activeChip : null,
          ]}>
          <Text
            style={
              isTopRatedActive ? styles.activeChipText : styles.filterChipText
            }>
            Top Rated
          </Text>
        </TouchableOpacity>

        {/* Price Low to High — sort by PRICE ASC */}
        <TouchableOpacity
          onPress={() => {
            changeFilter('sortField', 'PRICE');
            changeFilter('sortOrder', 'ASC');
          }}
          style={[
            styles.filterChip,
            isPriceAscActive ? styles.activeChip : null,
          ]}>
          <Text
            style={
              isPriceAscActive ? styles.activeChipText : styles.filterChipText
            }>
            Price ↑
          </Text>
        </TouchableOpacity>

        {/* Most Experienced — sort by EXPERIENCE DESC */}
        <TouchableOpacity
          onPress={() => {
            changeFilter('sortField', 'EXPERIENCE');
            changeFilter('sortOrder', 'DESC');
          }}
          style={[
            styles.filterChip,
            isMostExpActive ? styles.activeChip : null,
          ]}>
          <Text
            style={
              isMostExpActive ? styles.activeChipText : styles.filterChipText
            }>
            Most Exp.
          </Text>
        </TouchableOpacity>
      </View>

      {/* List — data comes directly from the API; no client-side filtering */}
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({item}) => (
          <AstrologerCard
            item={item}
            style={styles.card}
            onPress={() => handleCardPress(item)}
            onChatPress={() => handleChatPress(item)}
            onCallPress={() => handleCallPress(item)}
          />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator
              size="small"
              color="#6C2BD9"
              style={styles.loader}
            />
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon
              name="sparkles-outline"
              size={44}
              color="#C4B5FD"
              library="Ionicons"
            />

            <Text style={styles.emptyTitle}>No astrologers found</Text>

            <Text style={styles.emptyText}>
              Try searching with another keyword
            </Text>
          </View>
        }
      />

      {/* Login Required Modal */}
      <LoginRequiredModal
        visible={showLoginModal}
        onClose={handleCloseLoginModal}
        message={modalMessage}
      />

      {/* Chat Request Modal */}
      <ChatRequestModal
        visible={showChatRequestModal}
        type={consultationType}
        onClose={() => {
          setShowChatRequestModal(false);
          setChatTargetAstrologer(null);
        }}
        onSubmit={handleChatRequestSubmit}
        astrologer={chatTargetAstrologer ?? undefined}
        loading={isSubmitting}
      />
    </View>
  );
};

export default AstrologerListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  searchContainer: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginHorizontal: 16,
    marginTop: 14,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: '#111827',
    fontSize: 14,
    fontWeight: '500',
  },
  closeSearchBtn: {
    paddingLeft: 6,
  },
  filterRow: {
    flexDirection: 'row',
    marginTop: 14,
    marginHorizontal: 16,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: '#F3F4F6',
  },
  activeChip: {
    backgroundColor: '#6C2BD9',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  activeChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingTop: 16,
    paddingBottom: 30,
    marginTop: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    width: '48.5%',
  },
  loader: {
    marginTop: 10,
    marginBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    paddingHorizontal: 30,
  },
  emptyTitle: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  emptyText: {
    marginTop: 6,
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 13,
    lineHeight: 20,
  },
});
