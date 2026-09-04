import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  StatusBar,
  Animated,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Alert,
  BackHandler,
} from 'react-native';
import { useTheme } from '../../../theme';
import { useAuthStore } from '../../../stores/auth.store';
import { useChatStore } from '../../../services/chat/chat.store';
import { API_BASE_URL } from '../../../constants/api.constants';
import { socketService } from '../../../services/socket/socket.service';
import { SOCKET_EVENTS } from '../../../services/socket/socket.events';
import { RatingModal, ThankYouModal } from '../../../components/Modal';
import {
  ChatHeader,
  AstrologerProfile,
  UserInfoBar,
  MessageBubble,
  TypingIndicator,
  ChatInput,
} from './components';
import RechargePaymentModal from './screens/RechargePaymentModal';
import { useRechargePacks } from '../../../services/api/recharge/recharge.hooks';

// Types
import { ChatScreenProps, ChatMessage } from './types';

// Custom hooks
import {
  useChatSocket,
  useChatMessages,
  useChatTimer,
  useRechargeTrigger,
  useRatingModalController,
  useChatFlow,
} from './hooks';
import { useChatActions } from '../../../services/chat/chat.hooks';

const ChatScreen: React.FC<ChatScreenProps> = ({
  astrologerName: propAstrologerName,
  astrologerImage: propAstrologerImage,
  astrologerRating = 4.8,
  astrologerExperience = '10+ years',
  astrologerSkills = ['Vedic Astrology', 'Palmistry', 'Numerology'],
  isOnline = true,
  lastSeen = 'Just now',
  userData,
  onBack: propOnBack,
  onEndChat: _onEndChat,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const flatListRef = useRef<FlatList>(null);
  const profileAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Store selectors
  const user = useAuthStore(state => state.user);
  const storeRoomId = useChatStore(state => state.roomId);
  const chatRoom = useChatStore(state => state.chatRoom);
  const chatStatus = useChatStore(state => state.chatStatus);
  const chatDuration = useChatStore(state => state.chatDuration);
  const stopChatTimer = useChatStore(state => state.stopChatTimer);
  const setChatStatus = useChatStore(state => state.setChatStatus);
  const setTimeLeft = useChatStore(state => state.setTimeLeft);
  const userPayload = useChatStore(state => state.userPayload);
  const isChatTimerStarted = useChatStore(state => state.isChatTimerStarted);
  const hasSeededChatCountdown = useChatStore(
    state => state.hasSeededChatCountdown,
  );
  const markTimerExpirationHandled = useChatStore(
    state => state.markTimerExpirationHandled,
  );
  const setPendingAutoDisconnect = useChatStore(
    state => state.setPendingAutoDisconnect,
  );

  const roomId = storeRoomId || '';
  const astrologerName =
    chatRoom?.astrologerName || propAstrologerName || 'Astrologer';
  const astrologerImage = propAstrologerImage
    ? propAstrologerImage.startsWith('http')
      ? propAstrologerImage
      : `${API_BASE_URL.DEVELOPMENT}${propAstrologerImage}`
    : propAstrologerImage;

  const { data, loading } = useRechargePacks();

  // Local UI state
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [isChatUiDismissed, setIsChatUiDismissed] = useState(false);
  const [isUserInfoExpanded, setIsUserInfoExpanded] = useState(false);
  const [showRechargeModal, setRechargeModal] = useState(false);
  const [hasShownRecharge, setHasShownRecharge] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const selectedAstrologer = useChatStore(state => state.selectedAstrologer);
  const reviewAstrologerId =
    chatRoom?.astrologerId || selectedAstrologer?.id || '';
  // Socket instance
  const socket = socketService.getSocket();

  // Message state and actions
  const {
    messages,
    inputText,
    replyTo,
    setReplyTo,
    isTyping,
    setIsTyping,
    addMessage,
    sendMessage,
    handleInputChange,
    handleReplyPress,
  } = useChatMessages({
    socket,
    roomId,
    userId: user?.id,
    astrologerId: chatRoom?.astrologerId,
    astrologerName,
    chatStatus,
  });

  // Chat flow actions
  const {
    handleBack,
    handleEndChatPress,
    handleRatingSubmit,
    handleRecharge,
    handleChatAgain,
    handleExit,
    handleProceedToPay,
  } = useChatFlow({
    onBack: propOnBack,
    onShowRatingModal: setShowRatingModal,
    onShowThankYouModal: setShowThankYouModal,
    onShowRechargeModal: setRechargeModal,
    setHasShownRecharge,
    onHideChatScreen: () => setIsChatUiDismissed(true),
  });

  const { completeChat } = useChatActions();

 const handleEndChat = useCallback(() => {
  try {
    // console.log('[ChatScreen] handleEndChat called');

    const completed = completeChat();

    // console.log('[ChatScreen] completeChat result:', completed);

    if (completed) {
      // console.log('[ChatScreen] Opening rating modal');
      setShowRatingModal(true);
    }
  } catch (error) {
    // console.error('[ChatScreen] Error ending chat:', error);
    handleBack();
  }
}, [completeChat, handleBack]);

  const confirmEndChat = useCallback(() => {
    Alert.alert('End Chat', 'Are you sure you want to end this chat?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'End Chat',
        style: 'destructive',
        onPress: handleEndChat,
      },
    ]);
  }, [handleEndChat]);

  useEffect(() => {
    const onBackPress = () => {
      if (chatStatus === 'active') {
        confirmEndChat();
        return true;
      }

      return false;
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );

    return () => subscription.remove();
  }, [chatStatus, confirmEndChat]);

  // Chat timer (provides timeLeft from store)
  const { timeLeft } = useChatTimer({
    chatStatus,
    chatDuration,
  });
