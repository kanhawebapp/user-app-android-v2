import { useEffect, useRef, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { useChatStore } from './chat.store';
import { SOCKET_EVENTS } from '../socket/socket.events';
import { socketService } from '../socket/socket.service';
import { ChatMessage } from '../socket/socket.types';

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

let typingTimeout: NodeJS.Timeout | null = null;

export const useChatSocket = (socket: Socket | null) => {
  const registeredRef = useRef(false);
  const handlersRef = useRef<{
    handleChatRejected: (data: {roomId?: string; reason?: string}) => void;
    handleReceiveMessage: (data: ChatMessage) => void;
    handleTypingStatus: (data: {
      roomId?: string;
      isTyping?: boolean;
      senderType?: string;
    }) => void;
    handleLeaveChat: (data: {roomId?: string; reason?: string}) => void;
    handleUserDisconnected: (data: {
      roomId?: string;
      userType?: string;
    }) => void;
    handleError: (data: {message?: string}) => void;
  } | null>(null);

  const {
    roomId,
    setChatStatus,
    addMessage,
    setTypingStatus,
    setIsConnected,
    setError,
  } = useChatStore();

  const registerListeners = useCallback(() => {
    if (!socket || registeredRef.current) {
      return;
    }

    registeredRef.current = true;

    socket.on(SOCKET_EVENTS.CONNECT, () => {
      console.log('[ChatSocket] Connected:', socket.id);
      setIsConnected(true);
    });

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log('[ChatSocket] Disconnected');
      setIsConnected(false);
    });

    // QUEUE_POSITION / QUEUE_UPDATE / CHAT_ACCEPTED are owned by SocketService
    // global listeners. Registering them here caused duplicate acceptance paths
    // and blanket socket.off() on unmount stripped the global handlers.

    const handleChatRejected = (data: {
      roomId?: string;
      reason?: string;
    }) => {
      console.log('[ChatSocket] Chat rejected:', data.roomId, roomId);
      if (data.roomId === roomId) {
        setChatStatus('rejected');
        setError(data.reason || 'Chat request was rejected');
      }
    };

    const handleReceiveMessage = (data: ChatMessage) => {
      console.log('[ChatSocket] Received message:', data);
      if (data.roomId === roomId) {
        addMessage({
          ...data,
          status: 'delivered',
        });
      }
    };

    const handleTypingStatus = (data: {
      roomId?: string;
      isTyping?: boolean;
      senderType?: string;
    }) => {
      console.log('[ChatSocket] Typing status:', data);
      if (data.roomId === roomId) {
        setTypingStatus({
          isTyping: !!data.isTyping,
          senderType: data.senderType as any,
        });
      }
    };

    const handleLeaveChat = (data: {
      roomId?: string;
      roomid?: string;
      room_id?: string;
      reason?: string;
    }) => {
      console.log('[ChatSocket] Leave chat:', data);
      const incomingRoomId =
        data?.roomId || data?.roomid || data?.room_id || null;
      const currentRoomId = roomId ? String(roomId) : null;
      if (
        incomingRoomId &&
        currentRoomId &&
        String(incomingRoomId) !== currentRoomId
      ) {
        return;
      }
      if (!currentRoomId && !incomingRoomId) {
        return;
      }
      setChatStatus('completed');
      setError(data.reason || 'Chat ended by astrologer');
    };

    const handleUserDisconnected = (data: {
      roomId?: string;
      userType?: string;
    }) => {
      console.log('[ChatSocket] User disconnected:', data);
      if (data.roomId === roomId) {
        setError(
          `${
            data.userType === 'astrologer' ? 'Astrologer' : 'User'
          } disconnected`,
        );
      }
    };

    const handleError = (data: {message?: string}) => {
      console.log('[ChatSocket] Error:', data);
      setError(data.message || 'Socket error');
    };

    handlersRef.current = {
      handleChatRejected,
      handleReceiveMessage,
      handleTypingStatus,
      handleLeaveChat,
      handleUserDisconnected,
      handleError,
    };

    socket.on(SOCKET_EVENTS.CHAT_REJECTED, handleChatRejected);
    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceiveMessage);
    socket.on(SOCKET_EVENTS.TYPING_STATUS, handleTypingStatus);
    socket.on(SOCKET_EVENTS.LEAVE_CHAT_EVENT, handleLeaveChat);
    socket.on(SOCKET_EVENTS.USER_DISCONNECTED, handleUserDisconnected);
    socket.on(SOCKET_EVENTS.ERROR, handleError);

    console.log('[ChatSocket] Listeners registered');
  }, [
    socket,
    roomId,
    setChatStatus,
    addMessage,
    setTypingStatus,
    setIsConnected,
    setError,
  ]);

  useEffect(() => {
    if (socket) {
      registerListeners();
    }

    return () => {
      if (socket && registeredRef.current) {
        const handlers = handlersRef.current;
        // Only remove this hook's handlers — never blanket-off global events.
        if (handlers) {
          socket.off(SOCKET_EVENTS.CHAT_REJECTED, handlers.handleChatRejected);
          socket.off(
            SOCKET_EVENTS.RECEIVE_MESSAGE,
            handlers.handleReceiveMessage,
          );
          socket.off(SOCKET_EVENTS.TYPING_STATUS, handlers.handleTypingStatus);
          socket.off(SOCKET_EVENTS.LEAVE_CHAT_EVENT, handlers.handleLeaveChat);
          socket.off(
            SOCKET_EVENTS.USER_DISCONNECTED,
            handlers.handleUserDisconnected,
          );
          socket.off(SOCKET_EVENTS.ERROR, handlers.handleError);
          handlersRef.current = null;
        }
        registeredRef.current = false;
        console.log('[ChatSocket] Listeners cleaned up');
      }
    };
  }, [socket, registerListeners]);

  return { registerListeners };
};

