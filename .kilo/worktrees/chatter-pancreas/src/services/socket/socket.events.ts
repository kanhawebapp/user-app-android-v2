export const SOCKET_EVENTS = {
  // Connection events
  CONNECT: 'connect',
  CONNECT_ERROR: 'connect_error',
  DISCONNECT: 'disconnect',

  // Client-to-Server events (Chat)
  CHAT_REQUEST: 'chat_request',
  JOIN_ROOM: 'join_room',
  SEND_MESSAGE: 'send_message',
  JOIN_CHAT: 'joinChat',
  TYPING: 'typing',
  CANCEL_CHAT_REQUEST: 'cancel_chat_request',
  LEAVE_CHAT: 'leaveChat',
  CHAT_COMPLETED: 'chatCompleted',
  END_CHAT: 'end_chat',

  // Call events - Client to Server
  JOIN_CALL: 'join_call',
  OFFER: 'offer',
  ANSWER: 'answer',
  ICE_CANDIDATE: 'ice-candidate',
  CALL_ENDED_BY_USER: 'call_ended_by_user',

  // WebRTC events (for video/advanced features - keep for reference)
  WEBRTC_INITIATE_CALL: 'webrtc_initiate_call',
  WEBRTC_CALL_ACCEPTED: 'webrtc_call_accepted',
  WEBRTC_CALL_REJECTED: 'webrtc_call_rejected',
  WEBRTC_CALL_END: 'webrtc_call_end',
  WEBRTC_OFFER: 'webrtc_offer',
  WEBRTC_ANSWER: 'webrtc_answer',
  WEBRTC_ICE_CANDIDATE: 'webrtc_ice_candidate',

  // Server-to-Client events (Chat)
  WELCOME: 'welcome',
  CHAT_REQUEST_RECEIVED: 'chat_request_received',
  QUEUE_POSITION: 'queue_position',
  QUEUE_UPDATE: 'queue_update',
  CHAT_ACCEPTED: 'chatAcceptedByAstrologer',
  CHAT_REJECTED: 'chat_rejected',
  ROOM_JOINED: 'room_joined',
  RECEIVE_MESSAGE: 'receive_message',
  TYPING_STATUS: 'typing',
  LEAVE_CHAT_EVENT: 'leave_chat',
  CHAT_COMPLETED_EVENT: 'chatCompleted',
  USER_DISCONNECTED: 'user_disconnected',
  ERROR: 'error',

  // Call events - Server to Client
  PEER_JOINED: 'peer_joined',
  CALL_ENDED_BY_ASTROLOGER: 'call_ended_by_astrologer',
  CALL_CANCEL_BY_USER: 'call_ended_by_user',
} as const;

export type SocketEvent = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];

export const isChatEvent = (event: string): boolean => {
  return Object.values(SOCKET_EVENTS).includes(event as SocketEvent);
};
