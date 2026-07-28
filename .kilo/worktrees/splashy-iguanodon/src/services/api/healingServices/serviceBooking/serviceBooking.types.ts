// export interface CreateServiceBookingInput {
//   serviceId: string;
//   userId: string;
//   amount: number;
//   paymentMethod?: string;
// }

// export interface ServiceBooking {
//   id: string;
//   amount: number;
//   paymentStatus: string;
//   bookingStatus: string;
// }

// export interface CreateServiceBookingResponse {
//   createServiceBooking: ServiceBooking;
// }

export type PaymentStatus =
  | 'PENDING'
  | 'SUCCESS'
  | 'FAILED';

export type BookingStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface CreateServiceBookingInput {
  serviceId: string;

  name: string;

  email: string;

  phone: string;

  dob: string;

  tob: string;

  pob: string;

  gender?: string;

  concern?: string;
}

export interface ServiceBooking {
  id: string;

  amount: number;

  paymentStatus: PaymentStatus;

  bookingStatus: BookingStatus;
}

export interface CreateServiceBookingResponse {
  createServiceBooking: ServiceBooking;
}