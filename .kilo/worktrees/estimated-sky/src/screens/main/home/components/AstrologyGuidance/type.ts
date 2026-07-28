import { ViewStyle } from 'react-native';

export interface GuidanceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconLibrary?: string;
}

export interface AstrologyGuidanceProps {
  items?: GuidanceItem[];
  onItemPress?: (item: GuidanceItem) => void;
  style?: ViewStyle;
}

