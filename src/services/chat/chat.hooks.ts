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
  const {
    roomId,
    setQueueData,
    updateQueueData,
    setChatStatus,
    addMessage,
    setTypingStatus,
    setChatRoom,
    setIsConnected,
    setError,
    clearQueue,
    startTimer,
    stopTimer,
    userPayload,
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

    socket.on(SOCKET_EVENTS.QUEUE_POSITION, data => {
      if (!data) {
        return;
      }

      const storeState = useChatStore.getState();
      const { chatStatus, isChatTimerStarted } = storeState;

      // Ignore if chat is already in a terminal/active state
      if (chatStatus === 'active' || isChatTimerStarted) {
        return;
      }

      let waitTime = Number(data?.waitTime ?? data?.estimatedWaitTime ?? 0);
      if (!waitTime || waitTime <= 0) {
        return;
      }

      const normalized = {
        position: data?.position ?? 0,
        waitTime,
        estimatedWaitTime: waitTime,
        astrologerId: data?.astrologerId ?? '',
        astrologerName: data?.astrologerName ?? '',
        roomId: data?.roomId || data?.room_id || null,
        message: data?.message ?? '',
        chatCallType: data?.type ?? 'queue_update',
      };

      storeState.setQueueData(normalized);
      storeState.setChatStatus('queued');
      storeState.startTimer(waitTime);
    });

    socket.on(SOCKET_EVENTS.QUEUE_UPDATE, data => {
      console.log('[ChatSocket] Queue update:', data);
      updateQueueData(data);
    });

    socket.on(SOCKET_EVENTS.CHAT_ACCEPTED, data => {
      const storeState = useChatStore.getState();
      const terminalOrActiveStates: Set<string> = new Set([
        'active',
        'completed',
        'rejected',
        'cancelled',
      ]);
      if (terminalOrActiveStates.has(storeState.chatStatus)) {
        return;
      }

      const incomingRoomId = data?.roomId || data?.roomid || data?.room_id;
      const currentRoomId = storeState.roomId;

      console.log('[ChatSocket] Chat accepted:', {
        incoming: incomingRoomId,
        current: currentRoomId,
      });

      if (incomingRoomId === currentRoomId || !currentRoomId) {
        console.log('[ChatTimer] Chat accepted - starting chat session');
        storeState.clearQueue();
        storeState.stopTimer();
        storeState.setChatRoom({
          roomId: incomingRoomId || currentRoomId || '',
          astrologerId: data?.astrologerId || '',
          astrologerName: data?.astrologerName || '',
          userId: '',
          status: 'active',
          maximumTime: Number(data?.maximumTime ?? data?.maximum_time ?? 0),
        });
        storeState.setChatStatus('active');
      }
    });

    socket.on(SOCKET_EVENTS.CHAT_REJECTED, data => {
      console.log('[ChatSocket] Chat rejected:', data.roomId,roomId);
      if (data.roomId === roomId) {
        setChatStatus('rejected');
        setError(data.reason || 'Chat request was rejected');
      }
    });

    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, (data: ChatMessage) => {
      console.log('[ChatSocket] Received message:', data);
      if (data.roomId === roomId) {
        addMessage({
          ...data,
          status: 'delivered',
        });
      }
    });

    socket.on(SOCKET_EVENTS.TYPING_STATUS, data => {
      console.log('[ChatSocket] Typing status:', data);
      if (data.roomId === roomId) {
        setTypingStatus({
          isTyping: data.isTyping,
          senderType: data.senderType,
        });
      }
    });

    socket.on(SOCKET_EVENTS.LEAVE_CHAT_EVENT, data => {
      console.log('[ChatSocket] Leave chat:', data);
      if (data.roomId === roomId) {
        setChatStatus('completed');
        setError(data.reason || 'Chat ended by astrologer');
      }
    });

    socket.on(SOCKET_EVENTS.USER_DISCONNECTED, data => {
      console.log('[ChatSocket] User disconnected:', data);
      if (data.roomId === roomId) {
        setError(
          `${data.userType === 'astrologer' ? 'Astrologer' : 'User'
          } disconnected`,
        );
      }
    });

    socket.on(SOCKET_EVENTS.ERROR, data => {
      console.log('[ChatSocket] Error:', data);
      setError(data.message);
    });

    console.log('[ChatSocket] Listeners registered');
  }, [
    socket,
    roomId,
    setQueueData,
    updateQueueData,
    setChatStatus,
    addMessage,
    setTypingStatus,
    setChatRoom,
    setIsConnected,
    setError,
    clearQueue,
    startTimer,
    stopTimer,
  ]);

  useEffect(() => {
    if (socket) {
      registerListeners();
    }

    return () => {
      if (socket && registeredRef.current) {
        socket.off(SOCKET_EVENTS.QUEUE_POSITION);
        socket.off(SOCKET_EVENTS.QUEUE_UPDATE);
        socket.off(SOCKET_EVENTS.CHAT_ACCEPTED);
        socket.off(SOCKET_EVENTS.CHAT_REJECTED);
        socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE);
        socket.off(SOCKET_EVENTS.TYPING_STATUS);
        socket.off(SOCKET_EVENTS.LEAVE_CHAT_EVENT);
        socket.off(SOCKET_EVENTS.CHAT_COMPLETED_EVENT);
        socket.off(SOCKET_EVENTS.USER_DISCONNECTED);
        socket.off(SOCKET_EVENTS.ERROR);
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
