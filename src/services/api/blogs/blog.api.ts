
import { graphqlRequest } from '../graphql.client';
import {
  Blog,
  GetBlogsResponse,
} from './blog.types';

const GET_BLOGS = `
query GetBlogs {
  blogs {
    id
    title
    slug
    featuredImage
    createdAt

    categories {
      id
      name
      slug
    }
  }
}
`;

export const getBlogs =
  async (): Promise<Blog[]> => {
    try {
      const response =
        await graphqlRequest<GetBlogsResponse>(
          'GetBlogs',
          GET_BLOGS,
          {},
        );

      console.log(
        'GET BLOGS RESPONSE:',
        JSON.stringify(
          response,
          null,
          2,
        ),
      );

      return response?.blogs || [];
    } catch (error: any) {
      console.log(
        'GET BLOGS ERROR:',
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