import {graphqlRequest} from '../graphql.client';

import {GetAstrologerByIdResponse} from './astrologer-details.types';

const GET_ASTROLOGER_BY_ID = `
query GetAstrologerById($id: String!) {
  getAstrologerById(id: $id) {

    id

    name

    profilePic

    experience

    rating

    skills

    languages

    pricing {
      type

      price

      offerPrice

      commissionPercent

      isActive
    }
  }
}
`;

export const getAstrologerById = async (id: string) => {
  try {
    console.log('ASTROLOGER ID:', id);

    const response = await graphqlRequest<GetAstrologerByIdResponse>(
      'GetAstrologerById',
      GET_ASTROLOGER_BY_ID,
      {
        id,
      },
    );

    console.log('ASTROLOGER DETAILS RESPONSE:', response);

    return response.getAstrologerById;
  } catch (error: any) {
    console.log(
      'GET ASTROLOGER DETAILS ERROR:',
      error?.response?.data || error?.message || error,
    );

    throw error;
  }
};
