import {io, Socket} from 'socket.io-client';
import {ServerToClientEvents, ClientToServerEvents} from './socket.types';
import {API_BASE_URL} from '../../constants/api.constants';
import {SOCKET_EVENTS} from './socket.events';
import {useChatStore} from '../chat/chat.store';

export interface SocketServiceState {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  connected: boolean;
}

export interface EmitOptions {
  event: string;
  data: any;
}

interface RawQueueData {
  position?: number;
  waitTime?: number;
  estimatedWaitTime?: number;
  astrologerId?: string;
  astrologerName?: string;
  roomId?: string;
  room_id?: string;
  roomid?: string;
  message?: string;
}

interface RawChatAcceptedData {
  roomId?: string;
  roomid?: string;
  room_id?: string;
  astrologerId?: string;
  astrologerName?: string;
}

interface RawMessageData {
  msg_id?: string;
  id?: string;
  messageId?: string;
  message?: string;
  room_id?: string;
  roomId?: string;
  sender?: 'user' | 'astrologer';
  sender_id?: string;
  time?: string;
  timestamp?: number;
}

const SOCKET_URL = `${API_BASE_URL.DEVELOPMENT}dhwani-astro`;

const normalizeRoomId = (data: any): string | null => {
  const roomId = data?.roomId || data?.roomid || data?.room_id;
  if (
    !roomId ||
    roomId === 'undefined' ||
    roomId === null ||
    roomId === 'null'
  ) {
    return null;
  }
  return String(roomId);
};

class SocketService {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null =
    null;
  private connected: boolean = false;
  private connectCallback:
    | ((socket: Socket<ServerToClientEvents, ClientToServerEvents>) => void)
    | null = null;
  private connecting: boolean = false;
  private listenersRegistered: boolean = false;
  private chatAcceptedHandled: boolean = false;

  setSocket(socket: Socket<ServerToClientEvents, ClientToServerEvents>) {
    this.socket = socket;
    console.log('[SocketService] Socket instance set');
  }

  setConnected(status: boolean) {
    this.connected = status;
    console.log('[SocketService] Connection status:', status);
  }

  private handleChatAccepted = (
    data: RawChatAcceptedData,
    isAlias: boolean = false,
  ) => {
    if (!data) {
      console.warn('[SocketService] Empty data in chatAccepted');
      return;
    }

    const incomingRoomId = normalizeRoomId(data);
    if (!incomingRoomId) {
      console.warn(
        `[SocketService] Invalid roomId in chatAccepted${
          isAlias ? ' (alias)' : ''
        }, ignoring`,
        data,
      );
      return;
    }

    const storeState = useChatStore.getState();
    const currentRoomId = storeState.roomId;

    console.log('[SocketService] Chat Accepted:', {
      incoming: incomingRoomId,
      current: currentRoomId,
      isAlias,
    });

    if (incomingRoomId !== currentRoomId && currentRoomId !== null) {
      console.warn(
        '[SocketService] Room ID mismatch - ignoring chat acceptance',
        {incoming: incomingRoomId, current: currentRoomId},
      );
      return;
    }

    if (this.chatAcceptedHandled) {
      console.log('[SocketService] Chat already accepted, ignoring duplicate');
      return;
    }

    this.chatAcceptedHandled = true;

    storeState.setChatStatus('active');
    storeState.setShouldNavigateToChat(true);
    storeState.setChatRoom({
      roomId: incomingRoomId,
      astrologerId: data?.astrologerId || '',
      astrologerName: data?.astrologerName || '',
      userId: '',
      status: 'active',
      maximumTime: 0,
    });

    console.log(
      '[SocketService] Chat accepted, set shouldNavigateToChat=true, roomId:',
      incomingRoomId,
    );
  };

