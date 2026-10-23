import {graphqlRequest} from '../graphql.client';
import {PujaService, GetPujaServicesResponse} from './puja-services.types';

const GET_PUJA_SERVICES = `
query GetPujaServices {
  pujaServices {
    id
    title
    slug
    image
    category
    shortDescription
    price
    mrp
    discount
    rating
    __typename
  }
}
`;

export const getPujaServices = async (): Promise<PujaService[]> => {
  try {
    const response = await graphqlRequest<GetPujaServicesResponse>(
      'GetPujaServices',
      GET_PUJA_SERVICES,
      {},
    );
    return response?.pujaServices || [];
  } catch (error: any) {
    console.log(
      'GET PUJA SERVICES ERROR:',
      JSON.stringify(error?.response?.data || error?.message || error, null, 2),
    );
    throw error;
  }
};
