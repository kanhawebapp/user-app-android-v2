import {SpecialItemConfig} from './types';

// PNG images available for special puja items
export const ITEM_IMAGES: Record<string, any> = {
  sankh: require('../../assets/images/sankh.png'),
  mala: require('../../assets/images/rose.png'),
  aarti: require('../../assets/images/diya.png'),
};

// Special items that appear after puja starts
export const SPECIAL_POOJA_ITEMS: SpecialItemConfig[] = [
  {
    id: 'mala',
    name: 'Flowers',
    nameHindi: 'माला',
    iconName: 'meditation',
    color: '#9C27B0',
    soundFile: 'bell',
  },
  {
    id: 'sankh',
    name: 'Shankh',
    nameHindi: 'शंख',
    iconName: 'horn',
    color: '#4FC3F7',
    soundFile: 'shankh',
  },
  // {
  //   id: 'aarti',
  //   name: 'Aarti',
  //   nameHindi: 'आरती',
  //   iconName: 'flame',
  //   color: '#FFC107',
  //   soundFile: 'aarti',
  // },
];
