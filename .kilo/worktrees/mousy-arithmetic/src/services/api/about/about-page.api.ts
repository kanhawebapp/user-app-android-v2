import {graphqlRequest} from '../graphql.client';

import {
  GetAboutPageResponse,
} from './about-page.types';

const GET_ABOUT_PAGE = `
query GetAboutPage {
  getAboutPage {

    id

    pageType

    heroTitle

    heroDescription

    mentors {
      name

      image

      description

      designation
    }

    founders {
      name

      image

      description

      designation
    }

    metaTitle

    metaDescription

    keywords

    status

    createdAt

    updatedAt
  }
}
`;

export const getAboutPage = async () => {
  try {
    const response =
      await graphqlRequest<GetAboutPageResponse>(
        'GetAboutPage',
        GET_ABOUT_PAGE,
        {},
      );

    console.log(
      'ABOUT PAGE RESPONSE:',
      JSON.stringify(
        response,
        null,
        2,
      ),
    );

    return response.getAboutPage;
  } catch (error: any) {
    console.log(
      'GET ABOUT PAGE ERROR:',
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