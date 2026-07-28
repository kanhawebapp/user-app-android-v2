import { ToastType, ToastPosition, ToastAction } from "../components/Toast/toastType";

export interface ToastConfig {
  visible: boolean;
  message: string;
  type: ToastType;
  title?: string;
  position?: ToastPosition;
  duration?: number;
  showProgress?: boolean;
  action?: ToastAction;
  icon?: string;
  dismissOnPress?: boolean;
  autoDismiss?: boolean;
}

export interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
  hideToast: () => void;
  // New enhanced methods
  showToastWithConfig: (config: Omit<ToastConfig, 'visible'>) => void;
  showSuccessWithAction: (message: string, action: ToastAction) => void;
  showErrorWithAction: (message: string, action: ToastAction) => void;
  showWarningWithAction: (message: string, action: ToastAction) => void;
  showInfoWithAction: (message: string, action: ToastAction) => void;
  showAtPosition: (message: string, type: ToastType, position: ToastPosition) => void;
}
