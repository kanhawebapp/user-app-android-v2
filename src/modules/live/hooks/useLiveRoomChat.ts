import {useCallback, useEffect, useRef, useState} from 'react';
import {
  ChatClient,
  ChatConnectEventListener,
  ChatConversationType,
  ChatError,
  ChatMessage,
  ChatMessageChatType,
  ChatMessageEventListener,
  ChatMessageType,
  ChatOptions,
  ChatTextMessageBody,
} from 'react-native-agora-chat';
import loggingService from '../../../services/logging';

export type LiveChatStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'failed';

export interface LiveChatMessage {
  id: string;
  senderId: string;
  senderName?: string;
  text: string;
  timestamp: number;
  isOwn: boolean;
}

interface UseLiveRoomChatOptions {
  /** When false (invalid credentials), Chat is never initialised. */
  enabled: boolean;
  chatAppKey: string;
  chatUserId: string;
  chatToken: string;
  chatRoomId: string;
}

const HISTORY_PAGE_SIZE = 20;
const MAX_MESSAGES = 200;

// ChatClient is a process-wide singleton; these keep init/login/logout serialised across mounts.
let initializedAppKey: string | null = null;
let chatQueue: Promise<unknown> = Promise.resolve();

const enqueue = <T>(task: () => Promise<T>): Promise<T> => {
  const next = chatQueue.then(task, task);
  chatQueue = next.catch(() => undefined);
  return next;
};

const describeChatError = (err: unknown): string => {
  const chatError = err as Partial<ChatError> & {message?: string};
  return chatError?.description || chatError?.message || 'unknown error';
};

const toLiveChatMessage = (
  message: ChatMessage,
  currentUserId: string,
): LiveChatMessage | null => {
  if (message.body?.type !== ChatMessageType.TXT) {
    return null;
  }
  const nickname = message.attributes?.nickname ?? message.attributes?.name;
  return {
    id: message.msgId || message.localMsgId,
    senderId: message.from,
    senderName: typeof nickname === 'string' ? nickname : undefined,
    text: (message.body as ChatTextMessageBody).content ?? '',
    timestamp: message.serverTime || message.localTime || Date.now(),
    isOwn: message.from === currentUserId,
  };
};

const mergeMessages = (
  existing: LiveChatMessage[],
  incoming: LiveChatMessage[],
): LiveChatMessage[] => {
  const byId = new Map(existing.map(item => [item.id, item]));
  incoming.forEach(item => byId.set(item.id, item));
  return Array.from(byId.values())
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-MAX_MESSAGES);
};

/**
 * Logs in to Agora Chat with the live session's credentials, joins its chat room,
 * and streams room messages. Independent of RTC: failures here only affect chat.
 */
