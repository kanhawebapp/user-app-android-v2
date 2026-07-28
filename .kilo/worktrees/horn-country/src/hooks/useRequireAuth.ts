/**
 * useRequireAuth Hook
 * Hook to check if user is authenticated or guest, and show login modal if needed
 */

import {useState, useCallback} from 'react';
import {useAuthStore, useAppStore} from '../stores';

export interface UseRequireAuthProps {
  /** Custom message to show in the modal */
  message?: string;
  /** Callback when login is successful */
  onLoginSuccess?: () => void;
  /** Callback when action is cancelled */
  onCancel?: () => void;
}

export interface UseRequireAuthReturn {
  /** Whether to show the login required modal */
  showLoginModal: boolean;
  /** The message to show in the modal */
  modalMessage: string;
  /** Function to check if user can perform action, returns true if allowed */
  checkAuth: (customMessage?: string, onSuccess?: () => void) => boolean;
  /** Function to close the modal */
  closeModal: () => void;
  /** Function to proceed with action (after showing modal) */
  proceed: () => void;
  /** Whether user is authenticated (not a guest) */
  isAuthenticated: boolean;
  /** Whether user is a guest */
  isGuest: boolean;
  /** Whether user is logged in (either authenticated or guest) */
  isLoggedIn: boolean;
}

/**
 * Hook to require authentication for certain actions
 * Shows a modal to guest users asking them to login
 */
export const useRequireAuth = (
  props?: UseRequireAuthProps,
): UseRequireAuthReturn => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalMessage, setModalMessage] = useState(
    props?.message || 'Please login to perform this action',
  );
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(
    null,
  );

  // Get auth state from store
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isGuest = useAuthStore(state => state.isGuest);
  const isLoggedIn = useAppStore(state => state.isLoggedIn);

  /**
   * Check if user can perform the action
   * If user is a guest, show modal and return false
   * If user is authenticated, return true
   */
  const checkAuth = useCallback(
    (customMessage?: string, onSuccess?: () => void): boolean => {
      // If user is authenticated (not a guest), allow the action
      if (isAuthenticated) {
        onSuccess?.();
        return true;
      }

      // If user is a guest, show the login modal
      if (customMessage) {
        setModalMessage(customMessage);
      } else if (props?.message) {
        setModalMessage(props?.message);
      } else {
        setModalMessage('Please login to perform this action');
      }

      setPendingCallback(() => onSuccess || null);
      setShowLoginModal(true);
      return false;
    },
    [isAuthenticated, isGuest, props?.message],
  );

  /**
   * Close the login required modal
   */
  const closeModal = useCallback(() => {
    setShowLoginModal(false);
    setPendingCallback(null);
    props?.onCancel?.();
  }, [props?.onCancel]);

  /**
   * Proceed with the action (called after successful login)
   */
  const proceed = useCallback(() => {
    setShowLoginModal(false);
    pendingCallback?.();
    props?.onLoginSuccess?.();
  }, [pendingCallback, props?.onLoginSuccess]);

  return {
    showLoginModal,
    modalMessage,
    checkAuth,
    closeModal,
    proceed,
    isAuthenticated,
    isGuest,
    isLoggedIn,
  };
};

export default useRequireAuth;
