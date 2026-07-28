/**
 * Shimmer Components Index
 * Main export file for all shimmer-related components
 */

// ShimmerWrapper - Reusable wrapper component
export { ShimmerWrapper, default } from './ShimmerWrapper';
export type { ShimmerWrapperProps, ShimmerItemProps } from './ShimmerWrapper.types';

// Fallback system
export {
  ScreenFallbackMap,
  SidebarFallbackMap,
  DefaultFallback,
  getTabFallback,
  getSidebarFallback,
} from './fallbackMap';

// Screen-specific shimmer components
export {
  HomeScreenShimmer,
  ShopScreenShimmer,
  ProfileScreenShimmer,
  ChatScreenShimmer,
  LiveScreenShimmer,
  RemediesScreenShimmer,
} from './screens';

