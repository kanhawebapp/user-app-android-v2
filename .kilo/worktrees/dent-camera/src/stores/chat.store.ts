/**
 * Chat Store - Zustand
 * Manages chat sessions and messages for real-time communication
 */

import {create} from 'zustand';
import type {ChatSession, ChatMessage} from '../types/global.types';

interface ChatState {
  // Sessions
  sessions: ChatSession[];
  activeSession: ChatSession | null;
  isConnecting: boolean;
  isConnected: boolean;

  // Messages
  messages: Record<string, ChatMessage[]>; // sessionId -> messages
  typingUsers: Record<string, string[]>; // sessionId -> userIds

  // Queue for offline messages
  messageQueue: ChatMessage[];

  // Actions
  setSessions: (sessions: ChatSession[]) => void;
  setActiveSession: (session: ChatSession | null) => void;
  addSession: (session: ChatSession) => void;
  updateSession: (sessionId: string, updates: Partial<ChatSession>) => void;
  endSession: (sessionId: string) => void;

  setMessages: (sessionId: string, messages: ChatMessage[]) => void;
  addMessage: (sessionId: string, message: ChatMessage) => void;
  updateMessage: (
    sessionId: string,
    messageId: string,
    updates: Partial<ChatMessage>,
  ) => void;
  markMessagesAsRead: (sessionId: string) => void;

  setTyping: (sessionId: string, userId: string, isTyping: boolean) => void;
  setConnecting: (connecting: boolean) => void;
  setConnected: (connected: boolean) => void;

  addToQueue: (message: ChatMessage) => void;
  clearQueue: () => void;
  processQueue: () => ChatMessage[];

  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  sessions: [],
  activeSession: null,
  isConnecting: false,
  isConnected: false,
  messages: {},
  typingUsers: {},
  messageQueue: [],

  setSessions: sessions => set({sessions}),

  setActiveSession: session => set({activeSession: session}),

  addSession: session =>
    set(state => ({
      sessions: [session, ...state.sessions.filter(s => s.id !== session.id)],
    })),

  updateSession: (sessionId, updates) =>
    set(state => ({
      sessions: state.sessions.map(s =>
        s.id === sessionId ? {...s, ...updates} : s,
      ),
      activeSession:
        state.activeSession?.id === sessionId
          ? {...state.activeSession, ...updates}
          : state.activeSession,
    })),

  endSession: sessionId =>
    set(state => ({
      sessions: state.sessions.map(s =>
        s.id === sessionId
          ? {...s, status: 'ended' as const, isActive: false}
          : s,
      ),
      activeSession:
        state.activeSession?.id === sessionId ? null : state.activeSession,
    })),

  setMessages: (sessionId, messages) =>
    set(state => ({
      messages: {...state.messages, [sessionId]: messages},
    })),

  addMessage: (sessionId, message) =>
    set(state => {
      const sessionMessages = state.messages[sessionId] || [];
      // Avoid duplicates
      if (sessionMessages.some(m => m.id === message.id)) {
        return state;
      }
      return {
        messages: {
          ...state.messages,
          [sessionId]: [...sessionMessages, message],
        },
      };
    }),

  updateMessage: (sessionId, messageId, updates) =>
    set(state => {
      const sessionMessages = state.messages[sessionId] || [];
      return {
        messages: {
          ...state.messages,
          [sessionId]: sessionMessages.map(m =>
            m.id === messageId ? {...m, ...updates} : m,
          ),
        },
      };
    }),

  markMessagesAsRead: sessionId =>
    set(state => {
      const sessionMessages = state.messages[sessionId] || [];
      return {
        messages: {
          ...state.messages,
          [sessionId]: sessionMessages.map(m =>
            m.senderType === 'astrologer' && !m.isRead
              ? {...m, isRead: true}
              : m,
          ),
        },
      };
    }),

  setTyping: (sessionId, userId, isTyping) =>
    set(state => {
      const currentTyping = state.typingUsers[sessionId] || [];
      return {
        typingUsers: {
          ...state.typingUsers,
          [sessionId]: isTyping
            ? [...currentTyping.filter(id => id !== userId), userId]
            : currentTyping.filter(id => id !== userId),
        },
      };
    }),

  setConnecting: isConnecting => set({isConnecting}),
  setConnected: isConnected => set({isConnected}),

  addToQueue: message =>
    set(state => ({
      messageQueue: [...state.messageQueue, message],
    })),

  clearQueue: () => set({messageQueue: []}),

  processQueue: () => {
    const {messageQueue} = get();
    set({messageQueue: []});
    return messageQueue;
  },

  clearChat: () =>
    set({
      sessions: [],
      activeSession: null,
      messages: {},
      typingUsers: {},
      messageQueue: [],
      isConnecting: false,
      isConnected: false,
    }),
}));

export default useChatStore;
