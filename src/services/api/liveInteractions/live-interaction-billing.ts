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
