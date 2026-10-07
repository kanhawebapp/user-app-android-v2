import {graphqlRequest} from '../graphql.client';

import {
  Coupon,
  GetCouponsResponse,
  VerifyRechargeCouponInput,
  VerifyRechargeCouponResponse,
  VerifyRechargeCouponResult,
  VerifyServiceCouponInput,
  VerifyServiceCouponResponse,
  VerifyServiceCouponResult,
} from './coupon.types';

const GET_COUPONS = `
query GetCoupons {
  getCoupons {
    id
    code
    description
    type
    visibility
    couponCount
    applicable
    status
    percentage
    flatAmount
    maxDiscount
    minOrderAmount
    redeemLimit
    usedCount
    startDate
    endDate
    __typename
  }
}
`;

/**
 * Fetches every coupon configured on the backend.
 *
 * No filtering is applied here on purpose: the raw response is what the
 * Payment Screen validates against, so a manually typed code can only ever
 * match a coupon the backend actually returned. Filtering (status,
 * visibility, date window, `applicable`) lives in `coupon.utils.ts`.
 */
export const getCoupons = async (): Promise<Coupon[]> => {
  try {
    const response = await graphqlRequest<GetCouponsResponse>(
      'GetCoupons',
      GET_COUPONS,
      {},
    );
    // console.log('GET COUPONS RESPONSE:', JSON.stringify(response, null, 2));
    return Array.isArray(response?.getCoupons) ? response.getCoupons : [];
  } catch (error: any) {
    console.log(
      'GET COUPONS ERROR:',
      error?.response?.data || error?.message || error,
    );

    throw error;
  }
};

const VERIFY_RECHARGE_COUPON = `
mutation VerifyRechargeCoupon($input: VerifyRechargeCouponInput!) {
  verifyRechargeCoupon(input: $input) {
    success
    message
    originalAmount
    discount
    discountedPrice
    cashback
    payableAmount
    gstAmount
    coupon {
      id
      code
      description
      type
      visibility
      couponCount
      applicable
      status
      percentage
      flatAmount
      maxDiscount
      minOrderAmount
      redeemLimit
      usedCount
      startDate
      endDate
      __typename
    }
    __typename
  }
}
`;

/**
 * Verifies a coupon code against the currently selected recharge pack.
 *
 * Kept strictly separate from the service flow's coupon handling: this
 * mutation takes a `rechargePackId`, never a `bookingId`. The backend
 * response carries the authoritative pricing for the verified coupon
 * (original amount, discount, cashback, GST and payable amount) and must
 * not be recalculated on the frontend.
 */
export const verifyRechargeCoupon = async (
  input: VerifyRechargeCouponInput,
): Promise<VerifyRechargeCouponResult> => {
  try {
    const response = await graphqlRequest<VerifyRechargeCouponResponse>(
      'VerifyRechargeCoupon',
      VERIFY_RECHARGE_COUPON,
      {
        input: {
          rechargePackId: input.rechargePackId,
          couponCode: input.couponCode.trim(),
        },
      },
    );

    const result = response?.verifyRechargeCoupon;

    if (!result) {
      throw new Error('No data returned from GraphQL');
    }

    console.log('VERIFY RECHARGE COUPON RESPONSE:', JSON.stringify(result));

    return result;
  } catch (error: any) {
    console.log(
      'VERIFY RECHARGE COUPON ERROR:',
      error?.response?.data || error?.message || error,
    );

    throw error;
  }
};

const VERIFY_SERVICE_COUPON = `
mutation VerifyServiceCoupon($input: VerifyServiceCouponInput!) {
  verifyServiceCoupon(input: $input) {
    success
    message
    originalAmount
    discount
    discountedPrice
    cashback
    payableAmount
    gstAmount
    coupon {
      id
      code
      description
      type
      visibility
      couponCount
      applicable
      status
      percentage
      flatAmount
      maxDiscount
      minOrderAmount
      redeemLimit
      usedCount
      startDate
      endDate
      __typename
    }
    __typename
  }
}
`;

/**
 * Verifies a coupon code against a service booking.
 *
 * The booking id only exists after `CreateServiceBooking`, so this call runs
 * during the final payment run - after the booking is created and before
 * `CreateHealingOrder` - never when the user taps "Apply". The response is
 * the authoritative pricing for the verified coupon (discount, cashback, GST
 * and payable amount) and must not be recalculated on the frontend.
 */
export const verifyServiceCoupon = async (
  input: VerifyServiceCouponInput,
): Promise<VerifyServiceCouponResult> => {
  try {
    const payload = {
      input: {
        bookingId: input.bookingId,
        couponCode: input.couponCode.trim(),
      },
    };

    console.log(
      'VERIFY SERVICE COUPON PAYLOAD:',
      JSON.stringify(payload, null, 2),
    );

    const response = await graphqlRequest<VerifyServiceCouponResponse>(
      'VerifyServiceCoupon',
      VERIFY_SERVICE_COUPON,
      payload,
    );

    const result = response?.verifyServiceCoupon;

    if (!result) {
      throw new Error('No data returned from GraphQL');
    }

    console.log(
      'VERIFY SERVICE COUPON RESPONSE:',
      JSON.stringify(result, null, 2),
    );

    return result;
  } catch (error: any) {
    console.log(
      'VERIFY SERVICE COUPON ERROR:',
      error?.response?.data || error?.message || error,
    );

    throw error;
  }
};
