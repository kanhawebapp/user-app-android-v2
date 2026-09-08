import {graphqlRequest} from '../graphql.client';

import {SoftDeleteUserGraphQLResponse} from './delete-account.types';

const SOFT_DELETE_USER = `
mutation SoftDeleteUser {
  softDeleteUser {
    success
    message
  }
}
`;

export const softDeleteUser = async () => {
  try {
    console.log('SOFT DELETE USER:');

    const response = await graphqlRequest<SoftDeleteUserGraphQLResponse>(
      'SoftDeleteUser',
      SOFT_DELETE_USER,
    );

    console.log(
      'SOFT DELETE USER RESPONSE:',
      JSON.stringify(response, null, 2),
    );

    return response.softDeleteUser;
  } catch (error: any) {
    console.log(
      'SOFT DELETE USER ERROR:',
      JSON.stringify(error?.response?.data || error?.message || error, null, 2),
    );

    throw error;
  }
};
