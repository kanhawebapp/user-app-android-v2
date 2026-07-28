
import { graphqlRequest } from '../graphql.client';
// isBusy
//     isOnline
//     isChatActive
//     isCallActive
//     isLiveActive

import { GetAstrologerByIdResponse } from './astrologer-details.types';

const GET_ASTROLOGER_BY_ID = `
query GetAstrologerById($id: String!) {
  getAstrologerById(id: $id) {

    id

    name

    profilePic

    experience

    rating

    about

    tags

    vtags
 
    skills

    languages
    isBusy
    isOnline
    isChatActive
    isCallActive
    isLiveActive
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

    console.log('FULL ASTROLOGER RESPONSE:', JSON.stringify(response, null, 2));

    console.log(
      'GET ASTROLOGER DATA:',
      JSON.stringify(response?.getAstrologerById, null, 2),
    );

    return response.getAstrologerById;
  } catch (error: any) {
    console.log(
      'GET ASTROLOGER DETAILS ERROR:',
      JSON.stringify(error?.response?.data || error?.message || error, null, 2),
    );

    throw error;
  }
};
