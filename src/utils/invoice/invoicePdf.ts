import {format} from 'date-fns';
import {PDFDocument, StandardFonts, rgb} from 'pdf-lib';
import type {PDFFont, PDFPage} from 'pdf-lib';
import {Platform} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Share, {type ShareOptions} from 'react-native-share';

import type {PaymentInvoice} from '../../services/api/walletTransactions/paymentInvoice.types';
import {loadInvoiceLogoBase64} from './loadLogo';

/** A4 portrait 210mm × 297mm */
const PAGE_W = 595.28;
const PAGE_H = 841.89;

/** Same as web: px-[10mm] py-[9mm] */
const PAD_X = 28.35;
const PAD_Y = 25.51;

const BLACK = rgb(0, 0, 0);
const WHITE = rgb(1, 1, 1);

const str = (
  v: string | number | null | undefined,
  fallback = '-',
): string => {
  if (v == null || String(v).trim() === '') {
    return fallback;
  }

  return String(v);
};

const num = (v: number | string | null | undefined): number => {
  if (v == null || v === '') {
    return 0;
  }

  const n = Number(v);

  return Number.isFinite(n) ? n : 0;
};

/**
 * Indian date format DD/MM/YYYY
 */
export const formatDate = (
  v: string | null | undefined,
): string => {
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

/**
 * Same visual format as web:
 * 1000 -> 1000.00
 */
export const money = (
  v: number | string | null | undefined,
): string => {
  const n = num(v);

  return n.toFixed(2);
};

/**
 * PDF standard Helvetica does not support ₹.
 * Use Rs. for PDF compatibility.
 */
const rupee = (
  v: number | string | null | undefined,
): string => `Rs. ${money(v)}`;

const inr = (
  v: number | string | null | undefined,
): string => `INR ${money(v)}`;

export const createInvoiceFileName = (
  invoice: PaymentInvoice,
): string => {
  const raw =
    (invoice.invoiceNo && String(invoice.invoiceNo).trim()) ||
    (invoice.transactionId &&
      String(invoice.transactionId).trim()) ||
    'invoice';

  const safe = raw
    .replace(/[^a-zA-Z0-9._-]+/g, '_')
    .replace(/^_+|_+$/g, '');

  return `Invoice_${safe || 'invoice'}.pdf`;
};

/**
 * Wrap text according to actual PDF font width.
 */
const wrapParagraph = (
  font: PDFFont,
  size: number,
  text: string,
  maxWidth: number,
): string[] => {
  const out: string[] = [];

  const paragraphs = String(text ?? '').split(/\r?\n/);

  for (const paragraph of paragraphs) {
    if (paragraph.trim() === '') {
      out.push('');
      continue;
    }

    const words = paragraph.split(/\s+/);

    let current = '';

    for (const word of words) {
      const test = current
        ? `${current} ${word}`
        : word;

      if (
        font.widthOfTextAtSize(test, size) <=
        maxWidth
      ) {
        current = test;
      } else {
        if (current) {
          out.push(current);
        }

        if (
          font.widthOfTextAtSize(word, size) >
          maxWidth
        ) {
          let chunk = '';

          for (const char of word) {
            const next = chunk + char;

            if (
              font.widthOfTextAtSize(next, size) <=
              maxWidth
            ) {
              chunk = next;
            } else {
              if (chunk) {
                out.push(chunk);
              }

              chunk = char;
            }
          }

          current = chunk;
        } else {
          current = word;
        }
      }
    }

    if (current) {
      out.push(current);
    }
  }

  return out.length ? out : [''];
};

type Align =
  | 'left'
  | 'center'
  | 'right';

const drawText = (
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  size: number,
  font: PDFFont,
) => {
  page.drawText(text, {
    x,
    y,
    size,
    font,
    color: BLACK,
  });
};

const drawRight = (
  page: PDFPage,
  text: string,
  xRight: number,
  y: number,
  size: number,
  font: PDFFont,
) => {
  const width =
    font.widthOfTextAtSize(text, size);

  drawText(
    page,
    text,
    xRight - width,
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
  width: number,
  size: number,
  font: PDFFont,
  align: Align,
  padding = 4,
) => {
  const textWidth =
    font.widthOfTextAtSize(text, size);

  let tx = x + padding;

  if (align === 'right') {
    tx =
      x +
      width -
      textWidth -
      padding;
  } else if (align === 'center') {
    tx =
      x +
      Math.max(
        padding,
        (width - textWidth) / 2,
      );
  }

  drawText(
    page,
    text,
    Math.max(x + 1, tx),
    y,
    size,
    font,
  );
};

const strokeBox = (
  page: PDFPage,
  x: number,
  y: number,
  width: number,
  height: number,
  thickness = 0.7,
) => {
  page.drawRectangle({
    x,
    y,
    width,
    height,
    borderColor: BLACK,
    borderWidth: thickness,
  });
};

export const buildInvoiceBase64 = async (
  invoice: PaymentInvoice,
): Promise<string> => {
  const pdfDoc = await PDFDocument.create();

  const page = pdfDoc.addPage([
    PAGE_W,
    PAGE_H,
  ]);

  /**
   * White A4 background
   */
  page.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_W,
    height: PAGE_H,
    color: WHITE,
  });

  const helv =
    await pdfDoc.embedFont(
      StandardFonts.Helvetica,
    );

  const bold =
    await pdfDoc.embedFont(
      StandardFonts.HelveticaBold,
    );

  const logoB64 =
    await loadInvoiceLogoBase64();

  const logo =
    await pdfDoc.embedPng(logoB64);

  const contentRight =
    PAGE_W - PAD_X;

  const contentWidth =
    contentRight - PAD_X;

  let y =
    PAGE_H - PAD_Y;

  // ============================================================
  // HEADER
  // Same structure as web:
  // left 32% logo
  // right 68% invoice information
  // ============================================================

  const headerRightWidth =
    contentWidth * 0.68;

  const logoAreaWidth =
    contentWidth * 0.32;

  const logoMaxW = 100;
  const logoMaxH = 100;

  const logoScale = Math.min(
    logoMaxW / logo.width,
    logoMaxH / logo.height,
  );

  const logoW =
    logo.width * logoScale;

  const logoH =
    logo.height * logoScale;

  /**
   * Web image is inside left 32% area.
   * Keep it near the top-left.
   */
  page.drawImage(logo, {
    x: PAD_X,
    y: y - logoH - 6,
    width: logoW,
    height: logoH,
  });

  let headerY = y - 2;

  drawRight(
    page,
    'Payment Invoice',
    contentRight,
    headerY,
    20,
    bold,
  );

  headerY -= 18;

  drawRight(
    page,
    '(Original for recipient)',
    contentRight,
    headerY,
    13,
    helv,
  );

  /**
   * Same visual gap as web mt-5.
   */
  headerY -= 25;

  drawRight(
    page,
    'DHWANI ASTRO',
    contentRight,
    headerY,
    12,
    bold,
  );

  headerY -= 15;

  drawRight(
    page,
    `Supplier GSTIN: ${str(
      invoice.supplierGSTIN,
    )}`,
    contentRight,
    headerY,
    10,
    helv,
  );

  headerY -= 14;

  drawRight(
    page,
    `Website: ${str(invoice.website)}`,
    contentRight,
    headerY,
    10,
    helv,
  );

  headerY -= 14;

  drawRight(
    page,
    `E-mail: ${str(invoice.email)}`,
    contentRight,
    headerY,
    10,
    helv,
  );

  headerY -= 15;

  /**
   * Address is right aligned just like web text-right.
   */
  const addressLines = wrapParagraph(
    helv,
    10,
    `Address - ${str(
      invoice.supplierAddress,
    )}`,
    headerRightWidth,
  );

  for (const line of addressLines) {
    drawRight(
      page,
      line,
      contentRight,
      headerY,
      10,
      helv,
    );

    headerY -= 13;
  }

  /**
   * Match web mt-11 before customer section.
   */
  const logoBottom =
    y - logoH - 6;

  y =
    Math.min(
      logoBottom,
      headerY,
    ) - 32;

  // ============================================================
  // CUSTOMER + TRANSACTION
  // Web:
  // grid-cols-2 gap-8
  // ============================================================

  const columnGap = 32;

  const leftWidth =
    (contentWidth - columnGap) / 2;

  const rightWidth =
    (contentWidth - columnGap) / 2;

  const leftX = PAD_X;

  const rightX =
    PAD_X +
    leftWidth +
    columnGap;

  let leftY = y;
  let rightY = y;

  // ---------------- CUSTOMER ----------------

  drawText(
    page,
    'Customer Address:',
    leftX,
    leftY,
    11,
    bold,
  );

  leftY -= 16;

  drawText(
    page,
    str(invoice.userName),
    leftX,
    leftY,
    11,
    helv,
  );

  leftY -= 15;

  const cityLine =
    `${str(invoice.city, '-')}` +
    `${
      invoice.state
        ? `, ${invoice.state}`
        : ''
    }` +
    `${
      invoice.pincode
        ? ` - ${invoice.pincode}`
        : ''
    }`;

  const cityLines = wrapParagraph(
    helv,
    11,
    cityLine,
    leftWidth,
  );

  for (const line of cityLines) {
    drawText(
      page,
      line,
      leftX,
      leftY,
      11,
      helv,
    );

    leftY -= 14;
  }

  drawText(
    page,
    str(invoice.country, 'India'),
    leftX,
    leftY,
    11,
    helv,
  );

  leftY -= 25;

  drawText(
    page,
    'Place of Supply:',
    leftX,
    leftY,
    11,
    bold,
  );

  leftY -= 15;

  drawText(
    page,
    str(
      invoice.placeOfSupply ||
        invoice.state,
    ),
    leftX,
    leftY,
    11,
    helv,
  );

  // ---------------- TRANSACTION ----------------

  const transactionRows = [
    [
      'Transaction Id',
      str(
        invoice.transactionId ||
          invoice.razorpayOrderId,
      ),
    ],
    [
      'Payment Id',
      str(invoice.razorpayPaymentId),
    ],
    [
      'Recipient GSTIN',
      str(invoice.recipientGSTIN),
    ],
    [
      'Invoice Voucher No',
      str(invoice.invoiceNo),
    ],
    [
      'Invoice Voucher Date',
      formatDate(invoice.createdAt),
    ],
  ];

  /**
   * Helvetica/WinAnsi cannot encode every Unicode glyph.
   * Replace only unsupported chars in transaction values so
   * drawText does not drop/clip them.
   */
  const toHelveticaSafe = (text: string): string => {
    let out = '';

    for (const char of text) {
      try {
        helv.encodeText(char);
        out += char;
      } catch {
        if (char === '×' || char === '✕' || char === '✖') {
          out += 'x';
        } else if (char === '–' || char === '—') {
          out += '-';
        } else if (char === '\u2018' || char === '\u2019') {
          out += "'";
        } else if (char === '\u201C' || char === '\u201D') {
          out += '"';
        } else {
          out += '?';
        }
      }
    }

    return out;
  };

  /**
   * Web uses text-right and mt-3.
   * Use one consistent right edge.
   */
  rightY = y;

  for (let i = 0; i < transactionRows.length; i++) {
    const [label, value] =
      transactionRows[i];

    const safeValue = toHelveticaSafe(value);

    const labelWidth =
      bold.widthOfTextAtSize(
        label,
        10,
      );

    const colonPart = ': ';
    const colonWidth =
      helv.widthOfTextAtSize(
        colonPart,
        10,
      );

    const maxValueWidth = Math.max(
      40,
      rightWidth - labelWidth - colonWidth,
    );

    const valueLines = wrapParagraph(
      helv,
      10,
      safeValue,
      maxValueWidth,
    );

    const firstValue =
      valueLines[0] ?? '';

    const valueText =
      `${colonPart}${firstValue}`;

    const valueWidth =
      helv.widthOfTextAtSize(
        valueText,
        10,
      );

    const startX =
      contentRight -
      valueWidth -
      labelWidth;

    drawText(
      page,
      label,
      startX,
      rightY,
      10,
      bold,
    );

    drawText(
      page,
      valueText,
      startX + labelWidth,
      rightY,
      10,
      helv,
    );

    for (let li = 1; li < valueLines.length; li++) {
      rightY -= 12;

      drawRight(
        page,
        valueLines[li],
        contentRight,
        rightY,
        10,
        helv,
      );
    }

    if (i < transactionRows.length - 1) {
      rightY -= 21;
    }
  }

  y =
    Math.min(
      leftY,
      rightY,
    ) - 35;

  // ============================================================
  // MAIN PAYMENT TABLE
  // ============================================================

  /**
   * IMPORTANT:
   *
   * These proportions are deliberately based on the web table.
   * Description is widest.
   */
  const colDefs = [
    132, // Description
    58,  // Total
    58,  // Discount
    62,  // Taxable Value
    32,  // SGST Rate
    52,  // SGST Amount
    32,  // CGST Rate
    52,  // CGST Amount
    32,  // IGST Rate
    52,  // IGST Amount
  ];

  const tableW0 =
    colDefs.reduce(
      (sum, value) => sum + value,
      0,
    );

  const scale =
    Math.min(
      1,
      contentWidth / tableW0,
    );

  const colW =
    colDefs.map(
      width => width * scale,
    );

  const tableWidth =
    colW.reduce(
      (sum, value) => sum + value,
      0,
    );

  const tableX = PAD_X;

  const colX = (index: number) =>
    tableX +
    colW
      .slice(0, index)
      .reduce(
        (sum, value) => sum + value,
        0,
      );

  const headerH1 = 18;
  const headerH2 = 16;
  const headerH =
    headerH1 + headerH2;

  /**
   * Web table has px-2 py-2.
   * Increase row height so text doesn't look vertically cramped.
   */
  const dataRowH = 32;

  const headerFontSize = 8;
  const subHeaderFontSize = 7;

  const headerTop = y;
  const headerBottom =
    headerTop - headerH;

  // Outer border
  strokeBox(
    page,
    tableX,
    headerBottom,
    tableWidth,
    headerH,
    0.9,
  );

  // ---------------- HEADER ----------------

  const groups = [
    {
      i0: 0,
      i1: 0,
      label: 'Description',
    },
    {
      i0: 1,
      i1: 1,
      label: 'Total',
    },
    {
      i0: 2,
      i1: 2,
      label: 'Discount',
    },
    {
      i0: 3,
      i1: 3,
      label: 'Taxable\nValue',
    },
    {
      i0: 4,
      i1: 5,
      label: 'SGST',
    },
    {
      i0: 6,
      i1: 7,
      label: 'CGST',
    },
    {
      i0: 8,
      i1: 9,
      label: 'IGST',
    },
  ];

  for (const group of groups) {
    const x0 = colX(group.i0);

    const width = colW
      .slice(
        group.i0,
        group.i1 + 1,
      )
      .reduce(
        (sum, value) => sum + value,
        0,
      );

    /**
     * Rowspan columns
     */
    if (group.i0 === group.i1) {
      strokeBox(
        page,
        x0,
        headerBottom,
        width,
        headerH,
        0.7,
      );

      const lines =
        group.label.split('\n');

      const lineHeight = 8;

      const startY =
        headerBottom +
        headerH / 2 +
        (lines.length === 2
          ? 3
          : -2);

      lines.forEach(
        (line, index) => {
          drawAligned(
            page,
            line,
            x0,
            startY -
              index * lineHeight,
            width,
            headerFontSize,
            bold,
            'center',
          );
        },
      );
    } else {
      /**
       * Top group header
       */
      strokeBox(
        page,
        x0,
        headerTop - headerH1,
        width,
        headerH1,
        0.7,
      );

      drawAligned(
        page,
        group.label,
        x0,
        headerTop -
          headerH1 +
          5,
        width,
        headerFontSize,
        bold,
        'center',
      );

      /**
       * Rate
       */
      strokeBox(
        page,
        x0,
        headerBottom,
        colW[group.i0],
        headerH2,
        0.7,
      );

      /**
       * Amount
       */
      strokeBox(
        page,
        x0 + colW[group.i0],
        headerBottom,
        colW[group.i1],
        headerH2,
        0.7,
      );

      drawAligned(
        page,
        'Rate',
        x0,
        headerBottom + 5,
        colW[group.i0],
        subHeaderFontSize,
        bold,
        'center',
      );

      drawAligned(
        page,
        'Amount',
        x0 + colW[group.i0],
        headerBottom + 5,
        colW[group.i1],
        subHeaderFontSize,
        bold,
        'center',
      );
    }
  }

  // ============================================================
  // DATA ROW
  // ============================================================

  const dataTop = headerBottom;
  const dataBottom =
    dataTop - dataRowH;

  strokeBox(
    page,
    tableX,
    dataBottom,
    tableWidth,
    dataRowH,
    0.9,
  );

  const igstRate =
    invoice.igstRate ??
    invoice.gstRate ??
    0;

  const igstAmount =
    invoice.igst ??
    invoice.totalTax ??
    0;

  const dataValues = [
    'Purchase of AT-Money via Razorpay',

    rupee(invoice.amount),

    rupee(invoice.discount),

    rupee(invoice.taxableAmount),

    `${num(invoice.sgstRate)}%`,

    rupee(invoice.sgst),

    `${num(invoice.cgstRate)}%`,

    rupee(invoice.cgst),

    `${num(igstRate)}%`,

    rupee(igstAmount),
  ];

  const alignments: Align[] = [
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

  let cellX = tableX;

  for (
    let index = 0;
    index < colW.length;
    index++
  ) {
    strokeBox(
      page,
      cellX,
      dataBottom,
      colW[index],
      dataRowH,
      0.7,
    );

    const lines = wrapParagraph(
      helv,
      7.5,
      dataValues[index],
      colW[index] - 8,
    );

    /**
     * Vertically center content.
     */
    const lineHeight = 9;

    const totalTextHeight =
      lines.length * lineHeight;

    let textY =
      dataBottom +
      (dataRowH +
        totalTextHeight) /
        2 -
      lineHeight;

    for (const line of lines.slice(
      0,
      3,
    )) {
      drawAligned(
        page,
        line,
        cellX,
        textY,
        colW[index],
        7.5,
        helv,
        alignments[index],
      );

      textY -= lineHeight;
    }

    cellX += colW[index];
  }

  y = dataBottom;

  // ============================================================
  // TOTAL ROWS
  // ============================================================

  /**
   * IMPORTANT:
   *
   * Web version:
   *
   * Total:
   *   colSpan 4
   *   SGST colSpan 2
   *   CGST colSpan 2
   *   IGST colSpan 2
   *
   * Other rows:
   *   colSpan 8
   *   value colSpan 2
   */

  const totalsLabelWidth =
    colW
      .slice(0, 4)
      .reduce(
        (sum, value) => sum + value,
        0,
      );

  const totalsValueX =
    tableX + totalsLabelWidth;

  const totalsValueWidth =
    tableWidth -
    totalsLabelWidth;

  // ---------------- TOTAL ----------------

  {
    const rowH = 22;
    const bottomY = y - rowH;

    strokeBox(
      page,
      tableX,
      bottomY,
      tableWidth,
      rowH,
      0.9,
    );

    /**
     * Description → Taxable
     */
    strokeBox(
      page,
      tableX,
      bottomY,
      totalsLabelWidth,
      rowH,
      0.7,
    );

    /**
     * SGST
     */
    strokeBox(
      page,
      colX(4),
      bottomY,
      colW[4] + colW[5],
      rowH,
      0.7,
    );

    /**
     * CGST
     */
    strokeBox(
      page,
      colX(6),
      bottomY,
      colW[6] + colW[7],
      rowH,
      0.7,
    );

    /**
     * IGST
     */
    strokeBox(
      page,
      colX(8),
      bottomY,
      colW[8] + colW[9],
      rowH,
      0.7,
    );

    const textY =
      bottomY + 7;

    drawAligned(
      page,
      'Total',
      tableX,
      textY,
      totalsLabelWidth,
      9,
      bold,
      'right',
      6,
    );

    drawAligned(
      page,
      rupee(invoice.sgst),
      colX(4),
      textY,
      colW[4] + colW[5],
      9,
      helv,
      'right',
      6,
    );

    drawAligned(
      page,
      rupee(invoice.cgst),
      colX(6),
      textY,
      colW[6] + colW[7],
      9,
      helv,
      'right',
      6,
    );

    drawAligned(
      page,
      rupee(igstAmount),
      colX(8),
      textY,
      colW[8] + colW[9],
      9,
      helv,
      'right',
      6,
    );

    y = bottomY;
  }

  const totalRows = [
    {
      label: 'Total Tax',
      value: inr(invoice.totalTax),
    },
    {
      label: 'Total amount',
      value: inr(
        invoice.totalAmount ??
          invoice.amount,
      ),
    },
    {
      label: 'Total amount (in words)',
      value: str(
        invoice.amountInWords,
      ),
    },
    {
      label: 'Total amount received',
      value: inr(
        invoice.amountReceived ??
          invoice.totalAmount ??
          invoice.amount,
      ),
    },
  ];

  for (const row of totalRows) {
    const valueLines = wrapParagraph(
      helv,
      9,
      row.value || '-',
      totalsValueWidth - 12,
    );

    /**
     * Web uses py-1.
     * Give enough height for wrapped amount-in-words.
     */
    const rowH = Math.max(
      22,
      8 +
        valueLines.length * 12,
    );

    const bottomY =
      y - rowH;

    strokeBox(
      page,
      tableX,
      bottomY,
      tableWidth,
      rowH,
      0.9,
    );

    strokeBox(
      page,
      tableX,
      bottomY,
      totalsLabelWidth,
      rowH,
      0.7,
    );

    strokeBox(
      page,
      totalsValueX,
      bottomY,
      totalsValueWidth,
      rowH,
      0.7,
    );

    /**
     * Label is right aligned.
     */
    const labelWidth =
      bold.widthOfTextAtSize(
        row.label,
        9,
      );

    drawText(
      page,
      row.label,
      totalsValueX -
        labelWidth -
        6,
      bottomY +
        rowH / 2 -
        3,
      9,
      bold,
    );

    /**
     * Value is right aligned like web.
     */
    let valueY =
      bottomY +
      rowH -
      14;

    for (const line of valueLines) {
      drawRight(
        page,
        line,
        tableX +
          tableWidth -
          6,
        valueY,
        9,
        helv,
      );

      valueY -= 12;
    }

    y = bottomY;
  }

  // ============================================================
  // TRANSACTION HISTORY
  // ============================================================

  y -= 32;

  drawText(
    page,
    'To view your transaction history, please visit:',
    PAD_X,
    y,
    11,
    helv,
  );

  y -= 17;

  const historyUrl =
    invoice.transactionHistoryUrl &&
    String(
      invoice.transactionHistoryUrl,
    ).trim() !== ''
      ? String(
          invoice.transactionHistoryUrl,
        ).trim()
      : '-';

  const historyIsLink =
    historyUrl !== '-' &&
    /^https?:\/\//i.test(
      historyUrl,
    );

  const historyLines =
    wrapParagraph(
      helv,
      11,
      historyUrl,
      contentWidth,
    );

  for (const line of historyLines) {
    drawText(
      page,
      line,
      PAD_X,
      y,
      11,
      helv,
    );

    if (historyIsLink) {
      const lineWidth =
        helv.widthOfTextAtSize(
          line,
          11,
        );

      page.drawLine({
        start: {
          x: PAD_X,
          y: y - 2,
        },
        end: {
          x:
            PAD_X +
            lineWidth,
          y: y - 2,
        },
        color: BLACK,
        thickness: 0.6,
      });
    }

    y -= 14;
  }

  // ============================================================
  // OTHER DETAILS
  // Match web:
  // grid-cols-[220px_20px_1fr]
  // ============================================================

  y -= 28;

  drawText(
    page,
    'Other details:',
    PAD_X,
    y,
    11,
    bold,
  );

  y -= 18;

  const otherDetails = [
    {
      label: 'HSN/SAC',
      value: str(
        invoice.hsnSac,
        '999799',
      ),
    },
    {
      label:
        'Whether tax is payable on reverse charge basis',
      value:
        invoice.reverseCharge === true
          ? 'Yes'
          : 'No',
    },
    {
      label: 'PAN Number',
      value: str(
        invoice.panNumber,
      ),
    },
  ];

  /**
   * Match web fixed 220px label area.
   *
   * PDF coordinate conversion:
   * CSS 220px ≈ 165pt.
   */
  const labelWidth = 165;
  const colonWidth = 15;

  for (const item of otherDetails) {
    const labelLines =
      wrapParagraph(
        helv,
        9,
        item.label,
        labelWidth,
      );

    const startY = y;

    let currentY = startY;

    for (const line of labelLines) {
      drawText(
        page,
        line,
        PAD_X,
        currentY,
        9,
        helv,
      );

      currentY -= 11;
    }

    /**
     * Colon aligned in its own column.
     */
    drawText(
      page,
      ':',
      PAD_X + labelWidth,
      startY,
      9,
      helv,
    );

    /**
     * Value starts after colon.
     */
    drawText(
      page,
      item.value,
      PAD_X +
        labelWidth +
        colonWidth,
      startY,
      9,
      helv,
    );

    /**
     * Equivalent to web leading-6.
     */
    y =
      Math.min(
        currentY,
        startY - 11,
      ) - 5;
  }

  // ============================================================
  // FOOTER
  // ============================================================

  y -= 27;

  const footer =
    'This is a computer generated invoice voucher, no signatures required';

  const footerWidth =
    helv.widthOfTextAtSize(
      footer,
      8,
    );

  /**
   * Web footer is left aligned inside invoice.
   * So don't center it.
   */
  drawText(
    page,
    footer,
    PAD_X,
    Math.max(
      PAD_Y,
      y,
    ),
    8,
    helv,
  );

  return pdfDoc.saveAsBase64();
};

