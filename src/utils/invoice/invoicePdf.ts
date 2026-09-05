import {format} from 'date-fns';
import {PDFDocument, StandardFonts, rgb} from 'pdf-lib';
import type {PDFFont, PDFPage} from 'pdf-lib';
import {Platform} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Share, {type ShareOptions} from 'react-native-share';
import type {PaymentInvoice} from '../../services/api/walletTransactions/paymentInvoice.types';
import {loadInvoiceLogoBase64} from './loadLogo';

/** A4 portrait 210mm × 297mm (points) */
const PAGE_W = 595.28;
const PAGE_H = 841.89;
/** 10mm horizontal, 9mm vertical */
const PAD_X = 28.35;
const PAD_Y = 25.51;

const BLACK = rgb(0, 0, 0);
const WHITE = rgb(1, 1, 1);

const str = (v: string | null | undefined, fallback = '-'): string => {
  if (v == null || String(v).trim() === '') {
    return fallback;
  }
  return String(v);
};

const num = (v: number | null | undefined): number => {
  if (v == null) {
    return 0;
  }
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/** Indian date format DD/MM/YYYY; `-` if missing/invalid */
export const formatDate = (v: string | null | undefined): string => {
  if (!v) {
    return '-';
  }
  let parsed = new Date(v);
  if (Number.isNaN(parsed.getTime())) {
    const ts = parseInt(v, 10);
    if (Number.isNaN(ts)) {
      return '-';
    }
    parsed = new Date(ts);
  }
  if (Number.isNaN(parsed.getTime())) {
    return '-';
  }
  return format(parsed, 'dd/MM/yyyy');
};

/** Always two decimal places; safe for null/undefined/invalid. */
export const money = (v: number | null | undefined): string => {
  const n = num(v);
  // Force ASCII grouping so Helvetica WinAnsi never fails on NBSP etc.
  return n
    .toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    })
    .replace(/[\u00a0\u202f]/g, ',');
};

/**
 * PaymentInvoice UI uses ₹ for table cells. Helvetica/WinAnsi cannot encode ₹,
 * so we use "Rs." (same amounts, Arial/Helvetica-compatible glyphs).
 */
const rupee = (v: number | null | undefined): string => `Rs. ${money(v)}`;
/** Matches PaymentInvoice UI: INR for total rows */
const inr = (v: number | null | undefined): string => `INR ${money(v)}`;

export const createInvoiceFileName = (invoice: PaymentInvoice): string => {
  const raw =
    (invoice.invoiceNo && String(invoice.invoiceNo).trim()) ||
    (invoice.transactionId && String(invoice.transactionId).trim()) ||
    'invoice';
  const safe = raw.replace(/[^a-zA-Z0-9._-]+/g, '_').replace(/^_+|_+$/g, '');
  return `Invoice_${safe || 'invoice'}.pdf`;
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
        if (font.widthOfTextAtSize(w, size) > maxWidth) {
          let chunk = '';
          for (const ch of w) {
            const next = chunk + ch;
            if (font.widthOfTextAtSize(next, size) <= maxWidth) {
              chunk = next;
            } else {
              if (chunk) {
                out.push(chunk);
              }
              chunk = ch;
            }
          }
          cur = chunk;
        } else {
          cur = w;
        }
      }
    }
    if (cur) {
      out.push(cur);
    }
  }
  return out.length ? out : [''];
};

type Align = 'left' | 'center' | 'right';

const drawText = (
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  size: number,
  font: PDFFont,
) => {
  page.drawText(text, {x, y, size, font, color: BLACK});
};

const drawRight = (
  page: PDFPage,
  text: string,
  xRight: number,
  y: number,
  size: number,
  font: PDFFont,
) => {
  drawText(
    page,
    text,
    xRight - font.widthOfTextAtSize(text, size),
    y,
    size,
    font,
  );
};

const drawAligned = (
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  cellW: number,
  size: number,
  font: PDFFont,
  align: Align,
  pad = 2,
) => {
  const tw = font.widthOfTextAtSize(text, size);
  let tx = x + pad;
  if (align === 'right') {
    tx = x + cellW - tw - pad;
  } else if (align === 'center') {
    tx = x + Math.max(pad, (cellW - tw) / 2);
  }
  drawText(page, text, Math.max(x + 1, tx), y, size, font);
};

