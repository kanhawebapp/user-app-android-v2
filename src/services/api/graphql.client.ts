

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, HTTP_STATUS, TIMEOUT } from '../../constants/api.constants';
import { STORAGE_KEYS } from '../../constants/app.constants';
import secureStorage from '../storage/secure.storage';
import loggingService from '../logging';
import { useAuthStore } from '../../stores/auth.store';
import {
  handleUnauthorized,
  isUnauthorizedError,
} from './unauthorized.handler';

const resolveAccessToken = async (): Promise<string | null> => {
  const authToken = useAuthStore.getState().accessToken;
  if (authToken) {
    return authToken;
  }

  return secureStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

const applyAuthorizationHeader = (
  config: InternalAxiosRequestConfig,
  accessToken: string | null,
) => {
  if (!config.headers) {
    config.headers = {} as InternalAxiosRequestConfig['headers'];
  }

  if (accessToken) {
    if (typeof config.headers.set === 'function') {
      config.headers.set('Authorization', `Bearer ${accessToken}`);
    } else {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return;
  }

  if (typeof config.headers.delete === 'function') {
    config.headers.delete('Authorization');
  } else {
    delete config.headers.Authorization;
  }
};

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}


export const GRAPHQL_ENDPOINTS = {
  PRODUCTION: `${API_BASE_URL.PRODUCTION}userAuth/graphql`,
  STAGING: `${API_BASE_URL.STAGING}userAuth/graphql`,
  DEVELOPMENT: `${API_BASE_URL.DEVELOPMENT}userAuth/graphql`,
} as const;

const getGraphQLEndpoint = (): string => {
  const env = __DEV__ ? 'DEVELOPMENT' : 'PRODUCTION';
  return GRAPHQL_ENDPOINTS[env];
};

export const createGraphQLClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: getGraphQLEndpoint(),
    timeout: TIMEOUT.DEFAULT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  client.interceptors.request.use(async config => {
    const accessToken = await resolveAccessToken();
    applyAuthorizationHeader(config, accessToken);

    loggingService.info(
      `[GraphQL] ${config.method?.toUpperCase()} ${config.url}`,
    );
    return config;
  });

  //   client.interceptors.response.use(
  //   response => response,
  //   (error: AxiosError) => {

  //     console.log(
  //       'FULL ERROR RESPONSE =>',
  //       JSON.stringify(error?.response?.data, null, 2),
  //     );

  //     console.log(
  //       'STATUS CODE =>',
  //       error?.response?.status,
  //     );

  //     loggingService.error('[GraphQL] Request failed', {
  //       error: error.message,
  //     });

  //     return Promise.reject(error);
  //   },
  // );

  client.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      if (
        error.response?.status === HTTP_STATUS.UNAUTHORIZED ||
        isUnauthorizedError(error)
      ) {
        await handleUnauthorized();
      }

      return Promise.reject(error);
    },
  );

  return client;
};

export const graphqlClient = createGraphQLClient();

/** Auth mutations — 401/Unauthorized here is a credential failure, not session expiry */
const AUTH_GRAPHQL_OPERATIONS = new Set(['RequestOtp', 'AuthWithOtp']);

// export const graphqlRequest = async <T>(
//   operationName: string,
//   query: string,
//   variables?: Record<string, unknown>,
// ): Promise<T> => {
//   const payload = {
//     operationName,
//     query,
//     variables,
//     extensions: {
//       clientLibrary: {
//         name: '@apollo/client',
//         version: '4.1.5',
//       },
//     },
//   };

//   //  ADD LOG HERE (CORRECT PLACE)
//   loggingService.info('[GraphQL] REQUEST BODY', payload);
//   // console.log('GRAPHQL PAYLOAD:', JSON.stringify(payload, null, 2));

//   // Check token availability right before the request
//   const preCheckToken = await secureStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
//   console.log(
//     '[GraphQL] Pre-request token check:',
//     preCheckToken ? 'TOKEN EXISTS' : 'NO TOKEN',
//   );

//   const response = await graphqlClient.post<GraphQLResponse<T>>('', payload);

//   // console.log('GRAPHQL RESPONSE:', JSON.stringify(response.data, null, 2));
//   // console.log('Response headers:', response.headers);

//   if (response.data.errors && response.data.errors.length > 0) {
//     const errorMessage = response.data.errors[0].message;
//     loggingService.error('[GraphQL] Error', {error: errorMessage});
//     throw new Error(errorMessage);
//   }

//   if (!response.data.data) {
//     throw new Error('No data returned from GraphQL');
//   }

//   return response.data.data;
// };

export const graphqlRequest = async <T>(
  operationName: string,
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> => {

  const payload = {
    operationName,
    query,
    variables,
    extensions: {
      clientLibrary: {
        name: '@apollo/client',
        version: '4.1.5',
      },
    },
  };

  try {

    const response = await graphqlClient.post<GraphQLResponse<T>>(
      '',
      payload,
    );

    // console.log(
    //   'GRAPHQL RESPONSE =>',
    //   JSON.stringify(response.data, null, 2),
    // );

    if (response.data.errors?.length) {
      // console.log(
      //   'GRAPHQL ERRORS =>',
      //   JSON.stringify(response.data.errors, null, 2),
      // );

      throw new Error(response.data.errors[0].message);
    }

    if (!response.data.data) {
      throw new Error('No data returned from GraphQL');
    }

    return response.data.data;

  } catch (error: any) {

    console.log('========== API ERROR ==========');

    console.log(
      'STATUS =>',
      error?.response?.status,
    );

    console.log(
      'FULL ERROR RESPONSE =>',
      JSON.stringify(error?.response?.data, null, 2),
    );

    console.log(
      'ERROR MESSAGE =>',
      error?.message,
    );

    console.log('===============================');

    // GraphQL may return HTTP 200 with errors: [{ message: "Unauthorized" }]
    // or HTTP 401 — both are handled centrally (interceptor covers HTTP 401;
    // this covers Unauthorized error messages thrown above).
    if (
      isUnauthorizedError(error) &&
      !AUTH_GRAPHQL_OPERATIONS.has(operationName)
    ) {
      await handleUnauthorized();
    }

    throw error;
  }
};
export default graphqlClient;


