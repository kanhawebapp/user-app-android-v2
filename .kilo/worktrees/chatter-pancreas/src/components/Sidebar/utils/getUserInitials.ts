/**
 * Get user initials for avatar
 */
export const getUserInitials = (name: string): string => {
  const names = name?.split(' ');
  if (names?.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }
  return name?.substring(0, 2).toUpperCase() || 'U';
};
