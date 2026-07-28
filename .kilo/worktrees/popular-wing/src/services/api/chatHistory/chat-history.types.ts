// export interface ChatMessage {
//   id: string;

//   message: string;

//   sender: string;

//   createdAt: string;

//   __typename?: string;
// }

// export interface UserChatHistory {
//   sessionId: string;

//   roomId: string;

//   status: string;

//   astrologerName: string;

//   astrologerId: string;

//   astrologerImage?: string;

//   startedAt: string;

//   endedAt?: string;

//   durationSec?: number;

//   coinsDeducted?: number;

//   coinsEarned?: number;

//   createdAt?: string;

//   messages: ChatMessage[];

//   __typename?: string;
// }

// export interface UserChatHistoryPagination {
//   totalCount: number;

//   currentPage: number;

//   totalPages: number;

//   data: UserChatHistory[];

//   __typename?: string;
// }

// export interface GetUserChatHistoryResponse {
//   getUserChatHistory: UserChatHistoryPagination;
// }

// export interface UserChatHistoryInput {
//   page?: number;

//   limit?: number;

//   status?: string;

//   astrologerName?: string;

//   startDate?: string;

//   endDate?: string;
// }

// export interface Astrologer {
//   id: string;

//   name: string;

//   profilePic?: string;
// }

// export interface ChatHistory {
//   sessionId: string;

//   roomId: string;

//   status: string;

//   astrologer: Astrologer;

//   startedAt: string;

//   endedAt?: string;
// }

// export interface ChatHistoryPagination {
//   totalCount: number;

//   currentPage: number;

//   totalPages: number;

//   data: ChatHistory[];
// }

// // export interface GetUserChatHistoryResponse {
// //   getUserChatHistory: ChatHistoryPagination;
// // }

// export interface UserChatHistoryFilterInput {
//   page?: number;

//   limit?: number;

//   status?: string;

//   startDate?: string;

//   endDate?: string;
// }

export interface LastMessage {
  message?: string;

  image?: string;
}

export interface Astrologer {
  name: string;
}

export interface ChatHistory {
  srNo: number;

  roomId: string;

  sessionId: string;

  status: string;

  durationMinutes: number;

  ratePerMin: number;

  coinsDeducted: number;

  coinsEarned: number;

  commission: number;

  createdAt: string;

  astrologer: Astrologer;

  lastMessage?: LastMessage;
}

export interface ChatHistorySummary {
  totalCoinsDeducted: number;

  totalCoinsEarned: number;

  totalCommission: number;

  totalRecords: number;
}

export interface ChatHistoryPagination {
  success: boolean;

  summary: ChatHistorySummary;

  totalCount: number;

  currentPage: number;

  totalPages: number;

  data: ChatHistory[];
}

export interface GetUserChatHistoryResponse {
  getUserChatHistory: ChatHistoryPagination;
}

export interface UserChatHistoryFilterInput {
  page?: number;

  limit?: number;

  status?: string;

  astrologerName?: string;

  startDate?: string;

  endDate?: string;
}
