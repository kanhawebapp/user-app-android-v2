import {useState, useCallback, useEffect, useRef} from 'react';
import {SOCKET_EVENTS} from '../../../../services/socket/socket.events';
import {ChatMessage, ReplyToData} from '../types';
import {useChatActions} from '../../../../services/chat/chat.hooks';

interface UseChatMessagesProps {
  socket: any;
  roomId: string;
  userId?: string;
  astrologerId?: string;
  astrologerName: string;
  chatStatus: string;
}

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const useChatMessages = ({
  socket,
  roomId,
  userId,
  astrologerId,
  astrologerName,
  chatStatus,
}: UseChatMessagesProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [replyTo, setReplyTo] = useState<ReplyToData | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Add a message to the list
  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => {
      if (prev.some(m => m.id === message.id)) {
        return prev;
      }
      return [...prev, message];
    });
  }, []);

  // console.log('room iddd=-=-==-=-=-=-====', roomId);

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Greeting message when chat becomes active
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

  // Input change handler with typing indicator
  const handleInputChange = useCallback(
    (text: string) => {
      setInputText(text);

      if (!socket || !roomId) {
        return;
      }

      socket.emit('typing', {
        room_id: roomId,
        typing: text.length > 0,
        user_name: 'User',
      });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing', {
          room_id: roomId,
          typing: false,
          user_name: 'User',
        });
      }, 2000);
    },
    [socket, roomId],
  );

  // Send message handler
  const sendMessage = useCallback(
    (payload: {text?: string; image?: string | null}) => {
      if (!roomId || !userId || !socket) {
        return;
      }

      const {text = '', image = null} = payload;

      if (!text.trim() && !image) {
        return;
      } // 🔥 IMPORTANT

      const messageId = generateId();

      const userMessage: ChatMessage = {
        id: messageId,
        text: text,
        sender: 'user',
        timestamp: new Date(),
        read: false,
        isLiked: false,
        status: 'sending',
        replyTo: replyTo,
        image: image || null,
      };

      setMessages(prev => [...prev, userMessage]);
      setInputText('');
      setReplyTo(null);

      const payloadToSend = {
        room_id: String(roomId),
        msg_id: messageId,
        sender_id: userId,
        received_id: astrologerId || '',
        sender: 'user',
        message: text,
        image: image,
        time: new Date().toISOString(),
        replyTo: replyTo,
      };

      // 🔥 BOTH EVENTS (as your backend expects)
      console.log('Emitting send_message with payload:', payloadToSend);
      socket.emit('send_message', payloadToSend);

      setTimeout(() => {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === messageId ? {...msg, status: 'sent'} : msg,
          ),
        );
      }, 500);
    },
    [roomId, userId, socket, astrologerId, replyTo],
  );

  // Reply press handler
  const handleReplyPress = useCallback(
    (message: ChatMessage) => {
      setReplyTo({
        sender: message.sender === 'user' ? 'You' : astrologerName,
        message: message.text,
        image: message.image || null, // 🔥 IMPORTANT (image reply fix)
      });
    },
    [astrologerName],
  );

  return {
    messages,
    inputText,
    setInputText,
    replyTo,
    setReplyTo,
    isTyping,
    setIsTyping,
    addMessage,
    clearMessages,
    sendMessage,
    handleInputChange,
    handleReplyPress,
  };
};
