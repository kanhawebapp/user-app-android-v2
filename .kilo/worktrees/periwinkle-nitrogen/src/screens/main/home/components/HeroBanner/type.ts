import {ViewStyle} from 'react-native';

export interface HeroBannerData {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl?: any;
  backgroundColor?: string;
  ctaText?: string;
  ctaAction?: string;
}

export interface HeroBannerProps {
  data?: HeroBannerData[];
  onCtaPress?: (action?: string) => void;
  style?: ViewStyle;
}

export interface ExtendedHeroBannerData extends HeroBannerData {
  originalIndex?: number;
}
