/**
 * Shop Types
 * Defines types for Shop section in Home Screen
 */

import { ViewStyle } from 'react-native';

export interface ShopItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: any;
  price?: number;
  webUrl: string;
}

export interface ShopProps {
  items?: ShopItem[];
  onShopPress?: (item: ShopItem) => void;
  onViewAllPress?: () => void;
  style?: ViewStyle;
}

