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
 * Builds the PDF table description for a recharge invoice.
 * Pack name is primary; description and coins are appended when present.
 * PG charge totals are appended only as a short suffix (layout has no PG rows).
 */
export const buildRechargeItemDescription = (
  invoice: RechargeInvoice,
): string => {
  const parts: string[] = [];

  const packName = strOrNull(invoice.rechargePackName);
  if (packName) {
    parts.push(packName);
  }

  const packDescription = strOrNull(invoice.rechargePackDescription);
  if (packDescription && packDescription !== packName) {
    parts.push(packDescription);
  }

  if (invoice.coins != null && Number.isFinite(Number(invoice.coins))) {
    parts.push(`${invoice.coins} coins`);
  }

  if (
    invoice.pgTotal != null &&
    Number.isFinite(Number(invoice.pgTotal)) &&
    Number(invoice.pgTotal) > 0
  ) {
    parts.push(`PG charge Rs. ${Number(invoice.pgTotal).toFixed(2)}`);
  }

  if (parts.length === 0) {
    return 'Wallet Recharge';
  }

  return parts.join(' - ');
};

export const mapServicesInvoiceToPaymentInvoice = (
  invoice: ServicesInvoice,
): PaymentInvoice => ({
  id: invoice.id,
  invoiceNo: invoice.invoiceNo,
  transactionId: invoice.transactionId,
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
  itemDescription:
    strOrNull(invoice.serviceName) ??
    strOrNull(invoice.serviceType) ??
    'Service',
});

export const mapRechargeInvoiceToPaymentInvoice = (
  invoice: RechargeInvoice,
): PaymentInvoice => ({
  id: invoice.id,
  invoiceNo: invoice.invoiceNo,
  transactionId: invoice.transactionId,
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
});
