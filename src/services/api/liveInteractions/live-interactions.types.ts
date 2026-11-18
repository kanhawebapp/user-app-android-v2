export type LiveInteractionType = 'AUDIO' | 'VIDEO';

/**
 * Backend request lifecycle statuses for a live private interaction.
 * Unknown values are tolerated at runtime and treated as non-terminal unless matched.
 */
export type LiveInteractionRequestStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'ENDED'
  | 'FAILED'
  | string;

export interface LiveInteractionPricing {
  audioPrice: number;
  videoPrice: number;
  walletBalance: number;
  audioAvailable: boolean;
  videoAvailable: boolean;
}

export interface GetLiveInteractionPricingResponse {
  getLiveInteractionPricing: LiveInteractionPricing | null;
}

export interface LiveInteractionRequest {
  id: string;
  liveStreamId: string;
  userId: string;
  astrologerId: string;
  agoraUid: number | null;
  interactionType: LiveInteractionType;
  status: LiveInteractionRequestStatus;
  requestedAt: string | null;
  acceptedAt: string | null;
  /** Server-persisted billable start time — set by startLiveInteraction. */
  startedAt: string | null;
  endedAt: string | null;
  durationSeconds?: number | null;
  billableMinutes?: number | null;
  chargedCoins?: number | null;
}

export interface CreateLiveInteractionRequestVariables {
  liveStreamId: string;
  interactionType: LiveInteractionType;
}

export interface CreateLiveInteractionRequestResponse {
  createLiveInteractionRequest: LiveInteractionRequest;
}

export interface MyLiveInteraction {
  request: LiveInteractionRequest | null;
  appId: string | null;
  channelName: string | null;
  uid: number | null;
  rtcToken: string | null;
}

export interface GetMyLiveInteractionResponse {
  getMyLiveInteraction: MyLiveInteraction | null;
}

export interface StartLiveInteractionResponse {
  startLiveInteraction: LiveInteractionRequest;
}

export interface EndLiveInteractionResult {
  id: string;
  status: LiveInteractionRequestStatus;
  interactionType: LiveInteractionType;
  startedAt: string | null;
  endedAt: string | null;
  durationSeconds: number | null;
  billableMinutes: number | null;
  chargedCoins: number | null;
}

export interface EndLiveInteractionResponse {
  endLiveInteraction: EndLiveInteractionResult;
}
