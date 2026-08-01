export interface MuhurtaStyle {
  backgroundColor: string;
  textColor: string;
}

export const MUHURTA_COLOR_MAP: Record<string, MuhurtaStyle> = {
  Amrit: {backgroundColor: '#22c55e', textColor: '#ffffff'},
  Shubh: {backgroundColor: '#3b82f6', textColor: '#ffffff'},
  Labh: {backgroundColor: '#14b8a6', textColor: '#ffffff'},
  Char: {backgroundColor: '#f97316', textColor: '#ffffff'},
  Udveg: {backgroundColor: '#ef4444', textColor: '#ffffff'},
  Rog: {backgroundColor: '#b91c1c', textColor: '#ffffff'},
  Kaal: {backgroundColor: '#374151', textColor: '#ffffff'},
};

export const getMuhurtaStyle = (muhurta?: string): MuhurtaStyle => {
  if (!muhurta) {
    return {backgroundColor: 'transparent', textColor: '#000000'};
  }

  const normalized = muhurta.trim();
  const mapped = MUHURTA_COLOR_MAP[normalized];

  if (mapped) {
    return mapped;
  }

  return {backgroundColor: 'transparent', textColor: '#000000'};
};
