jest.mock('react-native-blob-util', () => ({
  __esModule: true,
  default: {
    fs: {
      dirs: {DocumentDir: '/tmp', CacheDir: '/tmp/cache'},
      writeFile: jest.fn().mockResolvedValue(undefined),
      readFile: jest.fn().mockResolvedValue('dGVzdA=='),
      exists: jest.fn().mockResolvedValue(true),
    },
  },
}));

jest.mock('react-native-share', () => ({
  __esModule: true,
  default: {open: jest.fn().mockResolvedValue(undefined)},
}));

jest.mock('../src/utils/invoice/loadLogo', () => ({
  loadInvoiceLogoBase64: jest
    .fn()
    .mockResolvedValue(
      require('fs').readFileSync(
        require('path').resolve(
          __dirname,
          '../src/assets/images/invoice-image.png',
        ),
        'base64',
      ),
    ),
  resetLogoCache: jest.fn(),
}));

// @ts-ignore - pako is a transitive dependency, no type declarations
import pako from 'pako';
import {
  buildInvoiceBase64,
  createInvoiceFileName,
  generateAndShareInvoice,
} from '../src/utils/invoice/invoicePdf';
import type {PaymentInvoice} from '../src/services/api/walletTransactions/paymentInvoice.types';

const sample: PaymentInvoice = {
  id: 'tx-1',
  invoiceNo: 'INV-001',
  transactionId: 'd2f16eb2-84cb-4a0e-af84-71f2c929f67d',
  razorpayOrderId: 'order_1',
  razorpayPaymentId: 'pay_1',
  amount: 1200,
  discount: 0,
  taxableAmount: 1000,
  sgst: 90,
  cgst: 90,
  igst: 0,
  sgstRate: 9,
  cgstRate: 9,
  igstRate: 0,
  gstRate: 18,
  totalTax: 180,
  totalAmount: 1180,
  amountReceived: 1180,
  amountInWords: 'One thousand one hundred eighty rupees only',
  userName: 'Amit Kumar',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400001',
  country: 'India',
  placeOfSupply: 'Maharashtra',
  supplierGSTIN: '27AABCU9676FZP1',
  supplierAddress: 'Dhwani Astro Pvt Ltd, Mumbai, Maharashtra',
  website: 'https://dhwaniastro.com',
  email: 'care@dawniaastro.com',
  recipientGSTIN: '27ABCDE1234FGH5',
  transactionHistoryUrl: 'https://dhwaniastro.com/transactions',
  hsnSac: '9983',
  reverseCharge: false,
  panNumber: 'ABCDE1234F',
  createdAt: '1788593578348',
};

const extractPdfText = (b64: string): string => {
  const bytes = Buffer.from(b64, 'base64');
  const str = bytes.toString('latin1');
  let result = '';

  let idx = 0;
  while (true) {
    const si = str.indexOf('stream\n', idx);
    if (si === -1) {
      const si2 = str.indexOf('stream\r\n', idx);
      if (si2 === -1) {
        break;
      }
      idx = si2 + 7;
    } else {
      idx = si + 7;
    }

    const contentStart = idx;
    const ei = str.indexOf('endstream', contentStart);
    if (ei === -1) {
      break;
    }

    let streamEnd = ei;
    const prev = str.charCodeAt(streamEnd - 1);
    if (prev === 0x0a) {
      streamEnd--;
    } else if (prev === 0x0d) {
      streamEnd--;
      if (str.charCodeAt(streamEnd - 1) === 0x0a) {
        streamEnd--;
      }
    }

    const raw = str.substring(contentStart, streamEnd);
    try {
      const dec = pako.inflate(Buffer.from(raw, 'latin1'));
      const text = dec.toString('latin1');
      const parts = text.split(',');
      let ascii = '';
      for (const p of parts) {
        const n = parseInt(p.trim(), 10);
        if (!isNaN(n)) {
          ascii += String.fromCharCode(n);
        }
      }
      ascii = ascii.replace(/<([0-9A-Fa-f]+)>/g, (_m, hex: string) => {
        let s = '';
        for (let i = 0; i < hex.length; i += 2) {
          s += String.fromCharCode(parseInt(hex.substring(i, i + 2), 16));
        }
        return s;
      });
      result += ascii;
    } catch {
      result += raw;
    }

    idx = ei + 9;
  }

  return result;
};

describe('payment invoice pdf', () => {
  it('produces a valid PDF base64 document with mapped fields', async () => {
    const b64 = await buildInvoiceBase64(sample);
    expect(typeof b64).toBe('string');
    expect(b64.length).toBeGreaterThan(100);

    const header = Buffer.from(b64, 'base64').slice(0, 5).toString('latin1');
    expect(header).toBe('%PDF-');

    const pdfText = extractPdfText(b64);
    expect(pdfText).toContain('Payment Invoice');
    expect(pdfText).toContain('Original for recipient');
    expect(pdfText).toContain('DHWANI ASTRO');
    expect(pdfText).toContain('Customer Address');
    expect(pdfText).toContain('Place of Supply');
    expect(pdfText).toContain('Amit Kumar');
    expect(pdfText).toContain('Transaction Id');
    expect(pdfText).toContain('Payment Id');
    expect(pdfText).toContain('Invoice Voucher No');
    expect(pdfText).toContain('INV-001');
    expect(pdfText).toContain('Description');
    expect(pdfText).toContain('Taxable Value');
    expect(pdfText).toContain('SGST');
    expect(pdfText).toContain('CGST');
    expect(pdfText).toContain('IGST');
    // Description may wrap across PDF text operators; match a distinctive token.
    expect(pdfText).toMatch(/AT-Money|Razorpay/);
    expect(pdfText).toContain('Total Tax');
    expect(pdfText).toContain('Total amount');
    expect(pdfText).toContain('Total amount (in words)');
    expect(pdfText).toContain('Total amount received');
    expect(pdfText).toContain('transaction history');
    expect(pdfText).toContain('Other details');
    expect(pdfText).toContain('HSN/SAC');
    expect(pdfText).toContain('computer generated invoice voucher');

    expect(pdfText).toContain('27AABCU9676FZP1');
    expect(pdfText).toContain('ABCDE1234F');
    expect(pdfText).toContain('9983');
  });

  it('builds the expected invoice filename', () => {
    expect(createInvoiceFileName(sample)).toBe('Invoice_INV-001.pdf');
    const fallback = {...sample, invoiceNo: null, transactionId: null};
    expect(createInvoiceFileName(fallback)).toBe('Invoice_invoice.pdf');
  });

  it('generates, saves and shares the invoice', async () => {
    const path = await generateAndShareInvoice(sample);
    expect(path).toContain('Invoice_INV-001.pdf');
  });
});