const strokeBox = (
  page: PDFPage,
  x: number,
  y: number,
  w: number,
  h: number,
  thickness = 0.7,
) => {
  page.drawRectangle({
    x,
    y,
    width: w,
    height: h,
    borderColor: BLACK,
    borderWidth: thickness,
  });
};

export const buildInvoiceBase64 = async (
  invoice: PaymentInvoice,
): Promise<string> => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([PAGE_W, PAGE_H]);
  page.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_W,
    height: PAGE_H,
    color: WHITE,
  });

  // Helvetica ≈ Arial for PDF (standard WinAnsi fonts)
  const helv = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const logoB64 = await loadInvoiceLogoBase64();
  const logo = await pdfDoc.embedPng(logoB64);

  const contentRight = PAGE_W - PAD_X;
  const contentWidth = contentRight - PAD_X;
  let y = PAGE_H - PAD_Y;

  // ---- HEADER: logo left, invoice meta right ----
  const logoMaxW = 130;
  const logoMaxH = 48;
  const logoScale = Math.min(logoMaxW / logo.width, logoMaxH / logo.height);
  const logoW = logo.width * logoScale;
  const logoH = logo.height * logoScale;
  const logoBottom = y - logoH;
  page.drawImage(logo, {x: PAD_X, y: logoBottom, width: logoW, height: logoH});

  const rightColW = contentWidth * 0.58;
  let ry = y - 16;
  drawRight(page, 'Payment Invoice', contentRight, ry, 20, bold);
  ry -= 16;
  drawRight(page, '(Original for recipient)', contentRight, ry, 12, helv);
  ry -= 18;
  drawRight(page, 'DHWANI ASTRO', contentRight, ry, 12, bold);
  ry -= 14;
  const headerMeta = [
    `Supplier GSTIN: ${str(invoice.supplierGSTIN)}`,
    `Website: ${str(invoice.website)}`,
    `E-mail: ${str(invoice.email)}`,
  ];
  for (const line of headerMeta) {
    drawRight(page, line, contentRight, ry, 10, helv);
    ry -= 13;
  }
  for (const l of wrapParagraph(
    helv,
    10,
    `Address - ${str(invoice.supplierAddress)}`,
    rightColW,
  )) {
    drawRight(page, l, contentRight, ry, 10, helv);
    ry -= 13;
  }

  y = Math.min(logoBottom, ry) - 18;

  // ---- CUSTOMER / TRANSACTION ----
  const leftMaxW = contentWidth * 0.48;
  const rightMaxW = contentWidth * 0.48;
  let leftY = y;
  let rightY = y;

  drawText(page, 'Customer Address:', PAD_X, leftY, 11, bold);
  leftY -= 14;
  drawText(page, str(invoice.userName), PAD_X, leftY, 11, helv);
  leftY -= 13;
  const cityLine = `${str(invoice.city, '-')}${
    invoice.state ? `, ${invoice.state}` : ''
  }${invoice.pincode ? ` - ${invoice.pincode}` : ''}`;
  for (const l of wrapParagraph(helv, 11, cityLine, leftMaxW)) {
    drawText(page, l, PAD_X, leftY, 11, helv);
    leftY -= 13;
  }
  drawText(page, str(invoice.country, 'India'), PAD_X, leftY, 11, helv);
  leftY -= 18;
  drawText(page, 'Place of Supply:', PAD_X, leftY, 11, bold);
  leftY -= 14;
  drawText(
    page,
    str(invoice.placeOfSupply || invoice.state),
    PAD_X,
    leftY,
    11,
    helv,
  );
  leftY -= 13;

  const txPairs: [string, string][] = [
    [
      'Transaction Id',
      str(invoice.transactionId || invoice.razorpayOrderId),
    ],
    ['Payment Id', str(invoice.razorpayPaymentId)],
    ['Recipient GSTIN', str(invoice.recipientGSTIN)],
    ['Invoice Voucher No', str(invoice.invoiceNo)],
    ['Invoice Voucher Date', formatDate(invoice.createdAt)],
  ];
  for (const [label, value] of txPairs) {
    for (const l of wrapParagraph(helv, 10, `${label}: ${value}`, rightMaxW)) {
      drawRight(page, l, contentRight, rightY, 10, helv);
      rightY -= 13;
    }
  }

  y = Math.min(leftY, rightY) - 16;

  // ---- MAIN GST TABLE ----
  // Description | Total | Discount | Taxable | SGST R/A | CGST R/A | IGST R/A
  const colDefs = [112, 50, 48, 56, 28, 46, 28, 46, 28, 46];
  const tableW0 = colDefs.reduce((a, b) => a + b, 0);
  const scale = Math.min(1, contentWidth / tableW0);
  const colW = colDefs.map(w => w * scale);
  const tw = colW.reduce((a, b) => a + b, 0);
  const tableX = PAD_X;
  const headerH1 = 14;
  const headerH2 = 12;
  const headerH = headerH1 + headerH2;
  const dataRowH = 30;
  const cellSize = 7.5;

  const colX = (i: number) =>
    tableX + colW.slice(0, i).reduce((a, b) => a + b, 0);

  const headerTop = y;
  const headerBottom = y - headerH;
  strokeBox(page, tableX, headerBottom, tw, headerH, 0.9);

  const groups: {i0: number; i1: number; label: string}[] = [
    {i0: 0, i1: 0, label: 'Description'},
    {i0: 1, i1: 1, label: 'Total'},
    {i0: 2, i1: 2, label: 'Discount'},
    {i0: 3, i1: 3, label: 'Taxable Value'},
    {i0: 4, i1: 5, label: 'SGST'},
    {i0: 6, i1: 7, label: 'CGST'},
    {i0: 8, i1: 9, label: 'IGST'},
  ];

  for (const g of groups) {
    const x0 = colX(g.i0);
    const w = colW.slice(g.i0, g.i1 + 1).reduce((a, b) => a + b, 0);
    if (g.i1 > g.i0) {
      strokeBox(page, x0, headerTop - headerH1, w, headerH1);
      drawAligned(
        page,
        g.label,
        x0,
        headerTop - headerH1 + 4,
        w,
        cellSize,
        bold,
        'center',
      );
      strokeBox(page, x0, headerBottom, colW[g.i0], headerH2);
      strokeBox(page, x0 + colW[g.i0], headerBottom, colW[g.i1], headerH2);
      drawAligned(
        page,
        'Rate',
        x0,
        headerBottom + 3,
        colW[g.i0],
        6.5,
        bold,
        'center',
      );
      drawAligned(
        page,
        'Amount',
        x0 + colW[g.i0],
        headerBottom + 3,
        colW[g.i1],
        6.5,
        bold,
        'center',
      );
    } else {
      strokeBox(page, x0, headerBottom, w, headerH);
      drawAligned(
        page,
        g.label,
        x0,
        headerBottom + headerH / 2 - 2,
        w,
        cellSize,
        bold,
        'center',
      );
    }
  }

  const dataTop = headerBottom;
  const dataBottom = dataTop - dataRowH;
  strokeBox(page, tableX, dataBottom, tw, dataRowH, 0.9);

  const igstRate = invoice.igstRate ?? invoice.gstRate ?? 0;
  const igstAmt = invoice.igst ?? invoice.totalTax;
  const dataVals = [
    'Purchase of AT-Money via Razorpay',
    rupee(invoice.amount),
    rupee(invoice.discount),
    rupee(invoice.taxableAmount),
    `${num(invoice.sgstRate)}%`,
    rupee(invoice.sgst),
    `${num(invoice.cgstRate)}%`,
    rupee(invoice.cgst),
    `${num(igstRate)}%`,
    rupee(igstAmt),
  ];
  const aligns: Align[] = [
    'left',
    'right',
    'right',
    'right',
    'center',
    'right',
    'center',
    'right',
    'center',
    'right',
  ];

  let vx = tableX;
  for (let i = 0; i < colW.length; i++) {
    strokeBox(page, vx, dataBottom, colW[i], dataRowH);
    const lines = wrapParagraph(helv, cellSize, dataVals[i], colW[i] - 4);
    let ty = dataTop - 11;
    for (const l of lines.slice(0, 3)) {
      drawAligned(page, l, vx, ty, colW[i], cellSize, helv, aligns[i]);
      ty -= 9;
    }
    vx += colW[i];
  }

  y = dataBottom;

  // ---- TOTAL ROWS ----
  const totalRows: Array<{
    label: string;
    value?: string;
    taxAmounts?: [string, string, string];
  }> = [
    {
      label: 'Total',
      taxAmounts: [rupee(invoice.sgst), rupee(invoice.cgst), rupee(igstAmt)],
    },
    {label: 'Total Tax', value: inr(invoice.totalTax)},
    {
      label: 'Total amount',
      value: inr(invoice.totalAmount ?? invoice.amount),
    },
    {
      label: 'Total amount (in words)',
      value: str(invoice.amountInWords),
    },
    {
      label: 'Total amount received',
      value: inr(
        invoice.amountReceived ?? invoice.totalAmount ?? invoice.amount,
      ),
    },
  ];

  // Label spans Description→Taxable (cols 0–3); values use remaining columns.
  const totalsLabelW = colW.slice(0, 4).reduce((a, b) => a + b, 0);
  const totalsValueX = tableX + totalsLabelW;
  const totalsValueW = tw - totalsLabelW;

  for (const row of totalRows) {
    if (row.taxAmounts) {
      const rowH = 18;
      const by = y - rowH;
      strokeBox(page, tableX, by, tw, rowH, 0.9);
      // Vertical guides under SGST/CGST/IGST amount columns
      for (const i of [4, 5, 6, 7, 8, 9]) {
        strokeBox(page, colX(i), by, colW[i], rowH, 0.7);
      }
      const textY = by + 5;
      drawRight(page, 'Total', totalsValueX - 4, textY, 10, bold);
      drawAligned(
        page,
        row.taxAmounts[0],
        colX(5),
        textY,
        colW[5],
        9,
        helv,
        'right',
      );
      drawAligned(
        page,
        row.taxAmounts[1],
        colX(7),
        textY,
        colW[7],
        9,
        helv,
        'right',
      );
      drawAligned(
        page,
        row.taxAmounts[2],
        colX(9),
        textY,
        colW[9],
        9,
        helv,
        'right',
      );
      y = by;
      continue;
    }

    const valueLines = wrapParagraph(
      helv,
      10,
      row.value && String(row.value).trim() !== '' ? String(row.value) : '-',
      totalsValueW - 8,
    );
    const rowH = Math.max(20, 8 + valueLines.length * 12);
    const by = y - rowH;
    strokeBox(page, tableX, by, tw, rowH, 0.9);
    strokeBox(page, tableX, by, totalsLabelW, rowH, 0.7);
    strokeBox(page, totalsValueX, by, totalsValueW, rowH, 0.7);

    const textY = by + rowH - 13;
    drawRight(page, row.label, totalsValueX - 6, textY, 10, bold);
    let vy = textY;
    for (const l of valueLines) {
      drawText(page, l, totalsValueX + 6, vy, 10, helv);
      vy -= 12;
    }
    y = by;
  }

  y -= 20;

  // ---- TRANSACTION HISTORY ----
  drawText(
    page,
    'To view your transaction history, please visit:',
    PAD_X,
    y,
    11,
    helv,
  );
  y -= 16;
  const rawHistoryUrl = invoice.transactionHistoryUrl;
  const historyUrl =
    rawHistoryUrl != null && String(rawHistoryUrl).trim() !== ''
      ? String(rawHistoryUrl).trim()
      : '-';
  const historyIsLink = historyUrl !== '-' && /^https?:\/\//i.test(historyUrl);
  for (const l of wrapParagraph(helv, 11, historyUrl, contentWidth)) {
    drawText(page, l, PAD_X, y, 11, helv);
    if (historyIsLink) {
      const lineW = helv.widthOfTextAtSize(l, 11);
      page.drawLine({
        start: {x: PAD_X, y: y - 1.5},
        end: {x: PAD_X + lineW, y: y - 1.5},
        color: BLACK,
        thickness: 0.6,
      });
    }
    y -= 14;
  }

  y -= 14;

  // ---- OTHER DETAILS ----
  // Three columns: label on first line(s), ": value" on the following line
  // so wrapping never splits "HSN/SAC" away from its value oddly.
  drawText(page, 'Other details:', PAD_X, y, 11, bold);
  y -= 18;
  const otherDetails: {label: string; value: string}[] = [
    {label: 'HSN/SAC', value: str(invoice.hsnSac, '999799')},
    {
      label: 'Whether tax is payable on reverse charge basis',
      value: invoice.reverseCharge === true ? 'Yes' : 'No',
    },
    {label: 'PAN Number', value: str(invoice.panNumber)},
  ];
  const otherColW = contentWidth / 3;
  let maxOtherDrop = 0;
  otherDetails.forEach((item, i) => {
    const x = PAD_X + i * otherColW;
    const labelLines = wrapParagraph(helv, 9, item.label, otherColW - 8);
    let oy = y;
    for (const l of labelLines) {
      drawText(page, l, x, oy, 9, helv);
      oy -= 11;
    }
    drawText(page, `: ${item.value}`, x, oy, 9, bold);
    oy -= 11;
    maxOtherDrop = Math.max(maxOtherDrop, y - oy);
  });
  y -= maxOtherDrop + 28;

  // ---- FOOTER ----
  const footer =
    'This is a computer generated invoice voucher, no signatures required';
  const fw = helv.widthOfTextAtSize(footer, 8);
  const footerY = Math.max(PAD_Y, Math.min(y, PAD_Y + 10));
  drawText(page, footer, (PAGE_W - fw) / 2, footerY, 8, helv);

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

