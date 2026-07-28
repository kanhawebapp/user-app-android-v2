// import {graphqlRequest} from '../graphql.client';

// import {
//   GetTestimonialsResponse,
// } from './testimonial.types';

// const GET_TESTIMONIALS = `
// query GetTestimonials {
//   getTestimonials {

//     id

//     name

//     address

//     content

//     image

//     rating

//     createdAt

//     updatedAt
//   }
// }
// `;

// export const getTestimonials = async () => {
//   try {
//     const response =
//       await graphqlRequest<GetTestimonialsResponse>(
//         'GetTestimonials',
//         GET_TESTIMONIALS,
//         {},
//       );

//     console.log(
//       'TESTIMONIAL RESPONSE:',
//       response,
//     );

//     return response.getTestimonials;
//   } catch (error: any) {
//     console.log(
//       'GET TESTIMONIAL ERROR:',
//       error?.response?.data ||
//         error?.message ||
//         error,
//     );

//     throw error;
//   }
// };

import {graphqlRequest} from '../graphql.client';

import {
  GetTestimonialsResponse,
} from './testimonial.types';

const GET_TESTIMONIALS = `
query GetTestimonials {
  getTestimonials {

    totalCount

    data {

      id

      name

      address

      content

      image

      rating

      createdAt

      updatedAt
    }
  }
}
`;

export const getTestimonials = async () => {
  try {
    const response =
      await graphqlRequest<GetTestimonialsResponse>(
        'GetTestimonials',
        GET_TESTIMONIALS,
        {},
      );

    console.log(
      'TESTIMONIAL RESPONSE:',
      JSON.stringify(
        response,
        null,
        2,
      ),
    );

    return response.getTestimonials;
  } catch (error: any) {
    console.log(
      'GET TESTIMONIAL ERROR:',
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