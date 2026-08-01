export type MuhurtaServiceKind = 'chaughadiya' | 'abhijeet' | 'other';

export const getMuhurtaServiceKind = (title: string): MuhurtaServiceKind => {
  const normalizedTitle = title?.toLowerCase() || '';

  if (normalizedTitle.includes('chaughadiya')) {
    return 'chaughadiya';
  }

  if (normalizedTitle.includes('abhijeet') || normalizedTitle.includes('abhijit')) {
    return 'abhijeet';
  }

  return 'other';
};
