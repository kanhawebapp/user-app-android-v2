import {graphqlRequest} from '../graphql.client';

import {CreateReviewInput, CreateReviewResponse} from './review.types';

const CREATE_REVIEW = `
mutation CreateReview($input: CreateReviewInput!) {
  createReview(input: $input) {

    success

    message
  }
}
`;

export const createReview = async (input: CreateReviewInput) => {
  try {
    console.log('CREATE REVIEW INPUT:', input);

    const response = await graphqlRequest<CreateReviewResponse>(
      'CreateReview',
      CREATE_REVIEW,
      {
        input,
      },
    );

    console.log('CREATE REVIEW RESPONSE:', response);

    return response.createReview;
  } catch (error: any) {
    console.log(
      'CREATE REVIEW ERROR:',
      error?.response?.data || error?.message || error,
    );

    throw error;
  }
};
