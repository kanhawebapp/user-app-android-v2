/**
 * Components Barrel Export
 * Unified export for all UI components
 */

export {ThemeProvider, useTheme, useColors, useTypography} from '../theme';

export {Text} from './Text';
export type {TextProps} from './Text/textType';

export {Button} from './Button';
export type {ButtonProps, ButtonVariant, ButtonSize} from './Button/buttonType';

export {InputBox} from './InputBox';
export type {InputBoxProps, InputBoxSize} from './InputBox/inputboxType';

export {Modal} from './Modal';
export type {ModalProps} from './Modal/modalType';

export {Icon, IconLoading} from './Icon';

export {CustomImage, AvatarImage} from './Image';
export type {ImageProps, ImageResizeMode} from './Image/imageType';

export {SkeletonLoader} from './SkeletonLoader';

// Shimmer Components
export {
  ShimmerWrapper,
  ScreenFallbackMap,
  SidebarFallbackMap,
  DefaultFallback,
  getTabFallback,
  getSidebarFallback,
  HomeScreenShimmer,
  ShopScreenShimmer,
  ProfileScreenShimmer,
  ChatScreenShimmer,
  LiveScreenShimmer,
  RemediesScreenShimmer,
} from './Shimmer';

export {BottomSheet} from './BottomSheet';

export {Card} from './Card';
export type {CardProps, CardVariant} from './Card';

export {Toast} from './Toast';

export {NetworkStatus} from './NetworkStatus';

export {ErrorBoundary} from './ErrorBoundary';

export {SplashScreen} from './SplashScreen';
export type {
  SplashScreenProps,
  SplashScreenVariant,
} from './SplashScreen/splashScreenType';

export {AppContent} from './AppContent';

export {BackgroundLayout} from './BackgroundLayout';
export type {
  BackgroundLayoutProps,
  GradientDirection,
} from './BackgroundLayout/backgroundLayoutType';

export {OTPInput} from './OTPInput';
// export type { OTPInputProps } from './OTPInput';

export {OTPModal} from './OTPModal';
export type {OTPModalProps} from './OTPModal';

export {BottomNavigation} from './BottomNavigation';
export type {BottomNavigationProps} from './BottomNavigation/bottomNavigationType';

export {Header} from './Header';
export type {HeaderProps} from './Header/headerType';

export {Sidebar} from './Sidebar';
export type {SidebarProps, SidebarMenuItem} from './Sidebar/types';

export {CountryCodePicker} from './CountryCodePicker';
export type {CountryCodePickerProps} from './CountryCodePicker';

export {QueueBubble} from './QueueBubble';

export {GoBack} from './GoBack';
export type {GoBackProps} from './GoBack/goBackType';
