import type {LiveInteractionRequestStatus} from '../../../services/api/liveInteractions';

/** Format durationSeconds as mm:ss (e.g. 01:10). Zero → 00:00. */
export const formatDurationMmSs = (
  seconds: number | null | undefined,
): string => {
  if (seconds == null || Number.isNaN(Number(seconds))) {
    return '—';
  }
  const total = Math.max(0, Math.floor(Number(seconds)));
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
};

const parseHistoryDate = (value: string): Date | null => {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  // ISO / date string
  if (/[T\-:]/.test(trimmed) && !/^\d+$/.test(trimmed)) {
    const isoDate = new Date(trimmed);
    return Number.isNaN(isoDate.getTime()) ? null : isoDate;
  }

  const numeric = Number(trimmed);
  if (!Number.isFinite(numeric)) {
    return null;
  }

  // Heuristic: values under 1e12 are seconds; otherwise milliseconds
  const ms = numeric < 1e12 ? numeric * 1000 : numeric;
  const date = new Date(ms);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** Prefer started/requested/created timestamps for display. */
export const formatHistoryDateTime = (
  value: string | null | undefined,
): string => {
  if (value == null || value === '') {
    return '—';
  }

  const date = parseHistoryDate(value);
  if (!date) {
    return '—';
  }

  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const pickDisplayTimestamp = (item: {
  requestedAt?: string | null;
  startedAt?: string | null;
  createdAt?: string | null;
}): string => {
  const candidates = [item.requestedAt, item.startedAt, item.createdAt];
  for (const candidate of candidates) {
    const formatted = formatHistoryDateTime(candidate);
    if (formatted !== '—') {
      return formatted;
    }
  }
  return '—';
};

export const getInteractionTypeLabel = (
  type: string | null | undefined,
): string => {
  const normalized = (type || '').toUpperCase();
  if (normalized === 'VIDEO') {
    return 'Video Call';
  }
  if (normalized === 'AUDIO') {
    return 'Audio Call';
  }
  return type ? String(type) : '—';
};

export const getInteractionTypeIcon = (
  type: string | null | undefined,
): string => {
  return (type || '').toUpperCase() === 'VIDEO' ? 'videocam' : 'call';
};

export const formatCoins = (value: number | null | undefined): string => {
  if (value == null || Number.isNaN(Number(value))) {
    return '—';
  }
  return String(Number(value));
};

export const formatRatePerMin = (value: number | null | undefined): string => {
  if (value == null || Number.isNaN(Number(value))) {
    return '—';
  }
  return `${Number(value)}/min`;
};

export const formatBillableMinutes = (
  value: number | null | undefined,
): string => {
  if (value == null || Number.isNaN(Number(value))) {
    return '—';
  }
  const mins = Number(value);
  return mins === 1 ? '1 min' : `${mins} mins`;
};

const STATUS_COLORS: Record<string, {dot: string; text: string}> = {
  ENDED: {dot: '#22C55E', text: '#22C55E'},
  COMPLETED: {dot: '#22C55E', text: '#22C55E'},
  CANCELLED: {dot: '#EF4444', text: '#EF4444'},
  REJECTED: {dot: '#EF4444', text: '#EF4444'},
  FAILED: {dot: '#EF4444', text: '#EF4444'},
  PENDING: {dot: '#F59E0B', text: '#F59E0B'},
  ACCEPTED: {dot: '#3B82F6', text: '#3B82F6'},
};

export const getStatusColors = (
  status: LiveInteractionRequestStatus | string | null | undefined,
): {dot: string; text: string} => {
  const key = (status || '').toUpperCase();
  return STATUS_COLORS[key] || {dot: '#6B7280', text: '#6B7280'};
};

export const getStatusLabel = (
  status: LiveInteractionRequestStatus | string | null | undefined,
): string => {
  if (status == null || status === '') {
    return '—';
  }
  return String(status).toUpperCase();
};
