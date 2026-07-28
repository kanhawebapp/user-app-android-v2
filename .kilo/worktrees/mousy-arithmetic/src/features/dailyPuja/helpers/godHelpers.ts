/**
 * Helper functions for God-related utilities
 * Centralized god data transformations and utilities
 */

import {God, ExtendedGod} from '../types';
import {GODS} from '../data/gods';

// Map of Hindi names for each god
const HINDI_NAMES: Record<string, string> = {
  ganesha: 'भगवान गणेश',
  shiv: 'भगवान शिव',
  krishna: 'भगवान कृष्ण',
  vishnu: 'भगवान विष्णु',
  hanuman: 'हनुमान जी',
  laxmi: 'माता लक्ष्मी',
};

// Map of colors for each god
const GOD_COLORS: Record<string, string> = {
  ganesha: '#FF9800',
  shiv: '#9C27B0',
  krishna: '#3F51B5',
  vishnu: '#2196F3',
  hanuman: '#F44336',
  laxmi: '#FFEB3B',
};

// Map of icons for each god
const GOD_ICONS: Record<string, string> = {
  ganesha: 'lightning-bolt',
  shiv: 'trident',
  krishna: 'flute',
  vishnu: 'diamond-stone',
  hanuman: 'monkey',
  laxmi: 'currency-inr',
};

/**
 * Get Hindi name for a god by ID
 * @param godId - The god's unique identifier
 * @returns Hindi name of the god
 */
export const getGodHindiName = (godId: string): string => {
  return HINDI_NAMES[godId] || godId;
};

/**
 * Get color for a god by ID
 * @param godId - The god's unique identifier
 * @returns Color hex code associated with the god
 */
export const getGodColor = (godId: string): string => {
  return GOD_COLORS[godId] || '#FFD700';
};

/**
 * Get icon name for a god by ID
 * @param godId - The god's unique identifier
 * @returns Icon name for the god
 */
export const getGodIcon = (godId: string): string => {
  return GOD_ICONS[godId] || 'god';
};

/**
 * Extend a God object with additional properties
 * @param god - Base god object
 * @returns Extended god object with Hindi name, color, and icon
 */
export const extendGod = (god: God): ExtendedGod => ({
  ...god,
  nameHindi: getGodHindiName(god.id),
  color: getGodColor(god.id),
  icon: getGodIcon(god.id),
});

/**
 * Prepare all gods with extended properties
 * @returns Array of extended god objects
 */
export const prepareGods = (): ExtendedGod[] => {
  return GODS.map(god => extendGod(god));
};

/**
 * Get the default selected god
 * @returns The first god in the list with extended properties
 */
export const getDefaultGod = (): ExtendedGod => {
  return prepareGods()[0];
};

export default {
  getGodHindiName,
  getGodColor,
  getGodIcon,
  extendGod,
  prepareGods,
  getDefaultGod,
};
