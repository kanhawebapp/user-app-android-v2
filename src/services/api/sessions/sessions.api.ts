import {graphqlRequest} from '../graphql.client';
import {GET_USER_SESSIONS} from './sessions.query';
import {SessionFilterInput, SessionResponse} from './sessions.types';

export const getUserSessions = async (
  filter: SessionFilterInput,
): Promise<SessionResponse> => {
  try {
    const response = await graphqlRequest<{
      getUserSessions: SessionResponse;
    }>('GetUserSessions', GET_USER_SESSIONS, {
      filter, //  IMPORTANT
    });

    return response.getUserSessions;
  } catch (error) {
    console.log('SESSIONS API ERROR:', error);
    throw error;
  }
};
