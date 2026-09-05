export interface PaymentInvoice {
  id: string;
  invoiceNo: string | null;
  transactionId: string | null;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  amount: number | null;
  discount: number | null;
  taxableAmount: number | null;
  sgst: number | null;
  cgst: number | null;
  igst: number | null;
  sgstRate: number | null;
  cgstRate: number | null;
  igstRate: number | null;
  gstRate: number | null;
  totalTax: number | null;
  totalAmount: number | null;
  amountReceived: number | null;
  amountInWords: string | null;
  userName: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  country: string | null;
  placeOfSupply: string | null;
  supplierGSTIN: string | null;
  supplierAddress: string | null;
  website: string | null;
  email: string | null;
  recipientGSTIN: string | null;
  transactionHistoryUrl: string | null;
  hsnSac: string | null;
  reverseCharge: boolean | null;
  panNumber: string | null;
  createdAt: string | null;
}

export interface GetPaymentInvoiceResponse {
  getPaymentInvoice: PaymentInvoice;
}
