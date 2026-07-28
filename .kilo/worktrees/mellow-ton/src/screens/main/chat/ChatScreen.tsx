import React, {useState, useCallback, useRef, useEffect} from 'react';
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  StatusBar,
  Animated,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from '../../../theme';
import {useAuthStore} from '../../../stores/auth.store';
import {socketService} from '../../../services/socket/socket.service';
import {SOCKET_EVENTS} from '../../../services/socket/socket.events';
import {useChatStore} from '../../../services/chat/chat.store';
import {navigate, goBack} from '../../../services/navigation/NavigationService';
import {
  ChatRequestData,
  RatingModal,
  ThankYouModal,
} from '../../../components/Modal';
import {
  ChatHeader,
  AstrologerProfile,
  UserInfoBar,
  MessageBubble,
  TypingIndicator,
  ChatInput,
} from './components';
import RechargePaymentModal from './screens/RechargePaymentModal';
import {useRechargePacks} from '../../../services/api/recharge/recharge.hooks';
import {RechargePack} from '../../../services/api/recharge/recharge.types';
import {useRechargeOrder} from '../../../services/api/recharge/recharge.order.hooks';
import {openRazorpayCheckout} from '../../../services/api/recharge/razorpay.service';
import {useProfile} from '../../../services/api/profile/profile.hooks';

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'astrologer';
  timestamp: Date;
  read?: boolean;
  isLiked?: boolean;
  status?: 'sending' | 'sent' | 'delivered' | 'failed';
}

