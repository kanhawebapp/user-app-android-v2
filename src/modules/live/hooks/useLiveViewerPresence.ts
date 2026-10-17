import {useCallback, useEffect, useRef, useState} from 'react';
import {ChatClient, ChatRoomEventListener} from 'react-native-agora-chat';
import loggingService from '../../../services/logging';

export interface UseLiveViewerPresenceOptions {
  /** When false, presence tracking is disabled and the count resets to 0. */
  enabled: boolean;
  /** Agora Chat room ID for the live session (from LiveJoinResponse.chatRoomId). */
  chatRoomId: string;
  /** Current user's chat user ID (from LiveJoinResponse.chatUserId). */
  chatUserId: string;
}

export const useLiveViewerPresence = ({
  enabled,
  chatRoomId,
  chatUserId,
}: UseLiveViewerPresenceOptions) => {
  const [viewerCount, setViewerCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const participantsRef = useRef<Set<string>>(new Set());
  const currentRoomIdRef = useRef(chatRoomId);
  const localUserIdRef = useRef(chatUserId);
  const isMountedRef = useRef(false);

  const setCount = useCallback((count: number) => {
    if (isMountedRef.current) {
      setViewerCount(count);
    }
  }, []);

  const reconcileMembers = useCallback(async () => {
    if (!enabled || !chatRoomId) {
      return;
    }
    try {
      const result =
        await ChatClient.getInstance().roomManager.fetchChatRoomMembers(
          chatRoomId,
        );
      const members = result?.list ?? [];
      participantsRef.current = new Set(members);
      if (chatUserId && !participantsRef.current.has(chatUserId)) {
        participantsRef.current.add(chatUserId);
      }
      setCount(participantsRef.current.size);
      setError(null);
    } catch (err: any) {
      const msg = err?.message || 'Failed to load viewer list';
      loggingService.warn('[LiveViewerPresence] Member fetch failed', {
        error: msg,
      });
    }
  }, [enabled, chatRoomId, chatUserId, setCount]);

  useEffect(() => {
    isMountedRef.current = true;
    currentRoomIdRef.current = chatRoomId;
    localUserIdRef.current = chatUserId;

    if (!enabled || !chatRoomId || !chatUserId) {
      setCount(0);
      participantsRef.current.clear();
      setError(null);
      return;
    }

    if (!participantsRef.current.has(chatUserId)) {
      participantsRef.current.add(chatUserId);
      setCount(participantsRef.current.size);
    }

    reconcileMembers();

    const listener: ChatRoomEventListener = {
      onMemberJoined: params => {
        if (!isMountedRef.current) {
          return;
        }
        if (params?.roomId !== chatRoomId) {
          return;
        }
        const participant = params?.participant;
        if (!participant || participant === chatUserId) {
          return;
        }
        if (participantsRef.current.has(participant)) {
          return;
        }
        participantsRef.current.add(participant);
        setCount(participantsRef.current.size);
        setError(null);
      },
      onMemberExited: params => {
        if (!isMountedRef.current) {
          return;
        }
        if (params?.roomId !== chatRoomId) {
          return;
        }
        const participant = params?.participant;
        if (!participant) {
          return;
        }
        participantsRef.current.delete(participant);
        setCount(participantsRef.current.size);
        setError(null);
      },
      onDestroyed: params => {
        if (!isMountedRef.current) {
          return;
        }
        if (params?.roomId !== chatRoomId) {
          return;
        }
        participantsRef.current.clear();
        setCount(0);
        setError('Live session has ended.');
      },
    };

    try {
      const client = ChatClient.getInstance();
      client.roomManager.addRoomListener(listener);
    } catch (err: any) {
      const msg = err?.message || 'Failed to register presence listener';
      setError(msg);
      loggingService.error(
        '[LiveViewerPresence] Listener registration failed',
        {
          error: msg,
        },
      );
    }

    return () => {
      isMountedRef.current = false;
      try {
        const client = ChatClient.getInstance();
        client.roomManager.removeRoomListener(listener);
      } catch {
        // Ignore cleanup errors
      }
      if (currentRoomIdRef.current === chatRoomId) {
        participantsRef.current.clear();
        setCount(0);
      }
    };
  }, [enabled, chatRoomId, chatUserId, reconcileMembers, setCount]);

  const retry = useCallback(() => {
    reconcileMembers();
  }, [reconcileMembers]);

  return {
    viewerCount,
    error,
    retry,
  };
};
