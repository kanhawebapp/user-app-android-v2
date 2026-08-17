import {createIntake} from '../api/intake/intake.api';
import {IntakeInput, CreateIntakeResponse} from '../api/intake/intake.types';
import {UserProfile} from '../api/profile/profile.types';
import {ChatRequestPayload, CallRequestPayload} from '../socket/socket.types';
import {socketService, resetChatAcceptedFlag} from '../socket/socket.service';
import {SOCKET_EVENTS} from '../socket/socket.events';
import {useChatStore} from './chat.store';
import {useCallStore} from '../call/call.store';
import {ChatRequestInput, ChatRequestResult} from './chat.types';
import { Platform } from 'react-native';

const mapGenderToAPI = (
  gender: 'male' | 'female' | 'other',
): 'MALE' | 'FEMALE' | 'OTHER' => {
  switch (gender) {
    case 'male':
      return 'MALE';
    case 'female':
      return 'FEMALE';
    default:
      return 'OTHER';
  }
};

const formatDate = (date: string): string => {
  if (!date) {
    return '';
  }
  const [day, month, year] = date.split('/');
  return `${year}-${month}-${day}`;
};

const formatTime = (time: string): string => {
  if (!time) {
    return '00:00';
  }

  const [timePart, modifier] = time.split(' ');
  let [hours, minutes] = timePart.split(':');

  if (modifier === 'PM' && hours !== '12') {
    hours = String(parseInt(hours, 10) + 12);
  }
  if (modifier === 'AM' && hours === '12') {
    hours = '00';
  }

  return `${hours}:${minutes}`;
};

const formatToISODate = (date: string): string => {
  if (!date) {
    return new Date().toISOString();
  }
  const [day, month, year] = date.split('/');
  return `${year}-${month}-${day}T00:00:00.000Z`;
};

const prepareSocketPayload = (
  intakeResponse: CreateIntakeResponse,
  input: ChatRequestInput,
  userProfile: UserProfile,
): ChatRequestPayload => {
  const phoneNumber = `${userProfile.countryCode}${userProfile.mobile}`;
  const occupation = input.occupation || userProfile.occupation || '';

  const payload: ChatRequestPayload = {
    name: input.name,
    userName: input.name,
    user_id: userProfile.id,
    astro_id: input.astrologerId,
    gender: mapGenderToAPI(input.gender),
    dateOfBirth: formatToISODate(input.dateOfBirth),
    timeOfBirth: input.birthTime ? formatTime(input.birthTime) : '00:00',
    occupation: occupation,
    location: input.placeOfBirth,
    room_id: intakeResponse.roomId,
    maximum_time: intakeResponse.chatTime,
    is_promotional: false,
    user_image: userProfile?.profilePic || '',
    phoneNumber: phoneNumber,
  };

  return payload;
};

