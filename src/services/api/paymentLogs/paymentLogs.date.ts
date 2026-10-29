/**
 * Date helpers for Payment Logs filters.
 * Uses local calendar components to avoid UTC shift on YYYY-MM-DD strings.
 */

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Convert a local Date from the picker into YYYY-MM-DD. */
export const formatLocalIsoDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/** Parse YYYY-MM-DD into a local Date (noon avoids DST edge cases). */
export const parseLocalIsoDate = (iso: string): Date => {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
};

/**
 * Normalize filter dates for GraphQL:
 * - null/undefined/'' → null (never send empty string)
 * - valid YYYY-MM-DD → same string
 */
export const toGraphqlDateParam = (value?: string | null): string | null => {
  if (value == null) {
    return null;
  }
  const trimmed = String(value).trim();
  if (!trimmed || !ISO_DATE_RE.test(trimmed)) {
    return null;
  }
  return trimmed;
};

/** Display label for an ISO date filter value. */
export const displayLocalIsoDate = (iso: string | null): string => {
  if (!iso || !ISO_DATE_RE.test(iso)) {
    return 'Select';
  }
  const date = parseLocalIsoDate(iso);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};
