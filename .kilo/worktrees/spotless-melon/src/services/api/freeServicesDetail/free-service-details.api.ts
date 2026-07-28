import {graphqlRequest} from '../graphql.client';

import {GetFreeServiceByIdResponse} from './free-service-details.types';

const GET_FREE_SERVICE_BY_ID = `
query GetFreeServiceById($id: ID!) {
  getFreeServiceById(id: $id) {

    id

    title

    slug

    href

    icon

    isActive

    order

    createdAt

    updatedAt
  }
}
`;

export const getFreeServiceById = async (id: string) => {
  try {
    const response = await graphqlRequest<GetFreeServiceByIdResponse>(
      'GetFreeServiceById',
      GET_FREE_SERVICE_BY_ID,
      {
        id,
      },
    );

    console.log(
      'FREE SERVICE DETAILS RESPONSE:',
      JSON.stringify(response, null, 2),
    );

    return response.getFreeServiceById;
  } catch (error: any) {
    console.log(
      'GET FREE SERVICE DETAILS ERROR:',
      JSON.stringify(error?.response?.data || error?.message || error, null, 2),
    );

    throw error;
  }
};
