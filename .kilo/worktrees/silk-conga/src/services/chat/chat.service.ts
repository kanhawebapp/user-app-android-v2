import {createIntake} from '../api/intake/intake.api';
import {IntakeInput, CreateIntakeResponse} from '../api/intake/intake.types';
import {UserProfile} from '../api/profile/profile.types';
import {ChatRequestPayload, CallRequestPayload} from '../socket/socket.types';
import {socketService, resetChatAcceptedFlag} from '../socket/socket.service';
import {SOCKET_EVENTS} from '../socket/socket.events';
import {useChatStore} from './chat.store';
import {useCallStore} from '../call/call.store';
import {ChatRequestInput, ChatRequestResult} from './chat.types';

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

  console.log('[ChatService] ===== FINAL PAYLOAD CREATED =====');
  console.log('[ChatService] Payload:', JSON.stringify(payload, null, 2));
  console.log('[ChatService] ===== END PAYLOAD =====');

  return Object.freeze(payload);
};

const generateCallId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const sendChatRequest = async (
  input: ChatRequestInput,
): Promise<ChatRequestResult> => {
  try {
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
      // requestType: input.consultationType,
    };

    const intakeResponse = await createIntake(apiPayload);

    if (!intakeResponse.roomId || intakeResponse.roomId === 'undefined') {
      throw new Error('Invalid roomId from API response');
    }

    console.log(
      '[ChatService] Intake API success. Room ID:',
      intakeResponse.roomId,
    );

// ============ CALL FLOW ============
    if (input.consultationType === 'call') {
      console.log('[ChatService] Processing call consultation flow');

      const callId = generateCallId();

      // Initialize call store BEFORE any emits so participant context is ready
      const callStore = useCallStore.getState();
      callStore.setCallId(callId);
      callStore.setParticipant({
        id: input.astrologerId,
        name: input.astrologerName || 'Astrologer',
        image: input.userProfile?.profilePic || '',
      });
      // Set additional fields via setState (callerId, calleeId, roomId)
      useCallStore.setState({
        callerId: input.userProfile.id,
        calleeId: input.astrologerId,
        roomId: intakeResponse.roomId,
      });

      // DO NOT set 'calling' yet — wait for queue decision.
      // 'calling' status triggers CallScreen navigation and WebRTC start
      // in other observers; setting it before the queue clears causes
      // CallScreen + QueueBubble to appear simultaneously.
      callStore.setStatus('queue_checking');

      console.log('[ChatService] Call store initialized:', {
        callId,
        callerId: input.userProfile.id,
        calleeId: input.astrologerId,
        roomId: intakeResponse.roomId,
      });

      // Ensure socket connection
      console.log('[ChatService] Connecting to socket for call...');
      const socket = await socketService.connectAndWait();
      console.log('[ChatService] Socket connected:', socket.id);

      // Create full payload using prepareSocketPayload and extend with call-specific fields
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

      console.log('[ChatService] ===== FINAL CALL PAYLOAD =====');
      console.log(JSON.stringify(callPayload, null, 2));
      console.log('[ChatService] ===== END CALL PAYLOAD =====');

      // ───────────────────────────────────────────────────────────────────────
      // Queue management promise for calls.
      // Attach QUEUE_POSITION and QUEUE_UPDATE listeners synchronously BEFORE
      // emitting call_request so there is no race with the server response.
      // Architecture: wait for proper server events instead of a short timeout.
      // The callStore status stays 'queue_checking' until we know the outcome.
      // ───────────────────────────────────────────────────────────────────────
      let queueResolved = false;

      const QUEUE_WINDOW_MS = 5000;
      const queueWindowTimer = setTimeout(() => {
        if (queueResolved) return;
        console.log(
          '[ChatService] QUEUE_WINDOW_MS expired — no queue_position received, treating as direct call',
        );
        queueResolved = true;
        callStore.setStatus('calling');
        // Resolve as direct call
      }, QUEUE_WINDOW_MS);

      const queueManagementPromise = new Promise<{
        isQueued: boolean;
        isCall: boolean;
      }>((resolve, reject) => {
        // Attach synchronously inside the constructor — listener is live before
        // emit(call_request) on the next tick.
        (socket as any).once(SOCKET_EVENTS.QUEUE_POSITION, (data: any) => {
          if (queueResolved) return;

          console.log('QUEUE_POSITION_RECEIVED', {
            position: data?.position,
            waitTime: data?.waitTime,
            estimatedWaitTime: data?.estimatedWaitTime,
            astrologerName: data?.astrologerName,
            astrologerId: data?.astrologerId,
          });

          const position = data?.position ?? 0;
          const waitTime = Number(
            data?.waitTime ?? data?.estimatedWaitTime ?? 0,
          );

          if (waitTime < 0) {
            console.warn('QUEUE_POSITION_RECEIVED negative waitTime, ignoring');
            return;
          }

          if (position === 0 && waitTime <= 0) {
            // ── Direct call — no queue ──────────────────────────────────────────
            console.log('CALL_FLOW_ALLOWED: no queue — position 0');
            queueResolved = true;
            clearTimeout(queueWindowTimer);
            callStore.setStatus('calling');
            resolve({isQueued: false, isCall: true});
            return;
          }

          if (position >= 1 && waitTime > 0) {
            // ── Queued — BLOCK all call flow ─────────────────────────────────────
            console.log('CALL_FLOW_BLOCKED_BY_QUEUE', {
              position,
              waitTime,
            });
            queueResolved = true;
            clearTimeout(queueWindowTimer);
            // Status stays 'queue_checking'; QueueBubble is shown by the global
            // socket-service listener. We remain blocked until the queue clears.
            return;
          }

          // ── Fallback: treat as direct ──────────────────────────────────────────
          console.log('QUEUE_POSITION fallback as direct');
          queueResolved = true;
          clearTimeout(queueWindowTimer);
          callStore.setStatus('calling');
          resolve({isQueued: false, isCall: true});
        });

        // QUEUE_UPDATE fired — queue has been cleared (position === 0).
        (socket as any).once(SOCKET_EVENTS.QUEUE_UPDATE, (data: any) => {
          if (queueResolved) return;

          const position = data?.position ?? -1;
          console.log('QUEUE_UPDATE_RECEIVED', {position});

          if (position === 0) {
            console.log('QUEUE_COMPLETED');
            queueResolved = true;
            clearTimeout(queueWindowTimer);
            // NOW allow the call flow to proceed
            callStore.setStatus('calling');
            console.log('STARTING_CALL_AFTER_QUEUE');
            resolve({isQueued: true, isCall: true});
            return;
          }

          console.log('QUEUE_UPDATE_POSITION_CHANGED', {position});
        });

        // Socket disconnect — reject immediately.
        (socket as any).once('disconnect', () => {
          if (queueResolved) return;
          console.warn('[ChatService] Socket disconnected during queue wait');
          queueResolved = true;
          clearTimeout(queueWindowTimer);
          callStore.setStatus('idle');
          reject('Socket disconnected during queue wait');
        });
      });

      // ── Emit call_request AFTER listeners are registered ─────────────────────
      const emitted = socketService.emit('call_request', callPayload);

      console.log('[ChatService] call_request emitted:', emitted);

      if (!emitted) {
        console.warn('[ChatService] Failed to emit call_request');
        callStore.reset();
        throw new Error('Failed to send call request');
      }

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
          socketEmitted: emitted,
        };
      } catch (error: any) {
        console.error('[ChatService] Queue promise error:', error);
        callStore.reset();
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
    });

    console.log('[ChatService] Connecting to socket...');
    resetChatAcceptedFlag();
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
      position: 1,
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
