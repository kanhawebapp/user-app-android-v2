import {graphqlRequest} from '../graphql.client';
import {GET_PAYMENT_INVOICE} from './paymentInvoice.query';
import type {
  GetPaymentInvoiceResponse,
  PaymentInvoice,
} from './paymentInvoice.types';

export const getPaymentInvoice = async (
  transactionId: string,
): Promise<PaymentInvoice> => {
  try {
    const response = await graphqlRequest<GetPaymentInvoiceResponse>(
      'GetPaymentInvoice',
      GET_PAYMENT_INVOICE,
      {transactionId},
    );
    console.log('GET PAYMENT INVOICE RESPONSE:', response);
    return response.getPaymentInvoice;
  } catch (error) {
    console.log('GET PAYMENT INVOICE ERROR:', error);
    throw error;
  }
};
