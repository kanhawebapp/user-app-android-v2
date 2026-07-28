import {graphqlRequest} from '../../graphql.client';

import {
  GetServicesResponse,
  Service,
} from './services.types';

const GET_SERVICES = `
query GetServices {
  getServices {
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
      slug
    }
  }
}
`;

export const getServices =
  async (): Promise<Service[]> => {
    try {
      const response =
        await graphqlRequest<GetServicesResponse>(
          'GetServices',
          GET_SERVICES,
        );

      console.log(
        'GET SERVICES RESPONSE:',
        JSON.stringify(
          response,
          null,
          2,
        ),
      );

      return response?.getServices || [];
    } catch (error: any) {
      console.log(
        'GET SERVICES ERROR:',
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