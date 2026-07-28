import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

export const SPLASH_COLORS = {
  gradientStart: '#0F0C29',
  gradientMid: '#302B63',
  gradientEnd: '#24243E',
  gold: '#FFD700',
  goldLight: '#FFEA70',
  goldDark: '#B8860B',
  goldGlow: 'rgba(255, 215, 0, 0.4)',
  purple: '#9B59B6',
  purpleLight: '#BB86FC',
  white: '#FFFFFF',
  whiteMuted: 'rgba(255,255,255,0.85)',
  whiteDim: 'rgba(255,255,255,0.6)',
  glow: 'rgba(255, 215, 0, 0.3)',
  divineGlow: 'rgba(187, 134, 252, 0.3)',
  nightOverlay: 'rgba(15, 12, 41, 0.7)',
} as const;

export const STAR_POSITIONS = [
  {top: height * 0.05, left: width * 0.1, size: 2.5},
  {top: height * 0.08, left: width * 0.85, size: 2},
  {top: height * 0.12, left: width * 0.2, size: 3},
  {top: height * 0.15, left: width * 0.75, size: 2},
  {top: height * 0.18, left: width * 0.5, size: 2.5},
  {top: height * 0.22, left: width * 0.05, size: 2},
  {top: height * 0.25, left: width * 0.9, size: 3},
  {top: height * 0.28, left: width * 0.15, size: 2},
  {top: height * 0.32, left: width * 0.8, size: 2.5},
  {top: height * 0.35, left: width * 0.3, size: 2},
  {top: height * 0.38, left: width * 0.95, size: 3},
  {top: height * 0.42, left: width * 0.08, size: 2},
  {top: height * 0.45, left: width * 0.7, size: 2.5},
  {top: height * 0.1, left: width * 0.6, size: 1.5},
  {top: height * 0.2, left: width * 0.4, size: 1.5},
  {top: height * 0.3, left: width * 0.55, size: 2},
];

export const PARTICLE_CONFIGS = [
  {left: width * 0.15, size: 3, opacity: 0.7},
  {left: width * 0.3, size: 2, opacity: 0.5},
  {left: width * 0.5, size: 4, opacity: 0.8},
  {left: width * 0.7, size: 2.5, opacity: 0.6},
  {left: width * 0.85, size: 3, opacity: 0.7},
];

export const {height: SCREEN_HEIGHT} = Dimensions.get('window');
