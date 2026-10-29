import {
  buildRechargePaymentLogsVariables,
  buildServicesBankPaymentLogsVariables,
} from '../src/services/api/paymentLogs/paymentLogs.api';
import {
  formatLocalIsoDate,
  parseLocalIsoDate,
  toGraphqlDateParam,
} from '../src/services/api/paymentLogs/paymentLogs.date';
import {filterPaymentsByInvoiceNo} from '../src/services/api/paymentLogs/paymentLogs.utils';
import type {UnifiedPaymentLog} from '../src/services/api/paymentLogs/paymentLogs.types';

describe('paymentLogs date helpers', () => {
  it('formats a local Date as YYYY-MM-DD', () => {
    const date = new Date(2026, 9, 29, 15, 45, 0);
    expect(formatLocalIsoDate(date)).toBe('2026-10-29');
  });

  it('parses YYYY-MM-DD without UTC day shift', () => {
    const parsed = parseLocalIsoDate('2026-10-29');
    expect(parsed.getFullYear()).toBe(2026);
    expect(parsed.getMonth()).toBe(9);
    expect(parsed.getDate()).toBe(29);
  });

  it('normalizes cleared/empty dates to null for GraphQL', () => {
    expect(toGraphqlDateParam(null)).toBeNull();
    expect(toGraphqlDateParam(undefined)).toBeNull();
    expect(toGraphqlDateParam('')).toBeNull();
    expect(toGraphqlDateParam('   ')).toBeNull();
    expect(toGraphqlDateParam('2026-10-29')).toBe('2026-10-29');
  });
});

describe('paymentLogs GraphQL variable builders', () => {
  it('passes startDate only for services bank', () => {
    expect(
      buildServicesBankPaymentLogsVariables({
        page: 1,
        limit: 10,
        serviceType: 'SERVICE',
        startDate: '2026-10-01',
        endDate: null,
      }),
    ).toEqual({
      page: 1,
      limit: 10,
      serviceType: 'SERVICE',
      startDate: '2026-10-01',
      endDate: null,
    });
  });

  it('passes endDate only for services bank', () => {
    expect(
      buildServicesBankPaymentLogsVariables({
        page: 1,
        limit: 10,
        serviceType: 'PUJA',
        startDate: null,
        endDate: '2026-10-29',
      }),
    ).toEqual({
      page: 1,
      limit: 10,
      serviceType: 'PUJA',
      startDate: null,
      endDate: '2026-10-29',
    });
  });

  it('passes both dates and converts empty strings to null', () => {
    expect(
      buildServicesBankPaymentLogsVariables({
        page: 1,
        limit: 10,
        serviceType: null,
        startDate: '2026-10-01',
        endDate: '',
      }),
    ).toEqual({
      page: 1,
      limit: 10,
      serviceType: null,
      startDate: '2026-10-01',
      endDate: null,
    });
  });

  it('passes date range for recharge logs', () => {
    expect(
      buildRechargePaymentLogsVariables({
        page: 1,
        limit: 10,
        startDate: '2026-10-01',
        endDate: '2026-10-29',
      }),
    ).toEqual({
      page: 1,
      limit: 10,
      startDate: '2026-10-01',
      endDate: '2026-10-29',
    });
  });
});

describe('paymentLogs invoice filter', () => {
  const rows: UnifiedPaymentLog[] = [
    {
      id: '1',
      kind: 'SERVICE',
      invoiceNo: 'INV-100',
      serviceType: 'SERVICE',
      serviceName: 'A',
      bookingId: 'BOOK-1',
      taxableAmount: 1,
      totalTax: 0,
      amount: 1,
      rechargePackName: null,
      coins: null,
      status: null,
      createdAt: '1',
      rawSource: 'services_bank',
    },
    {
      id: '2',
      kind: 'RECHARGE',
      invoiceNo: 'INV-200',
      serviceType: 'RECHARGE',
      serviceName: null,
      bookingId: null,
      taxableAmount: null,
      totalTax: null,
      amount: 2,
      rechargePackName: 'Pack',
      coins: 10,
      status: 'SUCCESS',
      createdAt: '2',
      rawSource: 'recharge',
    },
  ];

  it('filters loaded records by invoiceNo', () => {
    expect(filterPaymentsByInvoiceNo(rows, 'inv-100')).toHaveLength(1);
    expect(filterPaymentsByInvoiceNo(rows, 'inv-100')[0].id).toBe('1');
    expect(filterPaymentsByInvoiceNo(rows, 'INV')).toHaveLength(2);
    expect(filterPaymentsByInvoiceNo(rows, '')).toHaveLength(2);
  });
});
