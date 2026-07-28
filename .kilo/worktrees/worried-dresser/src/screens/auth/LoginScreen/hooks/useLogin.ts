import { useState, useCallback } from 'react';
import { useAppStore } from '../../../../stores/app.store';
import { useAuthStore } from '../../../../stores/auth.store';
import { loggingService } from '../../../../services/logging';
import type { User, Gender } from '../../../../types/global.types';
import { UseLoginProps, UseLoginReturn } from '../loginType';

const createMockUser = (): User => ({
  id: 'user_' + Date.now(),
  phone: '9110058872',
  email: 'sarjeet.kumar@example.com',
  name: 'Sarjeet Kumar',
  profilePic: undefined,
  dateOfBirth: '1999-01-15',
  birthTime: '10:30',
  birthPlace: 'Delhi, India',
  gender: 'male' as Gender,
  zodiacSign: 'Capricorn',
  languagePreference: 'en',
  walletBalance: 2500.00,
  isVerified: true,
  isAstrologer: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Mock guest user data
const createGuestUser = (): User => ({
  id: 'guest_' + Date.now(),
  phone: '',
  name: 'Guest User',
  languagePreference: 'en',
  walletBalance: 0,
  isVerified: false,
  isAstrologer: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});


export const useLogin = ({
  phoneNumber,
  onOTPRequested,
  onOTPSuccess,
  onLoginSuccess,
  onLoginError,
}: UseLoginProps): UseLoginReturn => {
  // OTP State
  const [isOTPRequested, setIsOTPRequested] = useState(false);
  const [isOTPVerifying, setIsOTPVerifying] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  
  // Social Login State
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);
  
  // Guest Login State
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  // Get app store functions
  const setOnboardingCompleted = useAppStore((state: { setOnboardingCompleted: (completed: boolean) => void }) => state.setOnboardingCompleted);
  const setIsLoggedIn = useAppStore((state: { setIsLoggedIn: (loggedIn: boolean) => void }) => state.setIsLoggedIn);

  // Get auth store functions
  const authLogin = useAuthStore((state: { login: (user: User, accessToken: string, refreshToken: string) => Promise<void> }) => state.login);
  const authLoginAsGuest = useAuthStore((state: { loginAsGuest: (user: User) => Promise<void> }) => state.loginAsGuest);
  const authSetUser = useAuthStore((state: { setUser: (user: User | null) => void }) => state.setUser);

  // Request OTP
  const requestOTP = useCallback(async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      const error = new Error('Please enter a valid phone number');
      onLoginError?.(error);
      return;
    }

    try {
      setIsOTPRequested(true);
      loggingService.info('[Login] Requesting OTP for:', { phoneNumber });
      
      // Simulate API call to send OTP
      await new Promise<void>((resolve) => setTimeout(resolve, 1000));
      
      onOTPRequested?.();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to send OTP');
      loggingService.error('[Login] OTP request failed:', { error: err });
      setOtpError(err.message);
      onLoginError?.(err);
    } finally {
      setIsOTPRequested(false);
    }
  }, [phoneNumber, onOTPRequested, onLoginError]);

  // Verify OTP
  const verifyOTP = useCallback(async (otp: string) => {
    if (!otp || otp.length !== 4) {
      const error = new Error('Please enter a valid 6-digit OTP');
      setOtpError(error.message);
      onLoginError?.(error);
      return;
    }

    try {
      setIsOTPVerifying(true);
      setOtpError(null);
      loggingService.info('[Login] Verifying OTP:', { phoneNumber });
      
      // Simulate OTP verification API call
      await new Promise<void>((resolve) => setTimeout(resolve, 1500));
      
      // Create mock user and login to auth store
      const mockUser = createMockUser();
      await authLogin(mockUser, 'mock_access_token', 'mock_refresh_token');
      
      // Set logged in state
      setIsLoggedIn(true);
      
      // Mock successful login
      loggingService.info('[Login] OTP verification successful:', { phoneNumber, user: mockUser.name });
      onOTPSuccess?.();
      onLoginSuccess?.();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('OTP verification failed');
      loggingService.error('[Login] OTP verification failed:', { error: err });
      setOtpError(err.message);
      onLoginError?.(err);
    } finally {
      setIsOTPVerifying(false);
    }
  }, [phoneNumber, onOTPSuccess, onLoginSuccess, onLoginError, setIsLoggedIn, authLogin]);

  // Resend OTP 
  const resendOTP = useCallback(async () => {
    try {
      loggingService.info('[Login] Resending OTP:', { phoneNumber });
      
      // Simulate resend API call
      await new Promise<void>((resolve) => setTimeout(resolve, 1000));
      
      loggingService.info('[Login] OTP resent successfully');
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to resend OTP');
      loggingService.error('[Login] Resend OTP failed:', { error: err });
      setOtpError(err.message);
      onLoginError?.(err);
    }
  }, [phoneNumber, onLoginError]);

  // Login with Google
  const loginWithGoogle = useCallback(async () => {
    try {
      setIsGoogleLoading(true);
      loggingService.info('[Login] Google login initiated');
      
      // Simulate Google login API call
      await new Promise<void>((resolve) => setTimeout(resolve, 1500));
      
      // Create mock user and login to auth store
      const mockUser = createMockUser();
      await authLogin(mockUser, 'mock_google_access_token', 'mock_google_refresh_token');
      
      // Set logged in state
      setIsLoggedIn(true);
      
      loggingService.info('[Login] Google login successful', { user: mockUser.name });
      onLoginSuccess?.();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Google login failed');
      loggingService.error('[Login] Google login failed:', { error: err });
      onLoginError?.(err);
    } finally {
      setIsGoogleLoading(false);
    }
  }, [onLoginSuccess, onLoginError, setIsLoggedIn, authLogin]);
  
  // Login with Facebook
  const loginWithFacebook = useCallback(async () => {
    try {
      setIsFacebookLoading(true);
      loggingService.info('[Login] Facebook login initiated');
      
      // Simulate Facebook login API call
      await new Promise<void>((resolve) => setTimeout(resolve, 1500));
      
      // Create mock user and login to auth store
      const mockUser = createMockUser();
      await authLogin(mockUser, 'mock_facebook_access_token', 'mock_facebook_refresh_token');
      
      // Set logged in state
      setIsLoggedIn(true);
      
      loggingService.info('[Login] Facebook login successful', { user: mockUser.name });
      onLoginSuccess?.();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Facebook login failed');
      loggingService.error('[Login] Facebook login failed:', { error: err });
      onLoginError?.(err);
    } finally {
      setIsFacebookLoading(false);
    }
  }, [onLoginSuccess, onLoginError, setIsLoggedIn, authLogin]);

  // Login as Guest
  const loginAsGuest = useCallback(async () => {
    try {
      setIsGuestLoading(true);
      loggingService.info('[Login] Guest login initiated');
      
      // Simulate guest login
      await new Promise<void>((resolve) => setTimeout(resolve, 500));
      
      // Create guest user and login via auth store
      const guestUser = createGuestUser();
      await authLoginAsGuest(guestUser);
      
      // Mark onboarding as completed to navigate to main app
      setOnboardingCompleted(true);
      
      // Set logged in state for guest
      setIsLoggedIn(true);
      
      loggingService.info('[Login] Guest login successful', { user: guestUser.name });
      onLoginSuccess?.();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Guest login failed');
      loggingService.error('[Login] Guest login failed:', { error: err });
      onLoginError?.(err);
    } finally {
      setIsGuestLoading(false);
    }
  }, [setOnboardingCompleted, onLoginSuccess, onLoginError, setIsLoggedIn, authLoginAsGuest]);

  // Close OTP Modal
  const closeOTPModal = useCallback(() => {
    setIsOTPRequested(false);
    setOtpError(null);
  }, []);

  // Clear errors
  const clearErrors = useCallback(() => {
    setOtpError(null);
  }, []);

  return {
    // OTP Login State
    isOTPRequested,
    isOTPVerifying,
    otpError,
    
    // Social Login State
    isGoogleLoading,
    isFacebookLoading,
    
    // Guest Login State
    isGuestLoading,
    
    // Actions
    requestOTP,
    verifyOTP,
    resendOTP,
    loginWithGoogle,
    loginWithFacebook,
    loginAsGuest,
    closeOTPModal,
    clearErrors,
  };
};

export default useLogin;

