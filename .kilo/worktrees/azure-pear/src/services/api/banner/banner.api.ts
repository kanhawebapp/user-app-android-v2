import {graphqlRequest} from '../graphql.client';

import {GetBannersResponse} from './banner.types';

const GET_BANNERS = `
query GetBanners($language: String) {
  getBanners(language: $language) {

    totalCount

    data {
      id

      heading

      subheading

      slug

      bannerlink

      imageUrl

      status
    }
  }
}
`;

export const getBanners = async (language = 'en') => {
  try {
    console.log('GET BANNERS LANGUAGE:', language);

    const response = await graphqlRequest<GetBannersResponse>(
      'GetBanners',
      GET_BANNERS,
      {
        language,
      },
    );

    console.log('BANNERS RESPONSE:', response);

    return response.getBanners;
  } catch (error: any) {
    console.log(
      'GET BANNERS ERROR:',
      error?.response?.data || error?.message || error,
    );

    throw error;
  }
};
