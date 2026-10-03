import {graphqlRequest} from '../../graphql.client';

import type {Service} from '../getServices/services.types';

import type {GetServiceResponse} from './get-service.types';

const GET_SERVICE = `
query GetService($slug: String!) {
  getService(slug: $slug) {
    id
    name
    slug
    image
    description
    longText
    price
    category {
      id
      name
      __typename
    }
    astrologerMappings {
      id
      price
      astrologer {
        id
        name
        displayName
        profilePic
        experience
        rating
        skills
        languages
        about
        __typename
      }
      __typename
    }
    __typename
  }
}
`;

/**
 * Fetches a single service by its slug.
 *
 * The slug is always passed as a GraphQL variable — it is never inlined into
 * the query — and auth/401/GraphQL-error handling is delegated to the shared
 * `graphqlRequest` client. Resolves to `null` when the slug does not match a
 * service; throws on network or GraphQL errors.
 */
export const getService = async (slug: string): Promise<Service | null> => {
  try {
    const response = await graphqlRequest<GetServiceResponse>(
      'GetService',
      GET_SERVICE,
      {slug},
    );
console.log('GET SERVICE RESPONSE:', response);
    return response?.getService ?? null;
  } catch (error: any) {
    console.log(
      'GET SERVICE ERROR:',
      JSON.stringify(error?.response?.data || error?.message || error, null, 2),
    );

    throw error;
  }
};
