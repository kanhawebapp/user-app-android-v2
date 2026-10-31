const ONES = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
];

const TENS = [
  '',
  'Ten',
  'Twenty',
  'Thirty',
  'Forty',
  'Fifty',
  'Sixty',
  'Seventy',
  'Eighty',
  'Ninety',
];

const convertLessThanThousand = (n: number): string => {
  if (n === 0) {
    return '';
  }

  let result = '';

  if (n >= 100) {
    result += ONES[Math.floor(n / 100)] + ' Hundred';
    n %= 100;
    if (n > 0) {
      result += ' ';
    }
  }

  if (n >= 20) {
    result += TENS[Math.floor(n / 10)];
    n %= 10;
    if (n > 0) {
      result += ' ' + ONES[n];
    }
  } else if (n > 0) {
    result += ONES[n];
  }

  return result;
};

/**
 * Convert an amount to Indian English words.
 *
 * Example: 1250.50 → "Rupees One Thousand Two Hundred Fifty and Fifty Paise Only"
 */
export const amountToWords = (
  amount: number | string | null | undefined,
): string => {
  const num = Number(amount);

  if (!Number.isFinite(num)) {
    return 'Rupees Zero Only';
  }

  // Round to 2 decimal places to avoid floating point issues
  const rounded = Math.round(num * 100) / 100;

  if (rounded === 0) {
    return 'Rupees Zero Only';
  }

  const rupees = Math.floor(rounded);
  const paise = Math.round((rounded - rupees) * 100);

  const parts: string[] = ['Rupees'];

  if (rupees === 0) {
    parts.push('Zero');
  } else {
    const crore = Math.floor(rupees / 10000000);
    const lakh = Math.floor((rupees % 10000000) / 100000);
    const thousand = Math.floor((rupees % 100000) / 1000);
    const remainder = rupees % 1000;

    if (crore > 0) {
      parts.push(convertLessThanThousand(crore) + ' Crore');
    }
    if (lakh > 0) {
      parts.push(convertLessThanThousand(lakh) + ' Lakh');
    }
    if (thousand > 0) {
      parts.push(convertLessThanThousand(thousand) + ' Thousand');
    }
    if (remainder > 0) {
      parts.push(convertLessThanThousand(remainder));
    }
  }

  if (paise > 0) {
    parts.push('and');
    parts.push(convertLessThanThousand(paise) + ' Paise');
  }

  parts.push('Only');

  return parts.join(' ');
};