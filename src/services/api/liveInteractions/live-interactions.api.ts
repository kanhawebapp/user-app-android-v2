import {graphqlRequest} from '../graphql.client';
import {
  CreateLiveInteractionRequestResponse,
  CreateLiveInteractionRequestVariables,
  EndLiveInteractionResponse,
  EndLiveInteractionResult,
  GetLiveInteractionPricingResponse,
  GetMyLiveInteractionResponse,
  LiveInteractionPricing,
  LiveInteractionRequest,
  MyLiveInteraction,
  StartLiveInteractionResponse,
} from './live-interactions.types';

const LIVE_INTERACTION_REQUEST_FIELDS = `
  id
  liveStreamId
  userId
  astrologerId
  agoraUid
  interactionType
  status
  requestedAt
  acceptedAt
  startedAt
  endedAt
  durationSeconds
  billableMinutes
  chargedCoins
`;

const GET_LIVE_INTERACTION_PRICING = `
query GetLiveInteractionPricing($astrologerId: ID!) {
  getLiveInteractionPricing(astrologerId: $astrologerId) {
    audioPrice
    videoPrice
    walletBalance
    audioAvailable
    videoAvailable
  }
}
`;

const CREATE_LIVE_INTERACTION_REQUEST = `
mutation CreateLiveInteractionRequest(
  $liveStreamId: ID!
  $interactionType: LiveInteractionType!
) {
  createLiveInteractionRequest(
    liveStreamId: $liveStreamId
    interactionType: $interactionType
  ) {
    ${LIVE_INTERACTION_REQUEST_FIELDS}
  }
}
`;

const GET_MY_LIVE_INTERACTION = `
query GetMyLiveInteraction($liveStreamId: ID!) {
  getMyLiveInteraction(liveStreamId: $liveStreamId) {
    request {
      ${LIVE_INTERACTION_REQUEST_FIELDS}
    }
    appId
    channelName
    uid
    rtcToken
  }
}
`;

/**
 * Persists the billable interaction start time on the server.
 * Must be called after the guest publishes on the public live channel,
 * and before EndLiveInteraction.
 */
const START_LIVE_INTERACTION = `
mutation StartLiveInteraction($requestId: ID!) {
  startLiveInteraction(requestId: $requestId) {
    ${LIVE_INTERACTION_REQUEST_FIELDS}
  }
}
`;

const END_LIVE_INTERACTION = `
mutation EndLiveInteraction($requestId: ID!) {
  endLiveInteraction(requestId: $requestId) {
    id
    status
    interactionType
    startedAt
    endedAt
    durationSeconds
    billableMinutes
    chargedCoins
    __typename
  }
}
`;

export const getLiveInteractionPricing = async (
  astrologerId: string,
): Promise<LiveInteractionPricing> => {
  const response = await graphqlRequest<GetLiveInteractionPricingResponse>(
    'GetLiveInteractionPricing',
    GET_LIVE_INTERACTION_PRICING,
    {astrologerId},
  );

  const pricing = response.getLiveInteractionPricing;
  if (!pricing) {
    throw new Error('Live interaction pricing is unavailable.');
  }

  return pricing;
};

export const createLiveInteractionRequest = async (
  variables: CreateLiveInteractionRequestVariables,
): Promise<LiveInteractionRequest> => {
  const response = await graphqlRequest<CreateLiveInteractionRequestResponse>(
    'CreateLiveInteractionRequest',
    CREATE_LIVE_INTERACTION_REQUEST,
    {
      liveStreamId: variables.liveStreamId,
      interactionType: variables.interactionType,
    },
  );

  return response.createLiveInteractionRequest;
};

export const getMyLiveInteraction = async (
  liveStreamId: string,
): Promise<MyLiveInteraction | null> => {
  const response = await graphqlRequest<GetMyLiveInteractionResponse>(
    'GetMyLiveInteraction',
    GET_MY_LIVE_INTERACTION,
    {liveStreamId},
  );

  return response.getMyLiveInteraction ?? null;
};

export const startLiveInteraction = async (
  requestId: string,
): Promise<LiveInteractionRequest> => {
  const response = await graphqlRequest<StartLiveInteractionResponse>(
    'StartLiveInteraction',
    START_LIVE_INTERACTION,
    {requestId},
  );

  return response.startLiveInteraction;
};

export const endLiveInteraction = async (
  requestId: string,
): Promise<EndLiveInteractionResult> => {
  const response = await graphqlRequest<EndLiveInteractionResponse>(
    'EndLiveInteraction',
    END_LIVE_INTERACTION,
    {requestId},
  );

  return response.endLiveInteraction;
};

/**
 * No cancel mutation is defined in the GraphQL Mutation type.
 * Keep this documented so callers do not invent a fake GraphQL operation.
 */
export const LIVE_INTERACTION_CANCEL_API_AVAILABLE = false as const;