// ============================================================
// SAVE FILE
// ============================================================

const errorMessage = (e: unknown): string => {
  if (e instanceof Error && e.message) {
    return e.message;
  }
  if (typeof e === 'string' && e) {
    return e;
  }
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
};

/**
 * On Android, prefer CacheDir so the path is covered by react-native-share's
 * FileProvider cache-path. DocumentDir (files/) is still fine with our
 * share_download_paths override, but cache is the library's default root.
 */
export const saveInvoiceFile = async (
  base64: string,
  fileName: string,
): Promise<string> => {
  const dirs = ReactNativeBlobUtil.fs.dirs;
  const dir =
    Platform.OS === 'android'
      ? dirs.CacheDir || dirs.DocumentDir
      : dirs.DocumentDir || dirs.CacheDir;

  if (!dir) {
    throw new Error('No writable directory available for invoice PDF');
  }

  const filePath = `${dir}/${fileName}`;

  console.log('INVOICE PDF WRITE START:', filePath);

  try {
    await ReactNativeBlobUtil.fs.writeFile(filePath, base64, 'base64');
  } catch (e) {
    throw new Error(`Invoice PDF write failed: ${errorMessage(e)}`);
  }

  const exists = await ReactNativeBlobUtil.fs.exists(filePath);
  if (!exists) {
    throw new Error(`Invoice PDF missing after write: ${filePath}`);
  }

  try {
    const stat = await ReactNativeBlobUtil.fs.stat(filePath);
    console.log('INVOICE PDF SIZE:', stat?.size ?? 'unknown');
    if (stat?.size != null && Number(stat.size) <= 0) {
      throw new Error(`Invoice PDF is empty: ${filePath}`);
    }
  } catch (e) {
    if (String(errorMessage(e)).includes('empty')) {
      throw e;
    }
    console.log('INVOICE PDF STAT WARN:', errorMessage(e));
  }

  console.log('INVOICE PDF SAVED:', filePath);
  return filePath;
};

