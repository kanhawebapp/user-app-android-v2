import {graphqlRequest} from '../graphql.client';
import {
  UpdateUserInput,
  UpdateUserProfileResponse,
  UserProfileResponse,
} from './profile.types';

const GET_USER_PROFILE = `
query GetUserProfile {
  getUserProfile {
    id
    name
    mobile
    countryCode
    gender
    birthDate
    birthTime
    occupation
    __typename
  }
}
`;

export const getUserProfile = async () => {
  try {
    const response = await graphqlRequest<UserProfileResponse>(
      'GetUserProfile',
      GET_USER_PROFILE,
      {},
    );

    // console.log('PROFILE RESPONSE:', response);

    return response.getUserProfile;
  } catch (error) {
    console.log('PROFILE API ERROR:', error);
    throw error;
  }
};

const UPDATE_USER_PROFILE = `
mutation UpdateUserProfile($input: UpdateUserInput!) {
  updateUserProfile(input: $input) {
    id
    name
    __typename
  }
}
`;

export const updateUserProfile = async (input: UpdateUserInput) => {
  try {
    const response = await graphqlRequest<UpdateUserProfileResponse>(
      'UpdateUserProfile',
      UPDATE_USER_PROFILE,
      {input},
    );

    // console.log('UPDATE PROFILE RESPONSE:', response);

    return response.updateUserProfile;
  } catch (error) {
    console.log('UPDATE PROFILE ERROR:', error);
    throw error;
  }
};
