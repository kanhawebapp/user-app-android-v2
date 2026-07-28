import { graphqlRequest } from '../../graphql.client';

import {
    GetMyServiceBookingsResponse,
} from './my-service-bookings.types';

const GET_MY_SERVICE_BOOKINGS = `
query GetMyServiceBookings {
  getMyServiceBookings {

    totalCount

    data {
      id

      bookingStatus

      paymentStatus

      amount

      createdAt

      service {
        id
        name
        image
      }

      astrologer {
        id
        name
        profilePic
      }
    }
  }
}
`;
// const GET_MY_SERVICE_BOOKINGS = `
// query GetMyServiceBookings {
//   getMyServiceBookings {

//     id

//     bookingStatus

//     paymentStatus

//     amount

//     createdAt

//     service {
//       id
//       name
//       image
//     }

//     astrologer {
//       id
//       name
//       profilePic
//     }
//   }
// }
// `;

export const getMyServiceBookings =
    async () => {
        try {
            const response =
                await graphqlRequest<GetMyServiceBookingsResponse>(
                    'GetMyServiceBookings',
                    GET_MY_SERVICE_BOOKINGS,
                );

            console.log(
                'MY SERVICE BOOKINGS RESPONSE:',
                JSON.stringify(
                    response,
                    null,
                    2,
                ),
            );

            return (
                response?.getMyServiceBookings ||
                []
            );
        } catch (error: any) {
            console.log(
                'GET MY SERVICE BOOKINGS ERROR:',
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