// ============================================================
// SHARE
// ============================================================

const toFileUri = (pathOrUri: string): string => {
  if (
    pathOrUri.startsWith('file://') ||
    pathOrUri.startsWith('content://')
  ) {
    return pathOrUri;
  }
  return `file://${pathOrUri}`;
};

const shareFileNameWithoutExt = (fileName: string): string =>
  fileName.replace(/\.pdf$/i, '');

const isShareCancel = (e: any): boolean => {
  const msg = String(e?.message ?? '');
  return (
    /cancel|dismissed|did not share|did not select|not an item|activity_not_found|e_activity_not_found/i.test(
      msg,
    ) ||
    e?.code === 'activity_canceled' ||
    e?.code === 'E_ACTIVITY_NOT_FOUND'
  );
};

const logShareOptions = (
  label: string,
  options: ShareOptions,
): void => {
  const {
    url,
    urls,
    type,
    message,
    filename,
    title,
    failOnCancel,
    useInternalStorage,
  } = options;

  const redactedUrl =
    typeof url === 'string' && url.startsWith('data:')
      ? `data:application/pdf;base64,[${url.length} chars]`
      : url;

  console.log(
    label,
    JSON.stringify({
      url: redactedUrl,
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

/**
 * Android (API 30+): share via base64 + useInternalStorage so react-native-share
 * writes under cache/Download and builds a FileProvider content:// URI itself.
 * Passing raw file:// from DocumentDir/CacheDir still hits ClipData.newUri(null)
 * when FileProvider mapping fails (known NPE on Uri.getScheme()).
 *
 * iOS: share the saved file via file://.
 */
export const shareInvoiceFile = async (
  filePath: string,
  fileName: string,
  base64?: string,
): Promise<void> => {
  if (!filePath) {
    throw new Error('Invalid PDF file path for sharing');
  }

  const exists = await ReactNativeBlobUtil.fs.exists(filePath);
  if (!exists) {
    throw new Error(`PDF missing before share: ${filePath}`);
  }

  console.log('INVOICE SHARE START:', filePath);

  if (Platform.OS === 'android') {
    if (!base64) {
      throw new Error('Missing PDF base64 for Android share');
    }

    const androidOptions: ShareOptions = {
      url: `data:application/pdf;base64,${base64}`,
      type: 'application/pdf',
      title: 'DhwaniAstro Payment Invoice',
      filename: shareFileNameWithoutExt(fileName),
      failOnCancel: false,
      useInternalStorage: true,
    };

    console.log(
      'INVOICE PDF SHARE URI: data:application/pdf;base64,[%s chars]',
      base64.length,
    );
    logShareOptions('INVOICE SHARE.open OPTIONS:', androidOptions);

    try {
      await Share.open(androidOptions);
      console.log('INVOICE SHARE SUCCESS (android base64)');
      return;
    } catch (e: any) {
      if (isShareCancel(e)) {
        console.log('INVOICE SHARE CANCELLED');
        return;
      }

      console.log(
        'INVOICE SHARE ANDROID BASE64 ERROR, trying file:// fallback:',
        errorMessage(e),
      );

      const cacheDir = ReactNativeBlobUtil.fs.dirs.CacheDir;
      if (!cacheDir) {
        throw new Error(
          `Android share failed (no CacheDir): ${errorMessage(e)}`,
        );
      }

      const cachePath = `${cacheDir}/${fileName}`;
      if (cachePath !== filePath) {
        try {
          await ReactNativeBlobUtil.fs.writeFile(cachePath, base64, 'base64');
        } catch (copyErr) {
          throw new Error(
            `Android share cache copy failed: ${errorMessage(copyErr)}`,
          );
        }
      }

      const cacheExists = await ReactNativeBlobUtil.fs.exists(cachePath);
      if (!cacheExists) {
        throw new Error(
          `Android share cache file missing after copy: ${cachePath}`,
        );
      }

      const fileUri = toFileUri(cachePath);
      console.log('INVOICE PDF SHARE URI (file fallback):', fileUri);

      const fileOptions: ShareOptions = {
        url: fileUri,
        type: 'application/pdf',
        title: 'DhwaniAstro Payment Invoice',
        filename: fileName,
        failOnCancel: false,
        useInternalStorage: true,
      };

      logShareOptions('INVOICE SHARE.open FILE FALLBACK OPTIONS:', fileOptions);

      try {
        await Share.open(fileOptions);
        console.log('INVOICE SHARE SUCCESS (android file fallback)');
        return;
      } catch (fileErr: any) {
        if (isShareCancel(fileErr)) {
          console.log('INVOICE SHARE CANCELLED');
          return;
        }
        throw new Error(
          `Android share failed: ${errorMessage(fileErr)} (base64 error: ${errorMessage(e)})`,
        );
      }
    }
  }

  const pdfUri = toFileUri(filePath);
  console.log('INVOICE PDF SHARE URI:', pdfUri);

  if (!pdfUri || pdfUri === 'file://' || pdfUri === 'content://') {
    throw new Error('Invalid PDF share URI');
  }

  const iosOptions: ShareOptions = {
    url: pdfUri,
    type: 'application/pdf',
    filename: fileName,
    failOnCancel: false,
  };

  logShareOptions('INVOICE SHARE.open OPTIONS:', iosOptions);

  try {
    await Share.open(iosOptions);
    console.log('INVOICE SHARE SUCCESS (ios)');
  } catch (e: any) {
    if (isShareCancel(e)) {
      console.log('INVOICE SHARE CANCELLED');
      return;
    }
    throw new Error(`iOS share failed: ${errorMessage(e)}`);
  }
};

// ============================================================
// GENERATE + SHARE
// ============================================================

export const generateAndShareInvoice = async (
  invoice: PaymentInvoice,
): Promise<string> => {
  console.log('INVOICE PDF GENERATION START');

  let base64: string;

  try {
    base64 = await buildInvoiceBase64(invoice);
    console.log('INVOICE PDF GENERATION OK, base64 chars:', base64.length);
  } catch (e) {
    console.log('INVOICE BUILD ERROR:', e);
    throw new Error(`Failed to generate invoice PDF: ${errorMessage(e)}`);
  }

  if (!base64 || base64.length < 100) {
    throw new Error('Failed to generate invoice PDF: empty or invalid base64');
  }

  const fileName = createInvoiceFileName(invoice);
  let filePath: string;

  try {
    filePath = await saveInvoiceFile(base64, fileName);
  } catch (e) {
    console.log('INVOICE SAVE ERROR:', e);
    throw new Error(`Failed to save invoice PDF: ${errorMessage(e)}`);
  }

  try {
    await shareInvoiceFile(filePath, fileName, base64);
  } catch (e) {
    console.log('INVOICE SHARE ERROR:', e);
    throw new Error(`Failed to share invoice PDF: ${errorMessage(e)}`);
  }

  return filePath;
};