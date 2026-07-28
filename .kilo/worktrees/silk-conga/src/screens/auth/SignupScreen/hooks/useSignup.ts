/**
 * useSignup Hook
 * Custom hook for handling signup logic
 */

import {useState, useCallback} from 'react';
import {useAppStore} from '../../../../stores/app.store';
import {useAuthStore} from '../../../../stores/auth.store';
import {loggingService} from '../../../../services/logging';
import type {User, Gender} from '../../../../types/global.types';

// Mock user data for dummy signup
const createMockUser = (name: string, phone: string, email: string): User => ({
  id: 'user_' + Date.now(),
  phone,
  email,
  name,
  profilePic: undefined,
  dateOfBirth: '',
  birthTime: '',
  birthPlace: '',
  placeOfBirth: '',
  countryCode: '+91',
  mobile: phone,
  gender: 'male' as Gender,
  zodiacSign: '',
  languagePreference: 'en',
  walletBalance: 0,
  isVerified: true,
  isAstrologer: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

interface UseSignupProps {
  name: string;
  email: string;
  phone: string;
  password: string;
  onSignupSuccess?: () => void;
  onSignupError?: (error: Error) => void;
}

interface UseSignupReturn {
  // Signup State
  isSigningUp: boolean;
  signupError: string | null;

  // Social Signup State
  isGoogleLoading: boolean;
  isFacebookLoading: boolean;

  // Actions
  signup: () => Promise<void>;
  signupWithGoogle: () => Promise<void>;
  signupWithFacebook: () => Promise<void>;
  clearError: () => void;
}

export const useSignup = ({
  name,
  email,
  phone,
  password,
  onSignupSuccess,
  onSignupError,
}: UseSignupProps): UseSignupReturn => {
  // Signup State
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);

  // Social Signup State
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);

  // Get app store functions
  const setOnboardingCompleted = useAppStore(
    (state: {setOnboardingCompleted: (completed: boolean) => void}) =>
      state.setOnboardingCompleted,
  );
  const setIsLoggedIn = useAppStore(
    (state: {setIsLoggedIn: (loggedIn: boolean) => void}) =>
      state.setIsLoggedIn,
  );

  // Get auth store functions
  const authLogin = useAuthStore(
    (state: {
      login: (
        user: User,
        accessToken: string,
        refreshToken: string,
      ) => Promise<void>;
    }) => state.login,
  );

  // Signup with email/phone
  const signup = useCallback(async () => {
    // Validate inputs
    if (!name || name.trim().length === 0) {
      const error = new Error('Please enter your name');
      setSignupError(error.message);
      onSignupError?.(error);
      return;
    }

    if (!email || email.trim().length === 0) {
      const error = new Error('Please enter your email');
      setSignupError(error.message);
      onSignupError?.(error);
      return;
    }

    if (!phone || phone.length < 10) {
      const error = new Error('Please enter a valid phone number');
      setSignupError(error.message);
      onSignupError?.(error);
      return;
    }

    if (!password || password.length < 6) {
      const error = new Error('Password must be at least 6 characters');
      setSignupError(error.message);
      onSignupError?.(error);
      return;
    }

    try {
      setIsSigningUp(true);
      setSignupError(null);
      loggingService.info('[Signup] Starting signup process:', {
        name,
        phone,
        email,
      });

      // Create mock user and login to auth store
      const mockUser = createMockUser(name, phone, email);
      await authLogin(mockUser, 'mock_access_token', 'mock_refresh_token');

      // Set logged in state
      setIsLoggedIn(true);

      loggingService.info('[Signup] Signup successful:', {
        phone,
        user: mockUser.name,
      });
      onSignupSuccess?.();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Signup failed');
      loggingService.error('[Signup] Signup failed:', {error: err});
      setSignupError(err.message);
      onSignupError?.(err);
    } finally {
      setIsSigningUp(false);
    }
  }, [
    name,
    email,
    phone,
    password,
    onSignupSuccess,
    onSignupError,
    setIsLoggedIn,
    authLogin,
  ]);

  // Signup with Google
  const signupWithGoogle = useCallback(async () => {
    try {
      setIsGoogleLoading(true);
      loggingService.info('[Signup] Google signup initiated');

      // Simulate Google signup API call
      await new Promise<void>(resolve => setTimeout(resolve, 1500));

      // Create mock user and login to auth store
      const mockUser = createMockUser('Google User', '', 'google@example.com');
      await authLogin(
        mockUser,
        'mock_google_access_token',
        'mock_google_refresh_token',
      );

      // Set logged in state
      setIsLoggedIn(true);

      loggingService.info('[Signup] Google signup successful', {
        user: mockUser.name,
      });
      onSignupSuccess?.();
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error('Google signup failed');
      loggingService.error('[Signup] Google signup failed:', {error: err});
      setSignupError(err.message);
      onSignupError?.(err);
    } finally {
      setIsGoogleLoading(false);
    }
  }, [onSignupSuccess, onSignupError, setIsLoggedIn, authLogin]);

  // Signup with Facebook
  const signupWithFacebook = useCallback(async () => {
    try {
      setIsFacebookLoading(true);
      loggingService.info('[Signup] Facebook signup initiated');

      // Simulate Facebook signup API call
      await new Promise<void>(resolve => setTimeout(resolve, 1500));

      // Create mock user and login to auth store
      const mockUser = createMockUser(
        'Facebook User',
        '',
        'facebook@example.com',
      );
      await authLogin(
        mockUser,
        'mock_facebook_access_token',
        'mock_facebook_refresh_token',
      );

      // Set logged in state
      setIsLoggedIn(true);

      loggingService.info('[Signup] Facebook signup successful', {
        user: mockUser.name,
      });
      onSignupSuccess?.();
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error('Facebook signup failed');
      loggingService.error('[Signup] Facebook signup failed:', {error: err});
      setSignupError(err.message);
      onSignupError?.(err);
    } finally {
      setIsFacebookLoading(false);
    }
  }, [onSignupSuccess, onSignupError, setIsLoggedIn, authLogin]);

  // Clear error
  const clearError = useCallback(() => {
    setSignupError(null);
  }, []);

  return {
    // Signup State
    isSigningUp,
    signupError,

    // Social Signup State
    isGoogleLoading,
    isFacebookLoading,

    // Actions
    signup,
    signupWithGoogle,
    signupWithFacebook,
    clearError,
  };
};

export default useSignup;
