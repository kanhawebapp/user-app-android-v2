import {Coupon, CouponPaymentFlow} from './coupon.types';

/**
 * Values accepted in the backend's free-form `Coupon.applicable` string.
 *
 * `applicable` is a nullable `String` on the schema (not an enum) and the only
 * value observed from the API is `"services"`, which the healing/service order
 * flow uses. The recharge flow has no published value yet, so it reuses the
 * app's own `paymentType` discriminator (`"recharge"`) and only matches coupons
 * that explicitly target it - service coupons are never shown for recharge.
 * Update `recharge` here once the backend publishes its own value.
 */
export const COUPON_APPLICABLE: Record<CouponPaymentFlow, string[]> = {
  service: ['services'],
  recharge: ['recharge'],
};

const COUPON_TYPE_CASHBACK = 'CASHBACK';
const COUPON_VISIBILITY_VISIBLE = 'VISIBLE';

/** Trims and upper-cases a value so comparisons are case/spacing insensitive. */
const normalize = (value?: string | null): string =>
  typeof value === 'string' ? value.trim().toUpperCase() : '';

/** Normalises a coupon code for user-input matching. */
export const normalizeCouponCode = (value?: string | null): string =>
  normalize(value);

const isPositiveNumber = (value?: number | null): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;

/**
 * Converts a backend date into epoch milliseconds.
 *
 * The API sends Unix timestamps serialised as strings (e.g. `"1790985600000"`,
 * which is already milliseconds). A bare 10-digit value is treated as seconds
 * and anything non-numeric falls back to `Date.parse`. Returns `null` when the
 * value cannot be understood so callers can decide how to treat the bound.
 */
export const parseCouponDate = (
  value?: string | number | null,
): number | null => {
  if (value === null || value === undefined) {
    return null;
  }

  const raw = String(value).trim();

  if (!raw) {
    return null;
  }

  if (/^-?\d+$/.test(raw)) {
    const numeric = Number(raw);

    if (!Number.isFinite(numeric)) {
      return null;
    }

    // 10 digits or fewer can only be a seconds-precision timestamp.
    return raw.replace('-', '').length <= 10 ? numeric * 1000 : numeric;
  }

  const parsed = Date.parse(raw);

  return Number.isNaN(parsed) ? null : parsed;
};

/**
 * True when `now` sits inside the coupon's validity window.
 *
 * A bound that is missing or unparseable is treated as unbounded rather than
 * as "expired", so a future change of date format on the backend cannot hide
 * every coupon. Authoritative validation still happens server side in
 * `createHealingOrder`.
 */
export const isCouponWithinDateRange = (
  coupon: Coupon,
  now: number = Date.now(),
): boolean => {
  const start = parseCouponDate(coupon?.startDate);
  const end = parseCouponDate(coupon?.endDate);

  if (start === null || end === null) {
    console.warn(
      'COUPON DATE PARSE FAILED:',
      coupon?.code,
      coupon?.startDate,
      coupon?.endDate,
    );
  }

  if (start !== null && now < start) {
    return false;
  }

  if (end !== null && now > end) {
    return false;
  }

  return true;
};

/** Only enabled coupons flagged `VISIBLE` are usable. */
export const isCouponVisible = (coupon: Coupon): boolean =>
  coupon?.status === true &&
  normalize(coupon?.visibility) === COUPON_VISIBILITY_VISIBLE;

/** Matches the coupon's `applicable` value against the current payment flow. */
export const isCouponApplicableToFlow = (
  coupon: Coupon,
  flow: CouponPaymentFlow,
): boolean => {
  const accepted = COUPON_APPLICABLE[flow] ?? [];

  if (!accepted.length) {
    return false;
  }

  const applicable = normalize(coupon?.applicable);

  // A coupon with no `applicable` value is never assumed to be valid.
  if (!applicable) {
    return false;
  }

  return accepted.some(value => normalize(value) === applicable);
};

