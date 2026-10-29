import {
  buildRechargeItemDescription,
  mapRechargeInvoiceToPaymentInvoice,
  mapServicesInvoiceToPaymentInvoice,
} from '../src/services/api/paymentLogs/paymentLogs.invoice.mapper';
import type {
  RechargeInvoice,
  ServicesInvoice,
} from '../src/services/api/paymentLogs/paymentLogs.invoice.types';

const baseServices: ServicesInvoice = {
  id: 'inv-svc-1',
  invoiceNo: 'SVC-001',
  transactionId: 'pay_abc',
  razorpayOrderId: 'order_1',
  razorpayPaymentId: 'pay_1',
  amount: 500,
  discount: 0,
  taxableAmount: 424,
  sgst: 38,
  cgst: 38,
  igst: 0,
  sgstRate: 9,
  cgstRate: 9,
  igstRate: 0,
  gstRate: 18,
  totalTax: 76,
  totalAmount: 500,
  amountReceived: 500,
  amountInWords: 'Five hundred rupees only',
  userName: 'Test User',
  city: 'Pune',
  state: 'Maharashtra',
  pincode: '411001',
  country: 'India',
  placeOfSupply: 'Maharashtra',
  supplierGSTIN: '27AAAAA0000A1Z5',
  supplierAddress: 'Address',
  website: 'https://dhwaniastro.com',
  email: 'care@dhwaniastro.com',
  recipientGSTIN: null,
  transactionHistoryUrl: null,
  hsnSac: '999799',
  reverseCharge: false,
  panNumber: 'ABCDE1234F',
  serviceType: 'SERVICE',
  serviceId: 'svc-1',
  serviceName: 'Birth Spell',
  createdAt: '2024-01-01T00:00:00.000Z',
};

const baseRecharge: RechargeInvoice = {
  id: 'inv-rc-1',
  invoiceNo: 'RC-001',
  transactionId: 'pay_xyz',
  paymentOrderId: 'po_1',
  razorpayOrderId: 'order_2',
  razorpayPaymentId: 'pay_2',
  rechargePackId: 'pack-1',
  rechargePackName: 'Starter Pack',
  rechargePackDescription: '100 coins pack',
  coins: 100,
  amount: 118,
  taxableAmount: 100,
  discount: 0,
  gstRate: 18,
  sgstRate: 0,
  cgstRate: 0,
  igstRate: 18,
  sgst: 0,
  cgst: 0,
  igst: 18,
  totalTax: 18,
  totalAmount: 118,
  pgChargeRate: 2,
  pgCharge: 2,
  pgIgst: 0.36,
  pgTotal: 2.36,
  amountReceived: 118,
  amountInWords: 'One hundred eighteen rupees only',
  userName: 'Test User',
  city: 'Pune',
  state: 'Maharashtra',
  country: 'India',
  placeOfSupply: 'Maharashtra',
  pincode: '411001',
  recipientGSTIN: null,
  supplierGSTIN: '27AAAAA0000A1Z5',
  supplierAddress: 'Address',
  website: 'https://dhwaniastro.com',
  email: 'care@dhwaniastro.com',
  hsnSac: '999799',
  reverseCharge: false,
  panNumber: 'ABCDE1234F',
  transactionHistoryUrl: null,
  provider: 'RAZORPAY',
  status: 'SUCCESS',
  platform: 'ANDROID',
  createdAt: '2024-01-01T00:00:00.000Z',
};

describe('paymentLogs invoice mappers', () => {
  it('maps services invoice with serviceName as item description', () => {
    const mapped = mapServicesInvoiceToPaymentInvoice(baseServices);
    expect(mapped.invoiceNo).toBe('SVC-001');
    expect(mapped.transactionId).toBe('pay_abc');
    expect(mapped.itemDescription).toBe('Birth Spell');
    expect(mapped.amount).toBe(500);
  });

  it('falls back to serviceType when serviceName is missing', () => {
    const mapped = mapServicesInvoiceToPaymentInvoice({
      ...baseServices,
      serviceName: null,
      serviceType: 'PUJA',
    });
    expect(mapped.itemDescription).toBe('PUJA');
  });

  it('builds recharge description with pack, coins, and PG charge', () => {
    expect(buildRechargeItemDescription(baseRecharge)).toBe(
      'Starter Pack - 100 coins pack - 100 coins - PG charge Rs. 2.36',
    );

    const mapped = mapRechargeInvoiceToPaymentInvoice(baseRecharge);
    expect(mapped.itemDescription).toContain('Starter Pack');
    expect(mapped.itemDescription).toContain('100 coins');
    expect(mapped.totalAmount).toBe(118);
  });
});
