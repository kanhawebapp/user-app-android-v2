import { graphqlRequest } from '../graphql.client';
import {
  GetSessionRemediesResponse,
  SessionRemedy,
} from './session-remedies.types';

const GET_SESSION_REMEDIES = `
query GetSessionRemedies(
  $sessionId: String!
) {
  getSessionRemedies(
    sessionId: $sessionId
  ) {
    id
    sessionId
    remedyText
    createdAt
  }
}
`;

export const getSessionRemedies =
  async (
    sessionId: string,
  ): Promise<SessionRemedy[]> => {
    try {
      const response =
        await graphqlRequest<GetSessionRemediesResponse>(
          'GetSessionRemedies',
          GET_SESSION_REMEDIES,
          {
            sessionId,
          },
        );

      console.log(
        'GET SESSION REMEDIES RESPONSE:',
        JSON.stringify(
          response,
          null,
          2,
        ),
      );

      return (
        response?.getSessionRemedies ||
        []
      );
    } catch (error: any) {
      console.log(
        'GET SESSION REMEDIES ERROR:',
        JSON.stringify(
          error?.response?.data ||
            error?.message ||
            error,
          null,
          2,
        ),
      );

      throw error;
    }
  };