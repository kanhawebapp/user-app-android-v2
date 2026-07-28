// import {graphqlRequest} from '../graphql.client';

// import {
//   GetUserChatHistoryResponse,
//   UserChatHistoryFilterInput,
//   // UserChatHistoryInput,
// } from './chat-history.types';
// // import { UserChatHistoryFilterInput } from './useChatHistory';

// const GET_USER_CHAT_HISTORY = `
// query GetUserChatHistory($filter: UserChatHistoryFilterInput) {
//   getUserChatHistory(filter: $filter) {
//     totalCount
//     currentPage
//     totalPages

//     data {
//       sessionId
//       roomId
//       status

//       astrologer {
//         id
//         name
//         profilePic
//       }

//       startedAt
//       endedAt
//     }
//   }
// }
// `;

// export const getUserChatHistory = async (
//   filter: UserChatHistoryFilterInput,
// ) => {
//   try {
//     console.log('CHAT HISTORY FILTER:', filter);

//     const response = await graphqlRequest<GetUserChatHistoryResponse>(
//       'GetUserChatHistory',
//       GET_USER_CHAT_HISTORY,
//       {
//         filter,
//       },
//     );

//     console.log('CHAT HISTORY RESPONSE HERE', response);

//     return response.getUserChatHistory;
//   } catch (error: any) {
//     console.log(
//       'GET USER CHAT HISTORY ERROR:',
//       error?.response?.data || error,
//     );

//     throw error;
//   }
// };

import {graphqlRequest} from '../graphql.client';

import {
  GetUserChatHistoryResponse,
  UserChatHistoryFilterInput,
} from './chat-history.types';

const GET_USER_CHAT_HISTORY = `
query GetUserChatHistory($filter: UserChatHistoryFilterInput) {
  getUserChatHistory(filter: $filter) {
    success

    summary {
      totalCoinsDeducted
      totalCoinsEarned
      totalCommission
      totalRecords
    }

    totalCount
    currentPage
    totalPages

    data {
      srNo

      roomId

      sessionId

      status

      durationMinutes

      ratePerMin

      coinsDeducted

      coinsEarned

      commission

      createdAt

      astrologer {
        name
      }

      lastMessage {
        message
        image
      }
    }
  }
}
`;

export const getUserChatHistory = async (
  filter: UserChatHistoryFilterInput,
) => {
  try {
    console.log('CHAT HISTORY FILTER:', filter);

    const response = await graphqlRequest<GetUserChatHistoryResponse>(
      'GetUserChatHistory',
      GET_USER_CHAT_HISTORY,
      {
        filter,
      },
    );

    console.log('CHAT HISTORY RESPONSE:', response);

    return response.getUserChatHistory;
  } catch (error: any) {
    console.log(
      'GET USER CHAT HISTORY ERROR:',
      error?.response?.data || error?.message || error,
    );

    throw error;
  }
};
