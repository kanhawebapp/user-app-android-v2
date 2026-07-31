import {graphqlRequest} from '../graphql.client';

import {CreateReviewInput, CreateReviewGraphQLResponse} from './review.types';

const CREATE_REVIEW = `
mutation CreateReview($input: CreateReviewInput!) {
  createReview(input: $input) {
    success

    message

    review {
      id

      userId

      astrologerId

      sessionId

      rating

      comment

      userName

      astroName

      createdAt
    }
  }
}
`;

export const createReview = async (input: CreateReviewInput) => {
  try {
    const response = await graphqlRequest<CreateReviewGraphQLResponse>(
      'CreateReview',
      CREATE_REVIEW,
      {input},
    );

    // console.log('CREATE REVIEW RESPONSE:', JSON.stringify(response, null, 2));

    return response.createReview;
  } catch (error: any) {
    console.log(
      'CREATE REVIEW ERROR:',
      JSON.stringify(error?.response?.data || error?.message || error, null, 2),
    );

    throw error;
  }
};