  private registerGlobalListeners(
    socket: Socket<ServerToClientEvents, ClientToServerEvents>,
  ) {
    if (this.listenersRegistered) {
      console.log('[SocketService] Listeners already registered, skipping');
      return;
    }

    console.log('[SocketService] Registering global listeners...');

    const eventsToOff = [
      SOCKET_EVENTS.QUEUE_POSITION,
      SOCKET_EVENTS.QUEUE_UPDATE,
      SOCKET_EVENTS.CHAT_ACCEPTED,
      SOCKET_EVENTS.CHAT_REJECTED,
      SOCKET_EVENTS.RECEIVE_MESSAGE,
      SOCKET_EVENTS.TYPING_STATUS,
      SOCKET_EVENTS.LEAVE_CHAT_EVENT,
      SOCKET_EVENTS.CHAT_COMPLETED_EVENT,
      SOCKET_EVENTS.USER_DISCONNECTED,
      SOCKET_EVENTS.ERROR,
    ];
    eventsToOff.forEach(event => socket.off(event));
    (socket as any).off('chatAcceptedByAstrologer');
    (socket as any).off('chat_started_astrologer');
    (socket as any).off('user_conformation_chat');

    const store = useChatStore.getState();

    (socket as any).on(SOCKET_EVENTS.QUEUE_POSITION, (data: RawQueueData) => {
      if (!data) {
        console.warn('[SocketService] Empty queue_position data');
        return;
      }

      let waitTime = Number(data?.waitTime ?? data?.estimatedWaitTime ?? 0);

      if (!waitTime || waitTime <= 0) {
        console.warn(
          '[SocketService] Invalid waitTime, ignoring queue position',
        );
        return;
      }

      console.log('[SocketService] queue_position:', {
        position: data?.position,
        waitTime,
        astrologerName: data?.astrologerName,
      });

      const storeState = useChatStore.getState();
      const {chatStatus, isChatTimerStarted} = storeState;

      if (chatStatus === 'active' || isChatTimerStarted) {
        console.log('[ChatTimer] Ignoring queue timer (chat already active)');
        storeState.setQueueData({
          position: data?.position ?? 0,
          waitTime,
          estimatedWaitTime: waitTime,
          astrologerId: data?.astrologerId ?? '',
          astrologerName: data?.astrologerName ?? '',
          roomId: normalizeRoomId(data),
          message: data?.message ?? '',
        });
        storeState.setChatStatus('queued');
        return;
      }

      storeState.setQueueData({
        position: data?.position ?? 0,
        waitTime,
        estimatedWaitTime: waitTime,
        astrologerId: data?.astrologerId ?? '',
        astrologerName: data?.astrologerName ?? '',
        roomId: normalizeRoomId(data),
        message: data?.message ?? '',
      });
      storeState.setChatStatus('queued');
      storeState.startTimer(waitTime);
    });

    (socket as any).on(SOCKET_EVENTS.QUEUE_UPDATE, (data: RawQueueData) => {
      if (!data) {
        return;
      }
      console.log('[SocketService] queue_update:', data);

      store.updateQueueData({
        position: data?.position,
        waitTime: data?.waitTime,
        estimatedWaitTime: data?.waitTime ?? data?.estimatedWaitTime,
        astrologerId: data?.astrologerId,
        astrologerName: data?.astrologerName,
        roomId: normalizeRoomId(data),
      });
    });

    (socket as any).on(
      SOCKET_EVENTS.CHAT_ACCEPTED,
      (data: RawChatAcceptedData) => {
        this.handleChatAccepted(data, false);
      },
    );

    (socket as any).on(
      'chatAcceptedByAstrologer',
      (data: RawChatAcceptedData) => {
        this.handleChatAccepted(data, true);
      },
    );

    (socket as any).on(
      SOCKET_EVENTS.CHAT_REJECTED,
      (data: {
        roomId?: string;
        roomid?: string;
        room_id?: string;
        reason?: string;
      }) => {
        const roomId = normalizeRoomId(data);
        const currentRoomId = useChatStore.getState().roomId;

        if (roomId && roomId === currentRoomId) {
          console.log('[SocketService] Chat rejected:', data);
          store.setChatStatus('rejected');
          store.setError(data?.reason || 'Chat request was rejected');
        }
      },
    );

    (socket as any).on(
      SOCKET_EVENTS.RECEIVE_MESSAGE,
      (data: RawMessageData) => {
        if (!data) {
          return;
        }

        const roomId = normalizeRoomId(data);
        const currentRoomId = useChatStore.getState().roomId;

        if (!roomId || roomId !== currentRoomId) {
          return;
        }

        const messageId =
          data?.msg_id || data?.id || data?.messageId || `msg_${Date.now()}`;
        let messageText = data?.message;
        if (typeof messageText === 'object' && messageText !== null) {
          messageText = (messageText as any).message;
        }

        if (!messageText || typeof messageText !== 'string') {
          return;
        }

        console.log('[SocketService] receive_message:', {
          id: messageId,
          text: messageText?.substring(0, 50),
          sender: data?.sender,
        });

        store.addMessage({
          id: messageId,
          roomId,
          senderId: data?.sender_id || '',
          senderType: data?.sender === 'user' ? 'user' : 'astrologer',
          message: messageText,
          timestamp: data?.time ? new Date(data.time).getTime() : Date.now(),
          status: 'delivered',
        });
      },
    );

    (socket as any).on(
      SOCKET_EVENTS.TYPING_STATUS,
      (data: {
        roomId?: string;
        roomid?: string;
        room_id?: string;
        isTyping?: boolean;
        senderType?: 'user' | 'astrologer';
      }) => {
        const roomId = normalizeRoomId(data);
        const currentRoomId = useChatStore.getState().roomId;

        if (roomId && roomId === currentRoomId) {
          store.setTypingStatus({
            isTyping: data?.isTyping ?? false,
            senderType: data?.senderType || 'astrologer',
          });
        }
      },
    );

    (socket as any).on(
      SOCKET_EVENTS.LEAVE_CHAT_EVENT,
      (data: {
        roomId?: string;
        roomid?: string;
        room_id?: string;
        reason?: string;
      }) => {
        const roomId = normalizeRoomId(data);
        const currentRoomId = useChatStore.getState().roomId;

        if (roomId && roomId === currentRoomId) {
          console.log('[SocketService] leave_chat:', data);
          store.setChatStatus('completed');
          store.setError(data?.reason || 'Chat ended by astrologer');
        }
      },
    );

    (socket as any).on(
      SOCKET_EVENTS.CHAT_COMPLETED_EVENT,
      (data: {
        roomId?: string;
        roomid?: string;
        room_id?: string;
        ratingNeeded?: boolean;
      }) => {
        const roomId = normalizeRoomId(data);
        const currentRoomId = useChatStore.getState().roomId;

        if (roomId && roomId === currentRoomId) {
          console.log('[SocketService] chatCompleted:', data);
          store.setChatStatus('completed');
        }
      },
    );

    (socket as any).on(
      SOCKET_EVENTS.USER_DISCONNECTED,
      (data: {
        roomId?: string;
        roomid?: string;
        room_id?: string;
        userType?: 'user' | 'astrologer';
      }) => {
        const roomId = normalizeRoomId(data);
        const currentRoomId = useChatStore.getState().roomId;

        if (roomId && roomId === currentRoomId) {
          console.log('[SocketService] user_disconnected:', data);
          store.setError(
            `${
              data?.userType === 'astrologer' ? 'Astrologer' : 'User'
            } disconnected`,
          );
        }
      },
    );

    (socket as any).on(
      SOCKET_EVENTS.ERROR,
      (data: {message?: string; code?: string}) => {
        console.log('[SocketService] Error event:', data);
        store.setError(data?.message || 'An error occurred');
      },
    );

    socket.onAny((event, data) => {
      if (
        ![SOCKET_EVENTS.QUEUE_POSITION, SOCKET_EVENTS.RECEIVE_MESSAGE].includes(
          event as any,
        )
      ) {
        console.log('[SOCKET SERVICE - EVENT]', event, data);
      }
    });

    this.listenersRegistered = true;
    console.log('[SocketService] Global listeners registered');
  }

