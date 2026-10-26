/**
 * Types for the `CreatePujaBooking` GraphQL mutation.
 *
 * Input mirrors the backend `CreatePujaBookingInput` shape used by the
 * Buy It Now flow: puja id, selected mantra option, and quantity.
 */

export type PujaPaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | string;

export type PujaBookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED'
  | string;

export interface CreatePujaBookingInput {
  pujaId: string;
  mantraOptionId: string;
  quantity: number;
}

export interface PujaBooking {
  id: string;
  pujaId: string;
  mantraOptionId: string;
  mantraOptionName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  paymentStatus: PujaPaymentStatus;
  bookingStatus: PujaBookingStatus;
  __typename?: string;
}

export interface CreatePujaBookingResponse {
  createPujaBooking: PujaBooking;
}
