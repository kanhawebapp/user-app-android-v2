export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type ToastPosition = 'top' | 'bottom';

export interface ToastAction {
  label: string;
  onPress: () => void;
  textColor?: string;
}

export interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onHide?: () => void;
  title?: string;
  position?: ToastPosition;
  showProgress?: boolean;
  action?: ToastAction;
  icon?: string;
  dismissOnPress?: boolean;
  autoDismiss?: boolean;
}
