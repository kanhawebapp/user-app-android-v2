// ============================================
// DhwaniAstro - Auth API Service
// ============================================

import { graphqlRequest } from '../graphql.client';
import loggingService from '../../logging';
import { LoginResult, AuthWithOTPResponse } from './auth.types';
import { Platform } from 'react-native';
import { oneSignalService } from '../../notifications/OneSignalService';

const REQUEST_OTP_MUTATION = `mutation RequestOtp($countryCode: String!, $mobile: String!) {
  requestOtp(countryCode: $countryCode, mobile: $mobile) {
    message
    __typename
  }
}`;

const AUTH_WITH_OTP_MUTATION = `
mutation AuthWithOtp(
  $countryCode: String!,
  $mobile: String!,
  $otp: String!,
  $source: String!,
  $playerId: String
) {
  authWithOtp(
    countryCode: $countryCode,
    mobile: $mobile,
    otp: $otp,
    source: $source,
    playerId: $playerId
  ) {
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
      requestOtp: { message: string };
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
    // Fresh SDK read at OTP verify time — not from Redux/local cache
    const playerId = await oneSignalService.getPlayerId();

    const variables: {
      countryCode: string;
      mobile: string;
      otp: string;
      source: string;
      playerId?: string;
    } = {
      countryCode,
      mobile: mobile.trim(),
      otp: otp.trim(),
      source: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
    };

    // Only send a real Player ID — never the string "null" or an empty value
    if (playerId) {
      variables.playerId = playerId;
    }

    console.log('VERIFY VARIABLES:', {
      countryCode: variables.countryCode,
      mobile: variables.mobile,
      otp: variables.otp,
      otpType: typeof variables.otp,
      source: variables.source,
      playerId: variables.playerId ?? null,
    });

    console.log(
      'AUTH PAYLOAD =>',
      JSON.stringify(
        variables,
        null,
        2,
      ),
    );

    const response = await graphqlRequest<AuthWithOTPResponse>(
      'AuthWithOtp',
      AUTH_WITH_OTP_MUTATION,
      variables,
    );

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
  } catch (error: any) {
    console.log(
      'VERIFY OTP ERROR:',
      JSON.stringify(
        error?.response?.data,
        null,
        2,
      ),
    );
    throw error;
  }
};

export default {
  sendOTP,
  verifyOTP,
};
