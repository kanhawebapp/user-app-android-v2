import type {
  LiveInteractionPricing,
  LiveInteractionType,
} from './live-interactions.types';

/** Minimum prepaid duration required before starting a live interaction. */
export const MIN_LIVE_INTERACTION_MINUTES = 5;

export const getLiveInteractionPricePerMinute = (
  pricing: LiveInteractionPricing | null | undefined,
  interactionType: LiveInteractionType,
): number | null => {
  if (!pricing) {
    return null;
  }
  const price =
    interactionType === 'VIDEO' ? pricing.videoPrice : pricing.audioPrice;
  if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0) {
    return null;
  }
  return price;
};

export const getMinimumRequiredBalance = (pricePerMinute: number): number =>
  pricePerMinute * MIN_LIVE_INTERACTION_MINUTES;

export const getAvailableCallSeconds = (
  walletBalance: number,
  pricePerMinute: number,
): number => {
  if (
    !Number.isFinite(walletBalance) ||
    !Number.isFinite(pricePerMinute) ||
    pricePerMinute <= 0
  ) {
    return 0;
  }
  return Math.floor((walletBalance / pricePerMinute) * 60);
};

export const hasMinimumCallBalance = (
  walletBalance: number,
  pricePerMinute: number,
): boolean =>
  walletBalance >= getMinimumRequiredBalance(pricePerMinute);

export const formatCallCountdown = (totalSeconds: number): string => {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const mins = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/** Remaining seconds from an absolute end timestamp. */
export const getRemainingSecondsFromEndTime = (endsAt: number): number =>
  Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));

/**
 * Whether the wallet can cover the next whole billable minute at the given rate.
 * Backend bills whole minutes — fractional leftovers must not keep the call open.
 */
export const canAffordNextBillableMinute = (
  walletBalance: number,
  pricePerMinute: number,
): boolean => {
  if (
    !Number.isFinite(walletBalance) ||
    !Number.isFinite(pricePerMinute) ||
    pricePerMinute <= 0
  ) {
    return false;
  }
  return walletBalance >= pricePerMinute;
};

/**
 * Absolute endsAt from the current wallet only (does not subtract elapsed time —
 * wallet is not reserved during the call; elapsed time is already baked into the
 * existing endsAt via Math.min when reconciling).
 */
export const getAffordableCallEndsAt = (
  walletBalance: number,
  pricePerMinute: number,
  now: number = Date.now(),
): number | null => {
  if (!canAffordNextBillableMinute(walletBalance, pricePerMinute)) {
    return null;
  }
  const availableSeconds = getAvailableCallSeconds(
    walletBalance,
    pricePerMinute,
  );
  if (availableSeconds <= 0) {
    return null;
  }
  return now + availableSeconds * 1000;
};

export type ReconcileCallEndsAtResult =
  | {shouldEnd: true; endsAt: null}
  | {shouldEnd: false; endsAt: number; didShrink: boolean};

/**
 * Reconcile an active call's absolute endsAt with the latest wallet balance.
 *
 * - Balance decrease (gifts): shrink endsAt to the newly affordable window.
 * - Balance increase (recharge): never extend past the current endsAt.
 * - Insufficient for the next billable minute: signal immediate end.
 */
export const reconcileCallEndsAtWithWallet = (
  currentEndsAt: number,
  walletBalance: number,
  pricePerMinute: number,
  now: number = Date.now(),
): ReconcileCallEndsAtResult => {
  const affordableEndsAt = getAffordableCallEndsAt(
    walletBalance,
    pricePerMinute,
    now,
  );

  if (affordableEndsAt == null) {
    return {shouldEnd: true, endsAt: null};
  }

  // Never grant extra time beyond the already-running countdown.
  const nextEndsAt = Math.min(currentEndsAt, affordableEndsAt);

  if (nextEndsAt <= now) {
    return {shouldEnd: true, endsAt: null};
  }

  return {
    shouldEnd: false,
    endsAt: nextEndsAt,
    didShrink: nextEndsAt < currentEndsAt,
  };
};
