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

/** Input for the `VerifyRechargeCoupon` GraphQL mutation. */
export interface VerifyRechargeCouponInput {
  /** Id of the currently selected recharge pack (`RechargePack.id`). */
  rechargePackId: string;
  /** Coupon code exactly as the user entered it (trimmed). */
  couponCode: string;
}

/**
 * Pricing snapshot returned by `verifyRechargeCoupon`.
 *
 * On the backend every numeric field is a non-null `Float` and `coupon` is
 * nullable, but failed verifications answer with zeroes plus a `message`, so
 * callers must only adopt these values after checking `success === true` and
 * still fall back to the original pack amounts when a value is missing.
 */
export interface VerifyRechargeCouponResult {
  success: boolean;
  message?: string | null;
  originalAmount?: number | null;
  discount?: number | null;
  discountedPrice?: number | null;
  cashback?: number | null;
  payableAmount?: number | null;
  gstAmount?: number | null;
  coupon?: Coupon | null;
  __typename?: string;
}

export interface VerifyRechargeCouponResponse {
  verifyRechargeCoupon: VerifyRechargeCouponResult;
}

/** Input for the `VerifyServiceCoupon` GraphQL mutation. */
export interface VerifyServiceCouponInput {
  /**
   * Id of the booking created by `CreateServiceBooking` on
   * `ServiceDetailsScreen`, before the Payment Screen opens.
   */
  bookingId: string;
  /** Coupon code exactly as the user entered it (trimmed). */
  couponCode: string;
}

/**
 * `VerifyServiceCoupon` shares the exact same backend response payload as
 * `VerifyRechargeCoupon` (both mutations return `VerifyServiceCouponResponse`
 * on the schema), so the recharge result shape is reused rather than
 * duplicated.
 */
export type VerifyServiceCouponResult = VerifyRechargeCouponResult;

export interface VerifyServiceCouponResponse {
  verifyServiceCoupon: VerifyServiceCouponResult;
}
