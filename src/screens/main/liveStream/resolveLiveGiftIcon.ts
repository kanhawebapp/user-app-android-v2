import {API_BASE_URL} from '../../../constants/api.constants';

/** Resolve gift icon to an absolute URI (supports absolute and relative paths). */
export const resolveLiveGiftIcon = (
  icon: string | null | undefined,
): string | null => {
  if (!icon || !icon.trim()) {
    return null;
  }

  const trimmed = icon.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  return `${API_BASE_URL.DEVELOPMENT}${trimmed.replace(/^\/+/, '')}`;
};