export interface ChatScreenProps {
  astrologerName?: string;
  astrologerImage?: string;
  astrologerRating?: number;
  astrologerExperience?: string;
  astrologerSkills?: string[];
  isOnline?: boolean;
  lastSeen?: string;
  userData: ChatRequestData;
  onBack?: () => void;
  onEndChat?: () => void;
  initialMessage?: string;
}

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
  onEndChat: propOnEndChat,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const flatListRef = useRef<FlatList>(null);

  const user = useAuthStore(state => state.user);
  const walletBalance = user?.walletBalance || 85;

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);

  const storeRoomId = useChatStore(state => state.roomId);
  const chatRoom = useChatStore(state => state.chatRoom);
  const chatStatus = useChatStore(state => state.chatStatus);
  const storeMessages = useChatStore(state => state.messages);
  const typingStatus = useChatStore(state => state.typingStatus);
  const timeLeft = useChatStore(state => state.timeLeft);
  const startChatTimer = useChatStore(state => state.startChatTimer);
  const stopChatTimer = useChatStore(state => state.stopChatTimer);
  const setTimeLeft = useChatStore(state => state.setTimeLeft);
  const setIsChatTimerStarted = useChatStore(
    state => state.setIsChatTimerStarted,
  );
  const chatDuration = useChatStore(state => state.chatDuration);
  const userId = user?.id;
  // const showRechargeModal = useChatStore(state => state.showRechargeModal);

  const isRechargeInProgress = useChatStore(
    state => state.isRechargeInProgress,
  );
  const hasRechargeTriggered = useChatStore(
    state => state.hasRechargeTriggered,
  );
  const setShowRechargeModal = useChatStore(
    state => state.setShowRechargeModal,
  );
  const setRechargeInProgress = useChatStore(
    state => state.isRechargeInProgress,
  );
  const setHasRechargeTriggered = useChatStore(
    state => state.hasRechargeTriggered,
  );

  const roomId = storeRoomId || '';
  const astrologerName =
    chatRoom?.astrologerName || propAstrologerName || 'Astrologer';
  const astrologerImage = chatRoom?.astrologerId
    ? propAstrologerImage
    : propAstrologerImage;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const {data, loading} = useRechargePacks();

  // console.log('pack list data', data);

  const socket = socketService.getSocket();
  const profileAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const joinedRef = useRef(false);
  const listenersRegisteredRef = useRef(false);

  useEffect(() => {
    if (!roomId || !socket || joinedRef.current) {
      return;
    }

    const roomIdStr = String(roomId);
    if (!roomIdStr || roomIdStr === 'undefined' || roomIdStr === 'null') {
      console.warn('[ChatScreen] Invalid roomId, not joining:', roomId);
      return;
    }

    joinedRef.current = true;
    console.log('[ChatScreen] Joining chat room with roomId:', roomId);

    (socket as any).emit(SOCKET_EVENTS.JOIN_CHAT, {
      room_id: roomIdStr,
      username: 'customer',
      joinpersonid: userId || 'unknown',
    });

    return () => {
      joinedRef.current = false;
    };
  }, [socket, roomId, userId]);
  // console.log('time left in useEffect', timeLeft);

  const [showRechargeModal, setRechargeModal] = useState(false);
  const [hasShownRecharge, setHasShownRecharge] = useState(false);

  useEffect(() => {
    if (timeLeft <= 60 && !hasShownRecharge) {
      console.log('Time reached 60 seconds, opening recharge modal');

      setRechargeModal(true);
      setHasShownRecharge(true); // 👈 ensures only once
    }
  }, [timeLeft, hasShownRecharge]);

  useEffect(() => {
    if (!socket || !roomId || listenersRegisteredRef.current) {
      return;
    }

    listenersRegisteredRef.current = true;

    const handleReceiveMessage = (data: any) => {
      if (!data) return;

      const messageRoomId = data?.roomId || data?.room_id || data?.roomid;
      if (messageRoomId && messageRoomId !== roomId) {
        return;
      }

      console.log('[ChatScreen] Received message:', data);

      const messageId =
        data?.msg_id || data?.id || data?.messageId || Date.now().toString();
      let messageText = data?.message;
      if (typeof messageText === 'object' && messageText !== null) {
        messageText = (messageText as any).message;
      }

      if (!messageText) return;

      const message: ChatMessage = {
        id: messageId,
        text: messageText,
        sender: data?.sender === 'user' ? 'user' : 'astrologer',
        timestamp: new Date(data?.time || data?.timestamp || Date.now()),
        read: data?.sender === 'astrologer',
        isLiked: false,
        status: 'delivered',
      };

      setMessages(prev => {
        if (prev.some(m => m.id === message.id)) return prev;
        return [...prev, message];
      });
    };

    const handleTyping = (data: any) => {
      if (!data) return;
      const messageRoomId = data?.roomId || data?.room_id || data?.roomid;
      if (messageRoomId && messageRoomId !== roomId) return;

      if (data?.senderType === 'astrologer' || data?.sender === 'astrologer') {
        setIsTyping(data?.isTyping ?? data?.typing ?? false);
      }
    };

    socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE);
    socket.off(SOCKET_EVENTS.TYPING_STATUS);
    (socket as any).off('receive_message');
    (socket as any).off('typing');

    (socket as any).on(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceiveMessage);
    (socket as any).on('receive_message', handleReceiveMessage);
    (socket as any).on(SOCKET_EVENTS.TYPING_STATUS, handleTyping);
    (socket as any).on('typing', handleTyping);

    return () => {
      listenersRegisteredRef.current = false;
      socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceiveMessage);
      socket.off(SOCKET_EVENTS.TYPING_STATUS, handleTyping);
    };
  }, [socket, roomId]);

  useEffect(() => {
    if (!socket || !roomId) {
      return;
    }

    const handleRechargeCompleted = (data: any) => {
      if (!data) return;

      const dataRoomId = data?.roomId;
      if (dataRoomId && dataRoomId !== roomId) {
        return;
      }

      console.log('[ChatScreen] Recharge completed:', data);

      setRechargeModal(false);
      setHasShownRecharge(false);

      const duetime = data?.duetime;
      if (duetime && typeof duetime === 'number') {
        const parsedTime = parseInt(String(duetime), 10);
        if (parsedTime > 0) {
          setTimeLeft(parsedTime);
        }
      }
    };

    const handleRechargeFailed = (data: any) => {
      if (!data) return;

      const dataRoomId = data?.roomId;
      if (dataRoomId && dataRoomId !== roomId) {
        return;
      }

      console.log('[ChatScreen] Recharge failed:', data);

      setRechargeModal(false);
    };

    (socket as any).off('recharge_complted', handleRechargeCompleted);
    (socket as any).off('customer_recharge_fail', handleRechargeFailed);

    (socket as any).on('recharge_complted', handleRechargeCompleted);
    (socket as any).on('customer_recharge_fail', handleRechargeFailed);

    return () => {
      (socket as any).off('recharge_complted', handleRechargeCompleted);
      (socket as any).off('customer_recharge_fail', handleRechargeFailed);
    };
  }, [socket, roomId, setTimeLeft, setRechargeModal, setHasShownRecharge]);

  useEffect(() => {
    if (chatStatus === 'completed' || chatStatus === 'rejected') {
      setShowRatingModal(true);
    }
  }, [chatStatus]);

  useEffect(() => {
    if (chatStatus === 'active') {
      setTimeLeft(chatDuration);
      setIsChatTimerStarted(true);
      startChatTimer();
    }

    return () => {
      stopChatTimer();
    };
  }, [
    chatStatus,
    chatDuration,
    setTimeLeft,
    setIsChatTimerStarted,
    startChatTimer,
    stopChatTimer,
  ]);

  const handleInputChange = useCallback(
    (text: string) => {
      setInputText(text);

      if (socket && roomId && text.length > 0) {
        socket.emit(SOCKET_EVENTS.TYPING, {
          roomId,
          isTyping: true,
        });
      }
    },
    [socket, roomId],
  );

  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToEnd({animated: true});
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages]);
  const {createOrder, loading: orderLoading} = useRechargeOrder();
  const {profile} = useProfile();

  const handleEndChat = useCallback(() => {
    setShowRatingModal(true);
  }, []);

  const handleRatingSubmit = useCallback(
    (_rating: number, _feedback?: string) => {
      setShowRatingModal(false);
      setTimeout(() => {
        setShowThankYouModal(true);
      }, 300);
    },
    [],
  );

  const handleRecharge = useCallback(() => {
    console.log('Navigate to recharge wallet');
  }, []);

  const handleChatAgain = useCallback(() => {
    useChatStore.getState().reset();
    setShowThankYouModal(false);
    goBack();
  }, []);

  const handleExit = useCallback(() => {
    useChatStore.getState().reset();
    setShowThankYouModal(false);
    navigate('Home');
  }, []);

  const sendMessage = useCallback(() => {
    if (!inputText.trim() || !roomId || !user || !socket) return;

    const roomIdStr = String(roomId);
    if (!roomIdStr || roomIdStr === 'undefined' || roomIdStr === 'null') {
      console.warn('[ChatScreen] Cannot send message: invalid roomId');
      return;
    }

    const messageId = generateId();
    const userMessage: ChatMessage = {
      id: messageId,
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
      read: false,
      isLiked: false,
      status: 'sending',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    const payload = {
      room_id: roomIdStr,
      msg_id: messageId,
      sender_id: userId || 'unknown',
      received_id: chatRoom?.astrologerId || '',
      sender: 'user',
      message: inputText.trim(),
      time: new Date().toISOString(),
    };

    (socket as any).emit(SOCKET_EVENTS.SEND_MESSAGE, {
      roomId: roomIdStr,
      message: inputText.trim(),
      messageId,
    });

    (socket as any).emit('send_message', payload);

    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? {...msg, status: 'sent'} : msg,
        ),
      );
    }, 500);
  }, [inputText, roomId, user, socket, userId, chatRoom?.astrologerId]);

  const handleBack = useCallback(() => {
    if (propOnBack) {
      propOnBack();
    } else {
      goBack();
    }
  }, [propOnBack]);

  const handleEndChatPress = useCallback(() => {
    if (propOnEndChat) {
      propOnEndChat();
    } else {
      setShowRatingModal(true);
    }
  }, [propOnEndChat]);

  const renderMessage = useCallback(
    ({item}: {item: ChatMessage}) => (
      <MessageBubble
        item={item}
        astrologerName={astrologerName}
        astrologerImage={astrologerImage}
        onLike={() => {}}
        onReply={() => {}}
        isLiked={item.isLiked}
      />
    ),
    [astrologerName, astrologerImage],
  );

  const heightInterpolate = profileAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 140],
  });

  useEffect(() => {
    if (messages.length === 0 && chatStatus === 'active') {
      const greeting: ChatMessage = {
        id: 'greeting',
        text: `Hello! I'm ${astrologerName}. I've received your request. Your birth details show interesting patterns. How can I help you today?`,
        sender: 'astrologer',
        timestamp: new Date(),
        read: true,
        isLiked: false,
        status: 'delivered',
      };
      setMessages([greeting]);
    }
  }, [messages.length, chatStatus, astrologerName]);

  async function handleProceedToPay(pack: RechargePack): Promise<void> {
    // throw new Error('Function not implemented.');
    let selectedPack = pack;
    console.log('Proceeding to pay with pack:', selectedPack?.price);
    // Step 1: Create Order
    const order = await createOrder(selectedPack?.price);

    console.log('ORDER CREATED:', order);

    // Step 2: Open Razorpay (with notes)
    const paymentResult = await openRazorpayCheckout({
      order,
      user: profile,
      selectedPack,
    });

    console.log('PAYMENT SUCCESS:', paymentResult);
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, {backgroundColor: colors.background.primary}]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
        onToggleProfile={() => {}}
        onEndChat={handleEndChatPress}
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

      <UserInfoBar userData={userData} isExpanded={false} onToggle={() => {}} />

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
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
      />

      <RatingModal
        visible={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleRatingSubmit}
        astrologerName={astrologerName}
      />

      <ThankYouModal
        visible={showThankYouModal}
        onClose={() => setShowThankYouModal(false)}
        onRecharge={handleRecharge}
        onChatAgain={handleChatAgain}
        onExit={handleExit}
        walletBalance={walletBalance}
      />

      <RechargePaymentModal
        visible={showRechargeModal}
        onClose={() => setRechargeModal(false)}
        rechargePacks={Array.isArray(data) ? data : []}
        loading={loading}
        onProceed={pack => handleProceedToPay(pack)}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
    flexGrow: 1,
  },
});

export default ChatScreen;
