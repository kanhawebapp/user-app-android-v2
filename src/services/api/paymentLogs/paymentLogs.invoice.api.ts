import {graphqlRequest} from '../graphql.client';
import type {PaymentInvoice} from '../walletTransactions/paymentInvoice.types';
import {
  mapRechargeInvoiceToPaymentInvoice,
  mapServicesInvoiceToPaymentInvoice,
} from './paymentLogs.invoice.mapper';
import {
  GET_RECHARGE_INVOICE,
  GET_SERVICES_INVOICE,
} from './paymentLogs.invoice.query';
import type {
  GetRechargeInvoiceResponse,
  GetServicesInvoiceResponse,
} from './paymentLogs.invoice.types';
import type {UnifiedPaymentKind} from './paymentLogs.types';

/**
 * Payment Logs list rows expose `id` as the record identifier.
 * That same value is passed as GraphQL `transactionId` — matching the
 * wallet GetPaymentInvoice pattern (list item.id → invoice query variable).
 */
export const getServicesInvoice = async (
  transactionId: string,
): Promise<PaymentInvoice> => {
  try {
    const response = await graphqlRequest<GetServicesInvoiceResponse>(
      'GetServicesInvoice',
      GET_SERVICES_INVOICE,
      {transactionId},
    );

    console.log('GET SERVICES INVOICE RESPONSE:', response);

    const invoice = response.getServicesInvoice;
    if (!invoice) {
      throw new Error('Invoice not found for this service transaction');
    }

    return mapServicesInvoiceToPaymentInvoice(invoice);
  } catch (error) {
    console.log('GET SERVICES INVOICE ERROR:', error);
    throw error;
  }
};

export const getRechargeInvoice = async (
  transactionId: string,
): Promise<PaymentInvoice> => {
  try {
    const response = await graphqlRequest<GetRechargeInvoiceResponse>(
      'GetRechargeInvoice',
      GET_RECHARGE_INVOICE,
      {transactionId},
    );

    console.log('GET RECHARGE INVOICE RESPONSE:', response);

    const invoice = response.getRechargeInvoice;
    if (!invoice) {
      throw new Error('Invoice not found for this recharge transaction');
    }

    return mapRechargeInvoiceToPaymentInvoice(invoice);
  } catch (error) {
    console.log('GET RECHARGE INVOICE ERROR:', error);
    throw error;
  }
};

export const getPaymentLogInvoice = async (
  kind: UnifiedPaymentKind,
  transactionId: string,
): Promise<PaymentInvoice> => {
  if (kind === 'RECHARGE') {
    return getRechargeInvoice(transactionId);
  }

  if (kind === 'SERVICE' || kind === 'PUJA') {
    return getServicesInvoice(transactionId);
  }

  throw new Error(`Unsupported transaction type: ${String(kind)}`);
};
