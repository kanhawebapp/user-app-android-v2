import {createIntake} from '../api/intake/intake.api';
import {IntakeInput, CreateIntakeResponse} from '../api/intake/intake.types';
import {UserProfile} from '../api/profile/profile.types';
import {ChatRequestPayload} from '../socket/socket.types';
import {socketService, resetChatAcceptedFlag} from '../socket/socket.service';
import {SOCKET_EVENTS} from '../socket/socket.events';
import {useChatStore} from './chat.store';

export interface ChatRequestInput {
  astrologerId: string;
  astrologerName?: string;
  userProfile: UserProfile;
  name: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  placeOfBirth: string;
  birthTime: string;
  occupation?: string;
}

export interface ChatRequestResult {
  success: boolean;
  intakeResponse?: CreateIntakeResponse;
  socketEmitted?: boolean;
  error?: string;
}

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

export const sendChatRequest = async (
  input: ChatRequestInput,
): Promise<ChatRequestResult> => {
  try {
    console.log('[ChatService] Starting chat request flow...');

    if (!input.astrologerId) {
      throw new Error('Missing astrologerId');
    }

    if (!input.userProfile?.id) {
      throw new Error('Missing userProfile.id');
    }

    const {
      setRoomId,
      setChatStatus,
      setTimer,
      setUserData,
      setChatDuration,
      setTimeLeft,
    } = useChatStore.getState();

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
      requestType: 'chat',
    };

    const intakeResponse = await createIntake(apiPayload);

    if (!intakeResponse.roomId || intakeResponse.roomId === 'undefined') {
      throw new Error('Invalid roomId from API response');
    }

    console.log(
      '[ChatService] Intake API success. Room ID:',
      intakeResponse.roomId,
    );

    const socketPayload = prepareSocketPayload(
      intakeResponse,
      input,
      input.userProfile,
    );

    setRoomId(intakeResponse.roomId);
    setChatStatus('waiting');

    // Store maximum_time (chat duration) in seconds - single source of truth
    const chatDurationSeconds = intakeResponse.chatTime * 60;
    // const chatDurationSeconds = 2 * 60;
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
