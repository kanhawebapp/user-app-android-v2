import {API_BASE_URL} from '../../../constants/api.constants';

/** Resolve gift icon to an absolute URI (supports absolute and relative paths). */
export const resolveLiveGiftIcon = (
  icon: string | null | undefined,
): string | null => {
  if (!icon || !icon.trim()) {
    return null;
  }

  const trimmed = icon.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const base = API_BASE_URL.DEVELOPMENT.replace(/\/+$/, '');
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${base}${path}`;
};
