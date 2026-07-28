// import { graphqlRequest } from '../../graphql.client';

// import {
//     CreateServiceBookingInput,
//     CreateServiceBookingResponse,
//     ServiceBooking,
// } from './serviceBooking.types';

// const CREATE_SERVICE_BOOKING = `
// mutation CreateServiceBooking($input: CreateServiceBookingInput!) {
//   createServiceBooking(input: $input) {
//     id
//     amount
//     paymentStatus
//     bookingStatus
//   }
// }
// `;

// export const createServiceBooking = async (
//     input: CreateServiceBookingInput,
// ): Promise<ServiceBooking> => {
//     try {
//         const response =
//             await graphqlRequest<CreateServiceBookingResponse>(
//                 'CreateServiceBooking',
//                 CREATE_SERVICE_BOOKING,
//                 { input },
//             );

//         console.log(
//             'CREATE SERVICE BOOKING RESPONSE:',
//             JSON.stringify(response, null, 2),
//         );

//         return response?.createServiceBooking;
//     } catch (error: any) {
//         console.log(
//             'CREATE SERVICE BOOKING ERROR:',
//             JSON.stringify(
//                 error?.response?.data || error?.message || error,
//                 null,
//                 2,
//             ),
//         );

//         throw error;
//     }
// };

import { graphqlRequest } from '../../graphql.client';
import {
    CreateServiceBookingInput,
    CreateServiceBookingResponse,
    ServiceBooking
} from './serviceBooking.types';

// import {
//   CreateServiceBookingInput,
//   CreateServiceBookingResponse,
//   ServiceBooking,
// } from './service-booking.types';

const CREATE_SERVICE_BOOKING = `
mutation CreateServiceBooking(
  $input: CreateServiceBookingInput!
) {
  createServiceBooking(
    input: $input
  ) {
    id
    amount
    paymentStatus
    bookingStatus
  }
}
`;

export const createServiceBooking =
    async (
        input: CreateServiceBookingInput,
    ): Promise<ServiceBooking> => {
        try {
            const response =
                await graphqlRequest<CreateServiceBookingResponse>(
                    'CreateServiceBooking',
                    CREATE_SERVICE_BOOKING,
                    {
                        input,
                    },
                );

            console.log(
                'CREATE SERVICE BOOKING RESPONSE:',
                JSON.stringify(
                    response,
                    null,
                    2,
                ),
            );

            return response.createServiceBooking;
        } catch (error: any) {
            console.log(
                'CREATE SERVICE BOOKING ERROR:',
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