import {useEffect, useRef} from 'react';
import {socketService} from '../../../../services/socket/socket.service';
import {SOCKET_EVENTS} from '../../../../services/socket/socket.events';
import {ChatMessage} from '../types';

interface UseChatSocketProps {
  roomId: string;
  userId?: string;
  onReceiveMessage: (message: ChatMessage) => void;
  onTyping: (isTyping: boolean) => void;
  onChatCompleted: () => void;
  onRechargeSuccess: (time: number) => void;
  onRechargeFail: () => void;
}

export const useChatSocket = ({
  roomId,
  userId,
  onReceiveMessage,
  onTyping,
  onChatCompleted,
  onRechargeSuccess,
  onRechargeFail,
}: UseChatSocketProps) => {
  const socket = socketService.getSocket();
  const joinedRef = useRef(false);

  // Join chat room effect
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

  // Chat completed event listener
  useEffect(() => {
    if (!socket || !roomId) {
      return;
    }

    const handleChatCompleted = (data: any) => {
      if (!data) {
        return;
      }

      const dataRoomId = data?.roomId || data?.room_id || data?.roomid;
      if (dataRoomId && dataRoomId !== roomId) {
        return;
      }

      console.log('[CHAT COMPLETED - BOTH SIDE SYNC]', data);
      onChatCompleted();
    };

    socket.off(SOCKET_EVENTS.CHAT_COMPLETED, handleChatCompleted);
    socket.off(SOCKET_EVENTS.CHAT_COMPLETED_EVENT, handleChatCompleted);

    socket.on(SOCKET_EVENTS.CHAT_COMPLETED, handleChatCompleted);
    socket.on(SOCKET_EVENTS.CHAT_COMPLETED_EVENT, handleChatCompleted);

    return () => {
      socket.off(SOCKET_EVENTS.CHAT_COMPLETED, handleChatCompleted);
      socket.off(SOCKET_EVENTS.CHAT_COMPLETED_EVENT, handleChatCompleted);
    };
  }, [socket, roomId, onChatCompleted]);

  // Message and typing event listeners
  useEffect(() => {
    if (!socket || !roomId) {
      return;
    }

    const handleReceiveMessage = (data: any) => {
      if (!data) {
        return;
      }

      const messageRoomId = data?.roomId || data?.room_id || data?.roomid;
      if (messageRoomId && messageRoomId !== roomId) {
        return;
      }

      console.log('[ChatScreen] Received message:-----------', data);

      const messageId =
        data?.msg_id || data?.id || data?.messageId || Date.now().toString();
      let messageText = data?.message;
      if (typeof messageText === 'object' && messageText !== null) {
        messageText = (messageText as any).message;
      }

      if (!messageText) {
        return;
      }

      const parseTime = (timeStr: string) => {
        if (!timeStr) {
          return new Date();
        }

        if (timeStr.includes('T')) {
          return new Date(timeStr);
        }

        const now = new Date();
        const [time, modifier] = timeStr.split(' ');

        if (!time || !modifier) {
          return new Date();
        }

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

      // const message: ChatMessage = {
      //   id: messageId,
      //   text: messageText,
      //   sender: data?.sender === 'user' ? 'user' : 'astrologer',
      //   timestamp: parseTime(data?.time || data?.timestamp),
      //   read: data?.sender === 'astrologer',
      //   isLiked: false,
      //   status: 'delivered',
      //   replyTo: data?.replyTo || null,
      // };
      const message: ChatMessage = {
        id: messageId,
        text: data?.message || '',
        image: data?.image || null, //  ADD THIS
        sender: data?.sender === 'user' ? 'user' : 'astrologer',
        timestamp: parseTime(data?.time || data?.timestamp),
        read: data?.sender === 'astrologer',
        isLiked: false,
        status: 'delivered',
        replyTo: data?.replyTo || null,
      };

      onReceiveMessage(message);
    };

    const handleTyping = (data: any) => {
      if (!data) {
        return;
      }

      const messageRoomId = data?.roomId || data?.room_id || data?.roomid;
      if (messageRoomId && messageRoomId !== roomId) {
        return;
      }

      console.log('[Typing Event Received]', data);

      const isAstrologerTyping = true;

      if (isAstrologerTyping && data?.user_name !== 'User') {
        onTyping(data?.isTyping ?? data?.typing ?? false);
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
      socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceiveMessage);
      socket.off(SOCKET_EVENTS.TYPING_STATUS, handleTyping);
    };
  }, [socket, roomId, onReceiveMessage, onTyping]);

  // Recharge event listeners
  useEffect(() => {
    if (!socket || !roomId) {
      return;
    }

    if (!socket?.connected) {
      console.log('[Socket] Not connected yet');
      return;
    }

    console.log('[Socket] Listening for recharge events');

    const RECHARGE_SUCCESS_EVENTS = [
      'recharge_complted',
      'recharge_completed',
      'recharge_success',
    ];

    const RECHARGE_FAIL_EVENTS = ['customer_recharge_fail', 'recharge_failed'];

    const handleRechargeCompleted = (data: any) => {
      if (!data) {
        return;
      }

      console.log('[Recharge SUCCESS EVENT]', data);

      const dataRoomId = data?.roomId || data?.room_id || data?.roomid;
      if (dataRoomId && dataRoomId !== roomId) {
        console.warn('[Recharge] Room mismatch but still handling recharge', {
          dataRoomId,
          roomId,
        });
      }

      const parsedTime = parseInt(data?.duetime, 10);
      if (!isNaN(parsedTime) && parsedTime > 0) {
        onRechargeSuccess(parsedTime);
      } else {
        onRechargeSuccess(0);
      }
    };

    const handleRechargeFailed = (data: any) => {
      if (!data) {
        return;
      }

      console.log('[Recharge FAIL EVENT]', data);

      const dataRoomId = data?.roomId || data?.room_id || data?.roomid;
      if (dataRoomId && dataRoomId !== roomId) {
        console.warn('[Recharge] Room mismatch but still handling fail', {
          dataRoomId,
          roomId,
        });
      }

      onRechargeFail();
    };

    RECHARGE_SUCCESS_EVENTS.forEach(event => {
      (socket as any).off(event, handleRechargeCompleted);
      (socket as any).on(event, handleRechargeCompleted);
    });

    RECHARGE_FAIL_EVENTS.forEach(event => {
      (socket as any).off(event, handleRechargeFailed);
      (socket as any).on(event, handleRechargeFailed);
    });

    return () => {
      RECHARGE_SUCCESS_EVENTS.forEach(event => {
        (socket as any).off(event, handleRechargeCompleted);
      });
      RECHARGE_FAIL_EVENTS.forEach(event => {
        (socket as any).off(event, handleRechargeFailed);
      });
    };
  }, [socket, roomId, onRechargeSuccess, onRechargeFail]);
};
