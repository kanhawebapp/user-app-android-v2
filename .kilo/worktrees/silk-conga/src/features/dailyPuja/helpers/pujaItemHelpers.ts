/**
 * Helper functions and constants for Puja Items
 * Centralized item configurations and utilities
 */

import {PujaItemOption} from '../types';

// PNG images available for puja items
export const ITEM_IMAGES: Record<string, any> = {
  sankh: require('../assets/images/sankh.png'),
  mala: require('../assets/images/mala.jpg'),
  sankh_white: require('../assets/images/sankh.png'),
  sankh_gold: require('../assets/images/sankh.png'),
  sankh_silver: require('../assets/images/sankh.png'),
  sankh_shankh: require('../assets/images/sankh.png'),
  mala_tulasi: require('../assets/images/mala.jpg'),
  mala_rudraksha: require('../assets/images/mala.jpg'),
  mala_sandwood: require('../assets/images/mala.jpg'),
  mala_pearl: require('../assets/images/mala.jpg'),
  flower: require('../assets/images/rose.png'),
  flower_rose: require('../assets/images/rose.png'),
  flower_marigold: require('../assets/images/marigold.png'),
  flower_lotus: require('../assets/images/lotus.png'),
  flower_jasmine: require('../assets/images/jasmine.png'),
  flower_mogra: require('../assets/images/mogra.png'),
  diya: require('../assets/images/diya.png'),
  diya_oil: require('../assets/images/oil_diya.png'),
  diya_ghee: require('../assets/images/ghee_diya.png'),
  diya_candle: require('../assets/images/candle.png'),
  diya_diya: require('../assets/images/diya.png'),
  camara: require('../assets/images/dhoop.png'),
  camara_dhoop: require('../assets/images/dhoop.png'),
  camara_agarbatti: require('../assets/images/agarbati.png'),
  camara_incense: require('../assets/images/incense.png'),
  camara_chandan: require('../assets/images/chandan.png'),
  kalash: require('../assets/images/copper_kalash.png'),
  kalash_copper: require('../assets/images/copper_kalash.png'),
  kalash_gold: require('../assets/images/gold_kalash.png'),
  kalash_silver: require('../assets/images/silver_kalash.png'),
  kalash_earthen: require('../assets/images/earthen_kalash.png'),
  coconut: require('../assets/images/coconut.png'),
  coconut_hard: require('../assets/images/coconut.png'),
  coconut_tender: require('../assets/images/tender_coconut.png'),
  coconut_decorated: require('../assets/images/decorated_cocont.png'),
  coconut_copra: require('../assets/images/copra_coconut.png'),
  laddu: require('../assets/images/laddu.png'),
  laddu_motichoor: require('../assets/images/laddu_motichoor.png'),
  laddu_boondi: require('../assets/images/laddu_boondi.png'),
  laddu_ghevar: require('../assets/images/laddu_besan.png'),
  laddu_besan: require('../assets/images/laddu_besan.png'),
};