const toFileUri = (pathOrUri: string): string => {
  if (pathOrUri.startsWith('file://') || pathOrUri.startsWith('content://')) {
    return pathOrUri;
  }
  // Absolute filesystem paths must be URI-prefixed for react-native-share.
  return `file://${pathOrUri}`;
};

const shareFileNameWithoutExt = (fileName: string): string =>
  fileName.replace(/\.pdf$/i, '');

/**
 * Android FileProvider (react-native-share ≥12.1.1) only exposes cache/files roots.
 * Prefer CacheDir so getUriForFile always succeeds even if DocumentDir paths are
 * not merged into the app's FileProvider config yet.
 */
const resolveAndroidSharePath = async (
  filePath: string,
  fileName: string,
): Promise<string> => {
  const cacheDir = ReactNativeBlobUtil.fs.dirs.CacheDir;
  if (!cacheDir) {
    return filePath;
  }

  const cachePath = `${cacheDir}/${fileName}`;
  if (cachePath === filePath) {
    return filePath;
  }

  const exists = await ReactNativeBlobUtil.fs.exists(filePath);
  if (!exists) {
    throw new Error(`PDF missing before share copy: ${filePath}`);
  }

  const data = await ReactNativeBlobUtil.fs.readFile(filePath, 'base64');
  await ReactNativeBlobUtil.fs.writeFile(cachePath, data, 'base64');
  const copied = await ReactNativeBlobUtil.fs.exists(cachePath);
  if (!copied) {
    throw new Error(`Failed to stage PDF for Android share: ${cachePath}`);
  }
  return cachePath;
};

