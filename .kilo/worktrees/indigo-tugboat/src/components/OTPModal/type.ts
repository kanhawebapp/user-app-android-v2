export interface OTPModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (otp: string) => void;
  phoneNumber?: string;
  onResendOTP?: () => void;
  loading?: boolean;
  title?: string;
  subtitle?: string;
  testID?: string;
}
