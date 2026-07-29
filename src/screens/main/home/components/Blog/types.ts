/**
 * Blog Types
 * Defines types for Blog section in Home Screen
 */

import {ViewStyle} from 'react-native';
import {BlogCategory} from '../../../../../services/api/blogs/blog.types';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  featuredImage: string;
  createdAt: string;
  categories: BlogCategory[];
}

export interface BlogProps {
  posts?: BlogPost[];
  loading?: boolean;
  error?: any;
  onPostPress?: (post: BlogPost) => void;
  onViewAllPress?: () => void;
  style?: ViewStyle;
}