// console.log('timeLeft', timeLeft);
  // Low-time recharge trigger
  useRechargeTrigger({
    timeLeft,
    socket,
    roomId,
    userId: user?.id,
    hasShownRecharge,
    setHasShownRecharge,
    setShowRechargeModal: setRechargeModal,
  });

  // Rating modal controller
  useRatingModalController({
    chatStatus,
    onShowRatingModal: setShowRatingModal,
  });

  // Socket event listeners
  useChatSocket({
    roomId,
    userId: user?.id,
    onReceiveMessage: addMessage,
    onTyping: setIsTyping,
    onChatCompleted: () => {
      stopChatTimer();
      setIsTyping(false);
      setChatStatus('completed');
      setRechargeModal(false);
    },
    onRechargeSuccess: parsedTime => {
      setRechargeModal(false);
      setHasShownRecharge(true);
      if (!isNaN(parsedTime) && parsedTime > 0) {
        setTimeLeft(parsedTime);
      }
    },
    onRechargeFail: () => {
      setRechargeModal(false);
    },
  });

  // Trigger AUTO_DISCONNECT when the chat time duration/timer expires.
  // Expiration is based on wall-clock remaining time (timeLeft === 0 after
  // syncing from chatTimerEndsAt), not on socket connectivity.
  useEffect(() => {
    if (
      timeLeft !== 0 ||
      !hasSeededChatCountdown ||
      !isChatTimerStarted ||
      chatStatus !== 'active'
    ) {
      return;
    }

    if (!markTimerExpirationHandled()) {
      return;
    }

    const emitted = socketService.emit(SOCKET_EVENTS.AUTO_DISCONNECT, {
      room_id: roomId,
      astroid: userPayload?.astro_id,
      type: 'chat',
    });
    console.log(
      '[ChatScreen] Chat timer expired, AUTO_DISCONNECT emitted:',
      emitted,
    );

    if (!emitted) {
      setPendingAutoDisconnect(true);
    }

    handleEndChat();
  }, [
    timeLeft,
    hasSeededChatCountdown,
    isChatTimerStarted,
    chatStatus,
    roomId,
    userPayload,
    markTimerExpirationHandled,
    setPendingAutoDisconnect,
    handleEndChat,
  ]);

  // console.log('selectedImage', selectedImage);
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  const renderMessage = useCallback(
    ({ item, index }: { item: ChatMessage; index: number }) => {
      const prevMessage = messages[index - 1];
      const isGrouped = prevMessage?.sender === item.sender;

      return (
        <MessageBubble
          item={item}
          astrologerName={astrologerName}
          astrologerImage={astrologerImage}
          onLike={() => { }}
          onReply={handleReplyPress}
          isLiked={item.isLiked}
          isGrouped={isGrouped}
          onImagePress={url => setSelectedImage(url)}
        />
      );
    },
    [messages, astrologerName, astrologerImage, handleReplyPress],
  );

  const heightInterpolate = profileAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 140],
  });

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
      keyboardVerticalOffset={0}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background.primary}
      />

      <ChatHeader
        astrologerName={astrologerName}
        astrologerImage={astrologerImage}
        astrologerRating={astrologerRating}
        isOnline={isOnline}
        lastSeen={lastSeen}
        showProfile={false}
        onBack={handleBack}
        onToggleProfile={() => { }}
        onEndChat={confirmEndChat}
        // onEndChat={completeChat}
        pulseAnim={pulseAnim}
        timeLeft={timeLeft}
      />

      <AstrologerProfile
        astrologerName={astrologerName}
        astrologerImage={astrologerImage}
        astrologerRating={astrologerRating}
        astrologerExperience={astrologerExperience}
        astrologerSkills={astrologerSkills}
        heightInterpolate={heightInterpolate}
      />

      {/* <UserInfoBar
        userData={userData}
        isExpanded={isUserInfoExpanded}
        onToggle={() => setIsUserInfoExpanded(prev => !prev)}
      /> */}

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={50}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
              Start your conversation...
            </Text>
          </View>
        }
      />

      {isTyping && (
        <TypingIndicator
          astrologerName={astrologerName}
          astrologerImage={astrologerImage}
          pulseAnim={pulseAnim}
        />
      )}

      <ChatInput
        inputText={inputText}
        onInputChange={handleInputChange}
        onSend={sendMessage}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />

      {isChatUiDismissed && (
        <View
          style={[
            StyleSheet.absoluteFillObject,
            styles.chatDismissOverlay,
            {backgroundColor: colors.background.primary},
          ]}
          pointerEvents="auto"
        />
      )}

      <RatingModal
        visible={showRatingModal}
        onClose={handleExit}
        onSubmit={handleRatingSubmit}
        astrologerName={astrologerName}
        // astrologerId={chatRoom?.astrologerId}
        astrologerId={reviewAstrologerId}
        userName={user?.name}
      />

      <ThankYouModal
        visible={showThankYouModal}
        onClose={() => setShowThankYouModal(false)}
        onRecharge={handleRecharge}
        onChatAgain={handleChatAgain}
        onExit={handleExit}
      // walletBalance={balanceCoins || 85}
      // walletBalance={user?.walletBalance || 85}
      />

      <RechargePaymentModal
        visible={showRechargeModal}
        onClose={() => setRechargeModal(false)}
        rechargePacks={Array.isArray(data) ? data : []}
        loading={loading}
        onProceed={pack => handleProceedToPay(pack)}
      />
      <Modal
        visible={!!selectedImage}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}>
        <View style={styles.modalContainer}>
          {/* CLOSE BUTTON */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedImage(null)}>
            {/* <Icon name="close" size={28} color="#fff" /> */}
            <Text style={styles.closeIcon}>X</Text>
          </TouchableOpacity>

          {/* IMAGE */}
          <TouchableWithoutFeedback onPress={() => setSelectedImage(null)}>
            <Image
              source={{ uri: selectedImage! }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  chatDismissOverlay: {
    zIndex: 10,
    elevation: 10,
  },
  messagesList: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 15,
    fontStyle: 'italic',
    opacity: 0.6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },

  fullImage: {
    width: '100%',
    height: '80%',
  },

  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  closeIcon: {
    fontSize: 18,
    color: '#000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'transparent',
  },
});

export default ChatScreen;
