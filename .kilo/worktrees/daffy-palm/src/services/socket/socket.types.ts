import {Socket} from 'socket.io-client';

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderType: 'user' | 'astrologer';
  message: string;
  timestamp: number;
  status: 'sending' | 'sent' | 'delivered' | 'failed';
}

export interface QueueData {
  position: number;
  estimatedWaitTime: number;
  waitTime?: number;
  astrologerId: string;
  astrologerName?: string;
  roomId?: string | null;
  message?: string;
  type?: string;
}

export interface TypingStatus {
  roomId: string;
  isTyping: boolean;
  senderType: 'user' | 'astrologer';
}

export interface ChatRoom {
  roomId: string;
  astrologerId: string;
  astrologerName: string;
  userId: string;
  status: 'waiting' | 'queued' | 'active' | 'rejected' | 'completed';
  startedAt?: number;
  endedAt?: number;
  maximumTime: number;
}

export interface ServerToClientEvents {
  welcome: (data: {message: string}) => void;
  chat_request_received: (data: {
    success: boolean;
    message?: string;
    roomId?: string;
  }) => void;
  queue_position: (data: QueueData) => void;
  queue_update: (data: Partial<QueueData>) => void;
  chatAcceptedByAstrologer: (data: {
    roomId: string;
    astrologerName: string;
  }) => void;
  chat_rejected: (data: {roomId: string; reason?: string}) => void;
  room_joined: (data: {roomId: string; success: boolean}) => void;
  receive_message: (data: ChatMessage) => void;
  typing: (data: TypingStatus) => void;
  leave_chat: (data: {roomId: string; reason?: string}) => void;
  chatCompleted: (data: {roomId: string; ratingNeeded: boolean}) => void;
  user_disconnected: (data: {
    roomId: string;
    userType: 'user' | 'astrologer';
  }) => void;
  error: (data: {message: string; code?: string}) => void;

  webrtc_offer: (data: {callId: string; sdp: any; callerId: string}) => void;
  webrtc_answer: (data: {callId: string; sdp: any}) => void;
  webrtc_ice_candidate: (data: {callId: string; candidate: any}) => void;
  webrtc_call_accepted: (data: {callId: string}) => void;
  webrtc_call_rejected: (data: {callId: string; reason?: string}) => void;
  webrtc_call_end: (data: {callId: string}) => void;

  // WebRTC signaling - new flow
  peer_joined: (data: {room_id: string}) => void;
  offer: (data: {
    room_id: string;
    callId?: string;
    callerId?: string;
    offer: {type: string; sdp: string};
  }) => void;
  answer: (data: {
    room_id: string;
    answer: {type: string; sdp: string};
  }) => void;
  'ice-candidate': (data: {room_id: string; candidate: any}) => void;
  call_ended_by_astrologer: (data: {room_id: string}) => void;
}


export interface ClientToServerEvents {
  message: (data: any) => void;
  chat_request: (data: ChatRequestPayload) => void;
  join_room: (data: {roomId: string}) => void;
  send_message: (data: {
    roomId: string;
    message: string;
    messageId: string;
  }) => void;
  joinChat: (data: {roomId: string}) => void;
  typing: (data: {roomId: string; isTyping: boolean}) => void;
  cancel_chat_request: (data: {roomId: string}) => void;
  leaveChat: (data: {roomId: string}) => void;
  chatCompleted: (data: {roomId: string}) => void;
  end_chat: (data: {roomId: string}) => void;

  // WebRTC signaling - legacy
  webrtc_initiate_call: (data: {
    callId: string;
    callerId: string;
    calleeId: string;
    roomId: string;
  }) => void;
  webrtc_offer: (data: {
    callId: string;
    sdp: any;
    callerId?: string;
    calleeId?: string;
  }) => void;
  webrtc_answer: (data: {callId: string; sdp: any}) => void;
  webrtc_ice_candidate: (data: {callId: string; candidate: any}) => void;
  webrtc_call_accepted: (data: {callId: string}) => void;
  webrtc_call_rejected: (data: {callId: string; reason?: string}) => void;
  webrtc_call_end: (data: {callId: string}) => void;

  // WebRTC signaling - new flow
  join_call: (data: {room_id: string}) => void;
  offer: (data: {
    room_id: string;
    callId?: string;
    callerId?: string;
    offer: {type: string; sdp: string};
  }) => void;
  answer: (data: {room_id: string; answer: {type: string; sdp: string}}) => void;
  'ice-candidate': (data: {room_id: string; candidate: any}) => void;
  call_ended_by_user: (data: {room_id: string}) => void;

}

export interface ChatRequestPayload {
  name: string;
  user_id: string;
  astro_id: string;
  room_id: string;
  maximum_time: number;
  phoneNumber: string;
  userName: string;
  gender: string;
  timeOfBirth: string;
  location: string;
  dateOfBirth?: string;
  birthTime?: string;
  is_promotional?: boolean;
  user_image?: string;
  occupation?: string;
}

export interface CallRequestPayload extends ChatRequestPayload {
  callId: string;
  callerId: string;
  callerName: string;
  callerImage?: string;
  receiverId: string;
  consultationType: 'call';
}

export type {Socket};
