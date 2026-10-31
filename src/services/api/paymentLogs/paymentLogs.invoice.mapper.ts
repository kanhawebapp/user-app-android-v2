import type {PaymentInvoice} from '../walletTransactions/paymentInvoice.types';
import type {RechargeInvoice, ServicesInvoice} from './paymentLogs.invoice.types';

const strOrNull = (
  value: string | number | null | undefined,
): string | null => {
  if (value == null) {
    return null;
  }
  const text = String(value).trim();
  return text === '' ? null : text;
};

/**
 * Recharge invoice description always displays exactly "Wallet Recharge".
 * No pack name, coins, or PG charge text is appended.
 */
export const buildRechargeItemDescription = (
  _invoice: RechargeInvoice,
): string => 'Wallet Recharge';

export const mapServicesInvoiceToPaymentInvoice = (
  invoice: ServicesInvoice,
): PaymentInvoice => ({
  id: invoice.id,
  invoiceNo: invoice.invoiceNo,
  transactionId: invoice.transactionId,
  razorpayOrderId: invoice.razorpayOrderId,
  razorpayPaymentId: invoice.razorpayPaymentId,
  paymentOrderId: invoice.paymentOrderId,
  amount: invoice.amount,
  discount: invoice.discount,
  taxableAmount: invoice.taxableAmount,
  sgst: invoice.sgst,
  cgst: invoice.cgst,
  igst: invoice.igst,
  sgstRate: invoice.sgstRate,
  cgstRate: invoice.cgstRate,
  igstRate: invoice.igstRate,
  gstRate: invoice.gstRate,
  totalTax: invoice.totalTax,
  totalAmount: invoice.totalAmount,
  amountReceived: invoice.amountReceived,
  amountInWords: invoice.amountInWords,
  userName: invoice.userName,
  city: invoice.city,
  state: invoice.state,
  pincode: invoice.pincode,
  country: invoice.country,
  placeOfSupply: invoice.placeOfSupply,
  supplierGSTIN: invoice.supplierGSTIN,
  supplierAddress: invoice.supplierAddress,
  website: invoice.website,
  email: invoice.email,
  recipientGSTIN: invoice.recipientGSTIN,
  transactionHistoryUrl: invoice.transactionHistoryUrl,
  hsnSac: invoice.hsnSac,
  reverseCharge: invoice.reverseCharge,
  panNumber: invoice.panNumber,
  createdAt: invoice.createdAt,
  itemDescription:
    strOrNull(invoice.serviceName) ??
    strOrNull(invoice.serviceType) ??
    'Service',
  invoiceType: 'SERVICE',
});

export const mapRechargeInvoiceToPaymentInvoice = (
  invoice: RechargeInvoice,
): PaymentInvoice => ({
  id: invoice.id,
  invoiceNo: invoice.invoiceNo,
  transactionId: invoice.transactionId,
  paymentOrderId: invoice.paymentOrderId,
  razorpayOrderId: invoice.razorpayOrderId,
  razorpayPaymentId: invoice.razorpayPaymentId,
  amount: invoice.amount,
  discount: invoice.discount,
  taxableAmount: invoice.taxableAmount,
  sgst: invoice.sgst,
  cgst: invoice.cgst,
  igst: invoice.igst,
  sgstRate: invoice.sgstRate,
  cgstRate: invoice.cgstRate,
  igstRate: invoice.igstRate,
  gstRate: invoice.gstRate,
  totalTax: invoice.totalTax,
  totalAmount: invoice.totalAmount,
  amountReceived: invoice.amountReceived,
  amountInWords: invoice.amountInWords,
  userName: invoice.userName,
  city: invoice.city,
  state: invoice.state,
  pincode: invoice.pincode,
  country: invoice.country,
  placeOfSupply: invoice.placeOfSupply,
  supplierGSTIN: invoice.supplierGSTIN,
  supplierAddress: invoice.supplierAddress,
  website: invoice.website,
  email: invoice.email,
  recipientGSTIN: invoice.recipientGSTIN,
  transactionHistoryUrl: invoice.transactionHistoryUrl,
  hsnSac: invoice.hsnSac,
  reverseCharge: invoice.reverseCharge,
  panNumber: invoice.panNumber,
  createdAt: invoice.createdAt,
  itemDescription: buildRechargeItemDescription(invoice),
  invoiceType: 'RECHARGE',
});