/** status === true && visibility === 'VISIBLE' && now within the date window. */
export const isCouponActive = (
  coupon: Coupon,
  flow: CouponPaymentFlow,
  now: number = Date.now(),
): boolean => isCouponVisible(coupon) && isCouponWithinDateRange(coupon, now);

/** Coupons that can actually be applied to the given payment flow. */
export const getApplicableCoupons = (
  coupons: Coupon[],
  flow: CouponPaymentFlow,
  now: number = Date.now(),
): Coupon[] =>
  (coupons ?? []).filter(
    coupon =>
      isCouponActive(coupon, flow, now) &&
      isCouponApplicableToFlow(coupon, flow),
  );

/**
 * Resolves a user typed code against the coupons returned by the API.
 * Matching is trimmed + upper-cased and still honours every validity rule.
 */
export const findCouponByCode = (
  coupons: Coupon[],
  code: string,
  flow: CouponPaymentFlow,
  now: number = Date.now(),
): Coupon | undefined => {
  const enteredCode = normalizeCouponCode(code);

  if (!enteredCode) {
    return undefined;
  }

  const candidates = getApplicableCoupons(coupons, flow, now);

  return candidates.find(
    coupon => normalizeCouponCode(coupon?.code) === enteredCode,
  );
};

const formatAmount = (value: number): string =>
  Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));

/** `₹500` style label used for minimum order / maximum discount rows. */
export const formatCurrency = (value?: number | null): string | null =>
  isPositiveNumber(value) ? `₹${formatAmount(value)}` : null;

/**
 * Headline value for a coupon: `10% OFF`, `₹100 OFF`, `10% cashback`, ...
 *
 * `percentage` wins when present, otherwise `flatAmount` is used. Cashback
 * coupons are never worded as a direct discount.
 */
export const getCouponDiscountLabel = (coupon: Coupon): string => {
  const isCashback = normalize(coupon?.type) === COUPON_TYPE_CASHBACK;

  if (isPositiveNumber(coupon?.percentage)) {
    return isCashback
      ? `${coupon.percentage}% cashback`
      : `${coupon.percentage}% OFF`;
  }

  if (isPositiveNumber(coupon?.flatAmount)) {
    return isCashback
      ? `₹${formatAmount(coupon.flatAmount)} cashback`
      : `₹${formatAmount(coupon.flatAmount)} OFF`;
  }

  return isCashback ? 'Cashback offer' : 'Discount offer';
};

/** Human readable coupon type, e.g. `Cashback` / `Discount`. */
export const getCouponTypeLabel = (coupon: Coupon): string =>
  normalize(coupon?.type) === COUPON_TYPE_CASHBACK ? 'Cashback' : 'Discount';

/** `Applicable: Services` style label derived from the raw API value. */
export const getCouponApplicableLabel = (coupon: Coupon): string | null => {
  const applicable = coupon?.applicable?.trim();

  if (!applicable) {
    return null;
  }

  const normalised = normalize(applicable);

  if (
    COUPON_APPLICABLE.service.some(value => normalize(value) === normalised)
  ) {
    return 'Services';
  }

  if (
    COUPON_APPLICABLE.recharge.some(value => normalize(value) === normalised)
  ) {
    return 'Recharge';
  }

  return applicable;
};

/** Minimum order requirement label, or `null` when the coupon has no minimum. */
export const getCouponMinOrderLabel = (coupon: Coupon): string | null =>
  formatCurrency(coupon?.minOrderAmount);

/** Discount cap label, or `null` when the coupon is uncapped. */
export const getCouponMaxDiscountLabel = (coupon: Coupon): string | null =>
  formatCurrency(coupon?.maxDiscount);

/** True when the order total satisfies the coupon's minimum order amount. */
export const meetsCouponMinOrder = (
  coupon: Coupon,
  totalAmount: number,
): boolean => {
  const minOrderAmount = Number(coupon?.minOrderAmount);

  if (!Number.isFinite(minOrderAmount) || minOrderAmount <= 0) {
    return true;
  }

  return (totalAmount ?? 0) >= minOrderAmount;
};
