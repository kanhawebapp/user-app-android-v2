import {graphqlRequest} from '../graphql.client';
import {
  Blog,
  GetBlogsResponse,
  BlogDetail,
  GetBlogBySlugResponse,
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

const GET_BLOG_BY_SLUG = `
query GetBlogBySlug($slug: String!) {
  blogBySlug(slug: $slug) {
    id
    title
    slug
    content
    featuredImage
    createdAt

    categories {
      id
      name
      slug
      __typename
    }
    __typename
  }
}
`;

export const getBlogs = async (): Promise<Blog[]> => {
  try {
    const response = await graphqlRequest<GetBlogsResponse>(
      'GetBlogs',
      GET_BLOGS,
      {},
    );

    console.log('GET BLOGS RESPONSE:', JSON.stringify(response, null, 2));

    return response?.blogs || [];
  } catch (error: any) {
    console.log(
      'GET BLOGS ERROR:',
      JSON.stringify(error?.response?.data || error?.message || error, null, 2),
    );

    throw error;
  }
};

export const getBlogBySlug = async (slug: string): Promise<BlogDetail> => {
  try {
    const response = await graphqlRequest<GetBlogBySlugResponse>(
      'GetBlogBySlug',
      GET_BLOG_BY_SLUG,
      {slug},
    );

    console.log(
      'GET BLOG BY SLUG RESPONSE:',
      JSON.stringify(response, null, 2),
    );

    return response?.blogBySlug;
  } catch (error: any) {
    console.log(
      'GET BLOG BY SLUG ERROR:',
      JSON.stringify(error?.response?.data || error?.message || error, null, 2),
    );

    throw error;
  }
};
