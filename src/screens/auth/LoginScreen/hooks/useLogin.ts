import {useState, useCallback, useRef} from 'react';
import {useAppStore} from '../../../../stores/app.store';
import {useAuthStore} from '../../../../stores/auth.store';
import {loggingService} from '../../../../services/logging';
import {sendOTP, verifyOTP} from '../../../../services/api/auth/auth.api';
import {updateUserProfile} from '../../../../services/api/profile/profile.api';
import type {User, Gender} from '../../../../types/global.types';
import {UseLoginProps, UseLoginReturn} from '../loginType';

const mapApiUserToUser = (apiUser: {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  profilePic?: string;
  dateOfBirth?: string;
  birthTime?: string;
  birthPlace?: string;
  gender?: string;
  zodiacSign?: string;
  languagePreference?: string;
  walletBalance?: number;
  isVerified?: boolean;
  isAstrologer?: boolean;
}): User => ({
  id: apiUser.id,
  phone: apiUser.phone || '',
  email: apiUser.email,
  name: apiUser.name,
  profilePic: apiUser.profilePic,
  dateOfBirth: apiUser.dateOfBirth,
  birthTime: apiUser.birthTime,
  birthPlace: apiUser.birthPlace,
  gender: (apiUser.gender as Gender) || 'male',
  zodiacSign: apiUser.zodiacSign,
  languagePreference: apiUser.languagePreference || 'en',
  walletBalance: apiUser.walletBalance || 0,
  isVerified: apiUser.isVerified ?? true,
  isAstrologer: apiUser.isAstrologer ?? false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  countryCode: undefined,
  mobile: undefined,
  placeOfBirth: '',
});

