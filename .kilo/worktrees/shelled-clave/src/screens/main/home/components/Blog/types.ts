/**
 * Blog Types
 * Defines types for Blog section in Home Screen
 */

import {ViewStyle} from 'react-native';

export interface BlogPost {
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
  posts?: BlogPost[];
  onPostPress?: (post: BlogPost) => void;
  onViewAllPress?: () => void;
  style?: ViewStyle;
}