const logShareOptions = (label: string, options: ShareOptions): void => {
  const {url, urls, type, message, filename, title, failOnCancel, useInternalStorage} =
    options;
  console.log(
    label,
    JSON.stringify({
      url,
      urls,
      type,
      message,
      filename,
      title,
      failOnCancel,
      useInternalStorage,
      platform: Platform.OS,
    }),
  );
};

export const shareInvoiceFile = async (
  filePath: string,
  fileName: string,
  base64?: string,
): Promise<void> => {
  if (!filePath) {
    throw new Error('Invalid PDF file path for sharing');
  }

  const pathForShare =
    Platform.OS === 'android'
      ? await resolveAndroidSharePath(filePath, fileName)
      : filePath;
  const pdfUri = toFileUri(pathForShare);

  console.log('INVOICE PDF SHARE URI:', pdfUri);

  if (!pdfUri || pdfUri === 'file://' || pdfUri === 'content://') {
    throw new Error('Invalid PDF share URI');
  }

  const shareOptions: ShareOptions = {
    url: pdfUri,
    type: 'application/pdf',
    message: 'DhwaniAstro Payment Invoice',
    filename: fileName,
    failOnCancel: false,
    ...(Platform.OS === 'android' ? {useInternalStorage: true} : null),
  };

  try {
    logShareOptions('INVOICE SHARE.open OPTIONS:', shareOptions);
    await Share.open(shareOptions);
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

    if (!base64) {
      throw e;
    }

    // Base64 path: library writes a temp file under cache (useInternalStorage)
    // then exposes it via FileProvider. Do not pass a null/empty urls array.
    const base64Options: ShareOptions = {
      url: `data:application/pdf;base64,${base64}`,
      type: 'application/pdf',
      message: 'DhwaniAstro Payment Invoice',
      // Library appends mime extension; strip .pdf to avoid name.pdf.pdf
      filename: shareFileNameWithoutExt(fileName),
      failOnCancel: false,
      ...(Platform.OS === 'android' ? {useInternalStorage: true} : null),
    };
    logShareOptions('INVOICE SHARE.open BASE64 FALLBACK OPTIONS:', {
      ...base64Options,
      url: `data:application/pdf;base64,[${base64.length} chars]`,
    });
    await Share.open(base64Options);
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
