import {format} from 'date-fns';
import {API_BASE_URL} from '../../../constants/api.constants';
import type {PujaMantraOption} from '../../../services/api/pujaServices/puja-services.types';

export const getPujaImageUrl = (url?: string | null): string => {
  if (!url) {
    return '';
  }

  if (url.startsWith('http')) {
    return url;
  }

  return `${API_BASE_URL.DEVELOPMENT}${url.replace(/^\/+/, '')}`;
};

export const formatDevoteeCount = (count?: number | null): string => {
  const value = Number(count);
  if (!Number.isFinite(value) || value <= 0) {
    return '0 devotees';
  }

  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1).replace(/\.0$/, '')}M devotees`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}K devotees`;
  }

  return `${value.toLocaleString('en-IN')} devotee${value === 1 ? '' : 's'}`;
};

export const formatPrice = (value?: number | null): string => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return '₹0';
  }

  return `₹${amount.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  })}`;
};

export const formatDiscount = (discount?: number | null): string | null => {
  const value = Number(discount);
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }

  const display =
    Number.isInteger(value) || value % 1 === 0
      ? String(Math.round(value))
      : value.toFixed(2).replace(/\.?0+$/, '');

  return `${display}% OFF`;
};

export const sortMantraOptions = (
  options?: PujaMantraOption[] | null,
): PujaMantraOption[] => {
  if (!options?.length) {
    return [];
  }

  return [...options].sort(
    (a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0),
  );
};

const getReviewDate = (createdAt?: string | null): Date | null => {
  if (!createdAt) {
    return null;
  }

  const trimmed = String(createdAt).trim();
  const asNumber = Number(trimmed);
  const date =
    /^\d+$/.test(trimmed) && Number.isFinite(asNumber)
      ? new Date(asNumber)
      : new Date(trimmed);

  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatReviewDate = (createdAt?: string | null): string => {
  const date = getReviewDate(createdAt);
  return date ? format(date, 'dd MMM yyyy') : '';
};