export const useLogin = ({
  phoneNumber,
  onOTPRequested,
  onOTPSuccess,
  onLoginSuccess,
  onLoginError,
}: UseLoginProps): UseLoginReturn => {
  const [isOTPRequested, setIsOTPRequested] = useState(false);
  const [isOTPVerifying, setIsOTPVerifying] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  const otpRequestInFlight = useRef(false);

  const [isNameRequired, setIsNameRequired] = useState(false);
  const [isNameSubmitting, setIsNameSubmitting] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const nameSubmitInFlight = useRef(false);

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  const setOnboardingCompleted = useAppStore(
    (state: {setOnboardingCompleted: (completed: boolean) => void}) =>
      state.setOnboardingCompleted,
  );
  const setIsLoggedIn = useAppStore(
    (state: {setIsLoggedIn: (loggedIn: boolean) => void}) =>
      state.setIsLoggedIn,
  );

  const authLogin = useAuthStore(
    (state: {
      login: (
        user: User,
        accessToken: string,
        refreshToken: string,
      ) => Promise<void>;
    }) => state.login,
  );
  const authLoginAsGuest = useAuthStore(
    (state: {loginAsGuest: (user: User) => Promise<void>}) =>
      state.loginAsGuest,
  );

  const requestOTP = useCallback(async () => {
    if (otpRequestInFlight.current) {
      return;
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      const error = new Error('Please enter a valid phone number');
      onLoginError?.(error);
      return;
    }

    try {
      setIsOTPRequested(true);
      otpRequestInFlight.current = true;
      setOtpError(null);
      loggingService.info('[Login] Requesting OTP for:', {phoneNumber});

      const response = await sendOTP(phoneNumber);

      loggingService.info('[Login] OTP sent successfully', {phoneNumber});
      onOTPRequested?.();
      return response;
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error('Failed to send OTP');
      loggingService.error('[Login] OTP request failed:', {error: err});
      setOtpError(err.message);
      onLoginError?.(err);
    } finally {
      setIsOTPRequested(false);
      otpRequestInFlight.current = false;
    }
  }, [phoneNumber, onOTPRequested, onLoginError]);

  const completeLoginFlow = useCallback(() => {
    setIsLoggedIn(true);
    onOTPSuccess?.();
    onLoginSuccess?.();
  }, [onOTPSuccess, onLoginSuccess, setIsLoggedIn]);

  const verifyOTPAndLogin = useCallback(
    async (otp: string) => {
      if (!otp || otp.length < 4) {
        const error = new Error('Please enter a valid 4-digit OTP');
        setOtpError(error.message);
        onLoginError?.(error);
        return;
      }

      try {
        setIsOTPVerifying(true);
        setOtpError(null);
        loggingService.info('[Login] Verifying OTP:', {phoneNumber});

        const result = await verifyOTP(phoneNumber, otp);

        const user = mapApiUserToUser(result.user);

        await authLogin(user, result.accessToken, result.refreshToken);

        console.log('[AUTH] AUTHWITHOTP SUCCESS:', {
          hasName: result.hasName,
        });

        if (result.hasName === false) {
          console.log('[AUTH] NAME REQUIRED: true');
          setIsNameRequired(true);
          return;
        }

        if (result.hasName !== true) {
          console.log(
            '[AUTH] NAME REQUIRED: unexpected hasName value, using existing login flow:',
            result.hasName,
          );
        } else {
          console.log('[AUTH] NAME REQUIRED: false');
        }

        loggingService.info('[Login] Login successful:', {
          phoneNumber,
          user: user.name,
          hasName: result.hasName,
        });

        completeLoginFlow();
      } catch (error) {
        const err =
          error instanceof Error ? error : new Error('OTP verification failed');
        loggingService.error('[Login] OTP verification failed:', {error: err});
        setOtpError(err.message);
        onLoginError?.(err);
      } finally {
        setIsOTPVerifying(false);
      }
    },
    [phoneNumber, onLoginError, authLogin, completeLoginFlow],
  );

  const submitName = useCallback(
    async (name: string) => {
      const trimmedName = name?.trim() ?? '';
      if (!trimmedName) {
        setNameError('Please enter a valid name');
        return;
      }
      if (nameSubmitInFlight.current) {
        return;
      }

      nameSubmitInFlight.current = true;
      setIsNameSubmitting(true);
      setNameError(null);
      console.log('[PROFILE] UPDATE NAME START');

      try {
        await updateUserProfile({name: trimmedName});
        console.log('[PROFILE] UPDATE NAME SUCCESS');
        useAuthStore.getState().updateUser({name: trimmedName});
        setIsNameRequired(false);
        completeLoginFlow();
      } catch (error) {
        const err =
          error instanceof Error ? error : new Error('Failed to update name');
        console.log('[PROFILE] UPDATE NAME FAILED', err.message);
        setNameError(err.message);
        setIsNameRequired(true);
      } finally {
        nameSubmitInFlight.current = false;
        setIsNameSubmitting(false);
      }
    },
    [completeLoginFlow],
  );

  const resendOTP = useCallback(async () => {
    try {
      loggingService.info('[Login] Resending OTP:', {phoneNumber});

      await sendOTP(phoneNumber);

      loggingService.info('[Login] OTP resent successfully');
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error('Failed to resend OTP');
      loggingService.error('[Login] Resend OTP failed:', {error: err});
      setOtpError(err.message);
      onLoginError?.(err);
    }
  }, [phoneNumber, onLoginError]);

  const loginAsGuest = useCallback(async () => {
    try {
      setIsGuestLoading(true);
      loggingService.info('[Login] Guest login initiated');

      await new Promise<void>(resolve => setTimeout(resolve, 500));

      const guestUser: User = {
        id: 'guest_' + Date.now(),
        phone: '',
        name: 'Guest User',
        languagePreference: 'en',
        walletBalance: 0,
        isVerified: false,
        isAstrologer: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        countryCode: undefined,
        mobile: undefined,
        placeOfBirth: '',
      };

      await authLoginAsGuest(guestUser);
      setOnboardingCompleted(true);
      setIsLoggedIn(true);

      loggingService.info('[Login] Guest login successful', {
        user: guestUser.name,
      });
      onLoginSuccess?.();
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error('Guest login failed');
      loggingService.error('[Login] Guest login failed:', {error: err});
      onLoginError?.(err);
    } finally {
      setIsGuestLoading(false);
    }
  }, [
    setOnboardingCompleted,
    onLoginSuccess,
    onLoginError,
    setIsLoggedIn,
    authLoginAsGuest,
  ]);

  const loginWithGoogle = useCallback(async () => {
    setIsGoogleLoading(true);
    try {
      loggingService.info('[Login] Google login initiated');
      onLoginError?.(new Error('Google login not implemented yet'));
    } finally {
      setIsGoogleLoading(false);
    }
  }, [onLoginError]);

  const loginWithFacebook = useCallback(async () => {
    setIsFacebookLoading(true);
    try {
      loggingService.info('[Login] Facebook login initiated');
      onLoginError?.(new Error('Facebook login not implemented yet'));
    } finally {
      setIsFacebookLoading(false);
    }
  }, [onLoginError]);

  const closeOTPModal = useCallback(() => {
    setIsOTPRequested(false);
    setOtpError(null);
  }, []);

  const clearErrors = useCallback(() => {
    setOtpError(null);
  }, []);

  return {
    isOTPRequested,
    isOTPVerifying,
    otpError,
    isGoogleLoading,
    isFacebookLoading,
    isGuestLoading,
    isNameRequired,
    isNameSubmitting,
    nameError,
    requestOTP,
    verifyOTP: verifyOTPAndLogin,
    resendOTP,
    loginWithGoogle,
    loginWithFacebook,
    loginAsGuest,
    closeOTPModal,
    clearErrors,
    submitName,
  };
};

export default useLogin;
