import {create} from 'zustand';
import {ChatMessage, QueueData, ChatRoom} from '../socket/socket.types';
import type {ChatRequestData} from '../../components/Modal/ChatRequestModal';
import type {
  ChatRequestPayload,
  CallRequestPayload,
} from '../socket/socket.types';
import { socketService } from '../socket/socket.service';
import { SOCKET_EVENTS } from '../socket/socket.events';

// Minimal astrologer info for chat flow
export interface AstrologerInfo {
  id: string;
  name: string;
  image?: string;
  rating: number;
  experience: string;
  skills: string[];
  isAvailableForChat: boolean;
}

export type ChatStatus =
  | 'idle'
  | 'waiting'
  | 'queued'
  | 'active'
  | 'rejected'
  | 'completed'
  | 'cancelled';

interface ChatState {
  // Recharge state — typed with index signature to avoid inference errors from `any`
  [k: string]: any;
  roomId: string | null;
  messages: ChatMessage[];
  queueData: QueueData | null;
  typingStatus: {isTyping: boolean; senderType: 'user' | 'astrologer'} | null;
  chatStatus: ChatStatus;
  timer: number;
  timeLeft: number;
  timerInterval: NodeJS.Timeout | null;
  isConnected: boolean;
  chatRoom: ChatRoom | null;
  error: string | null;
  shouldNavigateToChat: boolean;
  shouldNavigateToCall: boolean;
  userData: ChatRequestData | null;
  userPayload: ChatRequestPayload | CallRequestPayload | null;
  selectedAstrologer: AstrologerInfo | null;
  chatDuration: number;
  chatTimerRef: NodeJS.Timeout | null;
  isChatTimerStarted: boolean;
  queueTimeLeft: number;
  queueTimerRef: NodeJS.Timeout | null;
  pendingCallRequest: {
    callId: string;
    callPayload: any;
  } | null;
  pendingCallCancelled: boolean;

  setRoomId: (roomId: string | null) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  updateMessageStatus: (
    messageId: string,
    status: ChatMessage['status'],
  ) => void;
  setQueueData: (queueData: QueueData | null) => void;
  updateQueueData: (data: Partial<QueueData>) => void;
  clearQueue: () => void;
  setTypingStatus: (
    status: {isTyping: boolean; senderType: 'user' | 'astrologer'} | null,
  ) => void;
  setChatStatus: (status: ChatStatus) => void;
  setTimer: (time: number) => void;
  decrementTimer: () => void;
  startTimer: (seconds: number) => void;
  stopTimer: () => void;
  setQueueTimeLeft: (time: number) => void;
  setQueueTimerRef: (ref: NodeJS.Timeout | null) => void;
  setIsConnected: (connected: boolean) => void;
  setChatRoom: (room: ChatRoom | null) => void;
  setError: (error: string | null) => void;
  setShouldNavigateToChat: (shouldNavigate: boolean) => void;
  setShouldNavigateToCall: (shouldNavigate: boolean) => void;
  setUserData: (userData: ChatRequestData | null) => void;
  setUserPayload: (
    payload: ChatRequestPayload | CallRequestPayload | null,
  ) => void;
  setSelectedAstrologer: (astrologer: AstrologerInfo | null) => void;
  setChatDuration: (duration: number) => void;
  setTimeLeft: (time: number) => void;
  startChatTimer: () => void;
  stopChatTimer: () => void;
  setIsChatTimerStarted: (value: boolean) => void;
  setPendingCallRequest: (callRequest: ChatState['pendingCallRequest']) => void;
  cancelPendingCallQueue: () => void;
  reset: () => void;
}

const initialState = {
  roomId: null,
  messages: [],
  queueData: null,
  typingStatus: null,
  chatStatus: 'idle' as ChatStatus,
  timer: 0,
  timeLeft: 0,
  timerInterval: null,
  isConnected: false,
  chatRoom: null,
  error: null,
  shouldNavigateToChat: false,
  shouldNavigateToCall: false,
  userData: null,
  userPayload: null,
  selectedAstrologer: null,
  chatDuration: 0,
  chatTimerRef: null,
  isChatTimerStarted: false,
  queueTimeLeft: 0,
  queueTimerRef: null,
  pendingCallRequest: null,
  pendingCallCancelled: false,
};