  connectAndWait(): Promise<
    Socket<ServerToClientEvents, ClientToServerEvents>
  > {
    return new Promise((resolve, reject) => {
      if (this.socket && this.socket.connected) {
        console.log('[SocketService] Already connected, registering listeners');
        this.registerGlobalListeners(this.socket);
        return resolve(this.socket);
      }

      if (this.connecting) {
        console.log('[SocketService] Already connecting, waiting...');
        const checkConnection = setInterval(() => {
          if (this.socket?.connected) {
            clearInterval(checkConnection);
            this.registerGlobalListeners(this.socket);
            resolve(this.socket);
          }
        }, 100);
        return;
      }

      this.connecting = true;
      this.listenersRegistered = false;
      this.chatAcceptedHandled = false;
      console.log('[SocketService] Creating new socket connection...');

      const socket = io(SOCKET_URL, {
        path: '/user-socket-service-v2/socket.io',
        transports: ['websocket'],
        withCredentials: true,
      });

      this.socket = socket;

      socket.on('connect', () => {
        console.log('[SocketService] Connected:', socket.id);
        this.connected = true;
        this.connecting = false;
        this.registerGlobalListeners(socket);
        if (this.connectCallback) {
          this.connectCallback(socket);
        }
        resolve(socket);
      });

      socket.on('connect_error', (err: Error) => {
        console.log('[SocketService] Connection error:', err.message);
        this.connecting = false;
        reject(err);
      });

      socket.on('disconnect', (reason: string) => {
        console.log('[SocketService] Disconnected:', reason);
        this.connected = false;
        this.listenersRegistered = false;
        this.chatAcceptedHandled = false;
      });
    });
  }

  setConnectCallback(
    callback: (
      socket: Socket<ServerToClientEvents, ClientToServerEvents>,
    ) => void,
  ) {
    this.connectCallback = callback;
  }

  onConnect(
    callback: (
      socket: Socket<ServerToClientEvents, ClientToServerEvents>,
    ) => void,
  ) {
    this.connectCallback = callback;
  }

  emit(event: string, data: any): boolean {
    if (!data) {
      console.log(
        '[SocketService] emit called with null/undefined data:',
        event,
      );
      return false;
    }

    if (typeof data === 'object') {
      const dataStr = JSON.stringify(data);
      if (dataStr.includes('undefined')) {
        console.error(
          '[SocketService] EMIT BLOCKED - data contains undefined:',
          {
            event,
            data,
          },
        );
        return false;
      }
    }

    if (!this.socket) {
      console.log('[SocketService] ERROR: Socket not initialized');
      return false;
    }

    if (!this.socket.connected) {
      console.log('[SocketService] ERROR: Socket not connected');
      return false;
    }

    (this.socket as any).emit(event, data);
    return true;
  }

  isConnected(): boolean {
    return this.connected && this.socket?.connected === true;
  }

  getSocket(): Socket<ServerToClientEvents, ClientToServerEvents> | null {
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.connecting = false;
      this.listenersRegistered = false;
      this.chatAcceptedHandled = false;
      console.log('[SocketService] Disconnected and reset');
    }
  }

  resetChatAcceptedFlag() {
    this.chatAcceptedHandled = false;
  }
}

export const socketService = new SocketService();
export const resetChatAcceptedFlag = () =>
  socketService.resetChatAcceptedFlag();
