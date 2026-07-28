
import React, { createContext, useContext, useCallback, useState } from 'react';
import { Toast,  } from '../components/Toast';
import { ToastType, ToastPosition, ToastAction } from '../components/Toast/toastType';
import { ToastConfig, ToastContextType } from './toastType';

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastConfig>({
    visible: false,
    message: '',
    type: 'info',
    position: 'top',
    showProgress: true,
    dismissOnPress: true,
    autoDismiss: true,
  });

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToast({ 
      visible: true, 
      message, 
      type,
      position: 'top',
      showProgress: true,
      dismissOnPress: true,
      autoDismiss: true,
    });
  }, []);

  const showSuccess = useCallback((message: string) => {
    setToast({ 
      visible: true, 
      message, 
      type: 'success',
      position: 'top',
      showProgress: true,
      dismissOnPress: true,
      autoDismiss: true,
    });
  }, []);

  const showError = useCallback((message: string) => {
    setToast({ 
      visible: true, 
      message, 
      type: 'error',
      position: 'top',
      showProgress: true,
      dismissOnPress: true,
      autoDismiss: true,
    });
  }, []);

  const showWarning = useCallback((message: string) => {
    setToast({ 
      visible: true, 
      message, 
      type: 'warning',
      position: 'top',
      showProgress: true,
      dismissOnPress: true,
      autoDismiss: true,
    });
  }, []);

  const showInfo = useCallback((message: string) => {
    setToast({ 
      visible: true, 
      message, 
      type: 'info',
      position: 'top',
      showProgress: true,
      dismissOnPress: true,
      autoDismiss: true,
    });
  }, []);

  // Enhanced method: show toast with full configuration
  const showToastWithConfig = useCallback((config: Omit<ToastConfig, 'visible'>) => {
    setToast({
      ...config,
      visible: true,
      position: config.position || 'top',
      showProgress: config.showProgress !== undefined ? config.showProgress : true,
      dismissOnPress: config.dismissOnPress !== undefined ? config.dismissOnPress : true,
      autoDismiss: config.autoDismiss !== undefined ? config.autoDismiss : true,
    });
  }, []);

  // Action button methods
  const showSuccessWithAction = useCallback((message: string, action: ToastAction) => {
    setToast({
      visible: true,
      message,
      type: 'success',
      action,
      position: 'top',
      showProgress: true,
      dismissOnPress: true,
      autoDismiss: true,
    });
  }, []);

  const showErrorWithAction = useCallback((message: string, action: ToastAction) => {
    setToast({
      visible: true,
      message,
      type: 'error',
      action,
      position: 'top',
      showProgress: true,
      dismissOnPress: true,
      autoDismiss: true,
    });
  }, []);

  const showWarningWithAction = useCallback((message: string, action: ToastAction) => {
    setToast({
      visible: true,
      message,
      type: 'warning',
      action,
      position: 'top',
      showProgress: true,
      dismissOnPress: true,
      autoDismiss: true,
    });
  }, []);

  const showInfoWithAction = useCallback((message: string, action: ToastAction) => {
    setToast({
      visible: true,
      message,
      type: 'info',
      action,
      position: 'top',
      showProgress: true,
      dismissOnPress: true,
      autoDismiss: true,
    });
  }, []);

  // Position-based toast
  const showAtPosition = useCallback((message: string, type: ToastType, position: ToastPosition) => {
    setToast({
      visible: true,
      message,
      type,
      position,
      showProgress: true,
      dismissOnPress: true,
      autoDismiss: true,
    });
  }, []);

  return (
    <ToastContext.Provider
      value={{ 
        showToast, 
        showSuccess, 
        showError, 
        showWarning, 
        showInfo, 
        hideToast,
        showToastWithConfig,
        showSuccessWithAction,
        showErrorWithAction,
        showWarningWithAction,
        showInfoWithAction,
        showAtPosition,
      }}
    >
      {children}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        title={toast.title}
        position={toast.position}
        duration={toast.duration}
        showProgress={toast.showProgress}
        action={toast.action}
        icon={toast.icon}
        dismissOnPress={toast.dismissOnPress}
        autoDismiss={toast.autoDismiss}
        onHide={hideToast}
      />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export default ToastProvider;

