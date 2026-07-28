# Login Screen - API Integration Guide

## Architecture Overview

```
src/services/api/
├── graphql.client.ts    # GraphQL client setup (NEW)
├── auth.api.ts          # Auth API service (NEW)
├── axios.instance.ts    # REST API (for other endpoints)
└── config.api.ts        # Config API

src/screens/auth/LoginScreen/hooks/
└── useLogin.ts          # Login hook (UPDATED - uses real API)
```

## GraphQL API Endpoints

- **Endpoint:** `https://dhwaniastro.com/userAuth/graphql`
- **Operations:**
  - `RequestOtp` - Send OTP to phone
  - `AuthWithOtp` - Verify OTP and login

## Files Created/Modified

### 1. `src/services/api/graphql.client.ts` (NEW)

GraphQL client with:

- Endpoint configuration for production/staging
- Request interceptor for auth tokens
- `graphqlRequest()` helper function

### 2. `src/services/api/auth.api.ts` (NEW)

Auth API functions:

- `sendOTP(mobile, countryCode)` - Send OTP
- `verifyOTP(mobile, otp, countryCode)` - Verify OTP & login

### 3. `src/screens/auth/LoginScreen/hooks/useLogin.ts` (UPDATED)

- Replaced mock implementations with real API calls
- `requestOTP()` → calls `sendOTP()`
- `verifyOTP()` → calls `verifyOTP()`
- `resendOTP()` → calls `sendOTP()`

## API Flow

```
User enters phone → requestOTP() → GraphQL: RequestOtp → OTP sent
User enters OTP → verifyOTP() → GraphQL: AuthWithOtp → Returns tokens + user
Tokens stored in secure storage via auth.store
```

## GraphQL Queries Used

### Request OTP

```graphql
mutation RequestOtp($countryCode: String!, $mobile: String!) {
  requestOtp(countryCode: $countryCode, mobile: $mobile) {
    message
    __typename
  }
}
```

### Verify OTP (Login)

```graphql
mutation AuthWithOtp($countryCode: String!, $mobile: String!, $otp: String!) {
  authWithOtp(countryCode: $countryCode, mobile: $mobile, otp: $otp) {
    accessToken
    refreshToken
    hasName
    user {
      id
      name
      email
      phone
      profilePic
      walletBalance
      isVerified
      isAstrologer
    }
  }
}
```

## Error Handling

- Network errors → Caught and thrown as Error
- GraphQL errors → Extracted from `errors` array
- Auth failures → Display error message to user
