import {graphqlRequest} from '../graphql.client';

import {Coupon, GetCouponsResponse} from './coupon.types';

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

    return Array.isArray(response?.getCoupons) ? response.getCoupons : [];
  } catch (error: any) {
    console.log(
      'GET COUPONS ERROR:',
      error?.response?.data || error?.message || error,
    );

    throw error;
  }
};