export const useSendMessage = () => {
  const { roomId, chatStatus, addMessage } = useChatStore();

  const sendMessage = useCallback(
    (text: string): boolean => {
      if (!roomId || chatStatus !== 'active') {
        console.warn('[SendMessage] Cannot send: no room or not active');
        return false;
      }

      const messageId = generateId();
      const message: ChatMessage = {
        id: messageId,
        roomId,
        senderId: 'user',
        senderType: 'user',
        message: text,
        timestamp: Date.now(),
        status: 'sending',
      };

      addMessage(message);

      const success = socketService.emit(SOCKET_EVENTS.SEND_MESSAGE, {
        roomId,
        message: text,
        messageId,
      });

      if (!success) {
        console.warn('[SendMessage] Failed to emit');
      }

      return success;
    },
    [roomId, chatStatus, addMessage],
  );

  return { sendMessage };
};

export const useTypingIndicator = () => {
  const { roomId, chatStatus } = useChatStore();

  const handleTyping = useCallback(
    (isTyping: boolean) => {
      if (!roomId || chatStatus !== 'active') {
        return;
      }

      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      socketService.emit(SOCKET_EVENTS.TYPING, { roomId, isTyping });

      if (isTyping) {
        typingTimeout = setTimeout(() => {
          socketService.emit(SOCKET_EVENTS.TYPING, { roomId, isTyping: false });
        }, 3000);
      }
    },
    [roomId, chatStatus],
  );

  const startTyping = useCallback(() => {
    handleTyping(true);
  }, [handleTyping]);

  const stopTyping = useCallback(() => {
    handleTyping(false);
  }, [handleTyping]);

  return { startTyping, stopTyping };
};

// export const autoCallReject = useCallback((room_id: any, astro_id: any) => {

//   socketService.emit("autodisconnect", {
//     room_id: room_id,
//     astroid: astro_id,
//     type: 'call',
//   });
// }, []);
// export const autoCallReject = (room_id: any, astro_id: any) => {
//   return socketService.emit('autodisconnect', {
//     room_id,
//     astroid: astro_id,
//     type: 'call',
//   });
// };

export const useChatActions = () => {
  const { roomId } = useChatStore();

  const joinChat = useCallback((): boolean => {
    if (!roomId) {
      console.warn('[ChatActions] No roomId to join');
      return false;
    }

    console.log('[ChatActions] Joining chat:', roomId);
    return socketService.emit(SOCKET_EVENTS.JOIN_CHAT, { roomId });
  }, [roomId]);



 const cancelChatRequest = useCallback(
  ({
    roomId,
    astroId,
    userId,
    type,
  }: {
    roomId?: string;
    astroId?: string;
    userId?: string;
    type?: string;
  }): boolean => {
    if (!roomId) {
      console.warn('[ChatActions] No roomId to cancel');
      return false;
    }

    const payload = {
      room_id: roomId,
      astroid: astroId,
      user_id: userId,
      type: type || 'chat',
    };

    console.log('[ChatActions] Cancelling chat request:', payload);

    return socketService.emit(
      SOCKET_EVENTS.CANCEL_CHAT_REQUEST,
      payload,
    );
  },
  [],
);

  const leaveChat = useCallback((): boolean => {
    if (!roomId) {
      console.warn('[ChatActions] No roomId to leave');
      return false;
    }

    console.log('[ChatActions] Leaving chat:', roomId);
    return socketService.emit(SOCKET_EVENTS.LEAVE_CHAT, { roomId });
  }, [roomId]);

  // const completeChat = useCallback((): boolean => {
  //   if (!roomId) {
  //     console.warn('[ChatActions] No roomId to complete');
  //     return false;
  //   }

  //   console.log('[ChatActions] Completing chat:', roomId);
  //   return socketService.emit(SOCKET_EVENTS.CHAT_COMPLETED, { roomId });

  // }, [roomId]);

  const completeChat = useCallback((): boolean => {
    const store = useChatStore.getState();

    const currentRoomId = store.roomId;
    const astroId =
      store.queueData?.astrologerId ||
      store.chatRoom?.astrologerId ||
      store.userPayload?.astro_id;

    const userId = store.userPayload?.user_id || store.userPayload?.id;

    if (!currentRoomId) {
      console.warn('[ChatActions] No roomId to complete');
      return false;
    }

    if (!store.beginChatCompletion()) {
      store.flushPendingChatCompletion();
      return true;
    }

    console.log('[ChatActions] Completing chat:', {
      room_id: currentRoomId,
      astroId,
      userId,
    });

    // LOCAL CLEANUP FIRST
    store.setChatStatus('completed');
    store.stopTimer();
    store.clearQueue();

    // MAIN EVENT
    const completed = socketService.emit(SOCKET_EVENTS.CHAT_COMPLETED, {
      room_id: currentRoomId,
      astroId,
      userId,
    });

    // OPTIONAL ROOM LEAVE
    socketService.emit(SOCKET_EVENTS.LEAVE_CHAT, {
      room_id: currentRoomId,
    });

    if (!completed) {
      store.setPendingChatCompleted(true);
    }

    return true;
  }, []);

  return {
    joinChat,
    cancelChatRequest,
    leaveChat,
    completeChat,
    // cancelCallRequest,
  };
};

export const useChatTimer = () => {
  const { chatStatus, timer, decrementTimer } = useChatStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (chatStatus === 'active' && timer > 0) {
      intervalRef.current = setInterval(() => {
        decrementTimer();
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [chatStatus, timer, decrementTimer]);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  }, []);

  return { timer, formattedTime: formatTime(timer) };
};
