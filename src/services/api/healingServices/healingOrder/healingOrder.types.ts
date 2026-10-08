/**
 * Payload of the `CreateHealingOrder` mutation. `couponCode` is an empty
 * string when no coupon is applied.
 */
export interface CreateHealingOrderInput {
  bookingId: string;

  couponCode: string;

  amount: number;
}

export interface HealingOrder {
  success: boolean;

  orderId: string;

  bookingId: string;

  currency: string;

  totalAmount: number;

  amount: number;
}

export interface CreateHealingOrderResponse {
  createHealingOrder: HealingOrder;
}