import {format} from 'date-fns';
import {PDFDocument, StandardFonts, rgb} from 'pdf-lib';
import type {PDFFont} from 'pdf-lib';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';
import type {PaymentInvoice} from '../../services/api/walletTransactions/paymentInvoice.types';
import {loadInvoiceLogoBase64} from './loadLogo';

const PAGE_W = 595;
const PAGE_H = 842;
const M = 44;
const LINE = 12;
const BAND_H = 90;

const BLACK = rgb(0, 0, 0);
const MUTED = rgb(0.42, 0.42, 0.42);
const HDR_TEXT = rgb(0.9, 0.9, 0.92);
const HDR_ACCENT = rgb(1, 1, 1);
const BORDER = rgb(0.82, 0.82, 0.82);
const ROW_ALT = rgb(0.96, 0.96, 0.97);
const PRIMARY = rgb(0.357, 0.173, 0.647);

const str = (v: string | null | undefined): string => v ?? '';
const num = (v: number | null | undefined): number =>
  v == null ? 0 : Number(v);

const fmtAmt = (v: number | null | undefined): string => {
  const n = num(v);
  return `Rs. ${n.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const fmtRate = (v: number | null | undefined): string =>
  v == null ? '-' : `${num(v)}%`;

const fmtDate = (v: string | null | undefined): string => {
  if (!v) {
    return '-';
  }
  const parsed = new Date(v);
  if (Number.isNaN(parsed.getTime())) {
    const ts = parseInt(v, 10);
    if (!Number.isNaN(ts)) {
      return format(new Date(ts), 'dd MMM yyyy, h:mm a');
    }
  }
  return format(parsed, 'dd MMM yyyy, h:mm a');
};

export const createInvoiceFileName = (invoice: PaymentInvoice): string => {
  const base =
    str(invoice.invoiceNo) || str(invoice.transactionId) || 'invoice';
  return `Invoice_${base}.pdf`;
};

const wrapParagraph = (
  font: PDFFont,
  size: number,
  text: string,
  maxWidth: number,
): string[] => {
  const out: string[] = [];
  const paragraphs = String(text ?? '').split(/\r?\n/);
  for (const p of paragraphs) {
    if (p.trim() === '') {
      out.push('');
      continue;
    }
    const words = p.split(/\s+/);
    let cur = '';
    for (const w of words) {
      const test = cur ? `${cur} ${w}` : w;
      if (font.widthOfTextAtSize(test, size) <= maxWidth) {
        cur = test;
      } else {
        if (cur) {
          out.push(cur);
        }
        cur = w;
      }
    }
    if (cur) {
      out.push(cur);
    }
  }
  return out.length ? out : [''];
};

const drawHRule = (
  page: {drawLine: (o: any) => void},
  x1: number,
  x2: number,
  y: number,
  color: any = BORDER,
) => {
  page.drawLine({start: {x: x1, y}, end: {x: x2, y}, color, thickness: 0.6});
};

export const buildInvoiceBase64 = async (
  invoice: PaymentInvoice,
): Promise<string> => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([PAGE_W, PAGE_H]);
  const helv = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const logoBase64 = await loadInvoiceLogoBase64();
  const logo = await pdfDoc.embedPng(logoBase64);

  let y = PAGE_H - M;

  const move = (n = 1, h = LINE) => {
    y -= h * n;
  };

  const text = (
    t: string,
    x: number,
    size: number,
    font: PDFFont = helv,
    color: any = BLACK,
  ) => {
    page.drawText(t, {x, y, size, font, color});
  };

  const rightMax = PAGE_W - M;
  const rtext = (
    t: string,
    xRight: number,
    size: number,
    font: PDFFont = helv,
    color: any = BLACK,
  ) => {
    text(t, xRight - font.widthOfTextAtSize(t, size), size, font, color);
  };

  // Header band
  page.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_W,
    height: BAND_H,
    color: PRIMARY,
  });

  const logoW = 46;
  const logoH = (logoW * logo.height) / logo.width;
  const logoY = (BAND_H + logoH) / 2;
  page.drawImage(logo, {x: M, y: logoY, width: logoW, height: logoH});

  const title = 'Payment Invoice';
  text(
    title,
    (PAGE_W - helv.widthOfTextAtSize(title, 22)) / 2,
    22,
    bold,
    HDR_ACCENT,
  );
  y = BAND_H - 52;
  const sub = '(Original for recipient)';
  text(sub, (PAGE_W - helv.widthOfTextAtSize(sub, 10)) / 2, 10, helv, HDR_TEXT);
  y = BAND_H - 24;

  // Supplier details (top-right inside header)
  const supW = 160;
  y = BAND_H - 26;
  const supColor = HDR_TEXT;
  const supRow = (label: string, value: string) => {
    const line = `${label}: ${value}`;
    wrapParagraph(helv, 7.5, line, supW).forEach(l => {
      rtext(l, rightMax, 7.5, helv, supColor);
      move(0.7);
    });
  };
  supRow('GSTIN', str(invoice.supplierGSTIN));
  supRow('Website', str(invoice.website));
  supRow('E-mail', str(invoice.email));
  wrapParagraph(
    helv,
    7.5,
    `Address: ${str(invoice.supplierAddress)}`,
    supW,
  ).forEach(l => {
    rtext(l, rightMax, 7.5, helv, supColor);
    move(0.7);
  });

  // Content starts below the band
  y = BAND_H + 18;

  // Billed To (Customer)
  text('Billed To:', M, 9, bold, MUTED);
  move();
  text(str(invoice.userName), M, 10, bold, BLACK);
  move(0.8);
  const billAddr = [
    `${str(invoice.city)}, ${str(invoice.state)} - ${str(invoice.pincode)}`,
    str(invoice.country),
    `Place of Supply: ${str(invoice.placeOfSupply)}`,
  ].join('\n');
  wrapParagraph(helv, 8, billAddr, PAGE_W - M * 2).forEach(l => {
    text(l, M, 8, helv, BLACK);
    move();
  });
  move();

  // Transaction details
  const txRows: [string, string][] = [
    [
      'Transaction Id',
      str(invoice.transactionId) || str(invoice.razorpayOrderId),
    ],
    ['Payment Id', str(invoice.razorpayPaymentId)],
    ['Recipient GSTIN', str(invoice.recipientGSTIN)],
    ['Invoice Voucher No', str(invoice.invoiceNo)],
    ['Invoice Voucher Date', fmtDate(invoice.createdAt)],
  ];
  txRows.forEach(([label, value]) => {
    const line = `${label}: ${value}`;
    wrapParagraph(helv, 8, line, PAGE_W - M * 2).forEach(l => {
      text(l, M, 8, helv, MUTED);
      move();
    });
  });
  move();

  drawHRule(page, M, rightMax, y);
  move();

  // GST Payment table
  const tableX = M;
  const tableW = rightMax - tableX;
  const colWidths = [210, 80, tableW - 210 - 80 - 8];
  const rows: string[][] = [
    ['Particulars', 'Rate (%)', 'Amount (Rs.)'],
    ['Recharge Amount', '', fmtAmt(invoice.amount)],
    ['Discount', '', fmtAmt(invoice.discount)],
    ['Taxable Value', '', fmtAmt(invoice.taxableAmount)],
    ['SGST', fmtRate(invoice.sgstRate), fmtAmt(invoice.sgst)],
    ['CGST', fmtRate(invoice.cgstRate), fmtAmt(invoice.cgst)],
    [
      'IGST',
      fmtRate(invoice.igstRate ?? invoice.gstRate),
      fmtAmt(invoice.igst),
    ],
    ['Total Tax', '', fmtAmt(invoice.totalTax)],
    ['Total Amount', '', fmtAmt(invoice.totalAmount)],
  ];

  const rowH = 15;
  rows.forEach((row, ri) => {
    const ry = y;
    const isHead = ri === 0;
    if (isHead) {
      page.drawRectangle({
        x: tableX,
        y: ry - rowH,
        width: tableW,
        height: rowH,
        color: MUTED,
        borderWidth: 0,
      });
      row.forEach((cell, ci) => {
        const cx =
          tableX + colWidths.slice(0, ci).reduce((a, b) => a + b, 0) + 4;
        page.drawText(String(cell), {
          x: cx,
          y: ry - rowH + 4,
          size: 8.5,
          font: bold,
          color: HDR_ACCENT,
        });
      });
    } else {
      page.drawRectangle({
        x: tableX,
        y: ry - rowH,
        width: tableW,
        height: rowH,
        borderColor: BORDER,
        borderWidth: 0.5,
        color: ri % 2 ? ROW_ALT : undefined,
      });
      row.forEach((cell, ci) => {
        const alignRight = ci === 2;
        const cellW = colWidths[ci];
        const cx = tableX + colWidths.slice(0, ci).reduce((a, b) => a + b, 0);
        const label = String(cell ?? '-');
        const tw = helv.widthOfTextAtSize(label, 8.5);
        const x = alignRight ? cx + cellW - tw - 4 : cx + 4;
        page.drawText(label, {
          x,
          y: ry - rowH + 4,
          size: 8.5,
          font: helv,
          color: BLACK,
        });
      });
    }
  });
  y = y - rows.length * rowH;
  move(0.6);

  // Amount in words
  const wordsLabel = 'Total Amount in Words:';
  text(wordsLabel, M, 8.5, helv, MUTED);
  move();
  wrapParagraph(bold, 8.5, str(invoice.amountInWords), tableW - 80).forEach(
    l => {
      text(l, M, 8.5, bold, BLACK);
      move();
    },
  );
  move(0.3);
  text(
    `Total Amount Received: ${fmtAmt(invoice.amountReceived)}`,
    tableX + colWidths[0] + colWidths[1] + 4,
    8.5,
    bold,
    BLACK,
  );
  move(2);

  // Other details
  text('Other Details', M, 10, bold, BLACK);
  move();
  const detail: [string, string][] = [
    ['Transaction history', str(invoice.transactionHistoryUrl)],
    ['HSN / SAC', str(invoice.hsnSac)],
    ['Reverse charge', invoice.reverseCharge ? 'Yes' : 'No'],
    ['PAN Number', str(invoice.panNumber)],
  ];
  detail.forEach(([label, value]) => {
    const line = `${label}: ${value}`;
    wrapParagraph(helv, 8, line, rightMax - M).forEach(l => {
      text(l, M, 8, helv, MUTED);
      move();
    });
  });
  move();

  drawHRule(page, M, rightMax, y);
  move(4);

  // Footer
  const footY = 26;
  text('Computer Generated Invoice (Not Negotiable)', M, 7.5, helv, MUTED);
  text(`Supplier: ${str(invoice.supplierAddress)}`, M, 7.5, helv, MUTED);
  text(
    `GSTIN: ${str(invoice.supplierGSTIN)} | PAN: ${str(invoice.panNumber)}`,
    M,
    7.5,
    helv,
    MUTED,
  );
  rtext(
    `Invoice date: ${format(new Date(), 'dd MMM yyyy')}`,
    rightMax,
    7.5,
    helv,
    MUTED,
  );
  page.drawLine({
    start: {x: M, y: footY + 6},
    end: {x: rightMax, y: footY + 6},
    color: BORDER,
    thickness: 0.5,
  });
  // supplier contact centered below
  const footLine = `${str(invoice.website)} | ${str(invoice.email)}`;
  if (footLine.trim()) {
    text(
      footLine,
      (PAGE_W - helv.widthOfTextAtSize(footLine, 7.5)) / 2,
      7.5,
      helv,
      MUTED,
    );
  }

  return pdfDoc.saveAsBase64();
};

export const saveInvoiceFile = async (
  base64: string,
  fileName: string,
): Promise<string> => {
  const dir = ReactNativeBlobUtil.fs.dirs.DocumentDir;
  if (!dir) {
    throw new Error('DocumentDir is not available');
  }
  const filePath = `${dir}/${fileName}`;
  await ReactNativeBlobUtil.fs.writeFile(filePath, base64, 'base64');
  const exists = await ReactNativeBlobUtil.fs.exists(filePath);
  if (!exists) {
    throw new Error(`File was not written: ${filePath}`);
  }
  console.log('INVOICE PDF SAVED:', filePath);
  return filePath;
};

export const shareInvoiceFile = async (
  filePath: string,
  fileName: string,
  base64?: string,
): Promise<void> => {
  const pdfUri = `file://${filePath}`;
  console.log('INVOICE PDF SHARE URI:', pdfUri);

  if (!filePath || !pdfUri) {
    throw new Error('Invalid PDF file path for sharing');
  }

  const commonOptions = {
    type: 'application/pdf',
    message: 'DhwaniAstro Payment Invoice',
    filename: fileName,
  };

  try {
    await Share.open({
      url: pdfUri,
      ...commonOptions,
    });
  } catch (e: any) {
    const msg = String(e?.message ?? '');
    const isCancel =
      /cancel|dismissed|did not select|not an item|activity_not_found|e_activity_not_found/i.test(
        msg,
      ) ||
      e?.code === 'activity_canceled' ||
      e?.code === 'E_ACTIVITY_NOT_FOUND';
    if (isCancel) {
      return;
    }

    if (base64) {
      await Share.open({
        url: `data:application/pdf;base64,${base64}`,
        ...commonOptions,
      });
    } else {
      throw e;
    }
  }
};

export const generateAndShareInvoice = async (
  invoice: PaymentInvoice,
): Promise<string> => {
  let base64: string;
  try {
    base64 = await buildInvoiceBase64(invoice);
  } catch (e) {
    console.log('INVOICE BUILD ERROR:', e);
    throw new Error('Failed to generate invoice PDF');
  }

  const fileName = createInvoiceFileName(invoice);

  let filePath: string;
  try {
    filePath = await saveInvoiceFile(base64, fileName);
  } catch (e) {
    console.log('INVOICE SAVE ERROR:', e);
    throw new Error('Failed to save invoice PDF');
  }

  try {
    await shareInvoiceFile(filePath, fileName, base64);
  } catch (e) {
    console.log('INVOICE SHARE ERROR:', e);
    throw new Error('Failed to share invoice PDF');
  }

  return filePath;
};
