/**
 * Blog Types
 * Defines types for Blog section in Home Screen
 */

import {ViewStyle} from 'react-native';

export interface BlogPost {
  createdAt(createdAt: any): import("react").ReactNode;
  featuredImage(featuredImage: any): string | undefined;
  image: string | undefined;
  id: string;
  title: string;
  excerpt: string;
  imageUrl?: any;
  author?: string;
  date?: string;
  readTime?: string;
}

export interface BlogProps {
  posts?: any[];
  onPostPress?: (post: BlogPost) => void;
  onViewAllPress?: () => void;
  style?: ViewStyle;
}