export const useChatStore = create<ChatState>((set, get) => ({
  ...initialState,

  setRoomId: roomId => set({roomId}),

  setMessages: messages => set({messages}),

  addMessage: message =>
    set(state => ({
      messages: [...state.messages, message],
    })),

  updateMessageStatus: (messageId, status) =>
    set(state => ({
      messages: state.messages.map(msg =>
        msg.id === messageId ? {...msg, status} : msg,
      ),
    })),

  setQueueData: queueData => set({queueData}),

  updateQueueData: data =>
    set(state => ({
      queueData: state.queueData ? {...state.queueData, ...data} : null,
    })),

  clearQueue: () => set({queueData: null}),

  setTypingStatus: typingStatus => set({typingStatus}),

  setChatStatus: chatStatus => set({chatStatus}),

  setTimer: timer => set({timer}),

  decrementTimer: () =>
    set(state => ({
      timer: Math.max(0, state.timer - 1),
    })),

  startTimer: seconds => {
    const currentInterval = get().queueTimerRef;
    if (currentInterval) {
      clearInterval(currentInterval);
    }

    if (!seconds || seconds <= 0) {
      console.warn('[ChatTimer] Invalid seconds for queue timer:', seconds);
      return;
    }

    console.log('[ChatTimer] Starting queue timer with', seconds, 'seconds');

  const interval = setInterval(() => {
  const current = get().queueTimeLeft;

  // console.log('[ChatTimer] Current:', current);

  if (current <= 1) {
    console.log('[ChatTimer] Timer completed');

    const { roomId, userPayload } = get();

    console.log('[ChatTimer] Auto disconnect payload', {
      roomId,
      astroId: userPayload?.astro_id,
    });

    const emitted = socketService.emit(SOCKET_EVENTS.AUTO_DISCONNECT, {
      room_id: roomId,
      astroid: userPayload?.astro_id,
      type: 'chat',
    });

    console.log('[ChatTimer] AUTO_DISCONNECT emitted:', emitted);

    clearInterval(interval);

    set({
      queueTimeLeft: 0,
      queueTimerRef: null,
    });
  } else {
    set({
      queueTimeLeft: current - 1,
    });
  }
}, 1000);

    set({
      queueTimeLeft: seconds,
      queueTimerRef: interval,
    });
  },

  stopTimer: () => {
    const currentInterval = get().queueTimerRef;
    if (currentInterval) {
      clearInterval(currentInterval);
    }
    set({queueTimerRef: null, queueTimeLeft: 0});
  },

  setQueueTimeLeft: time => set({queueTimeLeft: time}),

  setQueueTimerRef: ref => set({queueTimerRef: ref}),

  setIsConnected: isConnected => set({isConnected}),

  setChatRoom: chatRoom => set({chatRoom}),

  setError: error => set({error}),

  setShouldNavigateToChat: shouldNavigateToChat => set({shouldNavigateToChat}),

  setShouldNavigateToCall: shouldNavigateToCall => set({shouldNavigateToCall}),

  setUserData: userData => set({userData}),

  setUserPayload: payload => set({userPayload: payload}),

  setSelectedAstrologer: selectedAstrologer => set({selectedAstrologer}),

  setChatDuration: duration => set({chatDuration: duration}),

  setTimeLeft: time => set({timeLeft: time}),

  setIsChatTimerStarted: isChatTimerStarted => set({isChatTimerStarted}),

  startChatTimer: () => {
    const {chatTimerRef} = get();
    if (chatTimerRef) {
      return;
    }

    console.log('[ChatTimer] Starting chat countdown timer');

    const interval = setInterval(() => {
      set(state => {
        if (state.timeLeft <= 1) {
          clearInterval(interval);
          return {timeLeft: 0, chatTimerRef: null};
        }
        return {timeLeft: state.timeLeft - 1};
      });
    }, 1000);

    set({chatTimerRef: interval});
  },

  stopChatTimer: () => {
    const {chatTimerRef} = get();
    if (chatTimerRef) {
      clearInterval(chatTimerRef);
    }
    set({chatTimerRef: null});
  },

  setPendingCallRequest: callRequest => set({pendingCallRequest: callRequest}),

  cancelPendingCallQueue: () =>
    set({
      pendingCallRequest: null,
      pendingCallCancelled: true,
      queueData: null,
    }),

  reset: () => set(initialState),
}));

export const selectMessages = (state: ChatState) => state.messages;
export const selectQueueData = (state: ChatState) => state.queueData;
export const selectTypingStatus = (state: ChatState) => state.typingStatus;
export const selectChatStatus = (state: ChatState) => state.chatStatus;
export const selectTimer = (state: ChatState) => state.timer;
export const selectRoomId = (state: ChatState) => state.roomId;
export const selectIsConnected = (state: ChatState) => state.isConnected;
export const selectChatRoom = (state: ChatState) => state.chatRoom;
export const selectError = (state: ChatState) => state.error;
export const selectShouldNavigateToChat = (state: ChatState) =>
  state.shouldNavigateToChat;
export const selectShouldNavigateToCall = (state: ChatState) =>
  state.shouldNavigateToCall;
export const selectUserData = (state: ChatState) => state.userData;
export const selectUserPayload = (state: ChatState) => state.userPayload;
export const selectSelectedAstrologer = (state: ChatState) =>
  state.selectedAstrologer;
export const selectPendingCallRequest = (state: ChatState) =>
  state.pendingCallRequest;
