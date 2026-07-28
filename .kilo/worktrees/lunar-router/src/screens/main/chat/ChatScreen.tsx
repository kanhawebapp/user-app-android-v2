import React, {useState, useCallback, useRef, useEffect} from 'react';
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  StatusBar,
  Animated,
} from 'react-native';
import {useTheme} from '../../../theme';
import {useAuthStore} from '../../../stores/auth.store';
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

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'astrologer';
  timestamp: Date;
  read?: boolean;
  isLiked?: boolean;
}

export interface ChatScreenProps {
  astrologerName: string;
  astrologerImage?: string;
  astrologerRating?: number;
  astrologerExperience?: string;
  astrologerSkills?: string[];
  isOnline?: boolean;
  lastSeen?: string;
  userData: ChatRequestData;
  onBack: () => void;
  onEndChat: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({
  astrologerName,
  astrologerImage,
  astrologerRating = 4.8,
  astrologerExperience = '10+ years',
  astrologerSkills = ['Vedic Astrology', 'Palmistry', 'Numerology'],
  isOnline = true,
  lastSeen = 'Just now',
  userData,
  onBack,
  onEndChat,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const flatListRef = useRef<FlatList>(null);

  const user = useAuthStore(state => state.user);
  const walletBalance = user?.walletBalance || 85;

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);

  const handleEndChat = useCallback(() => {
    setShowRatingModal(true);
    // onEndChat();
  }, [onEndChat]);

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
    console.log('Navigate to astrologer list for new chat');
  }, []);

  const handleExit = useCallback(() => {
    onBack();
  }, [onBack]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: `Hello! I'm ${astrologerName}. I've received your request. Your birth details show interesting patterns. How can I help you today?`,
      sender: 'astrologer',
      timestamp: new Date(),
      read: true,
      isLiked: false,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAstroProfile, setShowAstroProfile] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(true);

  const profileAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const toggleAstroProfile = useCallback(() => {
    const toValue = showAstroProfile ? 0 : 1;
    Animated.timing(profileAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setShowAstroProfile(!showAstroProfile);
  }, [showAstroProfile, profileAnim]);

  const handleLike = useCallback((messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? {...msg, isLiked: !msg.isLiked} : msg,
      ),
    );
  }, []);

  const handleReply = useCallback(
    (message: ChatMessage) => {
      setInputText(
        `@${message.sender === 'user' ? astrologerName : 'You'}: ${
          message.text
        }\n`,
      );
    },
    [astrologerName],
  );

  const sendMessage = useCallback(() => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
      read: false,
      isLiked: false,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const astroMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your message. Let me analyze this for you...',
        sender: 'astrologer',
        timestamp: new Date(),
        read: true,
        isLiked: false,
      };
      setMessages(prev => [...prev, astroMessage]);
    }, 1500);
  }, [inputText]);

  const renderMessage = useCallback(
    ({item}: {item: ChatMessage}) => (
      <MessageBubble
        item={item}
        astrologerName={astrologerName}
        astrologerImage={astrologerImage}
        onLike={handleLike}
        onReply={handleReply}
        isLiked={item.isLiked}
      />
    ),
    [astrologerName, astrologerImage, handleLike, handleReply],
  );

  const heightInterpolate = profileAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 140],
  });

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
        showProfile={showAstroProfile}
        onBack={onBack}
        onToggleProfile={toggleAstroProfile}
        onEndChat={handleEndChat}
        pulseAnim={pulseAnim}
      />

      <AstrologerProfile
        astrologerName={astrologerName}
        astrologerImage={astrologerImage}
        astrologerRating={astrologerRating}
        astrologerExperience={astrologerExperience}
        astrologerSkills={astrologerSkills}
        heightInterpolate={heightInterpolate}
      />

      <UserInfoBar
        userData={userData}
        isExpanded={showUserInfo}
        onToggle={() => setShowUserInfo(!showUserInfo)}
      />

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
        onInputChange={setInputText}
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
