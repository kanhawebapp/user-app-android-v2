import {graphqlRequest} from '../../graphql.client';

import {
  Category,
  GetCategoriesResponse,
} from './categories.types';

const GET_CATEGORIES = `
query getCategories {
  getCategories {
    id
    name
    slug
    image
  }
}
`;

export const getCategories =
  async (): Promise<Category[]> => {
    try {
      const response =
        await graphqlRequest<GetCategoriesResponse>(
          'getCategories',
          GET_CATEGORIES,
        );

      // console.log(
      //   'GET CATEGORIES RESPONSE:',
      //   JSON.stringify(
      //     response,
      //     null,
      //     2,
      //   ),
      // );

      return response?.getCategories || [];
    } catch (error: any) {
      console.log(
        'GET CATEGORIES ERROR:',
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