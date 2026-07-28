// ============================================
// DhwaniAstro - Auth API Service
// ============================================

import {graphqlRequest} from '../graphql.client';
import loggingService from '../../logging';
import {LoginResult} from './auth.types';

const REQUEST_OTP_MUTATION = `mutation RequestOtp($countryCode: String!, $mobile: String!) {
  requestOtp(countryCode: $countryCode, mobile: $mobile) {
    message
    __typename
  }
}`;

const AUTH_WITH_OTP_MUTATION = `
mutation AuthWithOtp($countryCode: String!, $mobile: String!, $otp: String!) {
  authWithOtp(countryCode: $countryCode, mobile: $mobile, otp: $otp) {
    accessToken
    refreshToken
    hasName
    user {
      id
      name
      __typename
    }
    __typename
  }
}`;

export const sendOTP = async (mobile: string, countryCode: string = '+91') => {
  try {
    const response = await graphqlRequest<{
      requestOtp: {message: string};
    }>('RequestOtp', REQUEST_OTP_MUTATION, {
      countryCode,
      mobile: mobile.trim(),
    });

    console.log('SEND OTP RESPONSE:', response);

    const data = response.requestOtp;

    if (!data?.message) {
      throw new Error('Invalid response from server');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const verifyOTP = async (
  mobile: string,
  otp: string,
  countryCode: string = '+91',
): Promise<LoginResult> => {
  try {
    console.log('VERIFY VARIABLES:', {
      countryCode,
      mobile,
      otp,
      otpType: typeof otp,
    });
    const response = await graphqlRequest<{
      authWithOtp: any;
    }>('AuthWithOtp', AUTH_WITH_OTP_MUTATION, {
      countryCode,
      mobile: mobile.trim(),
      otp: otp.trim(),
    });

    console.log('VERIFY OTP RESPONSE:', response);

    const authData = response.authWithOtp;

    if (!authData?.accessToken || !authData?.user) {
      throw new Error('Invalid response from server');
    }

    return {
      accessToken: authData.accessToken,
      refreshToken: authData.refreshToken,
      hasName: authData.hasName,
      user: authData.user,
    };
  } catch (error) {
    throw error;
  }
};

export default {
  sendOTP,
  verifyOTP,
};
