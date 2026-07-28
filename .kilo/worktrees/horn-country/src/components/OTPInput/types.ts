export interface OTPInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  keyboardType?: 'default' | 'number-pad' | 'phone-pad';
  testID?: string;
}