export const useLiveRoomChat = ({
  enabled,
  chatAppKey,
  chatUserId,
  chatToken,
  chatRoomId,
}: UseLiveRoomChatOptions) => {
  const [status, setStatus] = useState<LiveChatStatus>(
    enabled ? 'connecting' : 'idle',
  );
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);
  const [attempt, setAttempt] = useState(0);
  const roomJoinedRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      setStatus('idle');
      return;
    }

    const client = ChatClient.getInstance();
    let active = true;
    roomJoinedRef.current = false;
    setStatus('connecting');
    setError(null);

    const messageListener: ChatMessageEventListener = {
      onMessagesReceived: received => {
        if (!active) {
          return;
        }
        const roomMessages = received
          .filter(
            message =>
              message.chatType === ChatMessageChatType.ChatRoom &&
              message.conversationId === chatRoomId,
          )
          .map(message => toLiveChatMessage(message, chatUserId))
          .filter((item): item is LiveChatMessage => item !== null);
        if (roomMessages.length > 0) {
          setMessages(prev => mergeMessages(prev, roomMessages));
        }
      },
    };

    const connectionListener: ChatConnectEventListener = {
      onConnected: () => {
        if (active && roomJoinedRef.current) {
          setStatus('connected');
          setError(null);
        }
      },
      onDisconnected: () => {
        if (active) {
          setStatus('disconnected');
        }
      },
      onTokenDidExpire: () => {
        if (active) {
          setStatus('failed');
          setError(
            'Chat session expired. Rejoin the live to continue chatting.',
          );
        }
      },
      onUserDidLoginFromOtherDevice: () => {
        if (active) {
          setStatus('failed');
          setError('Chat was opened on another device.');
        }
      },
    };

    const setup = async () => {
      if (initializedAppKey !== chatAppKey) {
        if (initializedAppKey === null) {
          await client.init(
            ChatOptions.withAppKey({appKey: chatAppKey, autoLogin: false}),
          );
        } else {
          await client.logout(false).catch(() => undefined);
          await client.changeAppKey(chatAppKey);
        }
        initializedAppKey = chatAppKey;
      }

      const currentUser = client.currentUserName;
      if (currentUser && currentUser !== chatUserId) {
        await client.logout(false).catch(() => undefined);
      }
      if (currentUser !== chatUserId) {
        await client.loginWithToken(chatUserId, chatToken);
      }

      await client.roomManager.joinChatRoomEx({
        roomId: chatRoomId,
        exitOtherRoom: true,
      });
    };

    const teardown = async () => {
      await client.roomManager.leaveChatRoom(chatRoomId).catch(() => undefined);
      await client.logout(false).catch(() => undefined);
    };

    client.chatManager.addMessageListener(messageListener);
    client.addConnectionListener(connectionListener);

    enqueue(setup)
      .then(async () => {
        if (!active) {
          return;
        }
        roomJoinedRef.current = true;
        setStatus('connected');

        try {
          const history =
            await client.chatManager.fetchHistoryMessagesByOptions(
              chatRoomId,
              ChatConversationType.RoomChat,
              {pageSize: HISTORY_PAGE_SIZE},
            );
          const historyMessages = (history?.list ?? [])
            .map(message => toLiveChatMessage(message, chatUserId))
            .filter((item): item is LiveChatMessage => item !== null);
          if (active && historyMessages.length > 0) {
            setMessages(prev => mergeMessages(prev, historyMessages));
          }
        } catch (historyError) {
          loggingService.warn('[LiveChat] History unavailable', {
            error: describeChatError(historyError),
          });
        }
      })
      .catch(setupError => {
        loggingService.error('[LiveChat] Failed to join chat room', {
          error: describeChatError(setupError),
        });
        if (active) {
          setStatus('failed');
          setError('Unable to connect to live chat.');
        }
      });

    return () => {
      active = false;
      roomJoinedRef.current = false;
      client.chatManager.removeMessageListener(messageListener);
      client.removeConnectionListener(connectionListener);
      enqueue(teardown);
    };
  }, [enabled, chatAppKey, chatUserId, chatToken, chatRoomId, attempt]);

  const sendMessage = useCallback(
    async (text: string): Promise<boolean> => {
      const content = text.trim();
      if (!content || !roomJoinedRef.current) {
        return false;
      }

      const message = ChatMessage.createTextMessage(
        chatRoomId,
        content,
        ChatMessageChatType.ChatRoom,
      );
      const pending = toLiveChatMessage(message, chatUserId);
      if (pending) {
        setMessages(prev => mergeMessages(prev, [{...pending, isOwn: true}]));
      }

      try {
        await ChatClient.getInstance().chatManager.sendMessage(message, {
          onSuccess: () => undefined,
          onError: (localMsgId, sendError) => {
            loggingService.error('[LiveChat] Message failed', {
              error: describeChatError(sendError),
            });
            setMessages(prev => prev.filter(item => item.id !== localMsgId));
          },
        });
        return true;
      } catch (sendError) {
        loggingService.error('[LiveChat] Message failed', {
          error: describeChatError(sendError),
        });
        if (pending) {
          setMessages(prev => prev.filter(item => item.id !== pending.id));
        }
        return false;
      }
    },
    [chatRoomId, chatUserId],
  );

  const retry = useCallback(() => setAttempt(prev => prev + 1), []);

  return {
    status,
    error,
    messages,
    sendMessage,
    retry,
  };
};
