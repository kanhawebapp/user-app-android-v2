import {useCallback, useState} from 'react';
import type {PaymentInvoice} from '../walletTransactions/paymentInvoice.types';
import {getPaymentLogInvoice} from './paymentLogs.invoice.api';
import type {UnifiedPaymentKind, UnifiedPaymentLog} from './paymentLogs.types';

/**
 * Resolves the identifier expected by GetServicesInvoice / GetRechargeInvoice.
 * Payment log rows only expose `id`; the backend invoice queries take that
 * value as `$transactionId` (same contract as wallet GetPaymentInvoice).
 */
export const resolvePaymentLogInvoiceTransactionId = (
  item: Pick<UnifiedPaymentLog, 'id'>,
): string | null => {
  const id = item.id != null ? String(item.id).trim() : '';
  return id === '' ? null : id;
};

export const usePaymentLogInvoice = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invoice, setInvoice] = useState<PaymentInvoice | null>(null);

  const fetchInvoice = useCallback(
    async (
      kind: UnifiedPaymentKind,
      transactionId: string,
    ): Promise<PaymentInvoice> => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPaymentLogInvoice(kind, transactionId);
        setInvoice(data);
        return data;
      } catch (e: any) {
        const message = e?.message ?? 'Failed to load invoice';
        setError(message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {fetchInvoice, loading, error, invoice};
};
