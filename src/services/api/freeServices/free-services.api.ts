import {graphqlRequest} from '../graphql.client';

import {GetFreeServicesResponse} from './free-services.types';

const GET_FREE_SERVICES = `
query GetFreeServices {
  getFreeServices {
    totalCount

    data {
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
}
`;

export const getFreeServices = async () => {
  try {
    const response = await graphqlRequest<GetFreeServicesResponse>(
      'GetFreeServices',
      GET_FREE_SERVICES,
    );

    // console.log('FREE SERVICES RESPONSE:', JSON.stringify(response, null, 2));

    return response.getFreeServices;
  } catch (error: any) {
    console.log(
      'GET FREE SERVICES ERROR:',
      JSON.stringify(error?.response?.data || error?.message || error, null, 2),
    );

    throw error;
  }
};
