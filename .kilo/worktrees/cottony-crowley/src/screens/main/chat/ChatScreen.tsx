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
import {useChatActions} from '../../../services/chat/chat.hooks';

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export interface ReplyToData {
  sender: string;
  message: string;
  image?: string | null;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'astrologer';
  timestamp: Date;
  read?: boolean;
  isLiked?: boolean;
  status?: 'sending' | 'sent' | 'delivered' | 'failed';
  replyTo?: ReplyToData | null;
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
  const [isUserInfoExpanded, setIsUserInfoExpanded] = useState(false);
  const ratingModalShownRef = useRef(false);

  const storeRoomId = useChatStore(state => state.roomId);
  const chatRoom = useChatStore(state => state.chatRoom);
  const chatStatus = useChatStore(state => state.chatStatus);
  const prevChatStatusRef = useRef(chatStatus);
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

  // console.log("userDatauserDatauserData",userData)

  const roomId = storeRoomId || '';
  const astrologerName =
    chatRoom?.astrologerName || propAstrologerName || 'Astrologer';
  const astrologerImage = chatRoom?.astrologerId
    ? propAstrologerImage
    : propAstrologerImage;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [replyTo, setReplyTo] = useState<ReplyToData | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const {data, loading} = useRechargePacks();

  const {cancelChatRequest, leaveChat} = useChatActions();

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
      setHasShownRecharge(true);

      if (socket && roomId) {
        console.log('[EMIT] customer_recharge');
        (socket as any).emit('customer_recharge', {
          roomId: roomId,
          userId: userId,
        });
      }
    }
  }, [timeLeft, hasShownRecharge, socket, roomId, userId]);

  //new
  useEffect(() => {
    if (!socket || !roomId) return;

    console.log('[Socket] Listening for CHAT_COMPLETED');

    const handleChatCompleted = (data: any) => {
      if (!data) return;

      const dataRoomId = data?.roomId || data?.room_id || data?.roomid;

      if (dataRoomId && dataRoomId !== roomId) return;

      console.log('[CHAT COMPLETED - BOTH SIDE SYNC]', data);

      // ✅ timer stop
      stopChatTimer();

      // ✅ typing off
      setIsTyping(false);

      // ✅ store update
      useChatStore.getState().setChatStatus('completed');

      // ✅ recharge modal band
      setRechargeModal(false);

      // ✅ UI
      setShowRatingModal(true);
    };

    //  dono events handle karo
    socket.off(SOCKET_EVENTS.CHAT_COMPLETED, handleChatCompleted);
    socket.off(SOCKET_EVENTS.CHAT_COMPLETED_EVENT, handleChatCompleted);

    socket.on(SOCKET_EVENTS.CHAT_COMPLETED, handleChatCompleted);
    socket.on(SOCKET_EVENTS.CHAT_COMPLETED_EVENT, handleChatCompleted);

    return () => {
      socket.off(SOCKET_EVENTS.CHAT_COMPLETED, handleChatCompleted);
      socket.off(SOCKET_EVENTS.CHAT_COMPLETED_EVENT, handleChatCompleted);
    };
  }, [socket, roomId, stopChatTimer, setRechargeModal]);
  //end new

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

      const parseTime = (timeStr: string) => {
        if (!timeStr) return new Date();

        // Case 1: ISO string already
        if (timeStr.includes('T')) {
          return new Date(timeStr);
        }

        // Case 2: "03:14:54 PM" format
        const now = new Date();
        const [time, modifier] = timeStr.split(' ');

        if (!time || !modifier) return new Date();

        let [hours, minutes, seconds] = time.split(':').map(Number);

        if (modifier === 'PM' && hours !== 12) {
          hours += 12;
        }
        if (modifier === 'AM' && hours === 12) {
          hours = 0;
        }

        const parsed = new Date(now);
        parsed.setHours(hours || 0);
        parsed.setMinutes(minutes || 0);
        parsed.setSeconds(seconds || 0);

        return parsed;
      };

      const message: ChatMessage = {
        id: messageId,
        text: messageText,
        sender: data?.sender === 'user' ? 'user' : 'astrologer',
        // timestamp: new Date(data?.time || data?.timestamp || Date.now()),
        timestamp: parseTime(data?.time || data?.timestamp),
        read: data?.sender === 'astrologer',
        isLiked: false,
        status: 'delivered',
        replyTo: data?.replyTo || null,
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

      console.log('[Typing Event Received]', data);

      // IMPORTANT FIX
      // const isAstrologerTyping =
      //   data?.senderType === 'astrologer' ||
      //   data?.sender === 'astrologer' ||
      //   data?.user_name === 'Astrologer';
      const isAstrologerTyping = true;
      console.log('datttta', data);

      if (isAstrologerTyping && data?.user_name !== 'User') {
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

    if (!socket?.connected) {
      console.log('[Socket] Not connected yet');
      return;
    }

    console.log('[Socket] Listening for recharge events');
    console.log('[Socket] Current socket id:', socket?.id);

    const RECHARGE_SUCCESS_EVENTS = [
      'recharge_complted',
      'recharge_completed',
      'recharge_success',
    ];

    const RECHARGE_FAIL_EVENTS = ['customer_recharge_fail', 'recharge_failed'];

    const handleRechargeCompleted = (data: any) => {
      if (!data) return;

      console.log('[Recharge SUCCESS EVENT]', data);

      const dataRoomId = data?.roomId || data?.room_id || data?.roomid;
      if (dataRoomId && dataRoomId !== roomId) {
        console.warn('[Recharge] Room mismatch but still handling recharge', {
          dataRoomId,
          roomId,
        });
      }

      setRechargeModal(false);
      setHasShownRecharge(false);

      const parsedTime = parseInt(data?.duetime, 10);
      if (!isNaN(parsedTime) && parsedTime > 0) {
        setTimeLeft(parsedTime);
      }
    };

    const handleRechargeFailed = (data: any) => {
      if (!data) return;

      console.log('[Recharge FAIL EVENT]', data);

      const dataRoomId = data?.roomId || data?.room_id || data?.roomid;
      if (dataRoomId && dataRoomId !== roomId) {
        console.warn('[Recharge] Room mismatch but still handling fail', {
          dataRoomId,
          roomId,
        });
      }

      setRechargeModal(false);
    };

    RECHARGE_SUCCESS_EVENTS.forEach(event => {
      (socket as any).off(event, handleRechargeCompleted);
      (socket as any).on(event, handleRechargeCompleted);
    });

    RECHARGE_FAIL_EVENTS.forEach(event => {
      (socket as any).off(event, handleRechargeFailed);
      (socket as any).on(event, handleRechargeFailed);
    });

    (socket as any).onAny((eventName: string, eventData: any) => {
      console.log('[Socket GLOBAL DEBUG]', eventName, eventData);
    });

    return () => {
      RECHARGE_SUCCESS_EVENTS.forEach(event => {
        (socket as any).off(event, handleRechargeCompleted);
      });
      RECHARGE_FAIL_EVENTS.forEach(event => {
        (socket as any).off(event, handleRechargeFailed);
      });
    };
  }, [socket, roomId, setTimeLeft, setRechargeModal, setHasShownRecharge]);

  // useEffect(() => {
  //   const prevStatus = prevChatStatusRef.current;
  //   if (
  //     !ratingModalShownRef.current &&
  //     (chatStatus === 'completed' || chatStatus === 'rejected') &&
  //     (prevStatus === 'active' ||
  //       prevStatus === 'queued' ||
  //       prevStatus === 'waiting')
  //   ) {
  //     ratingModalShownRef.current = true;
  //     setShowRatingModal(true);
  //   }
  //   prevChatStatusRef.current = chatStatus;
  // }, [chatStatus]);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevChatStatusRef.current = chatStatus;
      return; // 🚫 skip first render
    }

    const prevStatus = prevChatStatusRef.current;

    if (
      !ratingModalShownRef.current &&
      (chatStatus === 'completed' || chatStatus === 'rejected') &&
      (prevStatus === 'active' ||
        prevStatus === 'queued' ||
        prevStatus === 'waiting')
    ) {
      ratingModalShownRef.current = true;
      setShowRatingModal(true);
    }

    prevChatStatusRef.current = chatStatus;
  }, [chatStatus]);

  useEffect(() => {
    if (chatStatus === 'active') {
      ratingModalShownRef.current = false;
      prevChatStatusRef.current = 'active';
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

  // const handleInputChange = useCallback(
  //   (text: string) => {
  //     setInputText(text);

  //     if (socket && roomId && text.length > 0) {
  //       console.log('[EMIT] typing', {roomId, isTyping: true});
  //       socket.emit(SOCKET_EVENTS.TYPING, {
  //         roomId,
  //         isTyping: true,
  //       });
  //     }
  //   },
  //   [socket, roomId],
  // );

  const typingTimeoutRef = useRef(null);

  const handleInputChange = useCallback(
    (text: string) => {
      setInputText(text);

      if (!socket || !roomId) return;

      // 🔥 START TYPING
      socket.emit('typing', {
        room_id: roomId,
        typing: text.length > 0,
        user_name: 'User',
      });

      console.log('[EMIT] typing START', {
        room_id: roomId,
        typing: text.length > 0,
      });

      // 🧠 CLEAR OLD TIMER
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // ⏱ STOP TYPING AFTER 2s
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing', {
          room_id: roomId,
          typing: false,
          user_name: 'User',
        });

        console.log('[EMIT] typing STOP', {
          room_id: roomId,
          typing: false,
        });
      }, 2000);
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
      replyTo: replyTo,
      
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setReplyTo(null);

    const payload = {
      room_id: roomIdStr,
      msg_id: messageId,
      sender_id: userId || 'unknown',
      received_id: chatRoom?.astrologerId || '',
      sender: 'user',
      message: inputText.trim(),
      image: imageUrl || null,
      time: new Date().toISOString(),
      replyTo: replyTo,
    };

    (socket as any).emit(SOCKET_EVENTS.SEND_MESSAGE, {
      roomId: roomIdStr,
      message: inputText.trim(),
      messageId,
      replyTo: replyTo,
    });

    (socket as any).emit('send_message', payload);

    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? {...msg, status: 'sent'} : msg,
        ),
      );
    }, 500);
  }, [
    inputText,
    roomId,
    user,
    socket,
    userId,
    chatRoom?.astrologerId,
    replyTo,
  ]);

  const handleBack = useCallback(() => {
    if (propOnBack) {
      propOnBack();
    } else {
      goBack();
    }
  }, [propOnBack]);

  const handleEndChatPress = useCallback(() => {
    console.log('[ChatScreen] End chat pressed', {
      chatStatus,
      roomId,
    });
    cancelChatRequest();
    // propOnEndChat();
    setShowRatingModal(true);
  }, [chatStatus, roomId, cancelChatRequest, leaveChat]);

  const handleReplyPress = useCallback(
    (message: ChatMessage) => {
      setReplyTo({
        sender: message.sender === 'user' ? 'You' : astrologerName,
        message: message.text,
        image: null,
      });
    },
    [astrologerName],
  );

  const renderMessage = useCallback(
    ({item, index}: {item: ChatMessage; index: number}) => {
      const prevMessage = messages[index - 1];
      const isGrouped = prevMessage?.sender === item.sender;

      return (
        <MessageBubble
          item={item}
          astrologerName={astrologerName}
          astrologerImage={astrologerImage}
          onLike={() => {}}
          onReply={handleReplyPress}
          isLiked={item.isLiked}
          isGrouped={isGrouped}
        />
      );
    },
    [messages, astrologerName, astrologerImage, handleReplyPress],
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
    let selectedPack = pack;
    console.log('Proceeding to pay with pack:', selectedPack?.price);

    const order = await createOrder(selectedPack?.price);
    console.log('ORDER CREATED:', order);

    try {
      const paymentResult = await openRazorpayCheckout({
        order,
        user: profile,
        selectedPack,
      });

      console.log('PAYMENT SUCCESS:', paymentResult);
      console.log('[Fallback] Closing modal after payment success');
      setRechargeModal(false);

      if (socket && roomId) {
        console.log('[EMIT] customer_recharge_completed');
        (socket as any).emit('customer_recharge_completed', {
          roomId: roomId,
          userId: userId,
        });
      }
    } catch (error) {
      console.log('PAYMENT FAILED:', error);
      if (socket && roomId) {
        console.log('[EMIT] customer_recharge_fail');
        (socket as any).emit('customer_recharge_fail', {
          roomId: roomId,
          userId: userId,
        });
      }
    }
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

      {/* <UserInfoBar userData={userData} isExpanded={false} onToggle={() => {}} /> */}

      <UserInfoBar
        userData={userData}
        isExpanded={isUserInfoExpanded}
        onToggle={() => setIsUserInfoExpanded(prev => !prev)}
      />

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({animated: true})
        }
        onLayout={() => flatListRef.current?.scrollToEnd({animated: false})}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={50}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, {color: colors.text.tertiary}]}>
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
        // <Text style={{color:'black'}}>Astro is typing...</Text>
      )}

      <ChatInput
        inputText={inputText}
        onInputChange={handleInputChange}
        onSend={sendMessage}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
        astrologerName={astrologerName}
      />

      <RatingModal
        visible={showRatingModal}
        onClose={handleExit}
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
});

export default ChatScreen;
