export interface AuthUser {
  id: string;
  name: string;
  __typename: string;
}

export interface AuthWithOTPResponse {
  authWithOtp: {
    accessToken: string;
    refreshToken: string;
    hasName: boolean;
    user: AuthUser;
    __typename: string;
  };
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  hasName: boolean;
  user: AuthUser;
}
export interface SendOTPResponse {
  requestOtp: {
    message: string;
    __typename: string;
  };
}
