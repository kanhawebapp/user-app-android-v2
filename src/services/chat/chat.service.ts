import {createIntake} from '../api/intake/intake.api';
import {IntakeInput, CreateIntakeResponse} from '../api/intake/intake.types';
import {UserProfile} from '../api/profile/profile.types';
import {ChatRequestPayload, CallRequestPayload} from '../socket/socket.types';
import {socketService, resetChatAcceptedFlag} from '../socket/socket.service';
import {SOCKET_EVENTS} from '../socket/socket.events';
import {useChatStore} from './chat.store';
import {useCallStore} from '../call/call.store';
import {
  promoteCallToCalling,
  resetCallReadyFlag,
} from '../call/call.queue';
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

    if (
      !intakeResponse ||
      (intakeResponse as {success?: boolean}).success === false
    ) {
      const errorMessage =
        (intakeResponse as {error?: string})?.error ||
        'Failed to create intake';
      console.log('[ChatService] Intake failed:', errorMessage);
      useChatStore.getState().setChatStatus('idle');
      return {
        success: false,
        error: errorMessage,
      };
    }

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
    // CALL FLOW — same architecture as CHAT (fire-and-forget + global queue)
    // Queue/acceptance lives in SocketService + call.queue.ts / callStore.
    // Do NOT attach per-request QUEUE_* listeners here (chat does not either).
    // ============================================================
    if (input.consultationType === 'call') {
      const callId = generateCallId();

      // Reset acceptance/queue mutexes for a fresh request (mirrors chat).
      resetChatAcceptedFlag();
      resetCallReadyFlag();

      useCallStore.getState().reset();
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
        status: 'waiting',
        pendingCallCancelled: false,
        shouldNavigateToCall: false,
        queueData: null,
        queueTimeLeft: 0,
      });

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
      // Selected astrologer helps QueueBubble / Call UI (same as chat path).
      useChatStore.getState().setSelectedAstrologer({
        id: input.astrologerId,
        name: input.astrologerName || 'Astrologer',
        displayName: input.astrologerName || 'Astrologer',
        image: input.userProfile?.profilePic || '',
        rating: 0,
        experience: '',
        skills: [],
        isAvailableForChat: false,
      });

      console.log('[ChatService] Connecting to socket for call...');
      await socketService.connectAndWait();

      const emitted = socketService.emit('call_request', callPayload);
      console.log('[ChatService] call_request emitted:', emitted);

      if (!emitted) {
        useCallStore.getState().reset();
        return {
          success: false,
          error: 'Failed to emit call_request',
        };
      }

      // Soft fallback like chat's initial queue window: if no QUEUE_* arrives,
      // promote to calling so AppContent can open Call (WebRTC still waits
      // for callAcceptedByAstrologer on Call screen). Cancelled if queued first.
      setTimeout(() => {
        const call = useCallStore.getState();
        if (
          call.status === 'waiting' &&
          !call.queueData &&
          !call.pendingCallCancelled
        ) {
          promoteCallToCalling('no-queue soft timeout');
        }
      }, 800);

      return {
        success: true,
        isCall: true,
        callId,
        roomId: intakeResponse.roomId,
        intakeResponse,
        socketEmitted: emitted,
      };
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

    useChatStore.getState().startInitialQueueTimer(intakeResponse.roomId);

    return {
      success: true,
      intakeResponse,
      socketEmitted: emitted1 && emitted2,
    };
  } catch (error: any) {
    const errorMessage =
      error?.message ||
      error?.response?.data?.errors?.[0]?.message ||
      'Failed to send chat request';
    console.log('[ChatService] ERROR:', errorMessage);
    console.log('[ChatService] Intake failed:', errorMessage);
    useChatStore.getState().setChatStatus('idle');
    useCallStore.getState().reset();
    return {
      success: false,
      error: errorMessage,
    };
  }
};
