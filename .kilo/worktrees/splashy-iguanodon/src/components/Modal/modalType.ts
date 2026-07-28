import {ViewStyle} from 'react-native';

export interface ModalProps extends Omit<any, 'animationType' | 'transparent'> {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  animationType?: 'fade' | 'slide' | 'none';
  showBackdrop?: boolean;
  dismissOnBackdropPress?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  showCloseButton?: boolean;
  title?: string;
  testID?: string;
  accessibilityLabel?: string;
}

export interface LoginRequiredModalProps {
  visible: boolean;
  onClose: () => void;
  onLoginPress: () => void;
  onSignupPress?: () => void;
  title?: string;
  message?: string;
  loginButtonText?: string;
  signupButtonText?: string;
  showSignup?: boolean;
}

export interface GiftModalProps {
  visible: boolean;
  onClose: () => void;
  onClaim?: () => void;
  title?: string;
  description?: string;
  offerAmount?: string | number;
  offerType?: 'bonus' | 'discount' | 'free' | 'coins';
  claimButtonText?: string;
  showLaterButton?: boolean;
  onLaterPress?: () => void;
}

export interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (astrologerId: any, rating: any, feedback?: any) => void;
  astrologerName?: string;
  astrologerId: any;
  userName: any;
}

export interface ThankYouModalProps {
  visible: boolean;
  onClose: () => void;
  onRecharge?: () => void;
  onChatAgain?: () => void;
  onExit?: () => void;
  // walletBalance?: number;
}
