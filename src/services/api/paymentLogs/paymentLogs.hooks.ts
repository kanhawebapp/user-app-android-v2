import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  getRechargePaymentLogs,
  getServicesBankPaymentLogs,
} from './paymentLogs.api';
import type {PaymentLogsCategory, UnifiedPaymentLog} from './paymentLogs.types';
import {
  filterPaymentsByInvoiceNo,
  mergeUniquePayments,
  normalizeRechargeLog,
  normalizeServiceBankLog,
} from './paymentLogs.utils';

const DEFAULT_LIMIT = 10;

export interface UsePaymentLogsOptions {
  category?: PaymentLogsCategory;
  startDate?: string | null;
  endDate?: string | null;
  /** Client-side only — does not trigger API refetch. */
  invoiceSearch?: string;
  limit?: number;
}

export const usePaymentLogs = (options: UsePaymentLogsOptions = {}) => {
  const category = options.category ?? 'all';
  const startDate = options.startDate ?? null;
  const endDate = options.endDate ?? null;
  const invoiceSearch = options.invoiceSearch ?? '';
  const limit = options.limit ?? DEFAULT_LIMIT;

  const [rawData, setRawData] = useState<UnifiedPaymentLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const requestIdRef = useRef(0);
  const loadingMoreRef = useRef(false);
  const hasMoreRef = useRef(true);

  // Single-API pagination (service / puja / recharge)
  const pageRef = useRef(1);
  const totalPagesRef = useRef(1);

  // Dual-API pagination (all)
  const servicesPageRef = useRef(1);
  const rechargePageRef = useRef(1);
  const servicesHasMoreRef = useRef(true);
  const rechargeHasMoreRef = useRef(true);

  const syncHasMore = useCallback((value: boolean) => {
    hasMoreRef.current = value;
    setHasMore(value);
  }, []);

  const resetPagination = useCallback(() => {
    pageRef.current = 1;
    totalPagesRef.current = 1;
    servicesPageRef.current = 1;
    rechargePageRef.current = 1;
    servicesHasMoreRef.current = true;
    rechargeHasMoreRef.current = true;
    syncHasMore(true);
  }, [syncHasMore]);

  const fetchSingleCategoryPage = useCallback(
    async (page: number) => {
      if (category === 'recharge') {
        const res = await getRechargePaymentLogs({
          page,
          limit,
          startDate,
          endDate,
        });
        return {
          rows: (res.data || []).map(normalizeRechargeLog),
          currentPage: res.pagination?.currentPage ?? page,
          totalPages: Math.max(1, res.pagination?.totalPages ?? 1),
        };
      }

      const serviceType = category === 'puja' ? 'PUJA' : 'SERVICE';
      const res = await getServicesBankPaymentLogs({
        page,
        limit,
        serviceType,
        startDate,
        endDate,
      });
      return {
        rows: (res.data || []).map(normalizeServiceBankLog),
        currentPage: res.pagination?.currentPage ?? page,
        totalPages: Math.max(1, res.pagination?.totalPages ?? 1),
      };
    },
    [category, limit, startDate, endDate],
  );

  const fetchInitial = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    loadingMoreRef.current = false;
    resetPagination();
    setRawData([]);
    setLoading(true);
    setLoadingMore(false);
    setError(null);

    try {
      if (category === 'all') {
        const [servicesRes, rechargeRes] = await Promise.all([
          getServicesBankPaymentLogs({
            page: 1,
            limit,
            serviceType: null,
            startDate,
            endDate,
          }),
          getRechargePaymentLogs({
            page: 1,
            limit,
            startDate,
            endDate,
          }),
        ]);

        if (requestId !== requestIdRef.current) {
          return;
        }

        const servicesRows = (servicesRes.data || []).map(
          normalizeServiceBankLog,
        );
        const rechargeRows = (rechargeRes.data || []).map(normalizeRechargeLog);

        servicesPageRef.current = servicesRes.pagination?.currentPage ?? 1;
        rechargePageRef.current = rechargeRes.pagination?.currentPage ?? 1;

        const servicesTotalPages = Math.max(
          1,
          servicesRes.pagination?.totalPages ?? 1,
        );
        const rechargeTotalPages = Math.max(
          1,
          rechargeRes.pagination?.totalPages ?? 1,
        );

        servicesHasMoreRef.current =
          servicesPageRef.current < servicesTotalPages;
        rechargeHasMoreRef.current =
          rechargePageRef.current < rechargeTotalPages;

        syncHasMore(servicesHasMoreRef.current || rechargeHasMoreRef.current);
        setRawData(mergeUniquePayments([], [...servicesRows, ...rechargeRows]));
      } else {
        const result = await fetchSingleCategoryPage(1);

        if (requestId !== requestIdRef.current) {
          return;
        }

        pageRef.current = result.currentPage;
        totalPagesRef.current = result.totalPages;
        syncHasMore(result.currentPage < result.totalPages);
        setRawData(result.rows);
      }
    } catch (err: any) {
      if (requestId !== requestIdRef.current) {
        return;
      }
      setError(
        err?.message || 'Failed to load payment logs. Please try again.',
      );
      setRawData([]);
      syncHasMore(false);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [
    category,
    limit,
    startDate,
    endDate,
    fetchSingleCategoryPage,
    resetPagination,
    syncHasMore,
  ]);

  const loadMore = useCallback(async () => {
    if (
      loadingMoreRef.current ||
      !hasMoreRef.current ||
      requestIdRef.current === 0
    ) {
      return;
    }

    const requestId = requestIdRef.current;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    setError(null);

    try {
      if (category === 'all') {
        const nextServicesPage = servicesPageRef.current + 1;
        const nextRechargePage = rechargePageRef.current + 1;

        const tasks: Promise<{
          source: 'services' | 'recharge';
          rows: UnifiedPaymentLog[];
          currentPage: number;
          totalPages: number;
        }>[] = [];

        if (servicesHasMoreRef.current) {
          tasks.push(
            getServicesBankPaymentLogs({
              page: nextServicesPage,
              limit,
              serviceType: null,
              startDate,
              endDate,
            }).then(res => ({
              source: 'services' as const,
              rows: (res.data || []).map(normalizeServiceBankLog),
              currentPage: res.pagination?.currentPage ?? nextServicesPage,
              totalPages: Math.max(1, res.pagination?.totalPages ?? 1),
            })),
          );
        }

        if (rechargeHasMoreRef.current) {
          tasks.push(
            getRechargePaymentLogs({
              page: nextRechargePage,
              limit,
              startDate,
              endDate,
            }).then(res => ({
              source: 'recharge' as const,
              rows: (res.data || []).map(normalizeRechargeLog),
              currentPage: res.pagination?.currentPage ?? nextRechargePage,
              totalPages: Math.max(1, res.pagination?.totalPages ?? 1),
            })),
          );
        }

        if (tasks.length === 0) {
          syncHasMore(false);
          return;
        }

        const results = await Promise.all(tasks);

        if (requestId !== requestIdRef.current) {
          return;
        }

        const incoming: UnifiedPaymentLog[] = [];

        for (const result of results) {
          incoming.push(...result.rows);
          if (result.source === 'services') {
            servicesPageRef.current = result.currentPage;
            servicesHasMoreRef.current = result.currentPage < result.totalPages;
          } else {
            rechargePageRef.current = result.currentPage;
            rechargeHasMoreRef.current = result.currentPage < result.totalPages;
          }
        }

        syncHasMore(servicesHasMoreRef.current || rechargeHasMoreRef.current);

        if (incoming.length > 0) {
          setRawData(prev => mergeUniquePayments(prev, incoming));
        }
      } else {
        const nextPage = pageRef.current + 1;
        if (nextPage > totalPagesRef.current) {
          syncHasMore(false);
          return;
        }

        const result = await fetchSingleCategoryPage(nextPage);

        if (requestId !== requestIdRef.current) {
          return;
        }

        pageRef.current = result.currentPage;
        totalPagesRef.current = result.totalPages;
        syncHasMore(result.currentPage < result.totalPages);

        if (result.rows.length > 0) {
          setRawData(prev => mergeUniquePayments(prev, result.rows));
        }
      }
    } catch (err: any) {
      if (requestId !== requestIdRef.current) {
        return;
      }
      setError(
        err?.message || 'Failed to load more payment logs. Please try again.',
      );
    } finally {
      loadingMoreRef.current = false;
      if (requestId === requestIdRef.current) {
        setLoadingMore(false);
      }
    }
  }, [
    category,
    limit,
    startDate,
    endDate,
    fetchSingleCategoryPage,
    syncHasMore,
  ]);

  useEffect(() => {
    fetchInitial();
  }, [fetchInitial]);

  const data = useMemo(
    () => filterPaymentsByInvoiceNo(rawData, invoiceSearch),
    [rawData, invoiceSearch],
  );

  return {
    data,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refresh: fetchInitial,
  };
};
