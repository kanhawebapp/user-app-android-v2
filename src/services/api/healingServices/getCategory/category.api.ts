import {graphqlRequest} from '../../graphql.client';

import {
  CategoryWithServices,
  GetCategoryResponse,
} from './category.types';

const GET_CATEGORY = `
query GetCategory($slug: String!) {
  getCategory(slug: $slug) {
    id
    name
    slug
    services {
      id
      name
      slug
      image
      description
      price
      astrologerMappings {
        price
        __typename
      }
      __typename
    }
    __typename
  }
}
`;

export const getCategory =
  async (slug: string): Promise<CategoryWithServices | null> => {
    try {
      const response =
        await graphqlRequest<GetCategoryResponse>(
          'GetCategory',
          GET_CATEGORY,
          {slug},
        );

      return response?.getCategory || null;
    } catch (error: any) {
      console.log(
        'GET CATEGORY ERROR:',
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
