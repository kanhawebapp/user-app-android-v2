import React, {useEffect, useCallback, useRef} from 'react';
import {useTheme} from '../../../../theme';
import {useChatStore} from '../../../../services/chat/chat.store';
import {
  useChatSocket,
  useSendMessage,
  useTypingIndicator,
  useChatActions,
  useChatTimer,
} from '../../../../services/chat/chat.hooks';
import {useSocket} from '../../../../services/socket/socket.context';
import {ChatRequestData} from '../../../../components/Modal/ChatRequestModal';
import ChatScreen from './ChatScreen';

interface ChatScreenWrapperProps {
  astrologerName: string;
  astrologerImage?: string;
  astrologerRating?: number;
  astrologerExperience?: string;
  astrologerSkills?: string[];
  initialMessage?: string;
  onBack: () => void;
  onEndChat: () => void;
}

interface WrappedMessage {
  id: string;
  text: string;
  sender: 'user' | 'astrologer';
  timestamp: Date;
  read?: boolean;
  isLiked?: boolean;
}

export const ChatScreenWrapper: React.FC<ChatScreenWrapperProps> = ({
  astrologerName,
  astrologerImage,
  astrologerRating,
  astrologerExperience,
  astrologerSkills,
  initialMessage,
  onBack,
  onEndChat,
}) => {
  const theme = useTheme();
  const {socket} = useSocket();

  const {messages, typingStatus, chatStatus, chatRoom, timer} = useChatStore();
  const {sendMessage: sendSocketMessage} = useSendMessage();
  const {startTyping, stopTyping} = useTypingIndicator();
  const {joinChat, leaveChat, completeChat} = useChatActions();
  const {formattedTime} = useChatTimer();

  const flatListRef = useRef<any>(null);

  useChatSocket(socket);

  useEffect(() => {
    if (chatStatus === 'active' && socket) {
      joinChat();
    }
  }, [chatStatus, socket, joinChat]);

  useEffect(() => {
    if (chatStatus === 'completed') {
      onEndChat();
    }
  }, [chatStatus, onEndChat]);

  const handleSendMessage = useCallback(
    (text: string): boolean => {
      return sendSocketMessage(text);
    },
    [sendSocketMessage],
  );

  const handleTyping = useCallback(
    (isTyping: boolean) => {
      if (isTyping) {
        startTyping();
      } else {
        stopTyping();
      }
    },
    [startTyping, stopTyping],
  );

  const handleEndChatRequest = useCallback(() => {
    completeChat();
    onEndChat();
  }, [completeChat, onEndChat]);

  const handleBackPress = useCallback(() => {
    leaveChat();
    onBack();
  }, [leaveChat, onBack]);

  const mappedMessages: WrappedMessage[] = messages.map(msg => ({
    id: msg.id,
    text: msg.message,
    sender: msg.senderType,
    timestamp: new Date(msg.timestamp),
    read: msg.status === 'delivered',
    isLiked: false,
  }));

  const userData: ChatRequestData = {
    name: '',
    gender: 'male',
    dateOfBirth: '',
    placeOfBirth: '',
    birthTime: '',
  };

  return (
    <ChatScreen
      astrologerName={chatRoom?.astrologerName || astrologerName}
      astrologerImage={astrologerImage}
      astrologerRating={astrologerRating}
      astrologerExperience={astrologerExperience}
      astrologerSkills={astrologerSkills}
      userData={userData}
      onBack={handleBackPress}
      onEndChat={handleEndChatRequest}
    />
  );
};
