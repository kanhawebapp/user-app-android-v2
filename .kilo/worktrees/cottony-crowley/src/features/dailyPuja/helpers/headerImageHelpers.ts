/**
 * Header Image Options Helper
 * Defines available header background images for the Daily Puja screen
 */

import { HeaderImageOption } from '../types';

export const HEADER_IMAGE_OPTIONS: HeaderImageOption[] = [
  {
    id: 'header1',
    name: 'Golden Temple',
    nameHindi: 'सुनहरा मंदिर',
    image: require('../assets/images/header2.jpg'),
  },
  {
    id: 'header2',
    name: 'Divine Light',
    nameHindi: 'दिव्य प्रकाश',
    image: require('../assets/images/header2.jpg'),
  },
  {
    id: 'header3',
    name: 'Traditional',
    nameHindi: 'पारंपरिक',
    image: require('../assets/images/header3.jpg'),
  },
  {
    id: 'header4',
    name: 'Sacred',
    nameHindi: 'पवित्र',
    image: require('../assets/images/header4.jpeg'),
  },
  {
    id: 'header5',
    name: 'Classic',
    nameHindi: 'क्लासिक',
    image: require('../assets/images/header5.jpg'),
  },
];

// Default header image
export const DEFAULT_HEADER_IMAGE = HEADER_IMAGE_OPTIONS[0];

