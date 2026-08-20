// export interface ChatMessage {
//   id: string;

//   msgId: string;

//   roomId: string;

//   senderId: string;

//   receiverId: string;

//   sender: string;

//   message?: string;

//   image?: string;

//   createdAt: string;
// }

// export interface GetChatMessagesResponse {
//   getChatMessagesBySessionId: ChatMessage[];
// }

export interface ChatMessage {
  msg_id: string;

  room_id: string;

  sender_id: string;

  received_id: string;

  sender: string;

  message?: string;

  image?: string;

  time?: string;
}

export interface GetChatMessagesResponse {
  getChatMessagesBySessionId: ChatMessage[];
}
