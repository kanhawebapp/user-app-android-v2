import {useCallback, useState} from 'react';
import {getPaymentInvoice} from './paymentInvoice.api';
import type {PaymentInvoice} from './paymentInvoice.types';

export const usePaymentInvoice = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invoice, setInvoice] = useState<PaymentInvoice | null>(null);

  const fetchInvoice = useCallback(
    async (transactionId: string): Promise<PaymentInvoice> => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPaymentInvoice(transactionId);
        setInvoice(data);
        return data;
      } catch (e: any) {
        const message = e?.message ?? 'Failed to load payment invoice';
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
