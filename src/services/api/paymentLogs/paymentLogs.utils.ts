import type {
  RechargePaymentLog,
  ServicesBankPaymentLog,
  UnifiedPaymentKind,
  UnifiedPaymentLog,
} from './paymentLogs.types';

export const parsePaymentTimestamp = (
  value: string | number | null | undefined,
): number => {
  if (value == null || value === '') {
    return 0;
  }

  if (typeof value === 'number') {
    return value;
  }

  const trimmed = String(value).trim();
  if (/^\d+$/.test(trimmed)) {
    return Number(trimmed);
  }

  const parsed = new Date(trimmed).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const normalizeServiceBankLog = (
  item: ServicesBankPaymentLog,
): UnifiedPaymentLog => {
  const serviceType = (item.serviceType || 'SERVICE').toUpperCase();
  const kind: UnifiedPaymentKind = serviceType === 'PUJA' ? 'PUJA' : 'SERVICE';

  return {
    id: item.id,
    kind,
    invoiceNo: item.invoiceNo ?? null,
    serviceType: item.serviceType ?? kind,
    serviceName: item.serviceName ?? (kind === 'PUJA' ? 'Puja' : null),
    bookingId: item.bookingId ?? null,
    taxableAmount: item.taxableAmount ?? null,
    totalTax: item.totalTax ?? null,
    amount: item.amount ?? null,
    rechargePackName: null,
    coins: null,
    status: null,
    createdAt: item.createdAt,
    rawSource: 'services_bank',
  };
};

export const normalizeRechargeLog = (
  item: RechargePaymentLog,
): UnifiedPaymentLog => ({
  id: item.id,
  kind: 'RECHARGE',
  invoiceNo: item.invoiceNo ?? null,
  serviceType: 'RECHARGE',
  serviceName: null,
  bookingId: null,
  taxableAmount: null,
  totalTax: null,
  amount: item.amount ?? null,
  rechargePackName: item.rechargePackName ?? null,
  coins: item.coins ?? null,
  status: item.status ?? null,
  createdAt: item.createdAt,
  rawSource: 'recharge',
});

export const sortPaymentsByCreatedAtDesc = (
  items: UnifiedPaymentLog[],
): UnifiedPaymentLog[] =>
  [...items].sort(
    (a, b) =>
      parsePaymentTimestamp(b.createdAt) - parsePaymentTimestamp(a.createdAt),
  );

/** Client-side Invoice Number filter on already-loaded records. */
export const filterPaymentsByInvoiceNo = (
  items: UnifiedPaymentLog[],
  invoiceSearch: string,
): UnifiedPaymentLog[] => {
  const invoiceQuery = invoiceSearch.trim().toLowerCase();

  if (!invoiceQuery) {
    return items;
  }

  return items.filter(item =>
    (item.invoiceNo || '').toLowerCase().includes(invoiceQuery),
  );
};

export const paginateItems = <T>(
  items: T[],
  page: number,
  limit: number,
): T[] => {
  const start = Math.max(0, (page - 1) * limit);
  return items.slice(start, start + limit);
};

/** Append incoming rows, dedupe by source+id, sort by createdAt desc. */
export const mergeUniquePayments = (
  existing: UnifiedPaymentLog[],
  incoming: UnifiedPaymentLog[],
): UnifiedPaymentLog[] => {
  const map = new Map<string, UnifiedPaymentLog>();

  for (const item of existing) {
    map.set(`${item.rawSource}-${item.id}`, item);
  }
  for (const item of incoming) {
    map.set(`${item.rawSource}-${item.id}`, item);
  }

  return sortPaymentsByCreatedAtDesc(Array.from(map.values()));
};