// Default options for each puja item type
export const POOJA_ITEM_OPTIONS: Record<string, PujaItemOption[]> = {
  sankh: [
    {
      id: 'sankh_white',
      name: 'White Sankh',
      nameHindi: 'सफेद शंख',
      icon: 'horn',
      color: '#E0E0E0',
    },
    {
      id: 'sankh_gold',
      name: 'Gold Sankh',
      nameHindi: 'सुनहरा शंख',
      icon: 'horn',
      color: '#FFD700',
    },
    {
      id: 'sankh_silver',
      name: 'Silver Sankh',
      nameHindi: 'चांदी शंख',
      icon: 'horn',
      color: '#C0C0C0',
    },
    {
      id: 'sankh_shankh',
      name: 'Shankh',
      nameHindi: 'शंख',
      icon: 'horn',
      color: '#4FC3F7',
    },
  ],
  flower: [
    {
      id: 'flower_rose',
      name: 'Rose',
      nameHindi: 'गुलाब',
      icon: 'flower',
      color: '#E91E63',
    },
    {
      id: 'flower_marigold',
      name: 'Marigold',
      nameHindi: 'गेंदा',
      icon: 'flower',
      color: '#FF9800',
    },
    {
      id: 'flower_lotus',
      name: 'Lotus',
      nameHindi: 'कमल',
      icon: 'lotus',
      color: '#F48FB1',
    },
    {
      id: 'flower_jasmine',
      name: 'Jasmine',
      nameHindi: 'चमेली',
      icon: 'flower',
      color: '#FFFFFF',
    },
    {
      id: 'flower_mogra',
      name: 'Mogra',
      nameHindi: 'मोगरा',
      icon: 'flower',
      color: '#F8BBD9',
    },
  ],
  mala: [
    {
      id: 'mala_tulasi',
      name: 'Tulasi Mala',
      nameHindi: 'तुलसी माला',
      icon: 'meditation',
      color: '#4CAF50',
    },
    {
      id: 'mala_rudraksha',
      name: 'Rudraksha',
      nameHindi: 'रुद्राक्ष',
      icon: 'meditation',
      color: '#795548',
    },
    {
      id: 'mala_sandwood',
      name: 'Sandwood',
      nameHindi: 'चंदन',
      icon: 'meditation',
      color: '#D7CCC8',
    },
    {
      id: 'mala_pearl',
      name: 'Pearl Mala',
      nameHindi: 'मोती माला',
      icon: 'meditation',
      color: '#ECEFF1',
    },
  ],
  diya: [
    {
      id: 'diya_oil',
      name: 'Oil Diya',
      nameHindi: 'तेल का दीया',
      icon: 'fire',
      color: '#FF9800',
    },
    {
      id: 'diya_ghee',
      name: 'Ghee Diya',
      nameHindi: 'घी का दीया',
      icon: 'fire',
      color: '#FFC107',
    },
    {
      id: 'diya_candle',
      name: 'Candle',
      nameHindi: 'मोमबत्ती',
      icon: 'fire',
      color: '#FFEB3B',
    },
    {
      id: 'diya_diya',
      name: 'Diya',
      nameHindi: 'दीया',
      icon: 'fire',
      color: '#FF5722',
    },
  ],
  camara: [
    {
      id: 'dhoop',
      name: 'Dhoop',
      nameHindi: 'धूप',
      icon: 'cloud',
      color: '#8D6E63',
    },
    {
      id: 'camara_agarbatti',
      name: 'Agarbatti',
      nameHindi: 'अगरबत्ती',
      icon: 'cloud',
      color: '#A1887F',
    },
    {
      id: 'camara_incense',
      name: 'Incense',
      nameHindi: 'धूप',
      icon: 'cloud',
      color: '#6D4C41',
    },
    {
      id: 'camara_chandan',
      name: 'Chandan',
      nameHindi: 'चंदन',
      icon: 'cloud',
      color: '#D7CCC8',
    },
  ],
  aarti: [
    {
      id: 'aarti_krishna',
      name: 'Krishna Aarti',
      nameHindi: 'कृष्ण आरती',
      icon: 'flame',
      color: '#3F51B5',
    },
    {
      id: 'aarti_ganesha',
      name: 'Ganesha Aarti',
      nameHindi: 'गणेश आरती',
      icon: 'flame',
      color: '#FF9800',
    },
    {
      id: 'aarti_shiv',
      name: 'Shiv Aarti',
      nameHindi: 'शिव आरती',
      icon: 'flame',
      color: '#9C27B0',
    },
    {
      id: 'aarti_laxmi',
      name: 'Laxmi Aarti',
      nameHindi: 'लक्ष्मी आरती',
      icon: 'flame',
      color: '#FFD700',
    },
  ],
  kalash: [
    {
      id: 'kalash_copper',
      name: 'Copper Kalash',
      nameHindi: 'तांबा कलश',
      icon: 'cup',
      color: '#B87333',
    },
    {
      id: 'kalash_gold',
      name: 'Gold Kalash',
      nameHindi: 'सोना कलश',
      icon: 'cup',
      color: '#FFD700',
    },
    {
      id: 'kalash_silver',
      name: 'Silver Kalash',
      nameHindi: 'चांदी कलश',
      icon: 'cup',
      color: '#C0C0C0',
    },
    {
      id: 'kalash_earthen',
      name: 'Earthen',
      nameHindi: 'मिट्टी का कलश',
      icon: 'cup',
      color: '#8D6E63',
    },
  ],
  coconut: [
    {
      id: 'coconut_hard',
      name: 'Coconut',
      nameHindi: 'नारियल',
      icon: 'fruit',
      color: '#795548',
    },
    {
      id: 'coconut_tender',
      name: 'Tender Coconut',
      nameHindi: 'नरकट',
      icon: 'fruit',
      color: '#A1887F',
    },
    {
      id: 'coconut_decorated',
      name: 'Decorated',
      nameHindi: 'सजा हुआ',
      icon: 'fruit',
      color: '#FFEB3B',
    },
    {
      id: 'coconut_copra',
      name: 'Copra',
      nameHindi: 'कपड़ा',
      icon: 'fruit',
      color: '#D7CCC8',
    },
  ],
  laddu: [
    {
      id: 'laddu_motichoor',
      name: 'Motichoor Laddu',
      nameHindi: 'मोतीचूर लड्डू',
      icon: 'cookie',
      color: '#FF9800',
    },
    {
      id: 'laddu_boondi',
      name: 'Boondi Laddu',
      nameHindi: 'बूंदी लड्डू',
      icon: 'cookie',
      color: '#FFC107',
    },
    {
      id: 'laddu_ghevar',
      name: 'Ghevar',
      nameHindi: 'घेवर',
      icon: 'cookie',
      color: '#FFEB3B',
    },
    {
      id: 'laddu_besan',
      name: 'Besan Laddu',
      nameHindi: 'बेसन लड्डू',
      icon: 'cookie',
      color: '#FFA726',
    },
  ],
};

/**
 * Get item image by ID
 * @param itemId - The item's unique identifier
 * @returns The image require statement or undefined
 */
export const getItemImage = (itemId: string): any => {
  return ITEM_IMAGES[itemId];
};

/**
 * Get options for a specific item type
 * @param itemId - The item type ID
 * @returns Array of puja item options
 */
export const getItemOptions = (itemId: string): PujaItemOption[] => {
  return POOJA_ITEM_OPTIONS[itemId] || [];
};

/**
 * Check if any items are selected
 * @param selectedItems - Record of selected items
 * @returns Boolean indicating if any items are selected
 */
export const hasItemsSelected = (
  selectedItems: Record<string, PujaItemOption>,
): boolean => {
  return Object.keys(selectedItems).length > 0;
};

export default {
  ITEM_IMAGES,
  POOJA_ITEM_OPTIONS,
  getItemImage,
  getItemOptions,
  hasItemsSelected,
};
