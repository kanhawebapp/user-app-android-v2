import {graphqlRequest} from '../graphql.client';

import {
  GetFAQsResponse,
} from './faq.types';

const GET_FAQS = `
query GetFaqs {
  getFaqs {

    totalCount

    data {
      id

      question

      answer

      createdAt

      updatedAt
    }
  }
}
`;

export const getFAQs = async () => {
  try {
    const response =
      await graphqlRequest<GetFAQsResponse>(
        'GetFaqs',
        GET_FAQS,
        {},
      );

    console.log(
      'FAQ RESPONSE:',
      response,
    );

    return response.getFaqs;
  } catch (error: any) {
    console.log(
      'GET FAQ ERROR:',
      error?.response?.data ||
        error?.message ||
        error,
    );

    throw error;
  }
};