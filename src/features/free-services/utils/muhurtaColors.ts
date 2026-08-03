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

export const HORA_COLOR_MAP: Record<string, MuhurtaStyle> = {
  Sun: {backgroundColor: '#f97316', textColor: '#ffffff'},
  Moon: {backgroundColor: '#e2e8f0', textColor: '#1e293b'},
  Mars: {backgroundColor: '#ef4444', textColor: '#ffffff'},
  Mercury: {backgroundColor: '#22c55e', textColor: '#ffffff'},
  Jupiter: {backgroundColor: '#eab308', textColor: '#ffffff'},
  Venus: {backgroundColor: '#ec4899', textColor: '#ffffff'},
  Saturn: {backgroundColor: '#6366f1', textColor: '#ffffff'},
};

export const getHoraStyle = (hora?: string): MuhurtaStyle => {
  if (!hora) {
    return {backgroundColor: 'transparent', textColor: '#000000'};
  }

  const normalized = hora.trim();
  const mapped = HORA_COLOR_MAP[normalized];

  if (mapped) {
    return mapped;
  }

  return {backgroundColor: 'transparent', textColor: '#000000'};
};
