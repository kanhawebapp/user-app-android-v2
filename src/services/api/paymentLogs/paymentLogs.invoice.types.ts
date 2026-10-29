/** Invoice returned by getServicesInvoice (SERVICE / PUJA). */
export interface ServicesInvoice {
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
  serviceType: string | null;
  serviceId: string | null;
  serviceName: string | null;
  createdAt: string | null;
}

/** Invoice returned by getRechargeInvoice (RECHARGE). */
export interface RechargeInvoice {
  id: string;
  invoiceNo: string | null;
  transactionId: string | null;
  paymentOrderId: string | null;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  rechargePackId: string | null;
  rechargePackName: string | null;
  rechargePackDescription: string | null;
  coins: number | null;
  amount: number | null;
  taxableAmount: number | null;
  discount: number | null;
  gstRate: number | null;
  sgstRate: number | null;
  cgstRate: number | null;
  igstRate: number | null;
  sgst: number | null;
  cgst: number | null;
  igst: number | null;
  totalTax: number | null;
  totalAmount: number | null;
  pgChargeRate: number | null;
  pgCharge: number | null;
  pgIgst: number | null;
  pgTotal: number | null;
  amountReceived: number | null;
  amountInWords: string | null;
  userName: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  placeOfSupply: string | null;
  pincode: string | null;
  recipientGSTIN: string | null;
  supplierGSTIN: string | null;
  supplierAddress: string | null;
  website: string | null;
  email: string | null;
  hsnSac: string | null;
  reverseCharge: boolean | null;
  panNumber: string | null;
  transactionHistoryUrl: string | null;
  provider: string | null;
  status: string | null;
  platform: string | null;
  createdAt: string | null;
}

export interface GetServicesInvoiceResponse {
  getServicesInvoice: ServicesInvoice | null;
}

export interface GetRechargeInvoiceResponse {
  getRechargeInvoice: RechargeInvoice | null;
}
