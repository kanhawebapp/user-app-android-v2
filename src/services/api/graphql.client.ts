// // ============================================
// // DhwaniAstro - GraphQL Client
// // ============================================

// import axios, {AxiosInstance, AxiosError} from 'axios';
// import {API_BASE_URL, TIMEOUT} from '../../constants/api.constants';
// import {STORAGE_KEYS} from '../../constants/app.constants';
// import secureStorage from '../storage/secure.storage';
// import loggingService from '../logging';

// interface GraphQLResponse<T> {
//   data?: T;
//   errors?: Array<{
//     message: string;
//     locations?: Array<{line: number; column: number}>;
//     path?: string[];
//   }>;
// }


// const GRAPHQL_ENDPOINTS = {
//   PRODUCTION: 'https://dhwaniastro.com/userAuth/graphql',
//   STAGING: 'https://staging-api.dhwaniastro.com/userAuth/graphql',
//   DEVELOPMENT: 'https://dhwaniastro.com/userAuth/graphql',
// } as const;

// const getGraphQLEndpoint = (): string => {
//   const env = __DEV__ ? 'DEVELOPMENT' : 'PRODUCTION';
//   return GRAPHQL_ENDPOINTS[env];
// };

// export const createGraphQLClient = (): AxiosInstance => {
//   const client = axios.create({
//     baseURL: getGraphQLEndpoint(),
//     timeout: TIMEOUT.DEFAULT,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//   client.interceptors.request.use(async config => {
//     const accessToken = await secureStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
//     console.log(
//       '[GraphQL] Access Token for request:',
//       accessToken ? `Token: ${accessToken.substring(0, 20)}...` : 'NO TOKEN',
//     );
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//       console.log(
//         '[GraphQL] Authorization header set:',
//         config.headers.Authorization.substring(0, 30) + '...',
//       );
//     } else {
//       console.log('[GraphQL] WARNING: No access token found!');
//     }
//     loggingService.info(
//       `[GraphQL] ${config.method?.toUpperCase()} ${config.url}`,
//     );
//     return config;
//   });

//   // client.interceptors.response.use(
//   //   response => response,
//   //   (error: AxiosError) => {
//   //     loggingService.error('[GraphQL] Request failed', {error: error.message});
//   //     return Promise.reject(error);
//   //   },
//   // );
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

//   return client;
// };

// export const graphqlClient = createGraphQLClient();


// // export const graphqlRequest = async <T>(
// //   operationName: string,
// //   query: string,
// //   variables?: Record<string, unknown>,
// // ): Promise<T> => {
// //   const payload = {
// //     operationName,
// //     query,
// //     variables,
// //     extensions: {
// //       clientLibrary: {
// //         name: '@apollo/client',
// //         version: '4.1.5',
// //       },
// //     },
// //   };

// //   //  ADD LOG HERE (CORRECT PLACE)
// //   loggingService.info('[GraphQL] REQUEST BODY', payload);
// //   // console.log('GRAPHQL PAYLOAD:', JSON.stringify(payload, null, 2));

// //   // Check token availability right before the request
// //   const preCheckToken = await secureStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
// //   console.log(
// //     '[GraphQL] Pre-request token check:',
// //     preCheckToken ? 'TOKEN EXISTS' : 'NO TOKEN',
// //   );

// //   const response = await graphqlClient.post<GraphQLResponse<T>>('', payload);

// //   // console.log('GRAPHQL RESPONSE:', JSON.stringify(response.data, null, 2));
// //   // console.log('Response headers:', response.headers);

// //   if (response.data.errors && response.data.errors.length > 0) {
// //     const errorMessage = response.data.errors[0].message;
// //     loggingService.error('[GraphQL] Error', {error: errorMessage});
// //     throw new Error(errorMessage);
// //   }

// //   if (!response.data.data) {
// //     throw new Error('No data returned from GraphQL');
// //   }

// //   return response.data.data;
// // };

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

//   try {

//     const response = await graphqlClient.post<GraphQLResponse<T>>(
//       '',
//       payload,
//     );

//     console.log(
//       'GRAPHQL RESPONSE =>',
//       JSON.stringify(response.data, null, 2),
//     );

//     if (response.data.errors?.length) {
//       console.log(
//         'GRAPHQL ERRORS =>',
//         JSON.stringify(response.data.errors, null, 2),
//       );

//       throw new Error(response.data.errors[0].message);
//     }

//     if (!response.data.data) {
//       throw new Error('No data returned from GraphQL');
//     }

//     return response.data.data;

//   } catch (error: any) {

//     console.log('========== API ERROR ==========');

//     console.log(
//       'STATUS =>',
//       error?.response?.status,
//     );

//     console.log(
//       'FULL ERROR RESPONSE =>',
//       JSON.stringify(error?.response?.data, null, 2),
//     );

//     console.log(
//       'ERROR MESSAGE =>',
//       error?.message,
//     );

//     console.log('===============================');

//     throw error;
//   }
// };
// export default graphqlClient;


// ============================================
// DhwaniAstro - GraphQL Client
// ============================================

import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL, TIMEOUT } from '../../constants/api.constants';
import { STORAGE_KEYS } from '../../constants/app.constants';
import secureStorage from '../storage/secure.storage';
import loggingService from '../logging';

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}


const GRAPHQL_ENDPOINTS = {
  PRODUCTION: 'https://dhwaniastro.com/userAuth/graphql',
  STAGING: 'https://staging-api.dhwaniastro.com/userAuth/graphql',
  DEVELOPMENT: 'https://dhwaniastro.com/userAuth/graphql',
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
    const accessToken = await secureStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    console.log(
      '[GraphQL] Access Token for request:',
      accessToken ? `Token: ${accessToken.substring(0, 20)}...` : 'NO TOKEN',
    );
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log(
        '[GraphQL] Authorization header set:',
        config.headers.Authorization.substring(0, 30) + '...',
      );
    } else {
      console.log('[GraphQL] WARNING: No access token found!');
    }
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
    response => {
      console.log('====================');
      console.log('HTTP STATUS =>', response.status);

      console.log(
        'HTTP RESPONSE =>',
        JSON.stringify(response.data, null, 2),
      );

      console.log('====================');

      return response;
    },

    (error: AxiosError) => {
      console.log('====================');
      console.log('AXIOS ERROR HIT');

      console.log(
        'STATUS =>',
        error?.response?.status,
      );

      console.log(
        'DATA =>',
        JSON.stringify(error?.response?.data, null, 2),
      );

      console.log(
        'MESSAGE =>',
        error?.message,
      );

      console.log('====================');

      return Promise.reject(error);
    },
  );

  return client;
};

export const graphqlClient = createGraphQLClient();


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

    console.log(
      'GRAPHQL RESPONSE =>',
      JSON.stringify(response.data, null, 2),
    );

    if (response.data.errors?.length) {
      console.log(
        'GRAPHQL ERRORS =>',
        JSON.stringify(response.data.errors, null, 2),
      );

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

    throw error;
  }
};
export default graphqlClient;


