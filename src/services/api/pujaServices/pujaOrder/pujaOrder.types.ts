/**
 * Types for the `CreatePujaOrder` GraphQL mutation.
 *
 * `couponCode` is an empty string when no coupon is applied.
 * `amount` is the gateway payment amount returned by the backend
 * (observed as paise for Razorpay). `totalAmount` is the display total.
 */

export interface CreatePujaOrderInput {
  bookingId: string;
  couponCode: string;
}

export interface PujaOrder {
  success: boolean;
  message?: string | null;
  orderId: string;
  amount: number;
  currency: string;
  bookingId: string;
  pujaTitle?: string | null;
  totalAmount: number;
  __typename?: string;
}

export interface CreatePujaOrderResponse {
  createPujaOrder: PujaOrder;
}
