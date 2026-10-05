/**
 * Types for the `GetCoupons` GraphQL operation.
 *
 * The shapes mirror the backend `Coupon` object type exactly (verified via
 * schema introspection): `id`, `code`, `type`, `visibility`, `couponCount`,
 * `status`, `startDate` and `endDate` are non-nullable there, everything else
 * is nullable.
 */

/** Backend `CouponType` enum. */
export type CouponType = 'DISCOUNT' | 'CASHBACK';

/** Backend `CouponVisibility` enum. */
export type CouponVisibility = 'VISIBLE' | 'HIDDEN';

/** Payment flow a coupon can be applied to, mirrors `PaymentScreen`'s `paymentType`. */
export type CouponPaymentFlow = 'service' | 'recharge';

export interface Coupon {
  id: string;
  code: string;
  description?: string | null;
  type: CouponType;
  visibility: CouponVisibility;
  couponCount: number;
  applicable?: string | null;
  status: boolean;
  percentage?: number | null;
  flatAmount?: number | null;
  maxDiscount?: number | null;
  minOrderAmount?: number | null;
  redeemLimit?: number | null;
  usedCount?: number | null;
  /**
   * Unix timestamp in milliseconds, serialised as a string
   * (e.g. `"1790985600000"`).
   */
  startDate: string;
  /**
   * Unix timestamp in milliseconds, serialised as a string
   * (e.g. `"1793404800000"`).
   */
  endDate: string;
}

export interface GetCouponsResponse {
  getCoupons: Coupon[];
}