const generateCallId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const sendChatRequest = async (
  input: ChatRequestInput,
): Promise<ChatRequestResult> => {
  try {
    // Reset at start of every new request so the acceptance dedup guard
    // cannot block a fresh call/chat after the user cancels and retries.
    resetChatAcceptedFlag();

    console.log(
      '[ChatService] Starting consultation request flow...',
      input.consultationType,
    );

    if (!input.astrologerId) {
      throw new Error('Missing astrologerId');
    }

    if (!input.userProfile?.id) {
      throw new Error('Missing userProfile.id');
    }

    const apiPayload: IntakeInput = {
      astrologerId: input.astrologerId,
      name: input.name,
      countryCode: input.userProfile.countryCode,
      mobile: input.userProfile.mobile,
      gender: mapGenderToAPI(input.gender),
      birthDate: formatDate(input.dateOfBirth),
      birthTime: input.birthTime ? formatTime(input.birthTime) : '00:00',
      birthPlace: input.placeOfBirth,
      occupation: input.occupation || input.userProfile.occupation,
      requestType: input.consultationType || 'chat',
     source: Platform.OS === 'ios' ? 'IOS' : 'ANDROID'

    };

    const intakeResponse = await createIntake(apiPayload);

    // console.log('intake response', intakeResponse);

    // try {
    //   const intakeResponse = await createIntake(apiPayload);

    //   showToast({
    //     type: 'success',
    //     title: 'Request Created',
    //     message: 'Connecting you with astrologer...',
    //     visible: true
    //   });

    //   console.log('intake response', intakeResponse);

    //   // rest code...

    // } catch (error: any) {
    //   console.log('[ChatService] ERROR:', error?.message || error);

    //   showToast({
    //     type: 'error',
    //     title: 'Request Failed',
    //     message: error?.message ||
    //       'Unable to connect with astrologer. Please try again.',
    //     visible: true
    //   });

    //   useChatStore.getState().setChatStatus('idle');

    //   return {
    //     success: false,
    //     error: error?.message || 'Failed to send chat request',
    //   };
    // }

    if (!intakeResponse.roomId || intakeResponse.roomId === 'undefined') {
      throw new Error('Invalid roomId from API response');
    }

    // ============================================================
    // CALL FLOW — streamlined, no heavy logging in hot path
    // ============================================================
    if (input.consultationType === 'call') {
      const callId = generateCallId();

      // Single batched setState (4 individual calls → 1)
      useCallStore.setState({
        callId,
        callerId: input.userProfile.id,
        calleeId: input.astrologerId,
        roomId: intakeResponse.roomId,
        participant: {
          id: input.astrologerId,
          name: input.astrologerName || 'Astrologer',
          image: input.userProfile?.profilePic || '',
        },
      });

      // Block 'calling' until the queue decision arrives (prevents
      // CallScreen + QueueBubble from appearing simultaneously)
      useCallStore.getState().setStatus('queue_checking');

      // connectAndWait: fresh socket (creates + resolves) or cached (resolves instantly
      // via the .once guard). Either path is safe here.
      const socket = await socketService.connectAndWait();

      const socketPayload = prepareSocketPayload(
        intakeResponse,
        input,
        input.userProfile,
      );

      const callPayload: CallRequestPayload = {
        ...socketPayload,
        callId,
        callerId: input.userProfile.id,
        callerName: input.name,
        callerImage: input.userProfile?.profilePic || '',
        receiverId: input.astrologerId,
        consultationType: 'call',
      };

      useChatStore.getState().setUserPayload(callPayload);

      // ───────────────────────────────────────────────────────────────────────
      // Queue management promise for calls.
      // Attach QUEUE_POSITION and QUEUE_UPDATE listeners synchronously BEFORE
      // emitting call_request so there is no race with the server response.
      // Architecture: wait for proper server events instead of a short timeout.
      // The call store status stays 'queue_checking' until we know the outcome.
      // ───────────────────────────────────────────────────────────────────────
      let emitResult: boolean = false;

      const queueManagementPromise = new Promise<{
        isQueued: boolean;
        isCall: boolean;
      }>((resolve, reject) => {
        let queueResolved = false;
        let queueEventReceived = false;
        let queueTimerRef: NodeJS.Timeout | null = null;
        let queueWindowTimer: NodeJS.Timeout | null = null;
        let inactivityTimerRef: NodeJS.Timeout | null = null;

        const INACTIVITY_TIMEOUT_MS = 45000;

        const callStore = useCallStore.getState();
        const chatStore = useChatStore.getState();

        const cleanupQueueListeners = () => {
          if (queueTimerRef) {
            clearInterval(queueTimerRef);
            queueTimerRef = null;
          }
          if (inactivityTimerRef) {
            clearTimeout(inactivityTimerRef);
            inactivityTimerRef = null;
          }
          if (queueWindowTimer) {
            clearTimeout(queueWindowTimer);
            queueWindowTimer = null;
          }
          socket.off(SOCKET_EVENTS.QUEUE_POSITION, handleQueuePosition);
          socket.off(SOCKET_EVENTS.QUEUE_UPDATE, handleQueueUpdate);
          socket.off('disconnect', handleDisconnect);
          chatStore.setIsChatTimerStarted(true);
        };

        const resetInactivityTimer = () => {
          if (inactivityTimerRef) {
            clearTimeout(inactivityTimerRef);
          }
          inactivityTimerRef = setTimeout(() => {
            if (queueResolved) {
              return;
            }
            console.warn(
              '[ChatService] Queue inactivity timeout (45s) - no updates received',
            );
            cleanupQueueListeners();
            callStore.setStatus('idle');
            rejectOnce('Queue inactivity timeout - no updates received');
          }, INACTIVITY_TIMEOUT_MS);
        };

        const startQueueTimer = (seconds: number) => {
          if (queueTimerRef) {
            clearInterval(queueTimerRef);
          }
          chatStore.setQueueTimeLeft(seconds);
          queueTimerRef = setInterval(() => {
            const current = chatStore.queueTimeLeft;
            if (current <= 1) {
              clearInterval(queueTimerRef!);
              queueTimerRef = null;
            } else {
              chatStore.setQueueTimeLeft(current - 1);
            }
          }, 1000);
        };

        const handleQueuePosition = (data: any) => {
          if (queueResolved) {
            return;
          }

          queueEventReceived = true;

          const position = data?.position ?? 0;
          const waitTime = Number(
            data?.waitTime ?? data?.estimatedWaitTime ?? 0,
          );

          if (waitTime < 0) {
            return;
          }

          resetInactivityTimer();

          chatStore.setQueueData({
            position,
            waitTime,
            estimatedWaitTime: waitTime,
            astrologerId: data?.astrologerId ?? '',
            astrologerName: data?.astrologerName ?? '',
            roomId: data?.roomId ?? intakeResponse.roomId,
            message: data?.message ?? '',
          });

          // If queued (position > 0 or waitTime > 0), stay in queue state
          if (position > 0 || waitTime > 0) {
            if (queueWindowTimer) {
              clearTimeout(queueWindowTimer);
              queueWindowTimer = null;
            }
            callStore.setStatus('queued');
            if (waitTime > 0) {
              startQueueTimer(waitTime);
            }
            return;
          }

          // Direct call path: position === 0 && waitTime <= 0
          if (position === 0 && waitTime <= 0) {
            queueResolved = true;
            cleanupQueueListeners();
            callStore.setStatus('calling');
            chatStore.clearQueue();
            chatStore.setShouldNavigateToCall(true);
            resolveOnce({isQueued: false, isCall: true});
          }
        };

        const handleQueueUpdate = (data: any) => {
          if (queueResolved) {
            return;
          }

          const position = data?.position ?? -1;
          const waitTime = Number(
            data?.waitTime ?? data?.estimatedWaitTime ?? 0,
          );

          resetInactivityTimer();

          chatStore.updateQueueData({
            position,
            waitTime,
            estimatedWaitTime: waitTime,
            astrologerId: data?.astrologerId,
            astrologerName: data?.astrologerName,
          });

          // Update timer if waitTime > 0, clear if waitTime <= 0
          if (waitTime > 0) {
            startQueueTimer(waitTime);
          } else if (queueTimerRef) {
            clearInterval(queueTimerRef);
            queueTimerRef = null;
          }

          // Only resolve when position === 0 && waitTime <= 0
          if (position === 0 && waitTime <= 0) {
            queueResolved = true;
            cleanupQueueListeners();
            callStore.setStatus('calling');
            chatStore.clearQueue();
            chatStore.setShouldNavigateToCall(true);
            resolveOnce({isQueued: false, isCall: true});
          }
        };

        const handleDisconnect = () => {
          if (queueResolved) {
            return;
          }
          queueResolved = true;
          cleanupQueueListeners();
          callStore.setStatus('idle');
          rejectOnce('Socket disconnected during queue wait');
        };

        const resolveOnce = (value: {isQueued: boolean; isCall: boolean}) => {
          if (queueResolved) {
            return;
          }
          queueResolved = true;
          resolve(value);
        };

        const rejectOnce = (err: any) => {
          if (queueResolved) {
            return;
          }
          queueResolved = true;
          reject(err);
        };

        queueWindowTimer = setTimeout(() => {
          if (queueResolved || queueEventReceived) {
            return;
          }
          // No queue event received -> direct call
          callStore.setStatus('calling');
          resolveOnce({isQueued: false, isCall: true});
        }, 600);

        socket.on(SOCKET_EVENTS.QUEUE_POSITION, handleQueuePosition);
        socket.on(SOCKET_EVENTS.QUEUE_UPDATE, handleQueueUpdate);
        socket.on('disconnect', handleDisconnect);

        // ── Emit call_request AFTER all listeners are registered ──────────────────
        emitResult = socketService.emit('call_request', callPayload);

        if (!emitResult) {
          cleanupQueueListeners();
          clearTimeout(queueWindowTimer);
          callStore.setStatus('idle');
          rejectOnce('Failed to emit call_request');
          return;
        }

        console.log('[ChatService] call_request emitted:', emitResult);
      });

      // ── Await the queue-management result ───────────────────────────────────
      // This blocks the function return. Callers may proceed to CallScreen only
      // after this promise resolves — either because the queue cleared, or because
      // no queue exists (direct call path resolved synchronously from QUEUE_POSITION).
      try {
        const queueResult = await queueManagementPromise;
        const isQueued = queueResult.isQueued ?? false;

        console.log('[ChatService] Queue result received:', {
          isQueued,
          isCall: queueResult.isCall,
        });

        // Guard against race: cancelPendingCallQueue is set by
        // QueueBubble when the user taps "Cancel Request".
        const {pendingCallCancelled} = useChatStore.getState();
        if (pendingCallCancelled && !isQueued) {
          console.log(
            '[ChatService] Queue was cancelled by user — aborting call flow',
          );
          return {
            success: false,
            error: 'Call request cancelled by user',
          };
        }

        return {
          success: true,
          isCall: queueResult.isCall,
          ...(isQueued ? {isQueued: true, callId} : {callId}),
          roomId: intakeResponse.roomId,
          intakeResponse,
          socketEmitted: emitResult,
        };
      } catch (error: any) {
        console.error('[ChatService] Queue promise error:', error);
        useCallStore.getState().reset();
        return {
          success: false,
          error: error?.message || 'Queue flow error',
        };
      }
    }

    // ============ CHAT FLOW (existing) ============
    console.log('[ChatService] Processing chat consultation flow');
    const socketPayload = prepareSocketPayload(
      intakeResponse,
      input,
      input.userProfile,
    );

    const {
      setRoomId,
      setChatStatus,
      setTimer,
      setUserData,
      setUserPayload,
      setChatDuration,
      setTimeLeft,
    } = useChatStore.getState();

    setRoomId(intakeResponse.roomId);
    setChatStatus('waiting');

    const chatDurationSeconds = intakeResponse.chatTime * 60;
    setChatDuration(chatDurationSeconds);
    setTimeLeft(chatDurationSeconds);
    setTimer(intakeResponse.chatTime * 60);

    setUserData({
      name: input.name,
      gender: input.gender,
      dateOfBirth: input.dateOfBirth,
      placeOfBirth: input.placeOfBirth,
      birthTime: input.birthTime,
      occupation: input.occupation,
    });

    setUserPayload(socketPayload);

    console.log('[ChatService] Connecting to socket...');
    const socket = await socketService.connectAndWait();
    console.log('[ChatService] Socket connected:', socket.id);

    const emitted1 = socketService.emit(
      SOCKET_EVENTS.CHAT_REQUEST,
      socketPayload,
    );
    console.log('[ChatService] CHAT_REQUEST emitted:', emitted1);

    const emitted2 = socketService.emit(SOCKET_EVENTS.JOIN_ROOM, {
      roomId: intakeResponse.roomId,
    });
    console.log('[ChatService] JOIN_ROOM emitted:', emitted2);

    if (!emitted1 || !emitted2) {
      console.warn('[ChatService] Some emits failed, but continuing...');
    }

    setChatStatus('queued');
    useChatStore.getState().setQueueData({
      position: 0,
      waitTime: 60,
      estimatedWaitTime: 60,
      astrologerId: '',
      astrologerName: '',
      roomId: intakeResponse.roomId,
      message: 'Connecting you with astrologer...',
    });
    useChatStore.getState().startTimer(60);

    return {
      success: true,
      intakeResponse,
      socketEmitted: emitted1 && emitted2,
    };
  } catch (error: any) {
    console.log('[ChatService] ERROR:', error?.message || error);
    useChatStore.getState().setChatStatus('idle');
    return {
      success: false,
      error: error?.message || 'Failed to send chat request',
    };
  }
};
