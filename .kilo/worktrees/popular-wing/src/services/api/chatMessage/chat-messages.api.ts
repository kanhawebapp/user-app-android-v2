// import {graphqlRequest} from '../graphql.client';

// import {
//   GetChatMessagesResponse,
// } from './chat-messages.types';

// const GET_CHAT_MESSAGES_BY_SESSION_ID = `
// query GetChatMessagesBySessionId($sessionId: String!) {
//   getChatMessagesBySessionId(sessionId: $sessionId) {
//     id

//     msgId

//     roomId

//     senderId

//     receiverId

//     sender

//     message

//     image

//     createdAt
//   }
// }
// `;

// export const getChatMessagesBySessionId = async (
//   sessionId: string,
// ) => {
//   try {
//     console.log('SESSION ID:', sessionId);

//     const response =
//       await graphqlRequest<GetChatMessagesResponse>(
//         'GetChatMessagesBySessionId',
//         GET_CHAT_MESSAGES_BY_SESSION_ID,
//         {
//           sessionId,
//         },
//       );

//     console.log('CHAT MESSAGES RESPONSE:', response);

//     return response.getChatMessagesBySessionId;
//   } catch (error: any) {
//     console.log(
//       'GET CHAT MESSAGES ERROR:',
//       error?.response?.data || error?.message || error,
//     );

//     throw error;
//   }
// };

import {graphqlRequest} from '../graphql.client';

import {GetChatMessagesResponse} from './chat-messages.types';

const GET_CHAT_MESSAGES_BY_SESSION_ID = `
query GetChatMessagesBySessionId($sessionId: String!) {
  getChatMessagesBySessionId(sessionId: $sessionId) {

    msg_id

    room_id

    sender_id

    received_id

    sender

    message

    image
  }
}
`;

export const getChatMessagesBySessionId = async (sessionId: string) => {
  try {
    console.log('SESSION ID:', sessionId);

    const response = await graphqlRequest<GetChatMessagesResponse>(
      'GetChatMessagesBySessionId',
      GET_CHAT_MESSAGES_BY_SESSION_ID,
      {
        sessionId,
      },
    );

    console.log('CHAT MESSAGES RESPONSE:', response);

    return response.getChatMessagesBySessionId;
  } catch (error: any) {
    console.log(
      'GET CHAT MESSAGES ERROR:',
      error?.response?.data || error?.message || error,
    );

    throw error;
  }
};
