import {graphqlRequest} from '../graphql.client';
import {
  PujaService,
  PujaServiceDetails,
  GetPujaServicesResponse,
  GetPujaDetailsResponse,
} from './puja-services.types';

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

const GET_PUJA_DETAILS = `
query GetPujaDetails($slug: String!) {
  pujaService(slug: $slug) {
    id
    title
    slug
    image
    category
    shortDescription
    description
    benefits
    howToPerform
    packaging
    price
    mrp
    discount
    customersCount
    rating
    mantraOptions {
      id
      name
      originalPrice
      offerPrice
      sortOrder
    }
    faqs {
      id
      question
      answer
    }
    reviews {
      id
      userName
      rating
      comment
      createdAt
    }
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

export const getPujaDetails = async (
  slug: string,
): Promise<PujaServiceDetails | null> => {
  try {
    const response = await graphqlRequest<GetPujaDetailsResponse>(
      'GetPujaDetails',
      GET_PUJA_DETAILS,
      {slug},
    );
    return response?.pujaService ?? null;
  } catch (error: any) {
    console.log(
      'GET PUJA DETAILS ERROR:',
      JSON.stringify(error?.response?.data || error?.message || error, null, 2),
    );
    throw error;
  }
};
